# Final localization and demo release validation

Review date: 2026-10-22. Public origin supplied by the owner: **https://kopiflow-demo.pages.dev**. This report distinguishes the tested local production build from the currently deployed site. No deployment, account changes, commit, push, purchase, image download/regeneration or real WhatsApp order was performed.

## Release decisions

| Decision | Status | Evidence |
| --- | --- | --- |
| Local production demo | **GO** | Indonesian UI, correct public-origin metadata/sitemap/QR, static build, all 51 unit tests and all 30 desktop/mobile E2E tests passed; customer-configuration test passed; audit found zero vulnerabilities. Demo checkout remains blocked. |
| Public demo: final localized release | **NO-GO until an explicitly authorized release** | The current site is available and passes the checked headers/domain/asset checks, but still serves the earlier English About/Visit/footer/interface copy. The localized build validated here has not been deployed. Availability/security checks are GO for the observed responses; they do not prove that this new release is live. |
| Commercial client deployment | **NO-GO with this demo configuration** | The brand, address, hours, menu and serving illustrations are fictional/sample data; contacts are empty, recipient verification is false and ordering is deliberately disabled. A real customer fork needs verified business/contact/domain details, owner content/image/recipe approval and launch authorization. The isolated client customization test passed; that synthetic fixture is not a deployable customer site. |

## Changes made

- Localized the navbar descriptor/CTA, footer headings/links, location card, Visit and About pages, 404 page, page metadata, skip link and remaining cart status messages. All pages now use `lang="id"`; the preserved tagline **Every Sip Has a Story.** has an English language annotation where rendered as standalone prose. Product names and platform/format names remain unchanged.
- Centralized business-specific navigation, footer, location, About, Visit and coffee-quality copy in `src/config/business.ts`. Existing fictional-business, illustrative-map, sample-hours, contact-disabled, privacy and order-confirmation disclaimers are retained in Indonesian; the privacy page and existing QR safety guidance already used Indonesian.
- Translated the order-message quantity label from `Qty` to `Jumlah`. Calculation, validation, cart persistence and checkout-gating behavior are unchanged. The localized storage-unavailable warning is now retained alongside the add-to-cart confirmation rather than immediately overwritten by that confirmation; this is feedback only, not a cart calculation/storage change.
- Configured this workspace's **ignored** `.env` with `PUBLIC_SITE_URL=https://kopiflow-demo.pages.dev`. The reusable `.env.example` remains generic/blank, and the source retains its safe placeholder fallback when no origin is supplied. No Cloudflare dashboard/build setting was accessed or changed.
- Updated tests to expect the configured production origin and the appropriate QR download/print state. Placeholder-origin behavior remains covered by the conditional QR assertions and origin-validation tests. Added desktop/mobile localization and forced-checkout tests; no existing accessibility check was removed or disabled.

The design system, stylesheet, layout classes, image files, product configuration and HTML content structure were preserved. Existing heading line breaks and the footer tagline's language semantics were maintained. No backend, database, payment gateway, runtime AI request or new dependency was introduced.

## Files modified in this pass

| Files | Purpose |
| --- | --- |
| `src/config/business.ts` | Centralized Indonesian copy, descriptions, alt text for the existing hero image and locale metadata |
| `src/components/Navbar.astro`, `Footer.astro`, `LocationCard.astro` | Indonesian shared interface, retaining layout and fictional-shop disclaimers |
| `src/layouts/Layout.astro` | Indonesian default document language, skip link and share-image description |
| `src/pages/about.astro`, `visit.astro`, `404.astro` | Indonesian page content and titles |
| `src/scripts/storefront.ts` | Indonesian status messages and preserved storage-warning feedback |
| `src/utils/cart.ts` | Quantity-label translation only; no arithmetic or validation change |
| `tests/e2e/storefront.spec.ts` | Configured-origin/QR assertions, localization coverage, demo keyboard/DOM/fallback restrictions, storage-warning assertion |
| `tests/unit/cart.test.ts`, `tests/unit/site.test.ts` | Translated message assertion and explicit empty-recipient check |
| `CONFIGURATION.md`, `DEPLOY-CLOUDFLARE.md`, `QA-CHECKLIST.md`, this report | Correct public-origin guidance and actual release evidence |
| `.env` (local, ignored) | Actual public origin for the tested local production build; not committed or copied to `dist/` |

