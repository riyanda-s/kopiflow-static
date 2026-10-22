# QA and launch checklist

## Latest final localization and release validation — 2026-10-22

Indonesian interface localization is complete while the brand tagline and product data/images remain unchanged. The local build uses `https://kopiflow-demo.pages.dev`; canonical/sitemap/QR and intentional noindex were verified. Check/lint/build passed, all 51 unit and 30 E2E tests passed, the isolated customer configuration test passed, and npm audit reported zero vulnerabilities. Demo checkout stays disabled under keyboard and forced-DOM attempts. Actual public HTTP checks found correct availability, redirects, five security headers and 27 valid image HEAD responses; the live site still serves earlier English copy and has not received the localized build. **Local GO; final localized public release NO-GO until separately authorized deployment; commercial client deployment NO-GO with fictional/unverified configuration.** See [FINAL-DEMO-RELEASE.md](FINAL-DEMO-RELEASE.md) for evidence, scope and limitations. Older entries below are historical.

## Latest UI polish — 2026-10-22

Repeated visible AI captions are replaced by one general note near the menu footer; AI alt text/metadata and asset evidence remain intact. Product card tracks, prices/borders and the three approved gallery images align at 1440/768/390/320px, including long-copy stress tests. Requested homepage copy is Indonesian and centralized. Check/lint/build passed, 51 unit tests and all 26 E2E tests passed, and the customer configuration fixture passed. Accessibility checks were retained and expanded across the four-width matrix. Screenshots/measurements are ignored under `qa-artifacts/ui-polish/`; see [UI-POLISH-REPORT.md](UI-POLISH-REPORT.md) for precise results, file changes and testing limits. Earlier image-restoration entries below describe the previous UI presentation.

## Latest: final nine product illustrations — 2026-10-22

All nine remaining placeholders are resolved using actual generated, inspected AI illustrations. All 23 menu products now have images. Each affected card/dialog visibly identifies AI imagery; stock-photo evidence and generation records are kept separate. See [PRODUCT-IMAGE-RESTORATION.md](PRODUCT-IMAGE-RESTORATION.md) for the full report and [assets/evidence/generated-products.json](assets/evidence/generated-products.json) for exact briefs and hashes. Check/lint/build passed, all 51 unit tests and 24 desktop/mobile E2E tests (35.1s) passed, and customer-configuration verification passed. Non-image menu data and disabled demo checkout are unchanged. No blocked asset was restored; no deployment, commit or push occurred. Earlier entries below are historical.

## Earlier stock-photo follow-up — 2026-10-22

Image restoration added 13 individually verified product photographs; nine placeholders remain, and Butter Croissant is unchanged. See [PRODUCT-IMAGE-RESTORATION.md](PRODUCT-IMAGE-RESTORATION.md) for source evidence, remaining blockers and the latest results: check/lint/build passed, 50 unit tests, 22 desktop/mobile E2E tests including axe accessibility, and customer-configuration verification passed. Menu prices/names/order behavior and disabled demo checkout are unchanged. No blocked asset was restored and nothing was deployed or pushed. The earlier review/remediation entries below are historical; this image follow-up does not reassess release readiness or Git commit status.

## Earlier local remediation

The current application uses only registered approved asset paths: two verified stock-photo sources plus original SVG assets. Six unverified sources are blocked/quarantined and excluded from Git/dist. Twenty-two products truthfully show no-photo placeholders. Ordering controls/descriptions, privacy and QR guidance are Indonesian; mobile text/targets are enlarged. Demo checkout remains disabled; tests require no real recipient or message. Real customer checkout additionally requires explicit `whatsappVerified: true`, a valid number and non-demo mode.

Safe future demo setup: leave `.env.example`'s `PUBLIC_SITE_URL` blank until the actual public origin is known. Invalid/reserved public values are rejected. Demo pages stay noindex; QR download/print controls are disabled for the local placeholder origin. Git author identity is not configured: 70 intended files are staged/checked, but no commit has been created.

Remediation results: full QA passed — 49 unit tests, 22 desktop/mobile tests (31.8s), clean typecheck (47 files), lint and static build; final customer configuration fixture passed. Two focused ordering tests passed after adding 320px reflow/readability/44px-target assertions. A final typecheck passed, and the refreshed audit found zero vulnerabilities. The older numbers/performance measurements below are historical. Read the latest completed-fix log and GO/NO-GO decisions in `COMMERCIAL-READINESS-REVIEW.md`.

Recorded environment: Windows, Node 24.19.0, Astro 7.4.1, Playwright Chromium 156. Run date: 2026-10-21. This is a local static build; no customer site or external deployment was created.

Latest commercial-readiness review: [COMMERCIAL-READINESS-REVIEW.md](COMMERCIAL-READINESS-REVIEW.md). Local demo approved; public/customer releases remain blocked by image-provenance and real configuration/acceptance gaps. All generated `qa-artifacts/`, including JSON summaries, are ignored; durable results are recorded in these documents.

## Functional coverage

- [x] Home, Menu, About, Visit, Privacy, QR routes render; generated 404 exists.
- [x] 23 fictional products across seven categories. Every available product and variant/add-on price is checked with integer Rupiah arithmetic.
- [x] Search, category filtering, empty results and reset.
- [x] Product size, sugar, temperature and optional add-ons; unavailable products cannot be added.
- [x] Add, merge identical selections, retain distinct selections, edit quantity, remove and clear.
- [x] Persist and reload the cart; handle corrupt/stale data and blocked localStorage.
- [x] Recalculate stored selections using catalog prices; reject invalid options and bounds.
- [x] Build encoded WhatsApp message with shop name, selections, quantities, subtotals, total and notes.
- [x] Normalize Indonesian/local and international numbers; reject malformed inputs.
- [x] Block demo checkout; retain bag when opening WhatsApp.
- [x] Handle blocked popups and throwing browser policies with same-tab fallback link.
- [x] Decode the actual downloaded SVG QR to the configured menu URL; verify print visibility.
- [x] Customer fixture changes config only, builds, enables checkout, retains the cart and generates a QR for `https://coffee.test/menu/`. External tab opening is stubbed; no message is sent.

