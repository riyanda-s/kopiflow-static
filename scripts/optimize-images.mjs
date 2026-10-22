import sharp from 'sharp';
import { mkdir, readFile } from 'node:fs/promises';
await mkdir('public/images', { recursive: true });
// Only sources with documented website-use evidence. Never recreate blocked files.
const sources = { hero: 'hero', pastry: 'pastry' };
for (const [name, source] of Object.entries(sources)) {
  await sharp(`assets/photo-sources/${source}-source.jpg`).resize(name === 'hero' ? 1600 : name === 'interior' ? 1000 : 700, undefined, { withoutEnlargement: true }).webp({ quality: 80 }).toFile(`public/images/${name}.webp`);
}
await sharp('assets/photo-sources/hero-source.jpg').resize(800).webp({ quality: 78 }).toFile('public/images/hero-800.webp');
// Sources are local-only: use recorded photo download URLs or retained generated originals.
const products = [
  ...JSON.parse(await readFile('assets/evidence/product-images.json', 'utf8')),
  ...JSON.parse(await readFile('assets/evidence/generated-products.json', 'utf8')),
];
for (const asset of products) {
  let image = sharp(asset.sourceFile).rotate();
  if (asset.transform.crop) image = image.extract(asset.transform.crop);
  await image.resize(asset.transform.width, asset.transform.height, { fit: 'cover' })
    .webp({ quality: asset.transform.webpQuality }).toFile(`public${asset.output}`);
}
