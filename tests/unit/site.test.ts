import { it, expect } from 'vitest';
import { publicSiteUrl } from '../../src/utils/site';
import { business } from '../../src/config/business';
import { approvedAssets } from '../../src/config/assets';
import { menu } from '../../src/data/menu';
import { existsSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import productImages from '../../assets/evidence/product-images.json';
import generatedImages from '../../assets/evidence/generated-products.json';
it('keeps the local demo origin explicit until an actual public origin is supplied', () => {
  expect(publicSiteUrl(undefined)).toBeUndefined(); expect(publicSiteUrl(' ')).toBeUndefined();
  expect(publicSiteUrl(' https://demo.shop.co.id/ ')).toBe('https://demo.shop.co.id');
  expect(business.isDemo).toBe(true); expect(business.whatsappVerified).toBe(false); expect(business.allowIndexing).toBe(false);
});
it.each(['http://demo.shop.co.id', 'https://localhost', 'https://127.0.0.1', 'https://coffee.test', 'https://kopisenja.example', 'https://example.com', 'https://demo.shop.co.id/menu/', 'https://demo.shop.co.id?token=secret', 'https://user:pass@demo.shop.co.id', 'https://demo.shop.co.id/#menu'])('rejects unsafe or placeholder public origin %s', value => expect(() => publicSiteUrl(value)).toThrow());
it('publishes only registered assets and truthful product imagery', () => {
  for (const path of Object.keys(approvedAssets)) expect(existsSync(`public${path}`)).toBe(true);
  for (const product of menu) {
    expect(Object.hasOwn(approvedAssets, product.image)).toBe(true);
    const evidence = productImages.find(asset => asset.productId === product.id);
    if (evidence) {
      expect(product.image).toBe(evidence.output);
      expect(product.imageAlt).toBe(evidence.alt);
      const bytes = readFileSync(`public${product.image}`);
      expect(createHash('sha256').update(bytes).digest('hex')).toBe(evidence.outputSha256);
      expect(bytes.length).toBeLessThan(80_000);
      expect(bytes.toString('ascii', 8, 12)).toBe('WEBP');
      expect(evidence.author.length).toBeGreaterThan(0);
      expect(new URL(evidence.page).protocol).toBe('https:');
      expect(new URL(evidence.licenseUrl).protocol).toBe('https:');
    } else if (product.imageGenerated) {
      const generated = generatedImages.find(asset => asset.productId === product.id);
      expect(generated).toBeDefined();
      expect(product.image).toBe(generated?.output);
      expect(product.imageAlt).toBe(generated?.alt);
      const bytes = readFileSync(`public${product.image}`);
      expect(createHash('sha256').update(bytes).digest('hex')).toBe(generated?.outputSha256);
      expect(bytes.length).toBeLessThan(80_000);
      expect(bytes.toString('ascii', 8, 12)).toBe('WEBP');
      expect(generated?.status).toBe('APPROVED_DEMO_ILLUSTRATION');
      expect(generated?.prompt.length).toBeGreaterThan(100);
      expect(product.imageAlt).toMatch(/^Ilustrasi AI:/);
    } else {
      expect(product.image).toBe(product.id === 'croissant' ? '/images/pastry.webp' : '/images/product-unavailable.svg');
    }
  }
  for (const name of ['black', 'iced', 'interior', 'latte', 'matcha', 'snack', 'tea']) expect(existsSync(`public/images/${name}.webp`)).toBe(false);
});
it('completes the nine missing images with distinct recorded AI illustrations', () => {
  const missing = ['kopi-aren', 'espresso', 'pandan', 'tubruk', 'chocolate', 'jasmine', 'lemon-tea', 'toast', 'fries'];
  expect(generatedImages.map(asset => asset.productId).sort()).toEqual(missing.sort());
  expect(new Set(generatedImages.map(asset => asset.outputSha256)).size).toBe(9);
  for (const asset of generatedImages) {
    expect(menu.find(product => product.id === asset.productId)?.imageGenerated).toBe(true);
    expect(asset.transform.width).toBe(700); expect(asset.transform.height).toBe(700);
  }
  expect(menu.filter(product => product.image.endsWith('product-unavailable.svg'))).toHaveLength(0);
});
it('keeps each approved product photograph assigned to exactly one existing product', () => {
  expect(new Set(productImages.map(asset => asset.productId)).size).toBe(productImages.length);
  for (const asset of productImages) expect(menu.filter(product => product.id === asset.productId)).toHaveLength(1);
});
