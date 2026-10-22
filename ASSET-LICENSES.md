# Asset and dependency notes

UI polish follow-up (2026-10-22): the repeated visible AI captions on product cards/dialogs were removed at the owner's request. The fictional menu instead displays one general note after the product grid: “Foto menu merupakan ilustrasi. Tampilan penyajian dapat berbeda.” AI-specific alternatives, `imageGenerated`, original generation records, approvals and image files are preserved. Earlier descriptions of per-card labels record the previous presentation. The third gallery slot now reuses the already-approved Nathan Dumlao `product-latte.webp` as a coffee illustration; no new asset or license claim was introduced.

Latest image status (2026-10-22): the demo uses 14 stock-photo product illustrations and nine explicitly disclosed AI product illustrations; zero product placeholders remain. The earlier stock-photo restoration notes below retain their historical decisions. The final section and `assets/evidence/generated-products.json` document the generated assets separately from photo licenses. Six previously blocked originals remain blocked.

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

## Product replacements verified 2026-10-22

The following new derivatives are approved only as incorporated, illustrative product imagery. Each original page identifies the author and individual license; following its image link established the exact asset below. Image fetches through the web reader failed, but the linked URLs were exposed and independent local downloads succeeded. Every downloaded image and final crop was inspected locally. No previously blocked original or derivative was restored.

