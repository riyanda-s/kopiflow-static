# Local remediation of recorded findings — 2026-10-21

This section records fixes to the existing review, not a repeat review. It supersedes the historical findings and results retained below. Nothing was deployed, no accounts or purchases were made, and real WhatsApp checkout remains disabled.

## Completed local fixes and evidence

| Finding | Fix completed | Evidence |
| --- | --- | --- |
| P1 image evidence | Verified two existing photographs for incorporated website use: Karl Fredrickson's brewing image and Mae Mu's croissants. Source pages identify author/license and link the exact CDN identifiers originally used. | [ASSET-LICENSES.md](ASSET-LICENSES.md), primary page links there, and intentionally versioned SHA-256 bindings in `assets/evidence/verified-images.json`. |
| P1 unverifiable assets | Six originals remain explicitly BLOCKED. Their derivatives and the misleading `black.webp` derivative were removed from `public/`. Blocked binaries and original JPEGs are excluded from Git. Build validation rejects image paths outside the approval register. | `src/config/assets.ts`, `src/utils/config.ts`, `tests/unit/site.test.ts`, `.gitignore`. No invented author/license evidence and no new photo downloads. |
| P1 misleading product images | Only the croissant uses the accurate approved croissant illustration. The other 22 products use an original neutral SVG stating that a product photo is unavailable. Brewing imagery is used only as illustrative brand/story/gallery imagery, never as espresso or premises evidence. | `src/data/menu.ts`, approved public assets, product imagery unit assertions. Customer product photos remain an owner-content task. |
| P2 ordering language | Menu controls/categories, product descriptions, variants/add-ons, quantity/remove/clear actions, notes, checkout instructions/status/errors, privacy and QR controls are Indonesian. Language scopes reflect Indonesian pages/dialogs and retained English marketing/footer copy. | Translated source, existing localized functional tests and axe checks. The design and marketing concept were retained. |
| P2 mobile typography/targets | Mobile product descriptions/prices and primary ordering labels use at least 14px, supporting text is enlarged, inputs use 16px, and plus/quantity/filter/action targets are at least 44px. Product-modal actions wrap on narrow screens. | Existing desktop/mobile suite plus 320px reflow and measured-size assertions in the ordering test. |
| P1/P2 safe future demo origin and SEO | Added blank `.env.example` and validated build-time `PUBLIC_SITE_URL`; unsafe/placeholder public values are rejected. The local `.example` fallback remains explicit; QR export/print controls are disabled for it. Demo pages always emit `noindex, follow`; default indexing is off. Added page-specific descriptions. | `src/utils/site.ts`, `tests/unit/site.test.ts`, metadata/QR/browser checks, configuration and Pages documentation. No public origin was invented. |
| P1 checkout safety | Added `whatsappVerified: false` in the real configuration. The button, click handler, checkout helper and production validation require a non-demo site, a valid number and explicit recipient verification. | `canCheckout`, checkout regression tests, disabled-demo E2E checks. Main site remains `isDemo: true`, blank WhatsApp and unverified. |
| P1 initial commit preparation | Staged the 70 intended source/config/documentation/approved-derivative files. Generated files, blocked/source photos and `.env` are excluded. Scoped staged credential-pattern checks and `git diff --cached --check` passed. | Staged snapshot and Git exclusion checks. **Commit creation is blocked by missing Git author name/email**; identity was requested, not invented. No Git global settings or remote were changed. |

The disposable customer fixture verifies a changed business name/domain and a renamed Rp25.000 product using unchanged shared components. Its recipient and verification flag are synthetic test inputs, and `window.open` is stubbed before checkout: no actual message or external order is sent. It also checks the resulting message, retained cart and decoded QR.

## Remediation test results

