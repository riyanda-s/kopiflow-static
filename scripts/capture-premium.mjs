import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
const stage = process.argv[2];
if (!['before', 'after'].includes(stage)) throw new Error('Expected before or after');
const directory = `qa-artifacts/premium/${stage}`;
await mkdir(directory, { recursive: true });
const server = spawn(process.execPath, ['node_modules/astro/bin/astro.mjs', 'preview', '--host', '127.0.0.1', '--port', '4326'], { stdio: 'ignore', windowsHide: true });
try {
  let ready = false;
  for (let i = 0; i < 80; i++) { try { if ((await fetch('http://127.0.0.1:4326')).ok) { ready = true; break; } } catch { /* Starting preview. */ } await new Promise(resolve => setTimeout(resolve, 250)); }
  if (!ready) throw new Error('Preview unavailable');
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage(); const results = [];
    for (const width of [320, 390, 768, 1024, 1440, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      for (const route of ['/', '/menu/', ...(width === 390 || width === 1440 ? ['/about/', '/visit/', '/qr/', '/privacy/'] : [])]) {
        await page.goto(`http://127.0.0.1:4326${route}`);
        await page.evaluate(async () => { const images = [...document.images]; images.forEach(image => { image.loading = 'eager'; }); await Promise.all(images.map(image => image.decode())); });
        const name = route === '/' ? 'home' : route.replaceAll('/', '');
        await page.screenshot({ path: `${directory}/${width}-${name}.png`, fullPage: true });
        if (route === '/') {
          await page.screenshot({ path: `${directory}/${width}-hero.png` });
          if (stage === 'after') {
            const focus = [];
            await page.keyboard.press('Tab');
            for (const selector of ['.hero .button', '.story-section .button', '.promo .button', '.footer-brand']) {
              const target = page.locator(selector); await target.focus();
              focus.push(await target.evaluate(node => { const style = getComputedStyle(node); return { text: node.textContent.trim(), visible: node.matches(':focus-visible'), color: style.outlineColor, width: style.outlineWidth }; }));
            }
            await writeFile(`${directory}/${width}-focus.json`, JSON.stringify(focus, null, 2));
            await page.locator('.hero .button').focus();
            await page.screenshot({ path: `${directory}/${width}-keyboard-focus.png` });
          }
        }
        if (route === '/menu/') {
          await page.screenshot({ path: `${directory}/${width}-menu-top.png` });
          await page.getByRole('button', { name: 'Atur Butter Croissant', exact: true }).first().click();
          await page.screenshot({ path: `${directory}/${width}-product-dialog.png` });
          await page.getByRole('button', { name: 'Tambah ke keranjang' }).click();
          await page.getByRole('button', { name: 'Buka keranjang' }).first().click();
          await page.screenshot({ path: `${directory}/${width}-cart.png` });
          await page.keyboard.press('Escape');
          await page.evaluate(() => localStorage.clear());
        }
        results.push({ width, route, overflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth) });
      }
    }
    await writeFile(`${directory}/layouts.json`, JSON.stringify(results, null, 2));
    console.log(JSON.stringify(results));
  } finally { await browser.close(); }
} finally { server.kill(); }
