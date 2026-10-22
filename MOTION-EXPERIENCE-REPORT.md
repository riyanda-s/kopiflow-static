# KopiFlow motion experience

## Scope and implementation

The editorial design remains the baseline. No catalogue records, prices, availability, variants, images, provenance, business configuration, checkout/cart implementation, dependencies or ownership settings were changed. No deployment, commit, push or real order is authorized or performed.

The new presentation layer uses CSS transforms/opacity and a small TypeScript initializer. There is no animation library, continuously running scroll handler, loading screen, scroll hijacking, parallax or progress bar.

| Effect | Timing | Behavior |
| --- | --- | --- |
| Hero headline | 800ms; second line starts 110ms later | 18px entrance with opacity never below .75; immediately readable |
| Hero photograph | 1100ms | Scale 1.035 to its resting crop, with no opacity delay |
| Hero CTAs | 700ms after 220ms | 9px entrance; controls stay usable and settle immediately on keyboard focus |
| Hero accent | 1400ms, once | Gentle 35-degree rotation to rest; no looping ornament |
| Scroll stories/cards | 650ms; stagger 0/70/140/210ms | 12px rise, image opacity .75 to 1 while text retains full contrast; IntersectionObserver threshold .08, bottom margin -24px; unobserved after first entry |
| Product/gallery images | 650ms | Fine-pointer hover scale 1.035/1.025; coarse-pointer image scaling suppressed |
| Buttons/categories | 180–240ms | Small press/hover transform, color transition and selected underline; filtering itself stays immediate |
| Product/cart dialogs | 260/300ms | Native dialogs keep their semantics; only their inner presentation animates; closing remains immediate |
| Cart count/toast | 480/260ms | Count pulse after an increase, plus existing textual confirmation; no extra cart action handler |
| Navigation | 240ms | Sticky header shadow observed using a 1px sentinel, underline transitions and finite mobile-menu entrance |
| Gallery captions | 350ms | 3px fine-pointer hover movement; text remains visible |

Most movement uses `cubic-bezier(.22, 1, .36, 1)`; color/backdrop changes use restrained ease timing. No permanent `will-change` layer hints are used.

## Files changed

- `src/styles/motion.css`: all motion treatments, sticky navigation, touch and reduced-motion rules.
- `src/scripts/motion.ts`: one-time visibility observation, cart-count presentation feedback, focus and page-restoration handling.
- `src/layouts/Layout.astro`: imports the motion stylesheet and initializer alongside the existing storefront.
- `src/components/Navbar.astro`: mobile navigation links for browsing without JavaScript.
- `tests/e2e/motion.spec.ts`: initial/middle/settled captures, six widths, recordings, mouse/touch/keyboard/history, reduced-motion and failure fallback checks.
- `tests/e2e/visual-polish.spec.ts`: waits for real running animations before measuring settled card tracks; all original alignment, axe and long-copy assertions remain.
- `tests/e2e/storefront.spec.ts`: normalizes translated DOMRect measurements to 0.001 CSS px before enforcing the existing 44px target minimum; no accessibility threshold is removed.
- `MOTION-EXPERIENCE-REPORT.md`: this report.

## Accessibility and failure behavior

Content has no hidden/pending reveal state. Scroll elements are visible before observer initialization, so missing JavaScript, missing IntersectionObserver or initialization failure cannot leave them invisible. Animations start only when the observer sees an element and then disconnect from that element. Keyboard focus removes a scroll entrance and finishes CTA movement without moving focus or changing tab order. Pointer focus does not reposition the target between pointerdown and pointerup. Cancelled entrances are cleaned up when filtering hides a card, preventing a replay when it returns.

Reduced-motion CSS removes animations and transitions, and disables smooth scrolling. The initializer also disconnects reveal observation when the preference changes to reduced motion. Cart, filters, native dialog keyboard behavior and disabled demo checkout remain functional. Hover enhancements require an appropriate pointer; product controls remain visible on touch screens.

With JavaScript disabled, the full static catalogue and business content remain readable, and a fallback mobile navigation row provides real page links. Search, customization and the client-side cart still require JavaScript, as explained by the existing menu notice. CSS hero entrances remain readable and finite; they are disabled when reduced motion is requested.

Browser back/forward navigation is exercised. A persisted `pageshow` handler settles in-flight presentation animations; the tests exercise both actual history navigation and that restoration branch. This does not claim that every browser history transition used its back-forward cache.

Two real issues were found and fixed during regression: scaling the dialog briefly reduced control dimensions, so its entrance now uses translation only; fading the About story container reduced the disclaimer contrast to 4.39:1, so scroll fades now apply to images while text stays fully opaque. All original axe checks remain enabled. An additional pointer test exercises the bottom edge of a CTA during its entrance, guarding against repositioning the link between press and release.

A later mobile measurement returned 43.999969px for a 44px translated target. Geometry is now normalized to 0.001 CSS px before checking the unchanged 44px minimum. This numerical correction does not excuse actual scaling: the earlier 43.999450px scale result still rounds below 44, and larger target reductions also fail.

## Evidence and measurements

All generated evidence stays in ignored directories. `qa-artifacts/motion/` contains the before/after Lighthouse reports and motion screenshots/measurements by browser project and viewport. Motion test videos are WebM attachments in ignored `test-results/`; they use a 960×700 recording canvas, while screenshots retain the requested CSS viewport widths.

Hero CSS animations are paused and sought to 0ms, 350ms and 1600ms for reproducible comparisons. Scroll entrances and interaction recordings run with production timing. The gallery, selection, benefits, visit, navigation, product hover, category selection, product dialog and add-to-cart feedback have dedicated capture points. This separates controlled state screenshots from real-time playback evidence.