## Visual and accessibility coverage

- [x] Desktop Chromium and mobile Chromium emulating iPhone 13 dimensions/touch.
- [x] No horizontal overflow across all six content pages.
- [x] Mobile navigation, visible focus, native dialog focus containment and Escape restoration.
- [x] Reviewed full-page home/menu screenshots in `qa-artifacts/`.
- [x] Reduced-motion CSS and print-specific QR stylesheet.
- [x] Local WebP assets; responsive hero; below-the-fold lazy loading; local system fonts.
- [x] Fix low contrast captions and signature discovered by automated audits.
- [x] Correct menu heading order and accessible names to include visible button/link text.
- [x] Final expanded axe suite: no violations on all six routes and product/cart dialogs, on desktop and mobile (WCAG 2 A/AA, 2.1 A/AA, 2.2 AA and axe best-practice tags).

Automated accessibility checking is not a certification. A human keyboard/screen-reader review and physical-device test remain part of customer launch acceptance. Mobile tests use Chromium emulation, not actual Safari.

## Build, security and SEO

- [x] Static production build succeeds, generating seven HTML pages including 404, XML sitemap, robots, one CSS bundle, one browser JS bundle, local images and Pages `_headers`.
- [x] No server runtime, required remote APIs, account system, payment fields or secrets.
- [x] Canonical URLs, descriptions, Open Graph, share image, Twitter card and WebSite JSON-LD.
- [x] No fabricated LocalBusiness address schema, reviews, awards or credentials.
- [x] External HTTPS URLs validated; links use secure `rel` attributes; user content uses DOM text rendering.
- [x] npm audit: **0 vulnerabilities** at verification time. Audit is a snapshot, not a permanent security guarantee.
- [x] Cloudflare security-header file supplied. Actual CDN header application remains untested until an authorized deployment.

## Recorded test results

| Check | Result |
| --- | --- |
| Vitest | 36 passed, 2 files (latest commercial review) |
| Astro type check | Passed: 44 files, 0 errors, 0 warnings, 0 hints |
| ESLint | Passed |
| Static production build | Passed, `dist/`, 7 HTML pages |
| Playwright desktop/mobile | 20 passed in 51.4s, no failed cases; dedicated production preview at port 4325 |
| Configuration-only customer fixture | Passed with business name/domain and product name/price changes; see ignored local `qa-artifacts/client-verification.json` |
| Cloudflare CSP browser compatibility | Passed with local header injection; actual CDN delivery untested |

## Performance measurements

Lighthouse uses its default simulated mobile profile: 412×823, 4× CPU slowdown, 150ms RTT and approximately 1.6 Mbps throughput, against a local production preview. These are lab measurements, not field Core Web Vitals or a production-host guarantee.

Initial run, while browser QA was also active:

| Route | Performance | Accessibility | Best Practices | SEO | LCP | CLS |
| --- | --- | --- | --- | --- | --- | --- |
| `/` | 77 | 96 | 100 | 100 | 1.72s | 0 |
| `/menu/` | 95 | 98 | 100 | 100 | 1.12s | 0 |

Home missed the Performance 90 target in that run, with 1,060ms total blocking time; concurrent browser work may have contributed. Accessibility findings were then fixed. The initial environment and metrics are retained in `qa-artifacts/lighthouse-initial.json`.

Final isolated measurement after fixes, with no concurrent browser QA (2026-10-21):

| Route | Performance | Accessibility | Best Practices | SEO | LCP | CLS |
| --- | --- | --- | --- | --- | --- | --- |
| `/` | 100 | 100 | 100 | 100 | 1.32s | 0 |
| `/menu/` | 100 | 100 | 100 | 100 | 1.53s | 0 |

All requested score and LCP targets were met in this final local run. Other routes were functionally/accessibility tested but did not receive separate Lighthouse performance measurements. Full environment/settings/results: `qa-artifacts/lighthouse-summary.json`; local HTML reports: `qa-artifacts/lighthouse-home.html` and `qa-artifacts/lighthouse-menu.html` (ignored by Git). The browser JS bundle is approximately 15.7KB and CSS 30.7KB before compression. The output has no `server/` or `functions/` directory. Production hosting and real-device metrics remain unmeasured.

## Customer launch checks still required

- [ ] Replace `.example` domain and all fictional story, contact, address and hours content.
- [ ] Approve every product image, recipe, price, option, allergen statement and availability.
- [ ] Set `isDemo: false` only after real contacts and location are verified.
- [ ] Confirm live WhatsApp recipient, actually send an approved test message and verify manual shop response.
- [ ] Scan the final-domain printed QR on at least two real phones. No physical paper scan was performed during development.
- [ ] Run Safari/Firefox and real iOS/Android checks where customer scope requires.
- [ ] Verify DNS, TLS, canonical host, HTTP response headers, deployed 404 and sitemap.
- [ ] Measure Lighthouse on actual hosting and record unmet targets; retest after content/color changes.
- [ ] Obtain publication approval and complete ownership/support handover.

Known constraints: current demo cannot accept actual orders, QR uses a reserved placeholder domain, stock is not live, estimates exclude delivery/taxes/fees, browser storage can be cleared by the visitor, and opening WhatsApp is neither acceptance nor payment.
