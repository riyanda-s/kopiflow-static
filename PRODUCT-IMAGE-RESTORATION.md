# Product image restoration

UI presentation follow-up: repeated visible AI labels have been replaced with one general fictional-demo menu note, while all image files, AI alternatives, metadata and evidence remain intact. See `UI-POLISH-REPORT.md` for the current layout/disclosure behavior and latest verification. The generation and sourcing results below remain historical evidence.

## Latest: final nine completed — 2026-10-22

All nine remaining placeholders have been replaced with new, visually inspected AI-generated illustrations. **All 23 products now have images; zero product placeholders or WAITING_FOR_GENERATED_ASSET items remain.** The existing 14 illustrated products are unchanged. No previously blocked original was restored.

Updated: Es Kopi Susu Gula Aren, Double Espresso, Pandan Kopi Susu (the existing menu name), Kopi Tubruk, Chocolate Milk, Jasmine Tea, Lemon Tea, Kaya Butter Toast and Sea Salt Fries.

### Sourcing and generation

Photo-first research did not establish suitable accurate stock assets for these servings. [Search decisions](assets/evidence/remaining-nine-sourcing.json) distinguish rejected/uncertain captions, branded cups, extra ingredients, multiple servings and unpurchased premium images. A new CC BY kaya-toast candidate was inspected but not published. No claim is made that suitable stock photographs cannot exist elsewhere.

Nine separate calls to the authorized built-in image_gen.imagegen capability returned nine actual PNGs. No API-key fallback, new account, asset purchase or reference-photo input was used. [Generation records](assets/evidence/generated-products.json) contain the exact per-product briefs, returned artifact filenames, actual source dimensions, hashes, transformation settings, alt text and usage basis. Provider model/version was not exposed and is not asserted. [ASSET-LICENSES.md](ASSET-LICENSES.md) distinguishes generated output subject to applicable provider/account terms from stock licenses; no exclusivity or copyright-registration guarantee is claimed.

Each final asset is a centered square 700 × 700 WebP, quality 80, 28–44 KB (300,708 bytes combined), with warm cream/brown surroundings, natural light and the specified serving only. Originals are retained locally under ignored assets/photo-sources/. The nine published paths are listed in the generation manifest and [inventory](PRODUCT-IMAGE-INVENTORY.md). A fresh clone uses the tracked WebP derivatives; re-encoding needs the retained original PNGs. A new generation would require new evidence/hashes.

Visible Indonesian AI captions appear on each affected product card and in its dialog; the menu notice explains stock/AI imagery. Alt text identifies AI illustrations and is reused in cart thumbnails. These disclosures remain when demo mode changes. This does not claim that a real coffee shop sells the pictured servings. Existing responsive image crops/layout are preserved; refreshed desktop/mobile screenshots and all nine optimized outputs were inspected.

### Verification results

| Command / verification | Actual result |
| --- | --- |
| npm run check | Passed: 48 files, zero errors/warnings/hints |
| npm run lint | Passed |
| npm test | Passed: 51 tests in 3 files |
| npm run build | Passed: static dist/, 7 HTML pages, all nine new images included |
| npm run test:e2e | Passed: 24 desktop/mobile tests, 35.1 seconds; includes axe accessibility, every new asset loading at 700 × 700, AI captions/modal switching, cart/checkout gates and screenshots |
| npm run test:client | Passed: isolated branding/product configuration change, mocked checkout fallback, recipient/message/total, retained cart and decoded fixture QR; no real message sent |
| Menu baseline comparison | Passed: all 23 products preserve every non-image field, including names/prices/options/availability/cart inputs |
| Source, derivative and build hash bindings | Passed for all nine; local re-encoding reproduces each recorded derivative exactly |
| Git exclusions / whitespace | Source PNGs, QA artifacts, dist/ and isolated fixture are ignored; git diff --check passed with only Windows line-ending notices |

The first E2E attempt stopped before running tests because the added JSON import lacked Node's required import attribute. It was corrected, then the complete 24-test suite passed. Test subprocesses used the required permission outside the Windows sandbox. Temporary contact-sheet rendering emitted non-fatal font-cache notices; final product assets contain no rendered text.

### Modified files in this follow-up

- Nine public/images/product-*-ai.webp files.
- src/data/menu.ts and src/data/product-photo-alt.ts: paths, alternatives and image-origin metadata only.
- src/config/assets.ts; new assets/evidence/generated-products.json and assets/evidence/remaining-nine-sourcing.json: approvals, real generation records and photo-search decisions.
- src/components/ProductCard.astro, src/components/ProductModal.astro, src/pages/menu.astro and src/scripts/storefront.ts: truthful AI disclosures and image alt text; no ordering calculations changed.
- scripts/optimize-images.mjs: re-encode documented generated originals alongside approved stock sources.
- tests/unit/site.test.ts and tests/e2e/storefront.spec.ts: generated-asset integrity/assignment/loading and disclosure coverage.
- ASSET-LICENSES.md, PRODUCT-IMAGE-INVENTORY.md, this report, QA-CHECKLIST.md and CONFIGURATION.md: evidence, results and customer guidance.

### Remaining actions