The ignored `qa-artifacts/motion/natural-preview.mjs` also captures separate, unpaused browsing clips at all six widths in `qa-artifacts/motion/natural/{width}-natural.webm`. Those preserve the viewport aspect ratio and cap large recordings at 960px video width. The ignored `review-recordings.mjs` copies test recordings and extracts representative real-time frames using the installed Playwright FFmpeg; no downloaded tool is required. These local capture helpers are QA artifacts, not published runtime code.

Rendered initial, middle and settled hero frames were compared, and screenshots at all six widths were opened. Story, selection, benefits, gallery, visit, pointer/touch controls, mobile navigation, dialog and cart-feedback images were inspected. Representative recording frames were extracted and viewed. Initial/mid hero samples show real translation/scale differences while retaining readable content; settled states return to the editorial layout. Tests cover all six widths in both desktop and mobile Chromium emulation, rather than assuming viewport size alone proves touch support.

Before-motion Lighthouse baseline (local production preview, simulated mobile): homepage Performance 95, Accessibility 100, Best Practices 100, SEO 69; LCP 1501ms, CLS 0. Menu Performance 100, Accessibility 100, Best Practices 100, SEO 69; LCP 1022ms, CLS 0. These are lab metrics, not production field Core Web Vitals. Demo `noindex` remains intentional.

## Final regression results

Validation completed locally on 22 October 2026. The final full run passed; no tests were skipped or accessibility checks removed.

| Command/check | Actual result |
| --- | --- |
| `npm run check` | Passed: 53 files, zero errors, warnings or hints |
| `npm run lint` | Passed |
| `npm test` | Passed: 51 tests across 3 files |
| `npm run test:e2e` | Passed: all 58 tests, desktop and mobile Chromium; 6.6 minutes |
| `npm run build` | Passed: seven static HTML pages, robots, sitemap, headers and local assets; no server runtime |
| `npm run test:client` | Passed: config/data-only customer replacement, pricing, cart retention and QR decoding; checkout uses a blocked-popup stub with no external requests or messages |
| `npm audit` | Zero vulnerabilities reported |
| Distribution/preservation audit | Passed: 39 intended files; no source maps, private source or documents; security headers and protected business/data/image/evidence files unchanged from HEAD |
| Six natural browsing recordings | Passed: quantity exactly 1, demo checkout disabled and horizontal overflow false at every width |
| Git checks | `git diff --check` passed; `.env`, `dist/`, `test-results/` and all QA recordings/screenshots remain ignored |

The matrix verifies initial, middle and settled motion at 320, 390, 768, 1024, 1440 and 1920 CSS px. Settled card tracks, decorative borders, long names/descriptions, search/filter behavior, variants, totals, persistence, unavailable items, QR, keyboard focus/Escape, demo checkout restrictions and WCAG axe checks all pass. The immediate hero-CTA pointer case passes in both browser projects. Hero comparison sheets at `qa-artifacts/motion/hero-comparison-{width}.png` were opened and compared across all six widths. Native-timing recording samples and their navigation, product-dialog and cart captures were also inspected.

## Final performance and delivery cost

Final Lighthouse measured the final local production build using the same simulated-mobile configuration as the baseline. Full HTML reports and environment/settings are saved in `qa-artifacts/motion/before/` and `qa-artifacts/motion/after/`.

| Route / measurement | Before | After |
| --- | --- | --- |
| Home Performance | 95 | 100 |
| Home LCP | 1501ms | 1380ms |
| Home total blocking time | 267ms | 17ms |
| Home CLS | 0 | 0 |
| Menu Performance | 100 | 100 |
| Menu LCP | 1022ms | 1475ms |
| Menu total blocking time | 0ms | 0ms |
| Menu CLS | 0 | 0 |
| Accessibility / Best Practices, both routes | 100 / 100 | 100 / 100 |
| SEO, both routes | 69 | 69 |

Menu LCP increased by approximately 453ms in this comparison; it still meets the 2.5-second lab target. These single-run comparisons are subject to scheduling/cache variability and do not establish a causal performance improvement or a field guarantee. The demo's intentional `noindex` policy remains; SEO 90 is not claimed. INP and real-user field Core Web Vitals were not collected.

| Delivered bundle | Before bytes / gzip | After bytes / gzip |
| --- | --- | --- |
| JavaScript, one bundle | 23,922 / 9,022 | 26,346 / 9,792 |
| CSS, one bundle | 47,839 / 10,857 | 52,867 / 11,904 |

The motion implementation adds 2,424 uncompressed JavaScript bytes (770 gzip) without a new runtime dependency or animation library. Assets, native fonts, responsive hero image hints, fetch priority and native below-fold lazy loading remain intact. There is no continuously running JavaScript animation loop or scroll listener.

## Release decision and limits

**GO — local motion-demo build and client presentation.** All required commands pass, the motion and interaction captures were inspected, demo ordering remains disabled, and no local functional or visual blocker remains in the tested configurations.

**Public release remains pending owner review and a separately authorized deployment.** This work does not update `https://kopiflow-demo.pages.dev/`, verify new live response headers or claim that the live demo contains these effects. No deployment, commit or push was performed.

Real Android/iOS hardware, Safari and Firefox have not been tested in this run; mobile results use Chromium emulation. Recordings and sampled-frame review are not a measured device frame-rate guarantee, and axe results are not a full accessibility certification. Real-device checks are recommended before customer handover. The fictional demo configuration is preserved; commercial-client business information and verified contact onboarding remain separate prerequisites. No parallax or scroll-progress feature was added, and no asset licensing or source-ownership record was changed.

To review locally, run `npm run dev`, or use `npm run build` followed by `npm run preview -- --port 4325` for the static production preview.
