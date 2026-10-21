import { it, expect, vi } from 'vitest';
import { launchCheckout, canCheckout } from '../../src/utils/checkout';
import type { CartItem } from '../../src/utils/cart';
const shop = { name: 'Configured shop', isDemo: false, whatsapp: '081234567890', whatsappVerified: true };
const cart: CartItem[] = [{ productId: 'croissant', variants: {}, addons: [], quantity: 2 }];
it('opens WhatsApp and preserves the cart without accepting an order', () => {
  const before = JSON.stringify(cart); const tab = { opener: {} }; const open = vi.fn(() => tab);
  const url = launchCheckout(shop, cart, 'Warm please', { open });
  expect(open).toHaveBeenCalledWith(url, '_blank'); expect(tab.opener).toBeNull();
  expect(new URL(url).searchParams.get('text')).toContain('44.000');
  expect(JSON.stringify(cart)).toBe(before);
});
it('returns a same-tab fallback URL when the browser blocks a popup', () => {
  const open = vi.fn(() => null); const before = JSON.stringify(cart);
  expect(launchCheckout(shop, cart, '', { open })).toMatch(/^https:\/\/wa.me\/6281234567890\?text=/);
  expect(JSON.stringify(cart)).toBe(before);
});
it('returns the fallback URL if browser popup policies throw', () => {
  expect(launchCheckout(shop, cart, '', { open: () => { throw new Error('SecurityError'); } })).toMatch(/^https:\/\/wa.me\//);
});
it('prevents demo orders, malformed contacts and empty orders from opening tabs', () => {
  const open = vi.fn();
  expect(() => launchCheckout({ ...shop, isDemo: true }, cart, '', { open })).toThrow();
  expect(() => launchCheckout({ ...shop, whatsappVerified: false }, cart, '', { open })).toThrow();
  expect(() => launchCheckout({ ...shop, whatsappVerified: undefined }, cart, '', { open })).toThrow();
  expect(() => launchCheckout({ ...shop, whatsapp: '' }, cart, '', { open })).toThrow();
  expect(() => launchCheckout(shop, [], '', { open })).toThrow();
  expect(open).not.toHaveBeenCalled();
});
it('requires both a verified syntactically valid recipient and a non-demo shop', () => {
  expect(canCheckout(shop)).toBe(true);
  for (const value of [{ ...shop, whatsappVerified: false }, { ...shop, whatsappVerified: undefined }, { ...shop, whatsapp: '' }, { ...shop, whatsapp: 'invalid' }, { ...shop, isDemo: true }]) expect(canCheckout(value)).toBe(false);
});