| Check | Result |
| --- | --- |
| Full `npm run qa` | Passed, exit 0 |
| Type checking | 47 files, 0 errors, 0 warnings, 0 hints |
| ESLint | Passed |
| Vitest functional/configuration tests | 49 passed in 3 files |
| Desktop/mobile Playwright, including axe and CSP | 22 passed in 31.8s |
| Customer configuration test | Passed after final application changes; Rp25.000 message/cart and `https://coffee.test/menu/` QR verified locally |
| Additional 320px/readability/target assertions | Passed on mobile and desktop: 2 focused tests in 6.5s; mobile font requirement scoped to mobile, 44px targets checked on both |
| Dependency audit | Refreshed `npm audit --offline=false`: 0 vulnerabilities |
| Git checks | 70 staged files; generated/quarantined/source-photo/env exclusion and scoped credential-pattern scan passed; no ignored files staged |

An intermediate typecheck picked up a temporary translated page under generated `qa-artifacts/` and failed on its relative imports. The page was moved into its final source location, generated QA files were excluded from type/lint scope, and the complete clean run above passed. The added 14px mobile-font assertion initially also ran on desktop, where typography was intentionally unchanged; it was scoped to mobile and both focused cases then passed. Final type checking also passed with 47 files and no diagnostics. Earlier historical failures/results below are not the final remediation result. The updated Home/Menu screenshots were inspected to confirm the approved-only imagery and retained layout; no Lighthouse measurement has been repeated, so old scores are historical, not a new performance claim.

## Remaining blockers and decisions

- **P1 — actual public origin:** the eventual public demo URL has not been provided. Supply the real approved HTTPS origin as `PUBLIC_SITE_URL`, rebuild and verify its canonical/sitemap/QR. Stay in demo/noindex mode. Hosting, DNS and TLS verification require an authorized external release and were not performed.
- **P1 — real customer information/approval:** real address, hours, recipient ownership, menu prices/recipes/availability and accurate product photos or an accepted no-photo presentation require the customer. Six quarantined legacy images must not be reintroduced without reliable evidence. They do not block publication of the current approved-only asset set.
- **P1 — commit author:** source is staged and checked, but creating a commit requires the user's Git name/email. Stop only this task until provided; no invented identity or global Git configuration.
- **P1 — launch acceptance:** real WhatsApp send/recipient confirmation, final printed QR scan and customer sign-off remain external tasks. Do not enable checkout for a public fictional demo.
- **P2 — physical checks:** real Safari/Android, human screen-reader use and long-order WhatsApp transport remain unverified. Storage-denied page-only persistence is accurately disclosed; it cannot be made cross-page without usable browser storage or changing the architecture.
- **P2 — retained marketing copy:** the ordering flow is Indonesian; English fictional marketing/story copy remains intentionally unchanged. Replace fictional content and recheck colors/contrast in a customer fork.

| Release decision | Verdict | Reason |
| --- | --- | --- |
| Local demo | **GO** | Functional static demo, honest no-photo states, disabled checkout and passing QA. |
| Public demo | **NO-GO until the actual public URL is supplied and release checks are performed** | Active images now have evidence or original authorship; unresolved origin and external deployment acceptance remain. Keep demo checkout/indexing disabled. |
| Commercial customer deployment | **NO-GO** | Requires real owner-approved business/catalog/imagery, verified recipient and live acceptance. Local code fixes do not establish those facts. |

## Historical review (superseded where fixed above)

Scope: current working tree in `D:\Projects\KopiFlow-Static`. No deployment, external resource creation, messages or purchases. Review is of the template as configured now, not a hypothetical completed customer configuration.

## Decisions

| Decision | Verdict | Evidence |
| --- | --- | --- |
| READY FOR LOCAL DEMO | YES | Complete static pages, responsive layouts, fictional demo labeling, disabled real checkout, local cart, product customization and QR demonstration. Final review checks passed. Local evaluation is not commercial image clearance. |
| READY FOR PUBLIC DEMO | NO, as currently configured | Canonicals, sitemap and downloadable QR use `kopisenja.example`. Individual image clearance is incomplete. Keep `isDemo: true` for a public demo, choose its actual HTTPS origin, resolve image evidence, rebuild and approve publication. |
| READY FOR COMMERCIAL CUSTOMER DEPLOYMENT | NO | No real customer contacts/location/approved catalog, checkout intentionally disabled, fictional story/hours, illustrative/reused product imagery and incomplete image clearance. Live recipient, final printed QR, DNS/TLS/CDN headers and customer sign-off are unverified. |

