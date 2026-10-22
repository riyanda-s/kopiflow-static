import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdir, writeFile } from 'node:fs/promises';

test.use({ deviceScaleFactor: 1, video: { mode: 'on', size: { width: 960, height: 700 } } });

test('hero CTA accepts a pointer click during its entrance without moving on pointer focus', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => document.querySelector('.hero-buttons')!.getAnimations().forEach(animation => { animation.pause(); animation.currentTime = 220; }));
  const button = page.locator('.hero .button'); const box = (await button.boundingBox())!;
  await page.mouse.click(box.x + box.width / 2, box.y + box.height - 2);
  await expect(page).toHaveURL(/\/menu\/$/);
});

for (const width of [320, 390, 768, 1024, 1440, 1920]) {
  test(`motion states and interactions at ${width}px`, async ({ page }, info) => {
    test.setTimeout(120_000);
    const directory = `qa-artifacts/motion-repeat/${info.project.name}/${width}`;
    await mkdir(directory, { recursive: true });
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await page.evaluate(async () => { await document.querySelector<HTMLImageElement>('.hero-photo img')!.decode(); });
    const states: object[] = [];
    // Seek real CSS animations: reproducible initial, middle and settled frames.
    // This affects only this browser's evidence, never production timing.
    for (const time of [0, 600, 2200]) {
      const state = await page.evaluate(time => {
        const hero = document.querySelector('.hero')!;
        const animations = document.getAnimations().filter(animation => hero.contains((animation.effect as KeyframeEffect)?.target as Node));
        animations.forEach(animation => { animation.pause(); animation.currentTime = time; });
        const headline = getComputedStyle(hero.querySelector('h1 > span')!);
        const image = getComputedStyle(hero.querySelector('img')!);
        return { time, animations: animations.length, opacity: Number(headline.opacity), headlineTransform: headline.transform, headlineSettled: new DOMMatrix(headline.transform).isIdentity, imageTransform: image.transform, overflow: document.documentElement.scrollWidth > innerWidth };
      }, time);
      expect(state.animations).toBeGreaterThanOrEqual(width > 760 ? 5 : 4);
      expect(state.opacity).toBeGreaterThanOrEqual(.75);
      expect(state.overflow).toBe(false);
      states.push(state);
      await page.screenshot({ path: `${directory}/hero-${time}.png` });
    }
    expect((states[0] as { headlineSettled: boolean }).headlineSettled).toBe(false);
    expect((states[2] as { headlineSettled: boolean }).headlineSettled).toBe(true);
    await page.evaluate(() => document.getAnimations().forEach(animation => animation.finish()));
    await page.locator('.hero .button').focus();
    await expect(page.locator('.hero .button')).toBeFocused();
    // Capture an actual observer-triggered reveal before it settles.
    await page.addStyleTag({ content: 'html{scroll-behavior:auto!important}' });
    await page.locator('.story-copy').evaluate(section => window.scrollTo(0, section.getBoundingClientRect().top + scrollY - 150));
    await expect(page.locator('.story-copy')).toHaveClass(/motion-enter/);
    await page.screenshot({ path: `${directory}/story-enter.png` });
    await expect(page.locator('.story-copy')).not.toHaveClass(/motion-enter/);
    await page.screenshot({ path: `${directory}/story-settled.png` });
    await expect(page.locator('.site-header')).toHaveClass(/is-scrolled/);
    expect(await page.locator('.site-header').evaluate(node => node.getBoundingClientRect().top)).toBe(0);
    // Count actual CSS animation starts, rather than merely observing classes.
    const story = page.locator('.story-copy');
    await story.evaluate(node => {
      node.setAttribute('data-qa-starts', '0');
      node.addEventListener('animationstart', event => {
        if ((event as AnimationEvent).animationName === 'kf-reveal' && event.target === node)
          node.setAttribute('data-qa-starts', String(Number(node.getAttribute('data-qa-starts')) + 1));
      });
    });
    // Fully exit above the viewport, then enter from above while scrolling up.
    await story.evaluate(node => scrollTo(0, node.getBoundingClientRect().bottom + scrollY + 100));
    await page.waitForTimeout(120);
    await story.evaluate(node => scrollTo(0, node.getBoundingClientRect().top + scrollY - 180));
    await expect(story).toHaveAttribute('data-qa-starts', '1');
    await page.screenshot({ path: `${directory}/story-replay-up.png` });
    await expect(story).not.toHaveClass(/motion-enter/);
    // Cross the inner threshold without crossing the outer exit boundary.
    for (const offset of [30, 70, 30, 70, 180]) {
      await story.evaluate((node, offset) => scrollTo(0, node.getBoundingClientRect().top + scrollY - innerHeight + offset), offset);
      await page.waitForTimeout(100);
    }
    await expect(story).toHaveAttribute('data-qa-starts', '1');
    // Fully exit below the viewport and enter again while scrolling down.
    await story.evaluate(node => scrollTo(0, node.getBoundingClientRect().top + scrollY - innerHeight - 100));
    await page.waitForTimeout(120);
    await story.evaluate(node => scrollTo(0, node.getBoundingClientRect().top + scrollY - 180));
    await expect(story).toHaveAttribute('data-qa-starts', '2');
    await page.screenshot({ path: `${directory}/story-replay-down.png` });
    await expect(story).not.toHaveClass(/motion-enter/);
    states.push({ replayStarts: await story.getAttribute('data-qa-starts'), boundaryJitterDidNotReplay: true });
    for (const [selector, name] of [['.bestsellers', 'selection'], ['.why-section', 'benefits'], ['.gallery-section', 'gallery'], ['.visit-section', 'visit']]) {
      await page.locator(selector!).evaluate(section => window.scrollTo(0, section.getBoundingClientRect().top + scrollY - 130));
      await page.waitForTimeout(80);
      await page.screenshot({ path: `${directory}/${name}-enter.png` });
      await page.waitForTimeout(1600);
      await page.screenshot({ path: `${directory}/${name}-settled.png` });
    }
    await page.locator('.gallery').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1600);
    if (info.project.name === 'desktop') {
      await page.locator('.gallery figure').first().hover(); await page.waitForTimeout(700);
      expect(await page.locator('.gallery img').first().evaluate(node => getComputedStyle(node).transform)).not.toBe('none');
      await page.screenshot({ path: `${directory}/gallery-hover.png` });
    }
    await page.goto('/menu/');
    await expect(page.locator('.product-card')).toHaveCount(23);
    if (width < 760) {
      await page.locator('#nav-toggle').click();
      await page.screenshot({ path: `${directory}/navigation-open.png` });
      await page.keyboard.press('Escape');
    }
    if (info.project.name === 'desktop') {
      await page.locator('.product-image').first().hover(); await page.waitForTimeout(700);
      expect(await page.locator('.product-image img').first().evaluate(node => getComputedStyle(node).transform)).not.toBe('none');
      await page.locator('.product-card').first().screenshot({ path: `${directory}/product-hover.png` });
      await page.locator('.add-button').first().hover(); await page.waitForTimeout(220);
      await page.locator('.product-card').first().screenshot({ path: `${directory}/cta-hover.png` });
    }
    const category = page.getByRole('button', { name: 'Teh', exact: true });
    if (info.project.name === 'mobile') await category.tap(); else await category.click();
    await expect(category).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('.product-card:visible')).toHaveCount(3);
    await expect(page.locator('.product-card[hidden].motion-enter')).toHaveCount(0);
    await page.screenshot({ path: `${directory}/category-selected.png` });
    await page.getByRole('button', { name: 'Semua', exact: true }).click();
    await expect(page.locator('.product-card[hidden].motion-enter')).toHaveCount(0);
    await expect(page.locator('.product-card').first()).not.toHaveClass(/motion-enter/);
    await page.getByRole('button', { name: 'Atur Butter Croissant', exact: true }).first().scrollIntoViewIfNeeded();
    await page.getByRole('button', { name: 'Atur Butter Croissant', exact: true }).first().focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#product-modal')).toBeVisible();
    await page.screenshot({ path: `${directory}/dialog.png` });
    await page.getByRole('button', { name: 'Tambah ke keranjang' }).click();
    await expect(page.locator('.cart-count').first()).toHaveText('1');
    await expect(page.locator('#announcement')).toContainText('ditambahkan');
    await page.screenshot({ path: `${directory}/cart-feedback.png` });
    await page.getByRole('button', { name: 'Buka keranjang' }).first().click();
    await expect(page.locator('.cart-row')).toHaveCount(1);
    await expect(page.locator('#checkout')).toBeDisabled();
    await page.keyboard.press('Escape');
    await page.goBack();
    await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true })));
    await expect(page.locator('.motion-enter')).toHaveCount(0);
    await page.locator('.story-copy').evaluate(node => scrollTo(0, node.getBoundingClientRect().top + scrollY - 180));
    await expect(page.locator('.story-copy')).toHaveClass(/motion-enter/);
    await expect(page.locator('.story-copy')).not.toHaveClass(/motion-enter/);
    await page.goForward();
    await page.getByRole('button', { name: 'Buka keranjang' }).first().click();
    await expect(page.locator('.cart-row')).toHaveCount(1);
    await page.keyboard.press('Escape');
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
    await writeFile(`${directory}/states.json`, JSON.stringify(states, null, 2));
  });
}