Temporary verification scripts, HTTP observations, downloaded HTML/text responses and screenshots are confined to ignored `qa-artifacts/`. Original generation/provenance manifests, approval registry and photo assets were not modified. No external image bodies were downloaded; public image availability used HEAD requests only.

## Tests and actual results

| Command / check | Actual result |
| --- | --- |
| `npm run check` | Passed: 49 files; zero errors, warnings or hints |
| `npm run lint` | Passed |
| `npm test` | Passed: 51 tests in 3 files |
| `npm run test:e2e` | Passed: **30 tests**, 2.7 minutes, Chromium desktop and mobile-emulation projects |
| `npm run build` | Passed: Astro static output, **7 HTML pages** in `dist/`; no server/functions runtime |
| `npm run test:client` | Passed: isolated brand/product/price configuration, mocked popup fallback, synthetic recipient/message, cart retention and decoded fixture QR `https://coffee.test/menu/`; no external order sent |
| `npm audit` | Passed: **0 vulnerabilities**. JSON audit also reported zero in every severity class. No package/lockfile update was needed. |
| Local static-output verification | Passed: seven Indonesian HTML pages, correct-origin canonicals/noindex, six correct-origin sitemap entries, decoded production QR, local images, header-file syntax/copy, no common secret-pattern matches or backend output |
| Preservation verification | Passed: every field of all **23 products** matches the pre-change export; product source/alternatives, stylesheet, checkout helper, asset registry and three evidence manifests retain their pre-change SHA-256 hashes. Recorded image derivatives also match their evidence hashes. |
| Git exclusions / whitespace | Confirmed `.env`, QA observations/screenshots and `.client-check/` are ignored. `git diff --check` passed with only normal Windows line-ending notices. |

The E2E suite covers navigation, search, category filtering, customization, totals, quantity changes, item removal/clearing, persistence and unavailable storage, product dialogs, keyboard focus, cart accessibility, QR decoding/export/print state, CSP behavior and axe WCAG checks. The existing 1440/768/390/320px layout matrix and long-copy tests passed in both projects. Localized desktop About and mobile Visit screenshots were also visually inspected.

