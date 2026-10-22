import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdir, writeFile } from 'node:fs/promises';

async function readyImages(page: Page) {
  await page.evaluate(async () => {
    const images = Array.from(document.images);
    images.forEach(image => { image.loading = 'eager'; });
    await Promise.all(images.map(image => image.decode()));
  });
}

async function alignedProducts(page: Page, selector: string) {
  const cards = await page.locator(selector).evaluateAll(nodes => nodes.map(node => {
    const rect = node.getBoundingClientRect();
    const box = (selector: string) => {
      const element = node.querySelector(selector)!;
      const bounds = element.getBoundingClientRect();
      return { top: bounds.top, bottom: bounds.bottom, width: bounds.width, height: bounds.height, overflow: element.scrollHeight > element.clientHeight + 1 };
    };
    return { top: rect.top, height: rect.height, image: box('.product-image'), metadata: box('.product-topline'), name: box('h3'), description: box('p'), price: box('.product-bottom') };
  }));
  const rows = new Map<number, typeof cards>();
  for (const card of cards) {
    const key = Math.round(card.top);
    rows.set(key, [...(rows.get(key) ?? []), card]);
    expect(card.name.overflow).toBe(false); expect(card.description.overflow).toBe(false);
  }
  for (const row of rows.values()) for (const card of row) {
    const first = row[0]!;
    for (const value of [card.height - first.height, card.image.height - first.image.height, card.metadata.top - first.metadata.top, card.name.top - first.name.top, card.description.top - first.description.top, card.price.top - first.price.top, card.price.bottom - first.price.bottom]) expect(Math.abs(value)).toBeLessThan(1.5);
  }
  return { count: cards.length, rows: rows.size };
}

test('homepage and menu align at 1440, 768, 390 and 320px including long copy', async ({ page }, testInfo) => {
  test.setTimeout(150_000);
  const directory = `qa-artifacts/ui-polish/${testInfo.project.name}`;
  await mkdir(directory, { recursive: true });
  const report: object[] = [];
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ['/', '/menu/']) {
      await page.goto(route); await page.addStyleTag({ content: 'html{scroll-behavior:auto!important}' });
      await readyImages(page);
      await page.evaluate(() => { if (document.activeElement instanceof HTMLElement) document.activeElement.blur(); });
      await page.mouse.click(1, 1);
      await expect(page.locator('.skip-link')).not.toBeInViewport();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await expect(page.getByText('Ilustrasi AI · bukan foto produk asli', { exact: true })).toHaveCount(0);
      const products = await alignedProducts(page, '.product-grid .product-card');
      const ratio = await page.locator('.product-image').first().evaluate(node => node.clientWidth / node.clientHeight);
      expect(Math.abs(ratio - (width > 760 ? 1.25 : 1))).toBeLessThan(.02);
      if (route === '/') {
        await expect(page.locator('html')).toHaveAttribute('lang', 'id');
        await expect(page.locator('.bestsellers .eyebrow')).toHaveText('PILIHAN KEDAI');
        await expect(page.locator('.gallery img')).toHaveCount(3);
        const gallery = await page.locator('.gallery figure').evaluateAll(figures => figures.map(figure => {
          const image = figure.querySelector('img')!; const caption = figure.querySelector('figcaption')!; const number = caption.querySelector('span')!; const text = caption.querySelector('p')!;
          return { src: image.getAttribute('src'), top: image.getBoundingClientRect().top, ratio: image.clientWidth / image.clientHeight, height: image.clientHeight, line: caption.getBoundingClientRect().top, number: number.getBoundingClientRect().top, text: text.getBoundingClientRect().top };
        }));
        for (const card of gallery) {
          expect(card.src).not.toContain('product-unavailable');
          expect(Math.abs(card.ratio - 4 / 3)).toBeLessThan(.02);
          expect(Math.abs(card.number - card.text)).toBeLessThan(1.5);
          expect(Math.abs(card.height - gallery[0]!.height)).toBeLessThan(1.5);
          if (width > 760) { expect(Math.abs(card.top - gallery[0]!.top)).toBeLessThan(1.5); expect(Math.abs(card.line - gallery[0]!.line)).toBeLessThan(1.5); }
        }
        if (width <= 760) expect(gallery[1]!.top).toBeGreaterThan(gallery[0]!.line);
        const selection = page.locator('.bestsellers');
        await selection.scrollIntoViewIfNeeded();
        await selection.screenshot({ path: `${directory}/${width}-selection.png`, style: '.mobile-cart,.skip-link:not(:focus){visibility:hidden!important}' });
        await page.locator('.gallery-section').scrollIntoViewIfNeeded();
        await page.locator('.gallery-section').screenshot({ path: `${directory}/${width}-gallery.png`, style: '.mobile-cart,.skip-link:not(:focus){visibility:hidden!important}' });
      }
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({ path: `${directory}/${width}-${route === '/' ? 'home' : 'menu'}.png`, fullPage: true });
      const accessibility = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
      expect(accessibility.violations.map(violation => violation.id)).toEqual([]);
      // Stress the real DOM layout without changing the product catalog or order data.
      await page.locator('.product-grid').first().evaluate(grid => {
        const cards = grid.querySelectorAll('.product-card');
        cards[0]!.querySelector('h3')!.textContent = 'Kopi Susu Pilihan Nusantara untuk Menemani Cerita Sore yang Panjang';
        cards[1]!.querySelector('p')!.textContent = 'Seduhan lembut dengan cita rasa yang akrab, dinikmati perlahan bersama teman cerita. '.repeat(5);
      });
      await alignedProducts(page, '.product-grid .product-card');
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await page.locator('.product-grid').first().screenshot({ path: `${directory}/${width}-${route === '/' ? 'home' : 'menu'}-long-copy.png`, style: '.mobile-cart,.skip-link:not(:focus){visibility:hidden!important}' });
      report.push({ width, route, products, imagesDecoded: true, equalTracks: true, galleryAligned: route === '/' ? true : null, longCopyNoClipping: true, horizontalOverflow: false, axeViolations: 0 });
    }
    if (width < 760) { await page.locator('#nav-toggle').click(); await expect(page.locator('#main-nav')).toBeVisible(); await page.keyboard.press('Escape'); }
    await page.getByRole('button', { name: 'Atur Butter Croissant', exact: true }).first().focus(); await page.keyboard.press('Enter');
    await expect(page.locator('#product-modal')).toBeVisible();
    await page.getByRole('button', { name: 'Tambah ke keranjang' }).click();
    await page.getByRole('button', { name: 'Buka keranjang' }).first().click();
    await expect(page.locator('#cart-drawer')).toBeVisible();
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => !!document.activeElement?.closest('#cart-drawer'))).toBe(true);
    expect((await new AxeBuilder({ page }).include('#cart-drawer').withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([]);
    await page.keyboard.press('Escape');
    await page.evaluate(() => localStorage.clear());
  }
  await writeFile(`${directory}/measurements.json`, JSON.stringify(report, null, 2));
});