## Prioritized remaining issues

P0 means a critical functional/security defect requiring immediate remediation. P1 means a blocker for the relevant public/customer release. P2 means an improvement or scoped launch verification. A placeholder is a release blocker, not evidence that the fictional demo is broken.

| Priority | Finding and evidence | Required resolution |
| --- | --- | --- |
| P0 | None identified in source review and completed checks. This is not a security certification. | No emergency correction identified. |
| P1 | **Image clearance incomplete for all eight source photographs.** `ASSET-LICENSES.md` records CDN URLs but not original photo pages, photographer identities or per-photo license evidence. Ten WebP outputs include derivatives of these eight images. | Recover/retain individual provenance and applicable license evidence, or replace with documented licensed/client-owned photography before public distribution/customer delivery. Review bundling original JPEGs in a sold template separately from incorporating images into a customer website. |
| P1 | **Placeholder origin** `https://kopisenja.example` drives canonical/OG links, sitemap and QR. | Configure the actual demo/customer origin, rebuild, inspect all generated URLs and scan the final QR. A public fictional demo may keep checkout disabled. |
| P1 | **Customer operating data missing.** Blank WhatsApp/Instagram/Maps; placeholder address; example opening hours; `isDemo: true`; imagined story, demo coffee-quality text, fictional menu prices/availability and best-seller picks. | Owner-approved business configuration and menu, real WhatsApp and Maps destination, actual hours/address and approved claims. Enable checkout only for the real customer release. Instagram remains optional. |
| P1 | **Photos do not reliably represent ordered products.** Croissant imagery is reused for pain au chocolat, banana bread and toast; fries for cassava; pour-over photography for espresso and other black coffee. | Use accurate approved product images or owner-approved truthful generic presentation; confirm all variants/add-ons and ingredient descriptions against actual recipes. |
| P1 | **No live customer acceptance evidence.** Local tests stub tab opening; no real message was sent, no real recipient verified, no physical QR proof scanned. | Verify actual recipient and approved order message with the owner, scan final printed QR, and complete documented customer acceptance before launch. |
| P1 | **Source has not been committed.** `git ls-files` is empty and application/docs appear as untracked files. | Review and commit intended source, lockfile and documentation to the authorized customer/template repository before delivery. No commit or remote push was made during this review. |
| P2 | **English-heavy customer UI.** Search, filters, variants, add/remove, notes, confirmation and hours are English; WhatsApp message framing is Indonesian. Shared UI strings and `lang="en"` are not a centralized translation system. | Confirm target audience; prefer consistent Bahasa Indonesia ordering labels/instructions for a general Indonesian audience. Translation would require a separate scoped content change, not a business-config-only switch. Current `lang` correctly describes the predominantly English UI. |
| P2 | **Mobile readability and ergonomics.** Descriptions/captions are often about 10–12px; plus buttons ~36px and quantity buttons ~32–38px. Layout is coherent, but these controls are less comfortable than 44px touch targets. | Consider larger supporting text and controls in the next design revision; inspect with real users and 200% zoom. Do not equate an axe pass with usability approval. |
| P2 | **Hosting verification is still local.** Correct Pages static build settings and `_headers` exist; actual Cloudflare application, domain redirects, TLS and 404 status have not been tested on the CDN. | Verify on an authorized release. Local CSP injection tests validate browser compatibility, not Cloudflare delivery. Avoid adding an SSR adapter or backend. |
| P2 | **SEO/content refinements.** Most pages inherit the same general description. Demo pages are indexable; client-specific LocalBusiness schema is intentionally absent. | Before customer indexing, supply accurate unique descriptions and verified business schema if desired. Decide indexing policy for a public demo and one canonical hostname. Never publish fictional LocalBusiness claims. |
| P2 | **Device and workflow boundaries.** Chromium desktop/mobile emulation only; no physical Safari/Android scan, screen-reader session or long-order WhatsApp transport test. Storage-denied carts are limited to the current document and are lost on navigation. | Verify representative real devices, keyboard/screen-reader operation and typical large orders. Explain storage limitations; current privacy text already discloses session-only fallback. |
| P2 | **Configuration and theme review remain human tasks.** Validation checks URL/price/option syntax, not address truth, image rights, shop ownership or all reserved-domain cases. Several supporting colors and UI copy are fixed in the design. | Use the onboarding checklist and recheck contrast after rebranding. Do not rely on `isDemo: false` as proof that content is customer-ready. |

