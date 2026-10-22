# Kopi Senja - brand-level redesign

## Baseline critique (before implementation)

1. The generic brewing-photo hero communicates a category, rather than a recognizable signature product.
2. Repeated heading/grid sections and the same brewing image in hero/story flatten the page rhythm.
3. Mobile cards devote too much height to secondary descriptions while prices and selection controls compete for attention.
4. The isolated sun character, hard rules and identical rectangular compositions do not yet form a distinctive brand language.
5. Menu introductions, filters, customization and cart have inconsistent emphasis; useful functionality feels separate from the brand presentation.

These are presentation and discovery problems. The existing search, variants, cart, pricing, QR, demo restrictions and repeatable observer system are functional baselines to preserve.

## Reference boundaries

Official reference pages reviewed: [Fore Coffee](https://fore.coffee/id/) and [Kopi Kenangan](https://kopikenangan.com/). Fore gives campaign/story/menu/app destinations clear roles; Kenangan gives product campaigns direct entry points and separates brand story from ordering destinations. The reusable lesson is strong product focus and clear navigation hierarchy. No reference trademarks, artwork, photographs, slogans, layout or proprietary design system are imported.

## Intended Kopi Senja direction

An original sunset-arch silhouette, espresso/ivory contrast and copper accents connect a bounded signature-product hero to quieter editorial sections. Existing licensed/native typography remains. A new signature-product story replaces the generic promotional banner; product data, not duplicated prices, supplies campaign details.

The existing gula aren asset is 700x700px. It is inspected and suitable for a contained product presentation, not a full-bleed large photograph. Rendering will stay below its intrinsic CSS dimensions. No file is regenerated, enlarged, downloaded or re-licensed. High-density close inspection remains limited by the available resolution.

## Implemented changes

- `Hero.astro`: the configured signature product supplies the approved image, exact alt text, name and base price. Two-tone ivory/caramel art direction, a CSS sunset orbit and arch frame replace the brewing-photo composition. The Menu CTA stays immediately usable; the fictional/illustrative disclosure remains visible.
- `SignatureCampaign.astro`: an original dark espresso campaign replaces the generic promotion banner, with ingredient storytelling, layered AREN lettering and an approved product image. No discount, review, award or operational claim was invented.
- `brand.css`: square catalogue images, clearer category/availability tracks, stronger price hierarchy, 44px-or-larger selection controls, coordinated card/dialog/cart treatments, compact menu introduction and horizontally scrollable mobile category controls. Names and descriptions can grow; there is no clipping or line clamp.
- Product dialog presentation uses a two-column layout on wide screens and compact image/form stacking on mobile. Tablet order controls can wrap. Native semantics, focus handling and the underlying form remain unchanged.
- Empty/sold-out states receive presentation refinements; available and unavailable controls retain their existing behavior. The cart has a clearer estimate panel and still explains confirmation and demo restrictions.
- `motion.ts`: adds only campaign targets to the existing repeatable observer. State transitions, hysteresis, timing, reduced-motion handling and focus safeguards are preserved.
- `business.ts`, `theme.ts`: campaign/menu/hero copy and copper/paper accents are centralized. `campaign.productId` selects a catalogue record; missing IDs fail the static build rather than inventing a product. The old generic promotion record remains for compatibility.
- `CONFIGURATION.md`: documents the campaign/product binding, accent settings and honest 700px asset limitation.
- `visual-polish.spec.ts`: expects the deliberately redesigned square images and checks the hero's approved asset, price, fictional disclosure, intrinsic/rendered size and campaign ingredients. All existing alignment, long-copy and accessibility assertions remain enabled.

Changed files: `src/components/Hero.astro`, new `src/components/SignatureCampaign.astro`, new `src/styles/brand.css`, `src/config/business.ts`, `src/config/theme.ts`, `src/layouts/Layout.astro`, `src/pages/index.astro`, `src/pages/menu.astro`, `src/scripts/motion.ts`, `tests/e2e/visual-polish.spec.ts`, `CONFIGURATION.md`, `playwright.config.ts`, `scripts/verify-client.mjs`, and this report.

## Before/after evidence and visual QA

Local evidence is under ignored `qa-artifacts/brand/before/` and `after/`. Baseline captures cover home, menu, dialog and cart at all six widths; secondary routes are captured at 390px and 1440px. The corrected after set additionally captures individual signature, selection, story, gallery, campaign and visit sections. Component-only screenshots hide fixed navigation/cart chrome for unobstructed inspection; full-page and viewport captures retain the actual UI. Smooth scrolling is disabled only in the capture helper to avoid sampling a scroll still in progress; production motion remains active.

| Component | Before evidence | After evidence | Difference inspected |
| --- | --- | --- | --- |
| Hero | `before/{width}-hero.png` | `after/{width}-hero.png` | Brewing scene replaced by bounded signature-product composition and stronger brand hierarchy |
| Catalogue | `before/{width}-menu-top.png`, `before/{width}-menu.png` | Matching files under `after/` | Earlier mobile discovery, scrollable categories, square images, readable prices |
| Featured products | `before/{width}-home.png` | `after/{width}-favorites.png`, `after/{width}-selection.png` | Stronger image/price balance, equal content tracks and selection controls |
| Campaign | Generic banner in `before/{width}-home.png` | `after/{width}-campaign.png` | Product/ingredient story with original type and arch treatment |
| Product dialog | `before/{width}-product-dialog.png` | Matching file under `after/` | Desktop product/form composition, mobile compact image and clear customization |
| Cart | `before/{width}-cart.png` | Matching file under `after/` | Branded product treatment and clearer estimated-total hierarchy |
| Supporting sections | `before/{width}-home.png` | `after/{width}-{story,gallery,visit}.png` | Coordinated shape, typography and section spacing |

Rendered hero captures were opened at every required width. Actual campaign, featured-product, catalogue, customization and cart captures were also inspected. The first captures revealed an inherited landscape image-container ratio, cramped ingredient labels at 320px and temporary text-encoding artifacts; these were corrected before the final full regression. Fixed chrome overlapping isolated section screenshots was corrected in the QA helper rather than misreported as clipped content. An initial preview-process conflict was resolved by serializing capture and Playwright preview servers.

All six after-capture home/menu pairs report no document horizontal overflow. Secondary-page captures at 390px and 1440px also report none. Hero rendering stays below the source image's intrinsic 700px width. The arch clips background corners, leaving the actual glass/ingredients visible. System serif/sans typography and all existing asset records are retained. No new photo, raster generation, font, dependency or third-party runtime request was introduced.

## Accessibility and regression findings

The first complete run passed 58/60 tests and exposed two actual regressions: the empty-cart paragraph had 4.2:1 contrast against its new background, and mobile catalogue descriptions were 13px rather than the existing 14px minimum. The paragraph was darkened and descriptions restored to 14px. Neither assertion was removed or weakened. Failure traces are retained under `qa-artifacts/brand/initial-regression/`; the corrected-build rerun passed those checks. That rerun passed 59/60 tests, with the 1920px touch-emulation case reaching its unchanged 150-second budget during its final axe scan under three parallel browsers. Browser concurrency was reduced from three workers to two; no test, assertion or timeout was removed or relaxed. Two workers alone did not resolve that aggregate-case timeout. The visual matrix was then split into independent homepage and menu cases, retaining every original check and the same 150-second limit per case. Menu cases retain the original keyboard/dialog/cart audit. Route-specific measurement files avoid collisions. This expands the suite from 60 to 72 cases without removing coverage; final results follow.

The brand link has a 44px minimum target, product selection buttons are 46px desktop / 44px mobile, options have a 44px minimum, and native focus indicators/keyboard semantics are retained. Reduced-motion CSS and the existing observer preference handling still disable nonessential motion. No-JavaScript content stays visible, with the existing fallback navigation and menu notice. Search/customization/cart remain JavaScript interactions as before.

No product data, image file, approval registry, provenance record, shared storefront logic or cart utility was modified (`git diff --exit-code HEAD -- src/data src/config/assets.ts src/scripts/storefront.ts src/utils public assets/evidence ASSET-LICENSES.md`). New campaign prices/images come from the catalogue; no price was duplicated in reusable presentation code. Demo flags, blank/unverified WhatsApp recipient, canonical/domain configuration and security headers are preserved. The build still distributes 39 static files, with no source maps, source TypeScript, Markdown, environment files or QA directories. Generated QA output, `.env`, `dist/` and `test-results/` remain ignored. Git diff whitespace validation passes.

## Bundle cost

The fresh baseline Lighthouse network audit confirms 27,226 JavaScript bytes and 52,645 CSS bytes. The final production build's local gzip measurement is saved in `after/bundle-sizes.json`; the baseline manifest is in `before/bundle-sizes.json`.

| Bundle | Before raw / gzip bytes | After raw / gzip bytes | Gzip increase |
| --- | --- | --- | --- |
| JavaScript | 27,226 / 10,111 | 27,834 / 10,310 | 199 bytes |
| CSS | 52,645 / 11,858 | 62,999 / 13,902 | 2,044 bytes |

The presentation layer adds no dependency, animation framework, font download or continuous scroll handler. Gzip figures are local compression measurements, not a guarantee of a hosting provider's transfer encoding. The isolated final runtime measurements are reported below.

## Remaining limits

- The approved signature illustration remains 700px square. Its bounded presentation is suitable for this local demo; a separately approved higher-resolution asset is needed for crisp large high-density crops or a future full-bleed treatment. No upscaled file or invented source evidence was supplied.
- Physical Android/iOS hardware, Safari and Firefox have not been validated in this run. Touch testing uses Chromium emulation; system-font rendering may vary across platforms.
- Lighthouse is a local single-run simulated-mobile lab measurement. Field INP, real-device frame rates and real-user Core Web Vitals are not measured. Demo noindex remains intentional.
- This remains a fictional shop with sample business details, illustrative menu imagery and disabled ordering. A real customer still requires verified business/contact information, appropriate owner-approved product photography and separate launch authorization.
- The existing public demo is unchanged. No deployment, commit, push, account creation, purchase or real message submission was performed.

## Final regression results

Validated locally on 23 October 2026. The final complete suite passes after the documented corrections and case split. No tests were skipped and no accessibility assertion or timeout was weakened.

| Command | Actual result |
| --- | --- |
| `npm run check` | Passed: 54 files, zero errors, warnings or hints |
| `npm run lint` | Passed |
| `npm test` | Passed: 51 tests across 3 files |
| `npm run test:e2e` | Passed: all 72 cases, desktop and touch-emulated Chromium; 11.6 minutes, two workers |
| `npm run build` | Passed: seven static HTML pages plus sitemap, robots, headers and local assets; no server runtime |
| `npm run test:client` | Passed: config/data-only customer fork, renamed product/price, cart retention and decoded QR; checkout popup stub sends no message |
| `npm audit` | Zero vulnerabilities reported |

| Viewport | Desktop homepage / menu | Touch-emulated homepage / menu | Alignment, long copy, overflow and axe |
| --- | --- | --- | --- |
| 320px | Passed | Passed | Passed |
| 390px | Passed | Passed | Passed |
| 768px | Passed | Passed | Passed |
| 1024px | Passed | Passed | Passed |
| 1440px | Passed | Passed | Passed |
| 1920px | Passed | Passed | Passed |

Final route-specific visual measurements are in `qa-artifacts/ui-polish/{desktop,mobile}/measurements-{width}-{home,menu}.json`. The full suite also preserves search/categories, variants/add-ons, prices/totals, persistence/blocked-storage fallback, sold-out behavior, QR export/destination, keyboard/Escape/focus, disabled demo checkout including forced DOM/keyboard attempts, Indonesian copy, image evidence, repeatable up/down motion, boundary hysteresis, history, reduced motion and visible no-JavaScript content.

## Final screenshot and performance findings

The final six-width capture completed with no document horizontal overflow and primary targets at least 44px on all 20 captured route/viewport combinations. Empty cart, empty search and sold-out states are captured at every width. All six before/after hero comparison images were opened, along with actual featured-product, campaign, menu, dialog and cart renders. No remaining clipping, broken image, misaligned price track or inaccessible primary control was observed in the tested layouts. Evidence remains local and ignored; comparison PNGs are `qa-artifacts/brand/{width}-{hero,menu-top,product-dialog,cart}-comparison.png` (before left, after right).

A final reuse check moved the decorative campaign word from a component literal to `business.campaign.word`. The extended customer fixture proves it can change to UJI without a component edit. All seven generated HTML documents are byte-identical to the 72-case-tested version after normalizing only the JavaScript bundle filename (`default-dom-invariance.json`). After this binding change, typecheck/lint/build, all 51 unit tests, the extended customer fixture and audit passed again; all six homepage visual/a11y cases also passed (21.7s). The full 72-case result is preserved separately as `full-e2e-last-run.json`. No default presentation, price, variant, availability, image, cart calculation or ordering behavior changed.

The isolated final Lighthouse measurement used the same simulated-mobile configuration as the fresh baseline. Full HTML reports and environment/config settings are saved in `qa-artifacts/brand/{before,after}/lighthouse-*`.

| Measurement | Before | Final after |
| --- | --- | --- |
| Home Performance | 100 | 99 |
| Home LCP | 1439ms | 1510ms |
| Home Total blocking time | 50ms | 100ms |
| Home CLS | 0 | 0 |
| Menu Performance | 100 | 100 |
| Menu LCP | 1135ms | 1672ms |
| Menu Total blocking time | 26ms | 44ms |
| Menu CLS | 0 | 0 |
| Accessibility, both routes | 100 | 100 |
| Best Practices, both routes | 100 | 100 |
| SEO, both routes | 69 | 69 |

Both routes meet the 90+ lab performance target and the 2.5-second lab LCP target; CLS is zero. LCP increased in this single comparison, particularly on the menu, but remains below target. Scheduling/cache/CPU variability is included; the measurements do not prove causation or guarantee production field results. SEO 90 is intentionally unmet because the fictional demo remains noindex. An earlier output-equivalent build scored 100 on both routes; the table uses the final-build run after the campaign-word binding.

## Local release decision

**GO for the local fictional-brand demo and client presentation.** The redesigned components were inspected as rendered output, all required commands have passing results, the extended configuration test and output-invariance check pass, and no unresolved local functional or visual blocker remains in the tested configurations.

Higher-resolution client photography and real-device/Safari/Firefox validation remain the limitations stated above. This is not approval for an automatic public or commercial customer launch. The live site has not been changed; no commit, push or deployment was performed.
