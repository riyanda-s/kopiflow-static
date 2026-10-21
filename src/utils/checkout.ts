import { checkoutMessage, whatsappUrl, type CartItem } from './cart';
import { normalizeWhatsApp } from './config';
interface Browser { open(url: string, target: string): { opener: unknown } | null }
interface OrderingShop { name: string; whatsapp: string; isDemo: boolean; whatsappVerified?: boolean }
export function canCheckout(shop: OrderingShop): boolean {
  if (shop.isDemo || shop.whatsappVerified !== true || !shop.whatsapp.trim()) return false;
  try { normalizeWhatsApp(shop.whatsapp); return true; } catch { return false; }
}
export function launchCheckout(shop: OrderingShop, items: CartItem[], notes: string, browser: Browser): string {
  if (!canCheckout(shop)) throw new Error('Pemesanan belum tersedia. Nomor WhatsApp kedai belum diverifikasi atau situs masih berupa demo.');
  const url = whatsappUrl(shop.whatsapp, checkoutMessage(shop.name, items, notes));
  try {
    const opened = browser.open(url, '_blank');
    if (opened) opened.opener = null;
  } catch { /* Always return a usable same-tab link when popups are restricted. */ }
  return url;
}