No image-generation blockers remain for the fictional local demo. Before real customer use, obtain owner approval for these illustrations and recipes or replace them with accurate rights-cleared shop photographs. Keep evidence and AI disclosures with any retained generated assets. Actual business/contact/domain setup and release readiness remain separate work. Main demo checkout is still disabled. No deployment, commit or push was performed.

---

## Earlier stock-photo restoration (historical)

## Result

Restored 13 of the 22 missing product photographs. Fourteen of 23 products now have approved illustrative photos, including the unchanged Butter Croissant; nine retain explicit placeholders. No previously blocked asset was restored. Nothing was deployed, pushed, purchased or sent to WhatsApp.

Updated products: Caffè Latte, Americano, Cappuccino, Flat White, Vanilla Latte, Caffè Mocha, V60 Filter Coffee, Slow Cold Brew, Matcha Latte, Lychee Iced Tea, Pain au Chocolat, Banana Bread and Singkong Goreng. Banana Bread remains unavailable, as configured before this work.

Placeholders retained: Es Kopi Susu Gula Aren, Double Espresso, Pandan Kopi Susu, Kopi Tubruk, Chocolate Milk, Lemon Tea, Jasmine Tea, Kaya Butter Toast and Sea Salt Fries. Candidates lacked sufficiently specific recipe/serving evidence, had visible branding, included unconfigured toppings, or could not be confidently distinguished. These are unresolved sourcing/product-match blockers, not a claim that no suitable licensed image exists anywhere. See [the inventory](PRODUCT-IMAGE-INVENTORY.md) for each decision.

## Evidence and implementation

- Twelve new photos use individually verified Unsplash pages and the [Unsplash License](https://unsplash.com/license). Singkong Goreng uses Wawan arga12's own-work photo on [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Singkong_goreng_gurih_dan_lezat.jpg), declared CC0 1.0. Source pages identify authors/licenses; image links establish exact asset identities. Commercial incorporation is supported by the recorded license terms, subject to their restrictions; no exclusive rights, endorsements or release guarantees are claimed.
- [ASSET-LICENSES.md](ASSET-LICENSES.md) contains the author/source/asset/license table. [Machine-readable evidence](assets/evidence/product-images.json) binds downloads and derivatives with SHA-256 hashes and records transformations, output sizes and alt text. [The approval registry](src/config/assets.ts) contains every new public asset.
- New local WebP files are 700 × 560, quality 80, approximately 12–61 KB each; combined size 326,068 bytes. Originals and rejected candidates stay outside `public/` and are ignored by Git. No image CDN is contacted by the shipped website.
- Menu image assignments and Indonesian alt text changed in data files only. A before/after comparison of all 23 exported products confirmed that every non-image field is unchanged, including names, prices, descriptions, categories, variants, add-ons, availability and badges. Shared UI, styling, checkout and business configuration were not modified.
- Inspected all final derivatives and refreshed desktop/mobile menu screenshots. Existing aspect ratios, responsive crops, layout and lazy loading remain intact. Screenshots and scratch files are ignored under `qa-artifacts/`.

## Verification

| Command / check | Actual result |
| --- | --- |
| `npm run check` | Passed: 48 files, zero errors/warnings/hints |
| `npm run lint` | Passed |
| `npm test` | Passed: 50 tests across 3 files; includes approval/assignment/hash/WebP/size checks |
| `npm run build` | Passed: static `dist/`, 7 HTML pages; all 13 new images present |
| `npm run test:e2e` | Passed: 22 desktop/mobile tests, 1.3 minutes; includes axe accessibility, cart, disabled demo ordering, CSP, QR and screenshots |
| `npm run test:client` | Passed: isolated branding/menu configuration change, mocked blocked-popup checkout, message/recipient/total/cart retention, decoded fixture QR; no real order sent |
| Non-image menu comparison | Passed: all 23 products preserve all non-image fields |
| `git diff --check` | Passed; only Windows LF/CRLF conversion notices |
| Git exclusions | Confirmed for source JPEGs, QA screenshots, `dist/` and `.client-check/`; generated files/secrets not added |

Unit, E2E and customer-fixture commands initially encountered Windows sandbox `spawn EPERM` startup errors; rerunning with required subprocess permission passed. Those startup failures are not hidden or counted as successful tests. Temporary contact-sheet rendering emitted a non-fatal font-cache warning; final images do not use rendered text or system fonts.

Main demo configuration remains `isDemo: true`, `whatsappVerified: false`, with an empty WhatsApp number. Actual ordering remains disabled. Public-origin configuration and deployment readiness were not changed or re-reviewed in this image-only task. Nine accurate product photographs and real customer acceptance/configuration remain future work.

## Changed files

- `src/data/menu.ts`, new `src/data/product-photo-alt.ts`: image paths and descriptive alternatives.
- `src/config/assets.ts`, new `assets/evidence/product-images.json`, `ASSET-LICENSES.md`: approvals and provenance.
- Thirteen new `public/images/product-*.webp` derivatives listed in the evidence manifest.
- `scripts/optimize-images.mjs`: reproducible local optimization of approved products only; original sources must be obtained separately on a fresh clone.
- `tests/unit/site.test.ts`: validates approved replacements instead of requiring placeholders for every non-croissant product.
- `PRODUCT-IMAGE-INVENTORY.md`, this report and `QA-CHECKLIST.md`: durable inventory, blockers and actual results.
