import lighthouse from 'lighthouse';
import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
await mkdir('qa-artifacts', { recursive: true });
const server = spawn(process.execPath, ['node_modules/astro/bin/astro.mjs', 'preview', '--host', '127.0.0.1', '--port', '4322'], { stdio: 'pipe', windowsHide: true });
let serverOutput = '';
server.stdout.on('data', data => { serverOutput += data.toString(); });
server.stderr.on('data', data => { serverOutput += data.toString(); });
try {
  let ready = false;
  for (let i = 0; i < 60; i++) { try { const response = await fetch('http://127.0.0.1:4322'); if (response.ok) { ready = true; break; } } catch { /* Server starting. */ } await new Promise(resolve => setTimeout(resolve, 250)); }
  if (!ready) throw new Error(`Preview did not start: ${serverOutput}`);
  const browser = await chromium.launch({ args: ['--remote-debugging-port=9223'] });
  try {
    const measurements = [];
    for (const route of ['/', '/menu/']) {
      const result = await lighthouse(`http://127.0.0.1:4322${route}`, { port: 9223, output: 'html', logLevel: 'error', onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'] });
      if (!result) throw new Error('Lighthouse produced no result.');
      await writeFile(`qa-artifacts/lighthouse-${route === '/' ? 'home' : 'menu'}.html`, result.report);
      measurements.push({ route, timestamp: result.lhr.fetchTime, environment: result.lhr.environment, config: result.lhr.configSettings, scores: Object.fromEntries(Object.entries(result.lhr.categories).map(([key, value]) => [key, Math.round(value.score * 100)])), lcpMs: result.lhr.audits['largest-contentful-paint'].numericValue, tbtMs: result.lhr.audits['total-blocking-time'].numericValue, cls: result.lhr.audits['cumulative-layout-shift'].numericValue, failures: Object.values(result.lhr.audits).filter(a => a.score !== null && a.score < .9 && a.details?.type !== 'opportunity').map(a => ({ id: a.id, title: a.title, displayValue: a.displayValue })) });
    }
    await writeFile('qa-artifacts/lighthouse-summary.json', JSON.stringify(measurements, null, 2));
    console.log(JSON.stringify(measurements.map(({ route, scores, lcpMs, cls }) => ({ route, scores, lcpMs, cls })), null, 2));
  } finally { await browser.close(); }
} finally { server.kill(); }
