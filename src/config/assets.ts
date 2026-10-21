/** Website-use approvals only. Blocked originals are quarantined and excluded from Git/dist. */
export const approvedAssets = {
  '/branding/mark.svg': { source: 'Original KopiFlow SVG mark', license: 'Locally authored for this project' },
  '/images/product-unavailable.svg': { source: 'Original neutral placeholder; depicts no menu item', license: 'Locally authored for this project' },
  '/images/hero.webp': { source: 'https://unsplash.com/photos/person-filling-glass-container-TYIzeCiZ_60', license: 'Unsplash License; Karl Fredrickson; checked 2026-10-21' },
  '/images/hero-800.webp': { source: 'https://unsplash.com/photos/person-filling-glass-container-TYIzeCiZ_60', license: 'Unsplash License; Karl Fredrickson; checked 2026-10-21' },
  '/images/pastry.webp': { source: 'https://unsplash.com/photos/two-brown-croissants-m9pzwmxm2rk', license: 'Unsplash License; Mae Mu; checked 2026-10-21' },
} as const;
