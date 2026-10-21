# KopiFlow Static

A reusable static coffee shop template with the original fictional **Kopi Senja** demo brand. Astro 7, strict TypeScript, Tailwind 4, Lucide, native browser interactions. One customer = one cloned repository, one hosting project, one domain. No accounts, database, checkout API, backend, or server runtime.

## Start locally

Use Node **24 LTS** (minimum 22.22) and npm. Versions are locked in `package-lock.json`.

```sh
npm ci
npm run dev
```

Open the printed local address, normally `http://127.0.0.1:4321`. To inspect the production site:

```sh
npm run build
npm run preview
```

The build produces `dist/`. Upload that directory to a static host. No adapter, environment secrets, Workers, functions, or Vercel-specific features are required.

## Included

- Responsive home, menu, about, visit, privacy, printable QR, and 404 pages.
- 23 fictional menu products in seven categories, search, filters, stock indicators, options, add-ons, and mobile cart access.
- Browser-local cart, catalog-based price validation, quantity editing, removal, clearing, and cross-tab updates.
- WhatsApp message preparation with quantities, customizations, item subtotals, estimated total, and optional notes. Blocked-tab fallback retains the cart.
- Branded QR SVG export and print layout generated from the configured `/menu/` URL.
- Canonicals, Open Graph, Twitter metadata, WebSite JSON-LD, sitemap, robots, local WebP assets, reduced-motion support, keyboard dialogs and focus indicators.
- Vitest functional tests, Playwright desktop/mobile flows, axe accessibility checks, actual QR decoding, and local Lighthouse measurement script.

The fictional demo intentionally has **no real contact numbers, address, Instagram or Maps destination**. Checkout requires `isDemo: false`, a valid number and `whatsappVerified: true`; the shipped configuration disables it. The `.example` QR is a local preview and cannot be downloaded/printed through the controls until its origin is configured. Set `PUBLIC_SITE_URL` only after a real public origin is supplied; do not guess one. Demos remain noindex. Before selling or printing, complete the configuration checklist.

Ordering controls and menu descriptions are in Indonesian; marketing story copy remains English with appropriate language scopes. Mobile ordering text and touch targets have been enlarged. Two stock photos have primary source/license evidence; six unverified sources are blocked and excluded from publication/Git. Most menu products intentionally show “Foto produk belum tersedia” until accurate approved photos are provided. See [ASSET-LICENSES.md](ASSET-LICENSES.md).

## Structure

```text
src/config/business.ts     brand, domain, contact, hours, story, images, SEO
src/config/theme.ts        five primary brand colors
src/data/menu.ts           products, prices, categories, options, stock
src/components/            reusable Astro components
src/layouts/Layout.astro   metadata and shared shell
src/pages/                 generated routes and static XML/text endpoints
src/scripts/storefront.ts  client interactions, rendered using safe DOM APIs
src/utils/                 validation, totals, WhatsApp messages
public/images/             optimized local WebP assets
public/branding/           original SVG brand mark
assets/evidence/           versioned source/license provenance register
assets/photo-sources/      approved source photos (local only, ignored)
assets/blocked/            unverified/misleading legacy files (local only, ignored)
scripts/                   optional image and performance tools
tests/                     unit and E2E tests
qa-artifacts/              recorded measurements and ignored screenshots/reports
```

## Validate

```sh
npx playwright install chromium
npm run check
npm run lint
npm test
npm run build
npm run test:e2e
npm audit
node scripts/measure-performance.mjs
npm run test:client
```

`npm run qa` runs the first five project checks including browser tests. Playwright starts/stops its own production preview. Lighthouse starts/stops a separate local preview and writes HTML reports plus a compact JSON summary under `qa-artifacts/`. Run measurements after the browser suite, without competing browser work. `npm run test:client` creates an ignored `.client-check/` fixture, changes business configuration only, and verifies production-mode checkout and the reconfigured QR locally without sending messages. Never deploy this test fixture. Performance is measured, never guaranteed. See [QA-CHECKLIST.md](QA-CHECKLIST.md) for recorded results and limitations. Windows managed environments may require permission for browser and build subprocesses.

## Customize, deploy, hand over

1. [CONFIGURATION.md](CONFIGURATION.md): clone for a customer, replace branding, content, products and contacts.
2. [DEPLOY-CLOUDFLARE.md](DEPLOY-CLOUDFLARE.md): commercial static customer deployment.
3. [DEPLOY-VERCEL.md](DEPLOY-VERCEL.md): eligible personal noncommercial demos only.
4. [CLIENT-ONBOARDING.md](CLIENT-ONBOARDING.md): collect verified customer information.
5. [COMMERCIAL-HANDOVER.md](COMMERCIAL-HANDOVER.md): service packages, ownership and maintenance.
6. [ASSET-LICENSES.md](ASSET-LICENSES.md): photography and dependency licensing.

No external resources were created and nothing was deployed. Source resale rights for commissioned work must be defined in your customer agreement; third-party images and dependencies retain their own licenses.
