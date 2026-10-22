import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import sharp from 'sharp';
import jsQR from 'jsqr';
import { mkdir, readFile } from 'node:fs/promises';
import generatedImages from '../../assets/evidence/generated-products.json' with { type: 'json' };
import { loadEnv } from 'vite';
const publicOrigin = process.env.PUBLIC_SITE_URL || loadEnv('production', process.cwd(), 'PUBLIC_').PUBLIC_SITE_URL || 'https://kopisenja.example';
const publicUrlConfigured = !new URL(publicOrigin).hostname.endsWith('.example');

test('one menu illustration note replaces repeated labels while AI alternatives and assets remain intact', async ({ page }) => {
  await page.goto('/menu/');
  await expect(page.locator('[data-menu-illustration-note]')).toHaveCount(1);
  await expect(page.locator('[data-menu-illustration-note]')).toHaveText('Foto menu merupakan ilustrasi. Tampilan penyajian dapat berbeda.');
  expect(await page.locator('[data-menu-illustration-note]').evaluate(note => !!(document.querySelector('.menu-section .product-grid')!.compareDocumentPosition(note) & Node.DOCUMENT_POSITION_FOLLOWING))).toBe(true);
  await expect(page.locator('[data-image-disclosure], #product-image-disclosure')).toHaveCount(0);
  for (const asset of generatedImages) {
    const card = page.locator('[data-product-card]').filter({ has: page.locator(`button[data-product="${asset.productId}"]`) });
    const image = card.locator('img');
    await image.scrollIntoViewIfNeeded();
    await expect(image).toHaveAttribute('src', asset.output);
    await expect(image).toHaveAttribute('alt', asset.alt);
    await expect.poll(() => image.evaluate(node => node instanceof HTMLImageElement && node.complete && node.naturalWidth === 700 && node.naturalHeight === 700)).toBe(true);
    await card.locator('button[data-product]').first().click();
    await expect(page.getByText('Ilustrasi AI · bukan foto produk asli', { exact: true })).toHaveCount(0);
    await expect(page.locator('#modal-photo')).toHaveAttribute('alt', asset.alt);
    await page.keyboard.press('Escape');
  }
  await page.locator('button[data-product="latte"]').first().click();
  await expect(page.locator('#product-image-disclosure')).toHaveCount(0);
});
test('all static pages, metadata, assets, mobile sizing and navigation work', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  for (const route of ['/', '/menu/', '/about/', '/visit/', '/privacy/', '/qr/']) {
    const response = await page.goto(route); expect(response?.status()).toBe(200); await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${publicOrigin}${route}`);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    expect(await page.locator('img').evaluateAll(images => images.every(image => image instanceof HTMLImageElement && (image.complete ? image.naturalWidth > 0 : true)))).toBe(true);
  }
  expect(errors).toEqual([]);
});
test('search, category filters, zero results, reset and unavailable products', async ({ page }) => {
  await page.goto('/menu/');
  await expect(page.locator('[data-product-card]')).toHaveCount(23);
  await page.getByRole('button', { name: 'Teh', exact: true }).click();
  await expect(page.locator('[data-product-card]:visible')).toHaveCount(3);
  await page.getByRole('searchbox', { name: 'Cari menu' }).fill('zzzz');
  await expect(page.getByText('Produk tidak ditemukan.')).toBeVisible();
  await page.getByRole('button', { name: 'Tampilkan semua menu' }).click();
  await expect(page.locator('[data-product-card]:visible')).toHaveCount(23);
  await expect(page.getByRole('button', { name: 'Atur Banana Bread' }).first()).toBeDisabled();
});
test('responsive navigation opens accessibly and reaches menu', async ({ page }) => {
  await page.goto('/');
  const navigation = page.getByRole('navigation', { name: 'Navigasi utama' });
  if (page.viewportSize()!.width < 760) {
    const toggle = page.locator('#nav-toggle');
    await toggle.click(); await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Escape'); await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await toggle.click();
  }
  await navigation.getByRole('link', { name: 'Menu', exact: true }).click();
  await expect(page).toHaveURL(/\/menu\/$/);
});
test('customization, correct totals, persistence, quantity, removal and clearing', async ({ page }) => {
  await page.goto('/menu/');
  await page.getByRole('button', { name: 'Atur Es Kopi Susu Gula Aren', exact: true }).first().click();
  const product = page.getByRole('dialog', { name: 'Es Kopi Susu Gula Aren' });
  await product.getByText('Besar +').click();
  await product.getByText('50%', { exact: true }).click();
  await product.getByLabel('Tambahan espresso').check();
  await product.getByRole('button', { name: 'Tambah jumlah' }).click();
  await expect(product.locator('#product-price')).toContainText('72.000');
  await product.getByRole('button', { name: 'Tambah ke keranjang' }).click();
  await page.reload();
  await page.getByRole('button', { name: 'Buka keranjang' }).first().click();
  const cart = page.getByRole('dialog', { name: 'Keranjang Anda' });
  await expect(cart.locator('#cart-total')).toContainText('72.000');
  await expect(cart.getByText('Ukuran: Besar')).toBeVisible();
  await cart.getByRole('button', { name: 'Tambah jumlah Es Kopi Susu Gula Aren' }).click();
  await expect(cart.locator('#cart-total')).toContainText('108.000');
  await expect(cart.getByRole('button', { name: 'Demo · pemesanan dinonaktifkan' })).toBeDisabled();
  await cart.getByRole('button', { name: 'Hapus Es Kopi Susu Gula Aren' }).click();
  await expect(cart.getByText('Keranjang masih kosong.')).toBeVisible();
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Atur Butter Croissant', exact: true }).first().click();
  await page.getByRole('button', { name: 'Tambah ke keranjang' }).click();
  await page.getByRole('button', { name: 'Buka keranjang' }).first().click();
  await cart.getByRole('button', { name: 'Kosongkan keranjang', exact: true }).click();
  expect(await page.evaluate(() => localStorage.getItem('kopiflow:cart:v1'))).toBe('[]');
});
test('native dialogs support Escape and keyboard focus', async ({ page }) => {
  await page.goto('/menu/');
  const trigger = page.getByRole('button', { name: 'Atur Caffè Latte', exact: true }).first(); await trigger.focus(); await page.keyboard.press('Enter');
  await expect(page.locator('#product-modal')).toBeVisible();
  await page.keyboard.press('Tab');
  expect(await page.evaluate(() => !!document.activeElement?.closest('#product-modal'))).toBe(true);
  await page.keyboard.press('Escape'); await expect(page.locator('#product-modal')).not.toBeVisible(); await expect(trigger).toBeFocused();
});
test('blocked storage still permits a session cart', async ({ page }) => {
  await page.addInitScript(() => { Object.defineProperty(window, 'localStorage', { get() { throw new Error('blocked'); } }); });
  await page.goto('/menu/');
  await page.getByRole('button', { name: 'Atur Butter Croissant', exact: true }).first().click();
  await page.getByRole('button', { name: 'Tambah ke keranjang' }).click();
  await expect(page.locator('#announcement')).toContainText('Penyimpanan browser tidak tersedia.');
  await page.getByRole('button', { name: 'Buka keranjang' }).first().click();
  await expect(page.locator('#cart-total')).toContainText('22.000');
});
test('QR SVG export and print styles exist for the configured URL', async ({ page }) => {
  await page.goto('/qr/');
  await expect(page.getByText(`${publicOrigin}/menu/`, { exact: true })).toBeVisible();
  if (publicUrlConfigured) {
    await expect(page.getByRole('link', { name: 'Unduh SVG' })).toHaveAttribute('download', /menu\.svg$/);
    await expect(page.getByRole('button', { name: 'Cetak kartu menu' })).toBeEnabled();
  } else {
    await expect(page.getByRole('button', { name: 'Unduh SVG' })).toBeDisabled();
    await expect(page.getByRole('button', { name: 'Cetak kartu menu' })).toBeDisabled();
  }
  const href = await page.locator('.qr-code').getAttribute('src'); expect(decodeURIComponent(href!)).toContain('<svg');
  const svg = decodeURIComponent(href!.slice(href!.indexOf(',') + 1));
  const raster = await sharp(Buffer.from(svg)).resize(600, 600).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  expect(jsQR(new Uint8ClampedArray(raster.data), raster.info.width, raster.info.height)?.data).toBe(`${publicOrigin}/menu/`);
  await page.emulateMedia({ media: 'print' }); await expect(page.locator('.qr-card')).toBeVisible(); await expect(page.locator('header')).not.toBeVisible();
});
test('demo ordering stays disabled and mobile ordering controls are comfortable to tap', async ({ page }) => {
  if (page.viewportSize()!.width < 760) await page.setViewportSize({ width: 320, height: 740 });
  await page.goto('/menu/');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  if (page.viewportSize()!.width < 760) expect(await page.locator('.product-card > p').first().evaluate(el => parseFloat(getComputedStyle(el).fontSize))).toBeGreaterThanOrEqual(14);
  // DOMRect translation arithmetic can report 43.999969px for a 44px target.
  // Normalize to 1/1000 CSS px; the 44px requirement and scale checks remain.
  const addTarget = await page.locator('.add-button').first().boundingBox(); expect(Number(addTarget!.width.toFixed(3))).toBeGreaterThanOrEqual(44); expect(Number(addTarget!.height.toFixed(3))).toBeGreaterThanOrEqual(44);
  await expect(page.locator('html')).toHaveAttribute('lang', 'id');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow');
  await page.getByRole('button', { name: 'Atur Butter Croissant', exact: true }).click();
  for (const button of [page.locator('#add-to-cart'), page.locator('[data-quantity="1"]'), page.locator('[data-quantity="-1"]')]) {
    const box = await button.boundingBox(); expect(Number(box!.width.toFixed(3))).toBeGreaterThanOrEqual(44); expect(Number(box!.height.toFixed(3))).toBeGreaterThanOrEqual(44);
  }
  await page.getByRole('button', { name: 'Tambah ke keranjang' }).click();
  await page.getByRole('button', { name: 'Buka keranjang' }).click();
  await expect(page.locator('#checkout')).toBeDisabled(); await expect(page.locator('#checkout-fallback')).toBeHidden();
});

test('demo checkout cannot be enabled through keyboard or forced DOM clicks and has no usable fallback', async ({ page, context }) => {
  const externalRequests: string[] = [];
  await context.route('**/*', route => {
    const url = new URL(route.request().url());
    if (url.origin !== 'http://127.0.0.1:4325') { externalRequests.push(url.href); return route.abort(); }
    return route.continue();
  });
  await page.goto('/menu/');
  await page.evaluate(() => { window.open = () => { document.body.dataset.popupAttempt = 'true'; return null; }; });
  await page.getByRole('button', { name: 'Atur Butter Croissant', exact: true }).first().click();
  await page.getByRole('button', { name: 'Tambah ke keranjang' }).click();
  await page.getByRole('button', { name: 'Buka keranjang' }).first().click();
  const checkout = page.locator('#checkout'); const fallback = page.locator('#checkout-fallback');
  await expect(checkout).toBeDisabled(); await expect(fallback).toBeHidden(); await expect(fallback).toHaveAttribute('href', '#');
  const saved = await page.evaluate(() => localStorage.getItem('kopiflow:cart:v1'));
  await checkout.evaluate(button => { (button as HTMLButtonElement).focus(); });
  await expect(checkout).not.toBeFocused();
  await page.keyboard.press('Enter');
  await checkout.evaluate(button => { button.removeAttribute('disabled'); (button as HTMLButtonElement).click(); button.dispatchEvent(new MouseEvent('click', { bubbles: true })); });
  await expect(fallback).toBeHidden(); await expect(fallback).toHaveAttribute('href', '#');
  expect(await page.evaluate(() => document.body.dataset.popupAttempt)).toBeUndefined();
  expect(await page.evaluate(() => localStorage.getItem('kopiflow:cart:v1'))).toBe(saved);
  expect(externalRequests).toEqual([]);
});

test('all pages use Indonesian interface copy and keep the brand tagline and demo notices', async ({ page }) => {
  for (const route of ['/', '/menu/', '/about/', '/visit/', '/qr/', '/privacy/', '/404.html']) {
    await page.goto(route);
    await expect(page.locator('html')).toHaveAttribute('lang', 'id');
    await expect(page.locator('footer')).toContainText('Every Sip Has a Story.');
    await expect(page.locator('footer')).toContainText('Merek fiktif');
    await expect(page.locator('.skip-link')).toHaveText('Lewati ke konten utama');
    const text = await page.locator('body').innerText();
    expect(text).not.toMatch(/Come say hello|FIND YOUR MOMENT|LET.S CONNECT|TAKE YOUR TIME|Our story|Our menu|Get directions|Visit information|This is a fictional shop|Page not found|Send the message in WhatsApp|Browser storage is unavailable/);
  }
  await page.goto('/visit/');
  await expect(page.locator('.visit-details')).toContainText('Jam buka hanya contoh. Demo ini tidak memiliki lokasi fisik.');
  await expect(page.locator('#contact')).toContainText('Ini adalah kedai fiktif.');
});
test('Pages content security policy permits cart interaction and QR rendering', async ({ page }) => {
  const headers = await readFile('public/_headers', 'utf8');
  const policy = headers.match(/Content-Security-Policy: (.+)/)![1]!;
  const violations: string[] = [];
  page.on('console', message => { if (message.text().startsWith('CSP violation:')) violations.push(message.text()); });
  await page.addInitScript(() => document.addEventListener('securitypolicyviolation', event => console.error(`CSP violation: ${event.violatedDirective}`)));
  await page.route('**/*', async route => {
    if (!route.request().isNavigationRequest()) return route.continue();
    const response = await route.fetch();
    await route.fulfill({ response, headers: { ...response.headers(), 'content-security-policy': policy } });
  });
  await page.goto('/menu/');
  await page.getByRole('button', { name: 'Atur Butter Croissant', exact: true }).click();
  await page.getByRole('button', { name: 'Tambah ke keranjang' }).click();
  await page.getByRole('button', { name: 'Buka keranjang' }).click();
  await expect(page.locator('#cart-total')).toContainText('22.000');
  await page.goto('/qr/');
  await expect(page.locator('.qr-code')).toBeVisible();
  expect(await page.locator('.qr-code').evaluate(image => image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0)).toBe(true);
  expect(violations).toEqual([]);
});
test('accessible pages and dialogs have no axe WCAG AA violations', async ({ page }) => {
  for (const route of ['/', '/menu/', '/about/', '/visit/', '/privacy/', '/qr/']) {
    await page.goto(route);
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice']).analyze();
    expect(results.violations, JSON.stringify(results.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) })))).toEqual([]);
  }
  await page.goto('/menu/'); await page.getByRole('button', { name: 'Atur Caffè Latte', exact: true }).first().click();
  expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice']).analyze()).violations).toEqual([]);
  await page.keyboard.press('Escape'); await page.getByRole('button', { name: 'Buka keranjang' }).first().click();
  expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice']).analyze()).violations).toEqual([]);
});
test('capture representative home and menu layouts', async ({ page }, testInfo) => {
  await mkdir('qa-artifacts', { recursive: true });
  for (const route of ['/', '/menu/', '/about/', '/visit/']) {
    await page.goto(route); await page.locator('footer').scrollIntoViewIfNeeded(); await page.waitForTimeout(200); await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: `qa-artifacts/${testInfo.project.name}-${route === '/' ? 'home' : route.split('/')[1]}.png`, fullPage: true });
  }
});
