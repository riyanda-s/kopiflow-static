# UI polish and layout verification — 2026-10-22

## Changes and root causes

Product cards previously used independent document flow. Variable name/description wrapping moved the price row and its border independently; repeated AI captions added height to only some cards. Mobile CSS also hid availability text. The gallery used unequal column widths, a 32px offset on the second figure, fixed image heights and a mobile first-card exception. Those rules caused inconsistent ratios, spacing and caption baselines. Gallery captions were hardcoded separately from their image configuration, and the third configured image was still the neutral placeholder.

Cards now use five shared CSS Grid/subgrid content tracks: image, category/availability, name, description and price. Cards stretch together within each row; names/descriptions reserve minimum space but grow without clipping or truncation. Price rows and their decorative rules align at the bottom. Image containers use 5:4 above the mobile breakpoint and square on mobile. Category/availability labels align and remain visible on small screens. The house selection uses four columns on desktop and two on tablet/mobile, preserving readable content widths.

Gallery cards now have equal columns, 4:3 images, consistent caption borders and a shared numbering/text baseline. The second-card offset and unequal first-card mobile height are removed. All three gallery cards stack at mobile widths. The third image now reuses the approved Nathan Dumlao latte photograph, `/images/product-latte.webp`; its original source and license evidence already exist in the asset register. No new image or licensing claim was introduced.

The repeated visible “Ilustrasi AI · bukan foto produk asli” label was removed from cards and dialogs. The fictional demo shows one note after the menu grid, near the menu footer:

> Foto menu merupakan ilustrasi. Tampilan penyajian dapat berbeda.

Image files, AI-specific alt text, `imageGenerated`, generation records, approval entries and provenance are preserved. An exported before/after comparison confirmed that **every field of all 23 products is unchanged**, including prices, descriptions, variants, options, availability and image metadata. Checkout calculations and WhatsApp behavior were not modified.

## Indonesian copy

The requested headings, descriptions, links and gallery captions now use Indonesian, with brand-specific copy centralized in configuration:

| Previous copy | Current copy |
| --- | --- |
| THE HOUSE SELECTION | PILIHAN KEDAI |
| A few more reasons to linger. | Alasan untuk tinggal sejenak. |
| Our best-seller selection: a bold brew, a fresh discovery, a sweet finish. | Dari seduhan berkarakter, rasa baru untuk dijelajahi, hingga teman manis di akhir. |
| Find your favorite | Temukan pilihan Anda |
| A GLIMPSE OF THE GOOD LIFE | SEKILAS MOMEN HANGAT |
| A little corner of calm. | Sudut kecil untuk melepas penat. |
| Coffee, company, and everything in between. | Kopi, teman cerita, dan jeda di antaranya. |
| Find your corner. | Temukan jeda Anda. |
| Savor the little things. | Nikmati hal-hal sederhana. |
| Make room for something good. | Sediakan waktu untuk rasa yang baik. |

Homepage hero, favorites, story, philosophy, promotional and opening-hours copy also use the centralized Indonesian text. The existing “Every Sip Has a Story.” brand tagline is unchanged. Shared footer/location copy and other pages retain some existing English; this pass does not claim complete site localization.

## Four-viewport results

| Width | House selection | Menu | Gallery | Result |
| --- | --- | --- | --- | --- |
| 1440px | 4 columns | 3 columns | 3 equal columns | Aligned; no overflow or broken images |
| 768px | 2 columns | 3 columns | 3 equal columns | Aligned; no overflow or broken images |
| 390px | 2 columns | 2 columns | 1 column | Aligned; no overflow or broken images |
| 320px | 2 columns | 2 columns | 1 column | Aligned; wrapping grows without clipping |

The new layout test checks card/image sizes, metadata/title/description starts, price/border positions and gallery image/caption/number alignment within 1.5 CSS pixels per row. It decodes every image, checks ratios and document overflow, and injects long names/descriptions into the DOM to verify growth without changing catalog data. It exercises navigation, keyboard product opening, adding to cart, cart focus containment and axe accessibility at every width. Existing functional/accessibility tests remain intact.

Screenshots and machine-readable measurements are saved in ignored `qa-artifacts/ui-polish/desktop/` and `qa-artifacts/ui-polish/mobile/`:

- `{width}-home.png`, `{width}-menu.png`: full-page views with normal floating UI.
- `{width}-selection.png`, `{width}-gallery.png`: focused section captures; the floating mobile cart and unfocused skip-link helper are excluded only during these screenshots to inspect unobscured content. Tall element captures otherwise include an offscreen fixed helper in Chromium. Full-page captures retain normal floating UI; keyboard and accessibility tests run without these capture styles.
- `{width}-home-long-copy.png`, `{width}-menu-long-copy.png`: synthetic long-copy stress captures.
- `measurements.json`: eight route/width results per browser project.

Screenshots were visually inspected in addition to automated geometry checks. These are layout regression checks and captured evidence, not claims of comparison against an existing golden pixel baseline. Testing uses the configured Chromium desktop and mobile-emulation projects; Safari/Firefox and physical devices were not tested.

## Verification

| Command / check | Result |
| --- | --- |
| `npm run check` | Passed: 49 files, zero errors/warnings/hints |
| `npm run lint` | Passed |
| `npm test` | Passed: 51 tests in 3 files |
| `npm run build` | Passed: static `dist/`, 7 HTML pages |
| `npm run test:e2e` | Passed: all 26 tests, including the four-width matrix in both configured projects; 2.1 minutes |
| `npm run test:client` | Passed: isolated customer configuration, price/name fixture, mocked checkout fallback, retained cart and QR decoding; no real order sent |
| Focused matrix rerun | Passed in both projects after adding neutral screenshot capture and long-copy screenshots; 2 tests, 1.9 minutes |
| Final section-capture refresh | Passed: all four widths in the desktop project; 1 test, 38.4 seconds; excludes offscreen helpers from section-only captures |
| Full menu baseline comparison | Passed: all product fields and image metadata unchanged |
| Product asset hashes | Passed: all 22 recorded product derivatives still match their stock/generation evidence |

The required test/browser subprocesses ran with permission outside the Windows sandbox. No accessibility check was removed or relaxed. The application remains static and demo checkout remains disabled.

## Files changed in this UI pass

- `src/styles/global.css`: card/gallery tracks, ratios, spacing and tablet/mobile behavior.
- `src/config/business.ts`: centralized Indonesian homepage copy, menu note, gallery asset/captions.
- `src/pages/index.astro`, `src/pages/menu.astro`, `src/components/Hero.astro`, `src/components/Gallery.astro`: configuration-driven copy and gallery/disclosure markup.
- `src/components/ProductCard.astro`, `src/components/ProductModal.astro`, `src/scripts/storefront.ts`: remove repeated labels and their obsolete dialog update only.
- `tests/e2e/storefront.spec.ts`, new `tests/e2e/visual-polish.spec.ts`: revised disclosure assertions, image preservation checks and four-width layout/accessibility/long-copy screenshots.
- `CONFIGURATION.md`, `ASSET-LICENSES.md`, `PRODUCT-IMAGE-RESTORATION.md`, `QA-CHECKLIST.md` and this report: current presentation policy and verification evidence. Original provenance/generation records were not rewritten.

No unresolved card/gallery alignment, broken-image or horizontal-overflow issue was found at the four target widths. Long content deliberately increases row height. Older browsers without CSS subgrid are outside this verification. No deployment, commit or push was performed.