## Visual and Indonesian customer UX review

Desktop Home and mobile Menu screenshots were inspected at the start. Fresh desktop/mobile About and Visit screenshots were inspected after the isolated run. Warm cream/espresso colors, serif headings, product card treatment, spacing, navigation and footer are coherent across these four main pages. Automated route/accessibility checks cover Privacy and QR too. The fixed mobile cart is visually dominant on informational pages, but remains operable and footer clearance is provided. No redesign was performed.

Search/category filtering and price customization are discoverable; mobile cart access is persistent. The circle-plus affordance would benefit from Indonesian supporting wording in an actual customer site. Estimated totals and manual confirmation are stated, with no automatic receipt/payment claim. Example stock and hours must not be mistaken for live inventory or an operating shop.

## Placeholder inventory

`src/config/business.ts`: name/tagline/mark are an original fictional identity; `domain` is reserved; address explicitly says `Alamat contoh`; contact URLs/number are empty; hours are examples; story/values/coffee-quality copy describe an imagined concept; best-seller IDs and promotion are demo selections. `src/data/menu.ts`: all 23 products/prices, option surcharges, stock and serving images are demo data. The illustrated location graphic is not a real map. The QR truthfully warns about the placeholder domain. Footer/About/Visit/menu notes identify the fiction, but a viewer entering at the hero may not see that immediately.

## Images and rights verification

All eight original JPEGs have a CDN identifier in `ASSET-LICENSES.md`: hero, interior, latte, pastry, iced, matcha, tea and snack. Hero also supplies `black.webp` and the smaller hero derivative. None has completed individual provenance verification in this repository. The SVG mark is locally authored according to the creation history; no trademark clearance is claimed. No additional image was downloaded or replaced in this review.

