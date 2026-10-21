import { business } from '../config/business';
import { theme } from '../config/theme';
import { menu, categories } from '../data/menu';
import { approvedAssets } from '../config/assets';
export function safeUrl(value: string): boolean { try { const u = new URL(value); return u.protocol === 'https:' && !u.username && !u.password; } catch { return false; } }
export function normalizeWhatsApp(value: string): string {
  if (!/^\+?[\d\s().-]+$/.test(value.trim())) throw new Error('Masukkan nomor WhatsApp internasional yang valid.');
  let digits = value.replace(/\D/g, '');
  if (value.trim().startsWith('+') && digits.startsWith('0')) throw new Error('Nomor internasional tidak boleh diawali angka nol.');
  if (digits.startsWith('00')) digits = digits.slice(2);
  else if (digits.startsWith('0')) {
    digits = `62${digits.slice(1)}`;
  }
  if (!/^[1-9]\d{7,14}$/.test(digits)) throw new Error('Masukkan nomor WhatsApp internasional yang valid.');
  return digits;
}
export function validateConfig() {
  if (!business.name || !safeUrl(business.domain) || new URL(business.domain).pathname !== '/' || new URL(business.domain).search || new URL(business.domain).hash) throw new Error('Business name and an HTTPS root domain without query or hash are required.');
  for (const url of [business.mapsUrl, business.instagram]) if (url && !safeUrl(url)) throw new Error('External links must use HTTPS.');
  if (business.whatsapp) normalizeWhatsApp(business.whatsapp);
  if (!business.isDemo && (!business.whatsapp || !business.mapsUrl || business.domain.includes('.example'))) throw new Error('Production needs a real domain, Maps link and WhatsApp number.');
  if (!business.isDemo && !business.whatsappVerified) throw new Error('Production ordering requires owner verification of the WhatsApp recipient.');
  const images = [business.logo, business.images.hero, business.images.heroSmall, business.images.story, business.seo.image, ...business.gallery.map(p => p.src), ...menu.map(p => p.image)];
  if (images.some(path => !Object.hasOwn(approvedAssets, path))) throw new Error('Unapproved image: register source/license evidence in src/config/assets.ts before use.');
  if (Object.values(theme).some(color => !/^#[\da-f]{6}$/i.test(color))) throw new Error('Use six-digit hex theme colors.');
  const ids = new Set<string>();
  for (const p of menu) {
    if (ids.has(p.id) || !/^[a-z0-9-]+$/.test(p.id) || !Number.isSafeInteger(p.price) || p.price < 0 || !categories.includes(p.category) || !p.image.startsWith('/images/')) throw new Error(`Invalid product: ${p.id}`);
    ids.add(p.id);
    if (new Set(p.variants.map(v => v.id)).size !== p.variants.length) throw new Error('Duplicate variants.');
    for (const options of [...p.variants.map(v => v.options), p.addons]) {
      if (new Set(options.map(o => o.id)).size !== options.length || options.some(o => !Number.isSafeInteger(o.price) || o.price < 0)) throw new Error('Invalid product options.');
    }
    if (p.variants.some(v => !v.options.length)) throw new Error('Variants need options.');
  }
}
