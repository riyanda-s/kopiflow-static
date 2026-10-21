import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
await mkdir('public/images', { recursive: true });
// Only photographs with verified source/website-use evidence. Never recreate blocked files.
const sources = { hero: 'hero', pastry: 'pastry' };
for (const [name, source] of Object.entries(sources)) {
  await sharp(`assets/photo-sources/${source}-source.jpg`).resize(name === 'hero' ? 1600 : name === 'interior' ? 1000 : 700, undefined, { withoutEnlargement: true }).webp({ quality: 80 }).toFile(`public/images/${name}.webp`);
}
await sharp('assets/photo-sources/hero-source.jpg').resize(800).webp({ quality: 78 }).toFile('public/images/hero-800.webp');
