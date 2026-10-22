# Premium redesign — working report

## Audit before implementation

The existing design repeats centered headings and evenly spaced cream sections. The full-bleed, gradient-covered hero obscures the approved brewing photograph and resembles a general hospitality template. Small desktop navigation and supporting text weaken hierarchy. Rounded image frames, circular ornaments and icon-led value cards compete with the editorial typography. The story uses the same brewing photograph as the hero without a distinct treatment. The menu's reliable shared grid tracks should be retained; replacing them with fixed heights would regress long-copy handling. Mobile ordering controls already have useful minimum touch targets and must be preserved.

Direction: a dark espresso editorial opening with an unobscured photographic panel, expressive native serif typography, numbered sections, fine rules, rectangular image treatments, olive story contrast and a stronger typographic footer. Existing assets and all business behavior remain unchanged.

## Implemented direction

- Espresso split hero with a clear brewing photograph, oversized serif heading and a caramel italic second line. On mobile the copy precedes an unobscured photographic panel instead of sitting over a darkened image.
- Ivory navigation with larger type, understated active rules and a compact mobile header. Screenshot inspection caught and corrected a cascade that made the visit CTA reappear on mobile and squeezed the brand.
- Rectangular product photography, refined category/availability rows, stronger tabular prices and square 44px add controls. Existing five-track subgrids still align names, descriptions and prices without truncation.
- Olive story section, an understated linear caption replacing the circular stamp, numbered philosophy entries, aligned editorial gallery captions, a dark typographic promotional panel and clearer visit/footer hierarchy.
- Shared page introductions, search, filters, native product dialogs and cart receive the same typography, fine rules and restrained geometry. No animation library, runtime dependency or visual JavaScript was added. Existing reduced-motion and print rules remain.
- System Georgia/Segoe UI/Arial font stacks avoid new licensing, font downloads and font-swap layout shifts.

## Before and after evidence

Screenshots are intentionally ignored by Git in `qa-artifacts/premium/before/` and `qa-artifacts/premium/after/`. Each contains home/menu captures at 320, 390, 768, 1024, 1440 and 1920px. About, Visit, QR and Privacy additionally have 390/1440px captures. Compare matching filenames such as `1440-hero.png`, `390-home.png` and `1440-menu.png`. The capture script also records overflow measurements; final captures include product-dialog/cart views. Baseline screenshots were captured before application edits.

The previous full-width photographic overlay is replaced by a deliberate text/photo split. The repeating cream story treatment becomes olive; icon-led advantages become numbered editorial entries. Photography, product records, prices, availability, options, approval registry, attribution and AI-generation evidence are unchanged. The fictional-demo notices and the single menu illustration notice remain.

Visual captures decode below-the-fold images eagerly for stable review; Lighthouse independently measures normal production loading. Rendered screenshots were opened and inspected, including home, menu, gallery, About, Visit, QR, Privacy, product dialogs and cart. At 320px the cart bar received tighter spacing so its labels fit on one line. Mobile native dialogs retain scrolling rather than clipping content to a fixed height.

| Viewport | Treatment and checks |
| --- | --- |
| 320px | Compact brand/navigation, stacked hero, two-column menu, stacked gallery; long-copy layout and keyboard/cart checks |
| 390px | Stacked photographic hero, two-column menu, stacked story/gallery and readable contact information |
| 768px | Split hero, full navigation, three signature/menu columns and two featured columns |
| 1024px | Split hero/story and refined two-column featured selection |
| 1440px | Wider editorial split, three menu columns, four featured columns and aligned three-image gallery |
| 1920px | Bounded 1360px content width with expressive hero type; consistent menu/card/gallery grids |

The viewport tests run in both desktop Chromium and mobile Chromium emulation, with no overflow, image/price-rule misalignment or long-copy clipping in the passing full suite. Automated axe checks complement keyboard tests; they do not replace a complete human accessibility audit or real-device Safari/Firefox testing.

## Source protection and deployment boundaries

`astro.config.mjs` explicitly disables Vite production source maps. `scripts/audit-distribution.mjs` validates a distribution allowlist against public assets, expected static routes and generated CSS/JS; rejects source maps/private source/documentation directories; scans text assets for selected credential signatures and repository links; checks that security headers match the source; records public-asset SHA-256 hashes and compressed bundle sizes; and checks protected business/asset/ordering files against HEAD.

Only `dist/` should be published to Cloudflare Pages. `.env`, build output, disposable customer fixtures, screenshots, traces and Playwright artifacts remain excluded by Git. `.env.example` is intentionally tracked. Existing CSP, frame restrictions, MIME protection, referrer and permissions headers are preserved. The CSP interaction test exercises cart and QR with the actual policy. Static preview does not itself demonstrate Cloudflare's live response headers; this redesign is not deployed and no new live-header claim is made.

Public HTML, CSS, JavaScript, images and screenshots remain obtainable by visitors. Minification is a normal delivery optimization, not effective protection against copying. No context-menu, selection, keyboard, screenshot or Developer Tools blocking was added. The source repository should remain private; authenticated GitHub visibility verification is unavailable locally (`gh` is not installed), so repository privacy is **unverified**, not asserted from the package's `private` field. No repository settings were changed.

