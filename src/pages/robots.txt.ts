import { business } from '../config/business';
export function GET() { return new Response(`User-agent: *\nAllow: /\nSitemap: ${new URL('/sitemap.xml', business.domain).href}\n`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } }); }