| Local WebP | Photographer / original page | Exact linked asset | License |
| --- | --- | --- | --- |
| product-latte.webp | [Nathan Dumlao](https://unsplash.com/photos/cup-of-latte-sDTslqK5gq8) | [photo-1575961895636-ce137b497075](https://images.unsplash.com/photo-1575961895636-ce137b497075) | [Unsplash License](https://unsplash.com/license) |
| product-americano.webp | [M Grate Pest](https://unsplash.com/photos/a-cup-of-coffee-sitting-on-top-of-a-saucer-1vBFkgwjQtg) | [photo-1718808713242-ce2f191d81ad](https://images.unsplash.com/photo-1718808713242-ce2f191d81ad) | [Unsplash License](https://unsplash.com/license) |
| product-cappuccino.webp | [Raymond Petrik](https://unsplash.com/photos/a-cappuccino-sits-on-a-table-next-to-a-coffee-maker-B_-RmmMesOs) | [photo-1721116804027-55008abc4752](https://images.unsplash.com/photo-1721116804027-55008abc4752) | [Unsplash License](https://unsplash.com/license) |
| product-flat-white.webp | [Caramel](https://unsplash.com/photos/a-person-holding-a-cup-of-coffee-in-their-hand-I87vK-gX7wE) | [photo-1670710029529-48fe1bc2eb3d](https://images.unsplash.com/photo-1670710029529-48fe1bc2eb3d) | [Unsplash License](https://unsplash.com/license) |
| product-vanilla.webp | [Natilyn Hicks Photography](https://unsplash.com/photos/white-cream-in-clear-glass-jar-T6ef007vJvE) | [photo-1594068842621-b7796f576a36](https://images.unsplash.com/photo-1594068842621-b7796f576a36) | [Unsplash License](https://unsplash.com/license) |
| product-mocha.webp | [Ibrahim Rifath](https://unsplash.com/photos/chocolate-mocha-serve-in-glass-mug-Edmcnx3LLsM) | [photo-1533651441215-d01c13c8c4ad](https://images.unsplash.com/photo-1533651441215-d01c13c8c4ad) | [Unsplash License](https://unsplash.com/license) |
| product-v60.webp | [William Figueroa](https://unsplash.com/photos/coffee-is-brewing-in-a-pour-over-coffee-maker-PIRNODAC1WA) | [photo-1741908494446-23d1550a1bca](https://images.unsplash.com/photo-1741908494446-23d1550a1bca) | [Unsplash License](https://unsplash.com/license) |
| product-cold-brew.webp | [Pradeep Javedar](https://unsplash.com/photos/person-pouring-coffee-in-cup-with-ice-92jVHOhXT7c) | [photo-1556791766-66ac915737cf](https://images.unsplash.com/photo-1556791766-66ac915737cf) | [Unsplash License](https://unsplash.com/license) |
| product-matcha.webp | [Cody Chan](https://unsplash.com/photos/a-glass-of-refreshing-matcha-iced-latte-Oog-4Ox0rv8) | [photo-1751563721808-3b81940b88f7](https://images.unsplash.com/photo-1751563721808-3b81940b88f7) | [Unsplash License](https://unsplash.com/license) |
| product-lychee.webp | [Content Pixie](https://unsplash.com/photos/clear-drinking-glass-with-brown-liquid-and-ice-mAYaGExwdEo) | [photo-1599767431130-41b1c51d9a7b](https://images.unsplash.com/photo-1599767431130-41b1c51d9a7b) | [Unsplash License](https://unsplash.com/license) |
| product-pain.webp | [Mink Mingle](https://unsplash.com/photos/close-up-photography-of-baked-treats-on-tray-qZ5lPCPvdXE) | [photo-1483695028939-5bb13f8648b0](https://images.unsplash.com/photo-1483695028939-5bb13f8648b0) | [Unsplash License](https://unsplash.com/license) |
| product-banana.webp | [Pratik Gupta](https://unsplash.com/photos/baked-pastry-0hqhBB373yU) | [photo-1538421001169-6774f32315fe](https://images.unsplash.com/photo-1538421001169-6774f32315fe) | [Unsplash License](https://unsplash.com/license) |
| product-singkong.webp | [Wawan arga12](https://commons.wikimedia.org/wiki/File:Singkong_goreng_gurih_dan_lezat.jpg) | [Singkong_goreng_gurih_dan_lezat.jpg](https://upload.wikimedia.org/wikipedia/commons/c/cd/Singkong_goreng_gurih_dan_lezat.jpg) | [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) |

[Unsplash License](https://unsplash.com/license) was checked on 2026-10-22 and permits commercial website incorporation subject to its restrictions. These photos are not sold as standalone assets. The Singkong Goreng original page declares the uploader’s own work under [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/), whose deed permits commercial use; no endorsement is implied. These observations establish the documented copyright basis, not a warranty of releases or ownership beyond the source declarations. None of the approved final crops shows an identifiable face or prominent third-party branding. Visible hands and anonymous background equipment are not claimed to belong to Kopi Senja.

`assets/evidence/product-images.json` records the exact download URLs, author/page/license observations, source and derivative SHA-256 values, output sizes, crop/encoding settings and Indonesian alt text. Outputs are 700 × 560 WebP (5:4); existing responsive card crops, lazy loading and modal behavior are preserved. Original JPEGs and rejected candidates stay in ignored local source/QA directories and are not published. `npm run images` can regenerate approved derivatives from local sources only; it never downloads or processes blocked originals.

Nine products retain explicit placeholders. Rejected or unverified candidates are **not approvals**: see [product inventory](PRODUCT-IMAGE-INVENTORY.md) for each remaining blocker. Future customers should replace illustrative stock with their own accurate, rights-cleared servings; the current photos do not establish Indonesian bean origin, recipe quantities, actual portion sizes or real shop premises.

## Final nine — generated product illustrations, 2026-10-22

After the recorded photo search did not establish suitable photographs for the remaining recipes, nine separate text-only prompts were submitted to the authorized built-in `image_gen.imagegen` capability. All nine calls returned actual PNG files; copies were saved locally, visually inspected, then optimized into square WebP. No stock photo or other reference image was supplied. No blocked original was edited or restored.

| Product | Published file | Returned generation artifact |
| --- | --- | --- |
| Es Kopi Susu Gula Aren | /images/product-kopi-aren-ai.webp | exec-143931d0-db87-4f91-806d-30fc1371ff47.png |
| Double Espresso | /images/product-espresso-ai.webp | exec-8a05a75a-22a2-4359-9bb0-229fbfa913c0.png |
| Pandan Kopi Susu | /images/product-pandan-ai.webp | exec-34bf556e-0ce0-44e7-a6a1-d0c525d703a5.png |
| Kopi Tubruk | /images/product-tubruk-ai.webp | exec-829f4e50-10c8-49f5-89ef-19b42c319c16.png |
| Chocolate Milk | /images/product-chocolate-ai.webp | exec-c5b59374-1ca2-41a9-beaf-181965c3f0cb.png |
| Jasmine Tea | /images/product-jasmine-ai.webp | exec-75285ecc-a05e-4230-acce-6aaafdadddcd.png |
| Lemon Tea | /images/product-lemon-tea-ai.webp | exec-795dfdbf-1909-4c95-a2be-e74c2826b610.png |
| Kaya Butter Toast | /images/product-toast-ai.webp | exec-28154aad-2d61-4c27-a09d-d56cec8f53e1.png |
| Sea Salt Fries | /images/product-fries-ai.webp | exec-82b0c9ae-dd96-4da3-834d-d7c349ec5b1b.png |

These are **AI-generated illustrations**, not photographs, CC0 works, or licensed Unsplash assets. Generation through the available tool is documented separately from stock-photo provenance. Use is subject to the applicable provider/account terms. The official [Terms of Use, Content section](https://openai.com/policies/terms-of-use/) and [Services Agreement, section 4](https://openai.com/policies/services-agreement/) were checked on 2026-10-22: they address output ownership between the provider and the user/customer, subject to law and the terms, and warn that outputs may be similar to other output. The account-specific agreement and copyright status have not been independently certified. No exclusive copyright, uniqueness, registration, third-party clearance or separate royalty-free stock license is asserted.

[Generation records](assets/evidence/generated-products.json) include every exact prompt, returned artifact filename, source/derivative SHA-256, actual source dimensions, 700 × 700 WebP encoding settings, usage basis, visual inspection and Indonesian AI-labelled alt text. The model/version is not exposed by the tool and is not invented. Original PNGs remain in ignored `assets/photo-sources/`; public WebP derivatives and the evidence records are intended to be versioned. `npm run images` re-encodes retained originals, not a new generation. A fresh clone uses the WebP files directly; new generations will differ and require new records/hashes.

Each generated menu card and its customization dialog visibly says “Ilustrasi AI · bukan foto produk asli”; the menu notice also identifies stock and AI imagery. Labels remain when demo mode is changed. Cart thumbnails use the same descriptive alt text. This is a fictional shop and these images do not prove real product availability, recipes or serving quantities. Before commercial customer use, obtain the owner’s approval for the illustrative presentation or replace it with actual rights-cleared product photography.

[Photo-first search decisions](assets/evidence/remaining-nine-sourcing.json) record rejected alternatives, including a CC BY kaya-toast candidate that was inspected but not published. No new licensed stock photo is incorporated in this follow-up.