Signature scanning cannot prove the absence of every possible secret. The allowlist and exclusion review reduce accidental publication risk; credentials must never be placed in `public/` or frontend configuration.

## Files changed

- `src/styles/editorial.css`: the presentation layer, responsive treatments and interactive styling.
- `src/layouts/Layout.astro`: imports the editorial stylesheet.
- `src/components/Hero.astro`: responsive image sizing appropriate to the photographic panel.
- `src/pages/index.astro`: numbered philosophy entries replacing decorative icons.
- `astro.config.mjs`: explicit production source-map policy.
- `tests/e2e/visual-polish.spec.ts`: six independent viewport tests with all alignment, overflow, keyboard, axe and long-copy assertions retained.
- `scripts/capture-premium.mjs`: reproducible local before/after screenshots.
- `scripts/audit-distribution.mjs`: build exposure, preservation and bundle audit.
- `PREMIUM-REDESIGN-REPORT.md`: this report.

## Regression and performance

Validation completed locally on 22 October 2026. The first sandboxed Vitest/customer fixture attempts encountered spawn EPERM; permitted reruns passed. The first aggregate visual test ran out of its cumulative 240-second budget after adding two widths; it was split into one test per width, keeping every check and avoiding a single cumulative screenshot budget. The full rerun passed; after the 320px cart-bar correction another full run passed. The final dark-section focus-ring change was rebuilt and received an additional focused regression and screenshot inspection. No tests were removed or skipped to obtain a pass.

| Command/check | Actual result |
| --- | --- |
| `npm run check` | Passed: 51 files, zero errors, warnings or hints |
| `npm run lint` | Passed |
| `npm test` | Passed: 51 tests across 3 files |
| `npm run test:e2e` | Passed: 40 tests, desktop and mobile; last full run 4.3 minutes |
| Additional E2E after focus refinement | 8/8 passed: native keyboard dialogs, forced-click demo restrictions, CSP interactions and page/dialog axe checks |
| `npm run build` | Passed: seven static HTML pages plus robots, sitemap, headers and public assets; no server runtime |
| `npm run test:client` | Passed: config/data-only rebrand, price change, cart retention and QR decoding; checkout intercepted with a popup stub, no external requests/orders |
| `npm audit` | Zero vulnerabilities reported |
| `node scripts/audit-distribution.mjs` | Passed: 39 intended files, zero unexpected/private files or maps, headers preserved, protected data/logic/assets unchanged from HEAD |
| Final captures | 20 route/viewport combinations without horizontal overflow; six focus logs show a visible 3px ivory focus ring on all four dark-section targets |
| Git exclusions / whitespace | Generated output, fixtures, `.env`, screenshot and test artifacts ignored and untracked; `git diff --check` passed |

Baseline Lighthouse (local production preview, simulated mobile): homepage/menu Performance 100, Accessibility 100, Best Practices 100, SEO 69. LCP 1441ms/1076ms, CLS 0/0. The intentional demo `noindex` contributes to the lower SEO score. These are lab measurements, not field Core Web Vitals or live-host guarantees. Full baseline HTML and settings are preserved in the ignored evidence directory.

| Final Lighthouse route | Performance | Accessibility | Best Practices | SEO | LCP | CLS |
| --- | --- | --- | --- | --- | --- | --- |
| `/` | 100 | 100 | 100 | 69 | 1327ms | 0 |
| `/menu/` | 100 | 100 | 100 | 69 | 1081ms | 0 |

The last run used `npm run measure` against the final local production build. Full reports and environment/settings are in `qa-artifacts/premium/after/lighthouse-*.html` and `lighthouse-summary.json`. A preceding homepage run scored 96 with approximately 232ms total blocking time; other post-redesign runs scored 100. This variation is recorded rather than treating one run as a performance guarantee. The SEO 90 target is intentionally unmet while the fictional demo is blocked from indexing. No indexing policy was changed.

Final delivery contains one unchanged JavaScript bundle: 23,922 bytes (9,022 gzip), and one CSS bundle: 47,839 bytes (10,857 gzip). The hero has a panel-aware `sizes` hint and retains high fetch priority; lower images remain lazy-loaded with reserved aspect ratios. No external fonts, animation library or extra runtime bundle was introduced. Lighthouse still suggests smaller responsive product-image derivatives and CSS delivery improvements; these are optional further optimizations, not an assertion that production field performance is guaranteed.

## Release boundaries and remaining blockers

- No deployment, commit, push, purchase, real order or external account operation was performed.
- Public release requires owner review/approval and a separate deployment; the existing live website cannot be assumed to contain this redesign.
- Verify repository privacy in the authenticated GitHub account before commercial handover.
- A commercial client still needs approved real business details, contact verification, a correct production origin and decisions about indexing and representative product imagery. Demo checkout remains disabled and must not be enabled for this fictional brand.

**Local presentation: GO.** The redesign, functional regression, accessibility checks and static build are validated locally. **Public release: pending owner approval, repository-privacy verification and a separate deployment with live response checks.** **Commercial customer deployment: NO-GO for this fictional configuration** until client onboarding and verified business/contact information are supplied. No local functional or visual release blocker was found in the tested Chromium layouts; other browser engines and real devices remain outside this validation.