Test/browser subprocesses required permission outside the Windows sandbox. The initial sandbox HTTP attempt could not connect to its proxy; the read-only retry outside that sandbox succeeded. The web-reader tool could not open the demo, so public findings below come from actual curl/Node HTTP responses, not an assumed deployment configuration. Two preliminary custom-verification assertions needed harness corrections (JSON omits undefined optional fields; Astro's generated 404 canonical is `/404/`); the final verification passed without changing product data or error-page routing.

## Demo checkout security

- `isDemo: true`, `whatsappVerified: false`, `whatsapp: ''`, `allowIndexing: false` remain in the main configuration.
- The main checkout button is disabled; the fallback is hidden and has only `href="#"`. No real recipient is configured for demo ordering.
- Local browser tests verified that keyboard focus/Enter cannot activate the disabled checkout. Even after a test removes the button's DOM `disabled` attribute and dispatches click events, the unchanged `canCheckout`/`launchCheckout` gate produces no popup attempt or usable fallback. Cart contents remain intact.
- External requests were intercepted and blocked in the adversarial test; zero attempts occurred. Unit tests use mocked browser functions. The separate non-demo fixture uses a synthetic recipient and a mocked popup; no WhatsApp URL is navigated and no message is sent.
- Current public HTML also renders checkout disabled and fallback hidden with `href="#"`. Public checks were HTTP-only; the full interactive browser suite ran against local production preview, not the live site.

## Assets and static configuration

- All **23 menu products** reference existing local files, and no product card uses `product-unavailable.svg`. All three gallery entries use registered approved assets. Every local HTML image reference inspected resolves in `dist/` (54 local references across the seven HTML pages).
- Exactly **one** general illustration notice appears on the menu: “Foto menu merupakan ilustrasi. Tampilan penyajian dapat berbeda.” No repeated visual AI captions appear. AI-specific product alt text, `imageGenerated`, source attribution, approval entries and generation records remain unchanged.
- A single neutral placeholder still exists as the **closed product dialog's initial image**, before a product is selected. It is an approved local SVG and is not assigned to any menu product or gallery image. The public HTML has the same standby-dialog behavior; this is not a missing product photo.
- Local canonical URLs, Open Graph URLs, sitemap and robots sitemap reference use `https://kopiflow-demo.pages.dev`. The decoded QR points to **https://kopiflow-demo.pages.dev/menu/**. The noindex policy is intentional for the fictional demo; robots allows crawling so the noindex directive can be read.
- `dist/_headers` matches `public/_headers` and has the expected Pages `/*` block and five header definitions. Astro preview does not apply Pages headers itself; the E2E CSP test injects the exact configured policy, and public responses were inspected separately.
- Static text assets were scanned for common private-key, API-token and repository-credential patterns; none matched. Reviewed frontend configuration contains no secrets. This is a scoped source/pattern check, not a claim of security certification.

## Public HTTP evidence

Checks were read-only and used the owner-supplied origin. Observations are timestamped in ignored `qa-artifacts/final-release/public-http.json` and `public-asset-heads.json`; local build/preservation results are in `local-verification.json`. The public QR was decoded from its existing HTML-embedded SVG, not regenerated or downloaded from an image provider.

| Public request / observation | Actual result |
| --- | --- |
| HTTPS `/`, `/menu/`, `/about/`, `/visit/`, `/qr/`, `/privacy/` | HTTP **200** |
| `/sitemap.xml`, `/robots.txt` | HTTP **200**; sitemap URLs use the correct public origin |
| HTTP root | HTTP **301** to `https://kopiflow-demo.pages.dev/` |
| HTTPS `/menu` | HTTP **308** to `/menu/`, then HTTP 200 |
| Public canonical / Open Graph URLs | Correct public origin on the checked HTML pages |
| Robots metadata | `noindex, follow` on all checked HTML pages |
| Public QR | Decodes to `https://kopiflow-demo.pages.dev/menu/` |
| Public menu | 23 product cards, zero product placeholders, one general illustration notice, no repeated visual AI labels |
| Public existing image paths | **27 HEAD requests**: HTTP 200 and image content types; no image bodies downloaded |
| Security headers | All five values below match the repository configuration on the checked HTML and image responses |
| Release-content freshness | **Not current:** About/Visit still have `lang="en"`, and shared English copy remains. The local localized output differs and has not been deployed. |

Observed security header values:

```text
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
X-Frame-Options: DENY
Permissions-Policy: camera=(), microphone=(), geolocation=()
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'none'
```

These observations establish the served output and responses at check time. They do **not** establish which build environment variables are currently configured in the Cloudflare dashboard. That account setting was not accessed; the local build's `PUBLIC_SITE_URL` is confirmed, and the currently served output independently has the correct origin.

## Remaining issues and known demo limitations

1. **Public release blocker:** publish the reviewed localized build only under a separately authorized release, then repeat public HTTP/browser smoke checks. This task intentionally does not deploy or request a deployment.
2. **Commercial deployment blockers:** configure and verify the real business, address/hours/contact/domain/recipient; obtain owner acceptance of prices, recipes, availability, image usage and privacy copy. Do not turn this fictional demo into a real ordering site by changing only a flag.
3. The main demo never accepts actual orders or payments. The cart is device-local, availability is a build-time snapshot, totals are estimates, browser storage may be unavailable/cleared, and QR only opens the menu. It does not identify tables or monitor orders.
4. Stock/AI imagery remains illustrative, not evidence of actual shop servings or premises. No new license/ownership guarantee is asserted.
5. Browser verification covers configured Chromium desktop/mobile emulation, including four viewport widths; no physical-device, Firefox/Safari, new Lighthouse measurement or live interactive checkout test is claimed.

No unresolved local functional, localization, asset-path or tested responsive-layout failure remains. The remaining public-release and commercial-client work depends on explicit release authorization and real business information, not additional application features.