test('reduced motion, preference changes, focus and all controls remain functional', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
  await page.screenshot({ path: 'qa-artifacts/motion/reduced-home.png' });
  await page.locator('.gallery').scrollIntoViewIfNeeded();
  await expect(page.locator('.motion-enter')).toHaveCount(0);
  expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([]);
  await page.goto('/menu/');
  await page.getByRole('button', { name: 'Atur Butter Croissant', exact: true }).click();
  await page.getByRole('button', { name: 'Tambah ke keranjang' }).click();
  await expect(page.locator('.cart-count').first()).toHaveText('1');
  expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
  await page.emulateMedia({ reducedMotion: 'no-preference' }); await page.goto('/');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
  await expect(page.locator('.motion-enter')).toHaveCount(0);
});

test('no JavaScript or observer support never hides content or navigation', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 800 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4325/');
  await expect(page.locator('.hero h1')).toBeVisible();
  await expect(page.locator('.story-copy')).toBeVisible();
  await page.locator('.no-script-nav a[href="/menu/"]').click();
  await expect(page.locator('.product-card')).toHaveCount(23);
  await expect(page.locator('.product-card').first()).toBeVisible();
  await page.screenshot({ path: 'qa-artifacts/motion/no-javascript.png', fullPage: true });
  await context.close();
  const fallback = await browser.newContext();
  await fallback.addInitScript(() => { Reflect.deleteProperty(window, 'IntersectionObserver'); });
  const fallbackPage = await fallback.newPage(); await fallbackPage.goto('http://127.0.0.1:4325/');
  await expect(fallbackPage.locator('.story-copy')).toBeVisible();
  await expect(fallbackPage.locator('.motion-enter')).toHaveCount(0);
  await fallback.close();
});

// Inspect the hit target during a real held press, not only its resting CSS size.
test('product controls retain 44px targets while pressed', async ({ page }) => {
  await page.goto('/menu/');
  const button = page.locator('.add-button').first();
  await button.scrollIntoViewIfNeeded();
  await expect(page.locator('.motion-enter')).toHaveCount(0);
  const box = (await button.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.waitForTimeout(500);
  const pressed = (await button.boundingBox())!;
  expect(Number(pressed.width.toFixed(3))).toBeGreaterThanOrEqual(44);
  expect(Number(pressed.height.toFixed(3))).toBeGreaterThanOrEqual(44);
  await page.mouse.move(0, 0); await page.mouse.up();
  await expect(page.locator('#product-modal')).not.toBeVisible();
});
