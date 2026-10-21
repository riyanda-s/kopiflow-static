# Asset and dependency notes

The fictional Kopi Senja name treatment and SVG sun mark were made for this template. They are not claimed as a registered or cleared trademark; check availability before real-world adoption.

Photos were downloaded from the Unsplash image CDN on 2026-10-21, resized and encoded locally. The general [Unsplash License](https://unsplash.com/license) permits commercial website incorporation subject to its terms; it does not permit selling unmodified image copies or compiling a competing image service. The following per-file verification was completed on 2026-10-21. Permission for a stock image is not evidence of a real shop, a menu serving, trademark clearance or model/property releases. Only approved derivatives are published. Original JPEGs are excluded from Git and `dist/`, so the template does not redistribute the downloaded original collection.

## Approved for incorporated website use

| Asset | Photographer and primary evidence | Exact CDN identifier linked by that page | Permitted usage in this template |
| --- | --- | --- | --- |
| `hero.webp`, `hero-800.webp` | Karl Fredrickson, [Person filling glass container](https://unsplash.com/photos/person-filling-glass-container-TYIzeCiZ_60), published 2015-09-17. The page identifies the photographer and Unsplash License. | `photo-1442512595331-e89e73853f31` | Illustrative brewing/brand photography; never a picture of espresso, cold brew or actual premises. |
| `pastry.webp` | Mae Mu, [Two brown croissants](https://unsplash.com/photos/two-brown-croissants-m9pzwmxm2rk), published 2019-04-17. The page identifies the photographer and Unsplash License. | `photo-1555507036-ab1f4038808a` | Croissant serving illustration and explicitly illustrative gallery; never banana bread, toast or pain au chocolat. |
| `branding/mark.svg` | Locally authored original SVG in this project's creation history. | Not applicable | Demo identity; no registered-trademark claim. |
| `product-unavailable.svg` | Locally authored neutral image-frame placeholder, created during remediation. | Not applicable | Explicitly says no product photo is available and depicts no food/drink. |

The source pages' image links were followed and their CDN paths matched the originally downloaded assets. Image fetches through the web reader failed, but exposed the exact matching target URLs; source-page author/license text was available. Local SHA-256 bindings and evidence URLs are recorded in `assets/evidence/verified-images.json`. This is a record of observed evidence, not a guarantee of every possible downstream use.

## BLOCKED — not approved, not published or committed

| Original | Status and reason |
| --- | --- |
| `interior-source.jpg` | BLOCKED: original photo page and individual rights evidence not established. |
| `latte-source.jpg` | BLOCKED: a candidate source page was found but returned HTTP 429 and an exact CDN match was not established. No photographer attribution is asserted. |
| `iced-source.jpg` | BLOCKED: original photo page and individual rights evidence not established. |
| `matcha-source.jpg` | BLOCKED: original photo page and individual rights evidence not established. |
| `tea-source.jpg` | BLOCKED: original photo page and individual rights evidence not established. |
| `snack-source.jpg` | BLOCKED: original photo page and individual rights evidence not established. |

Their JPEGs/derivatives are quarantined locally under ignored `assets/blocked/`. The old `black.webp` derivative is also removed: its verified brewing source is misleading as a product image for espresso/other black coffees. None of these files is referenced by customer configuration or included in the public directory. Recover evidence or supply documented replacement imagery before reintroducing them. The build rejects images absent from the approval register in `src/config/assets.ts`.

## Historical source identifiers (not approvals)

| Local source | Original CDN image identifier |
| --- | --- |
| hero-source.jpg (also black.webp) | https://images.unsplash.com/photo-1442512595331-e89e73853f31 |
| interior-source.jpg | https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb |
| latte-source.jpg | https://images.unsplash.com/photo-1541167760496-1628856ab772 |
| pastry-source.jpg | https://images.unsplash.com/photo-1555507036-ab1f4038808a |
| iced-source.jpg | https://images.unsplash.com/photo-1517701604599-bb29b565090c |
| matcha-source.jpg | https://images.unsplash.com/photo-1515823064-d6e0c04616a7 |
| tea-source.jpg | https://images.unsplash.com/photo-1544787219-7f47ccb76574 |
| snack-source.jpg | https://images.unsplash.com/photo-1573080496219-bb080dd4f877 |

Approved original downloaded copies remain in ignored `assets/photo-sources/` for local optimization. Published approved derivatives live in `public/images/`. There are no runtime image/font provider requests. Photographer names are not guessed. Maintain provenance for replacements, and review image/person/property rights for the intended customer use. A real customer still needs accurate owner-approved product/premises photographs or an explicitly accepted no-photo presentation.

Open-source packages retain their own licenses. Refer to installed package `LICENSE` files and the exact locked versions, including Astro (MIT), Tailwind (MIT), Lucide (ISC), QRCode (MIT), and test tooling. Do not relabel third-party material as exclusively owned customer work. No exclusive-rights or legal-compliance guarantee is made by this template.
