// Creates a disposable local fixture using reserved demo contact data. Never deploy it.
import { cp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { resolve, sep, basename } from 'node:path';
import { spawn } from 'node:child_process';
import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import jsQR from 'jsqr';
const root = resolve('.client-check');
if (!root.startsWith(resolve('.') + sep) || basename(root) !== '.client-check') throw new Error('Refusing to clean outside the disposable fixture.');
await rm(root, { recursive: true, force: true });
await mkdir(root, { recursive: true });
for (const name of ['src', 'public', 'astro.config.mjs', 'tsconfig.json']) await cp(name, resolve(root, name), { recursive: true });
const configPath = resolve(root, 'src/config/business.ts');
let config = await readFile(configPath, 'utf8');
config = config.replaceAll('Kopi Senja', 'Kopi Uji').replaceAll('https://kopisenja.example', 'https://coffee.test').replace('isDemo: true', 'isDemo: false').replace('whatsappVerified: false', 'whatsappVerified: true').replace("whatsapp: '', instagram: '', mapsUrl: ''", "whatsapp: '447700900123', instagram: '', mapsUrl: 'https://www.google.com/maps'");
await writeFile(configPath, config);
const menuPath = resolve(root, 'src/data/menu.ts');
const catalog = await readFile(menuPath, 'utf8');
assert(catalog.includes("'croissant', 'Butter Croissant', 'Pastri', 22000"));
await writeFile(menuPath, catalog.replace("'croissant', 'Butter Croissant', 'Pastri', 22000", "'croissant', 'Roti Uji', 'Pastri', 25000"));
const cli = resolve('node_modules/astro/bin/astro.mjs');
await new Promise((accept, reject) => {
  const build = spawn(process.execPath, [cli, 'build', '--root', root], { stdio: 'pipe', windowsHide: true, env: { ...process.env, PUBLIC_SITE_URL: '' } });
  let output = ''; build.stdout.on('data', data => { output += data.toString(); }); build.stderr.on('data', data => { output += data.toString(); });
  build.on('error', reject); build.on('exit', code => code === 0 ? accept() : reject(new Error(output)));
});
const server = spawn(process.execPath, [cli, 'preview', '--root', root, '--host', '127.0.0.1', '--port', '4323'], { stdio: 'pipe', windowsHide: true });
let output = ''; server.stdout.on('data', data => { output += data.toString(); }); server.stderr.on('data', data => { output += data.toString(); });
try {
  let ready = false;
  for (let i = 0; i < 100; i++) { try { if ((await fetch('http://127.0.0.1:4323/menu/')).ok) { ready = true; break; } } catch { /* Starting local fixture. */ } await new Promise(resolve => setTimeout(resolve, 200)); }
  assert(ready, output);
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.goto('http://127.0.0.1:4323/menu/');
    assert((await page.title()).includes('Kopi Uji'));
    assert(!(await page.locator('body').textContent()).includes('Kopi Senja'));
    await page.getByRole('button', { name: 'Atur Roti Uji', exact: true }).click();
    await page.getByRole('button', { name: 'Tambah ke keranjang' }).click();
    await page.getByRole('button', { name: 'Buka keranjang' }).click();
    await page.locator('#customer-notes').fill('Hangat & tanpa alat makan');
    await page.evaluate(() => { window.open = () => null; });
    const checkout = page.getByRole('button', { name: 'Lanjut ke WhatsApp' });
    assert(await checkout.isEnabled()); await checkout.click();
    const link = page.locator('#checkout-fallback'); assert(await link.isVisible());
    const url = new URL(await link.getAttribute('href'));
    assert.equal(url.hostname, 'wa.me'); assert.equal(url.pathname, '/447700900123');
    assert(url.searchParams.get('text').includes('Halo Kopi Uji')); assert(url.searchParams.get('text').includes('Roti Uji')); assert(url.searchParams.get('text').includes('25.000')); assert(url.searchParams.get('text').includes('Hangat & tanpa alat makan'));
    assert((await page.locator('#cart-total').textContent()).includes('25.000'));
    assert.equal(JSON.parse(await page.evaluate(() => localStorage.getItem('kopiflow:cart:v1'))).length, 1);
    await page.goto('http://127.0.0.1:4323/qr/');
    const href = await page.getByRole('link', { name: 'Unduh SVG' }).getAttribute('href');
    const svg = decodeURIComponent(href.slice(href.indexOf(',') + 1));
    const raster = await sharp(Buffer.from(svg)).resize(600, 600).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    assert.equal(jsQR(new Uint8ClampedArray(raster.data), raster.info.width, raster.info.height)?.data, 'https://coffee.test/menu/');
    const report = { customerConfigOnly: true, productDataChanged: 'Roti Uji, Rp25.000', uiComponentsModified: false, productionModeCheckout: 'passed with blocked popup stub', recipientAndMessage: 'passed without external requests or sending', cartRetained: true, qrDecoded: 'https://coffee.test/menu/', timestamp: new Date().toISOString() };
    await mkdir('qa-artifacts', { recursive: true }); await writeFile('qa-artifacts/client-verification.json', JSON.stringify(report, null, 2)); console.log(JSON.stringify(report, null, 2));
  } finally { await browser.close(); }
} finally { server.kill(); }
