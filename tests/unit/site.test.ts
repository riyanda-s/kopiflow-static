import { it, expect } from 'vitest';
import { publicSiteUrl } from '../../src/utils/site';
import { business } from '../../src/config/business';
import { approvedAssets } from '../../src/config/assets';
import { menu } from '../../src/data/menu';
import { existsSync } from 'node:fs';
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
    expect(product.image).toBe(product.id === 'croissant' ? '/images/pastry.webp' : '/images/product-unavailable.svg');
  }
  for (const name of ['black', 'iced', 'interior', 'latte', 'matcha', 'snack', 'tea']) expect(existsSync(`public/images/${name}.webp`)).toBe(false);
});
