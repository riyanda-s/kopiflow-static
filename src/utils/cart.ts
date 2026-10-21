import { menu, type Product } from '../data/menu';
import { normalizeWhatsApp } from './config';
export interface CartItem { productId: string; variants: Record<string, string>; addons: string[]; quantity: number }
export const CART_KEY = 'kopiflow:cart:v1';
export const rupiah = (value: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
export const productFor = (item: CartItem): Product => {
  const product = menu.find(p => p.id === item.productId && p.available);
  if (!product) throw new Error('Produk sedang tidak tersedia.');
  return product;
};
export function validateItem(value: unknown): CartItem {
  if (!value || typeof value !== 'object') throw new Error('Produk tidak valid.');
  const v = value as CartItem;
  const p = productFor(v);
  if (!Number.isInteger(v.quantity) || v.quantity < 1 || v.quantity > 99 || !v.variants || typeof v.variants !== 'object' || Array.isArray(v.variants) || !Array.isArray(v.addons)) throw new Error('Pilihan tidak valid.');
  if (Object.keys(v.variants).length !== p.variants.length || p.variants.some(group => !group.options.some(o => o.id === v.variants[group.id]))) throw new Error('Pilih opsi yang tersedia untuk setiap varian.');
  if (new Set(v.addons).size !== v.addons.length || v.addons.some(id => !p.addons.some(o => o.id === id))) throw new Error('Tambahan tidak valid.');
  return { productId: p.id, variants: Object.fromEntries(p.variants.map(g => [g.id, v.variants[g.id]!])), addons: [...v.addons].sort(), quantity: v.quantity };
}
export const itemKey = (item: CartItem) => JSON.stringify([item.productId, Object.entries(item.variants).sort(), [...item.addons].sort()]);
export function unitPrice(item: CartItem): number {
  const v = validateItem(item); const p = productFor(v);
  return p.price + p.variants.reduce((sum, g) => sum + g.options.find(o => o.id === v.variants[g.id])!.price, 0) + p.addons.filter(o => v.addons.includes(o.id)).reduce((sum, o) => sum + o.price, 0);
}
export const total = (items: CartItem[]) => items.reduce((sum, item) => sum + unitPrice(item) * item.quantity, 0);
export function addItem(items: CartItem[], value: CartItem): CartItem[] {
  const item = validateItem(value); const result = items.map(i => validateItem(i));
  const existing = result.find(i => itemKey(i) === itemKey(item));
  if (existing) { if (existing.quantity + item.quantity > 99) throw new Error('Maksimal 99 untuk setiap pilihan.'); existing.quantity += item.quantity; }
  else { if (result.length >= 50) throw new Error('Maksimal 50 pilihan berbeda.'); result.push(item); }
  return result;
}
export function restoreCart(raw: string | null): CartItem[] {
  try {
    if (!raw || raw.length > 100000) return [];
    const parsed: unknown = JSON.parse(raw); if (!Array.isArray(parsed)) return [];
    return parsed.slice(0, 50).reduce<CartItem[]>((items, value) => { try { return addItem(items, validateItem(value)); } catch { return items; } }, []);
  } catch { return []; }
}
export function describeItem(item: CartItem): string {
  const p = productFor(item);
  return [...p.variants.map(g => `${g.label}: ${g.options.find(o => o.id === item.variants[g.id])!.label}`), ...p.addons.filter(o => item.addons.includes(o.id)).map(o => o.label)].join(' · ');
}
export function checkoutMessage(name: string, items: CartItem[], notes = ''): string {
  if (!items.length) throw new Error('Keranjang masih kosong.');
  const lines = items.map((item, i) => { validateItem(item); return `${i + 1}. ${productFor(item).name}\n   Qty: ${item.quantity}\n   ${describeItem(item)}\n   Subtotal: ${rupiah(unitPrice(item) * item.quantity)}`; });
  return `Halo ${name}, saya ingin memesan:\n\n${lines.join('\n\n')}\n\nEstimasi Total: ${rupiah(total(items))}${notes.trim() ? `\n\nCatatan: ${notes.trim().slice(0, 500)}` : ''}\n\nMohon konfirmasi ketersediaan, total akhir, dan metode pembayaran.`;
}
export const whatsappUrl = (number: string, message: string) => `https://wa.me/${normalizeWhatsApp(number)}?text=${encodeURIComponent(message)}`;