The general [Unsplash License](https://unsplash.com/license) allows commercial incorporation subject to its terms. [Unsplash's product-use guidance](https://help.unsplash.com/en/articles/2612317-can-i-use-unsplash-images-as-part-of-a-product-to-sell) distinguishes website use from selling image products. These policies were checked during this review; neither proves a particular CDN file's license or all depicted third-party rights. The previous register's broad wording was corrected to make the incomplete verification explicit.

## Configurability and ordering

Business identity, domain, images, contact/hours/story and primary colors are configurable. Products, names, prices, descriptions, categories, availability, variants and add-ons are defined in `src/data/menu.ts`; shared cards/modal/cart consume that catalog. UI translation is a separate concern.

The customer fixture now changes **both business configuration and product data**: `Kopi Uji`, `https://coffee.test`, and `Roti Uji` at Rp25.000. It builds a separate ignored local site, uses unchanged shared components, opens a product, verifies checkout recipient/message/price and notes with a blocked popup stub, verifies cart retention and decodes its actual QR. It does not contact WhatsApp or submit an order.

Cart persistence contains only validated IDs/selections/quantities, with current catalog prices recalculated on load. Unavailable/stale items are discarded. Estimates do not include tax/delivery/payment collection. WhatsApp text is encoded, includes confirmation wording, and checkout preserves the cart. The fallback URL exists for blocked/throwing popups. Number validation remains syntactic; actual account ownership/reachability requires the owner check.

## Cloudflare, security, privacy and accessibility

`output: 'static'`, no adapter; `npm run build` → `dist/`; Node 24 documented. Generated directory-index routes and `404.html` suit Pages. [Cloudflare's Astro guide](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/) supports the static build workflow. No hosting resources were created.

The Pages header file sets CSP, frame restrictions, nosniff, referrer and permissions policies. Script sources are same-origin; inline styles are allowed for theme/style attributes. JSON-LD is serialized with `<` escaped; browser user text is rendered with DOM text APIs. No hardcoded credentials were found in the scoped frontend scan. `npm audit` returned zero vulnerabilities during this review; this is a point-in-time result, not an ongoing guarantee.

No backend, analytics, embedded Maps, font-provider calls, accounts or payment fields were found. Browser-local storage and WhatsApp sharing are described by the privacy page. Hosting logs remain provider-controlled. Do not enter sensitive information in notes; WhatsApp receives the encoded note/order when its link is opened. Customer privacy contact is still unavailable in this fictional configuration.

Automated axe checks and native-dialog keyboard tests exist, including Escape/focus behavior and reduced-motion CSS. They do not replace human screen-reader/device review. Current aesthetic uses small text, noted above. Local performance results from the earlier implementation were 100 in four Lighthouse categories on Home/Menu; those are historical lab results, not newly measured production results.

## Corrections and verification

Only narrow corrections were made:

1. Ignore the entire generated `qa-artifacts/` directory, including JSON. Existing exclusions for `dist/`, `.astro/`, `node_modules/`, `.client-check/`, Playwright results/reports and `.env*` remain. `git check-ignore` verifies representative files; no ignored artifacts are tracked.
2. Reject repeated/embedded plus signs and `+0` international numbers; normalize `00` prefixes correctly. Added regression cases.
3. Make Playwright use dedicated production preview port 4325 with server reuse disabled. The first review run reused an existing Astro dev server at 4321, causing four selector failures from its toolbar. That was test-environment contamination, not a customer-page defect; the existing server was left untouched.
4. Extend the existing customer fixture to change product data; extend main-page screenshots; add browser testing with the configured Pages CSP response header.
5. Correct asset-register claims and document this review. No imagery or UI design was redeveloped.

Final isolated review results:

| Check | Actual result |
| --- | --- |
| `npm run qa` | Passed, exit 0 |
| Astro check | 44 files; 0 errors, 0 warnings, 0 hints |
| ESLint | Passed |
| Vitest | 36 passed, 2 files |
| Playwright | 20 passed in 51.4s, desktop/mobile Chromium |
| Accessibility | No axe violations in the tested pages/dialogs and configured rule tags |
| CSP browser compatibility | Passed on desktop/mobile, local response-header injection |
| Production build | Passed; 7 HTML pages, one browser JS bundle, CSS, images, XML, robots and `_headers`; no server/functions runtime output |
| `npm run test:client` | Passed; business/product config-only change, Rp25.000 message/total and retained cart, decoded configured QR |
| `npm audit --offline=false` | 0 vulnerabilities |
| Git exclusions | All representative generated outputs ignored; no ignored files tracked |

The initial review run passed type/lint, all 36 unit cases and the static build; 14/18 browser cases passed, with four toolbar-contamination failures as described. Those failures were resolved by isolating the production server; the final expanded run had zero failures. No Lighthouse measurement was repeated during this review. No real WhatsApp send, production CDN verification or physical-device QR scan was performed.

Changed files: `.gitignore`, `src/utils/config.ts`, `tests/unit/cart.test.ts`, `scripts/verify-client.mjs`, `playwright.config.ts`, `tests/e2e/storefront.spec.ts`, `ASSET-LICENSES.md`, `QA-CHECKLIST.md`, and this report. Generated artifacts remain local/ignored. Shared visual components, business configuration, product catalog and imagery were not changed by this review.
