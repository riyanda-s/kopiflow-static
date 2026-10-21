import { describe, it, expect } from 'vitest';
import { addItem, restoreCart, validateItem, total, unitPrice, checkoutMessage, whatsappUrl, type CartItem } from '../../src/utils/cart';
import { normalizeWhatsApp, validateConfig } from '../../src/utils/config';
import { menu } from '../../src/data/menu';
const item = (): CartItem => ({ productId: 'kopi-aren', variants: { size: 'large', sugar: 'half', temperature: 'iced' }, addons: ['shot'], quantity: 2 });
describe('catalog and configuration', () => {
  it('validates the entire catalog and config', () => { expect(() => validateConfig()).not.toThrow(); expect(menu.length).toBeGreaterThanOrEqual(20); });
  it('calculates every catalog item and all supported options using integer IDR', () => {
    for (const p of menu.filter(p => p.available)) {
      const v = { productId: p.id, variants: Object.fromEntries(p.variants.map(g => [g.id, g.options[0]!.id])), addons: [], quantity: 1 };
      expect(unitPrice(v)).toBe(p.price);
      for (const group of p.variants) for (const option of group.options) expect(unitPrice({ ...v, variants: { ...v.variants, [group.id]: option.id } })).toBe(p.price + option.price);
      expect(unitPrice({ ...v, addons: p.addons.map(o => o.id) })).toBe(p.price + p.addons.reduce((n, o) => n + o.price, 0));
    }
  });
});
describe('cart integrity', () => {
  it('includes variants, add-ons, and quantities in totals', () => { expect(unitPrice(item())).toBe(36000); expect(total([item(), { productId: 'croissant', variants: {}, addons: [], quantity: 1 }])).toBe(94000); });
  it('merges identical selections and keeps different variants separate', () => { const merged = addItem([item()], item()); expect(merged).toHaveLength(1); expect(merged[0]!.quantity).toBe(4); expect(addItem(merged, { ...item(), addons: [] })).toHaveLength(2); });
  it('ignores tampered stored prices', () => { expect(total(restoreCart(JSON.stringify([{ ...item(), price: 1 }])))).toBe(72000); });
  it.each([null, {}, { ...item(), quantity: -1 }, { ...item(), quantity: 1.5 }, { ...item(), quantity: 100 }, { ...item(), productId: 'banana' }, { ...item(), variants: {} }, { ...item(), addons: ['free-money'] }, { ...item(), addons: ['shot', 'shot'] }])('rejects invalid selections %j', value => { expect(() => validateItem(value)).toThrow(); });
  it('recovers from corrupt, stale and oversized persistence', () => { expect(restoreCart('{invalid')).toEqual([]); expect(restoreCart('a'.repeat(100001))).toEqual([]); expect(restoreCart(JSON.stringify([{ ...item(), productId: 'missing' }, item()]))).toEqual([item()]); });
  it('bounds quantities after merging', () => { expect(() => addItem([{ ...item(), quantity: 99 }], item())).toThrow(); });
});
describe('WhatsApp checkout', () => {
  it.each([['0812 3456 7890', '6281234567890'], ['+62 (812) 3456-7890', '6281234567890'], ['0062 81234567890', '6281234567890'], ['00447700900123', '447700900123'], ['447700900123', '447700900123']])('normalizes %s', (input, output) => expect(normalizeWhatsApp(input)).toBe(output));
  it.each(['', 'abc6281234567890', '123', '00000', '000000000000', '++6281234567890', '62+81234567890', '+081234567890', '6281234567890123456'])('rejects invalid number %s', input => expect(() => normalizeWhatsApp(input)).toThrow());
  it('produces a complete encoded order with notes and confirmation request', () => {
    const message = checkoutMessage('Kopi Senja', [item()], 'Tanpa sedotan & terima kasih');
    expect(message).toContain('Kopi Senja'); expect(message).toContain('Ukuran: Besar'); expect(message).toContain('Gula: 50%'); expect(message).toContain('Tambahan espresso'); expect(message).toContain('Qty: 2'); expect(message).toContain('72.000'); expect(message).toContain('Mohon konfirmasi');
    const url = new URL(whatsappUrl('081234567890', message)); expect(url.hostname).toBe('wa.me'); expect(url.searchParams.get('text')).toBe(message);
  });
  it('rejects empty orders and limits notes', () => { expect(() => checkoutMessage('shop', [])).toThrow(); expect(checkoutMessage('shop', [item()], 'x'.repeat(900))).not.toContain('x'.repeat(501)); });
});
