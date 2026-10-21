import { business } from '../config/business';
export function GET() {
  const routes = ['/', '/menu/', '/about/', '/visit/', '/qr/', '/privacy/'];
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map(path => `<url><loc>${new URL(path, business.domain).href.replaceAll('&', '&amp;')}</loc></url>`).join('')}</urlset>`, { headers: { 'Content-Type': 'application/xml' } });
}
