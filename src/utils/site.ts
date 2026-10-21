export function publicSiteUrl(value: string | undefined): string | undefined {
  if (!value?.trim()) return undefined;
  let url: URL;
  try { url = new URL(value.trim()); } catch { throw new Error('PUBLIC_SITE_URL must be a valid HTTPS root origin.'); }
  const host = url.hostname.toLowerCase();
  const reserved = host === 'localhost' || host.endsWith('.localhost') || /(^|\.)(example|invalid|test)$/.test(host) || ['example.com', 'example.org', 'example.net'].includes(host) || host.includes(':') || /^[\d.]+$/.test(host);
  if (url.protocol !== 'https:' || url.username || url.password || url.pathname !== '/' || url.search || url.hash || reserved || !host.includes('.')) throw new Error('PUBLIC_SITE_URL must be a public HTTPS root origin without credentials, path, query or fragment.');
  return url.origin;
}
