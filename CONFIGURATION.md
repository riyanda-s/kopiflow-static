# Customer configuration

## Safe defaults and public-demo URL

The shipped configuration remains `isDemo: true`, `whatsapp: ''`, `whatsappVerified: false`, and `allowIndexing: false`. Do not enable real ordering during demo preparation. A syntactically valid number is not proof of ownership: owner verification must precede setting `whatsappVerified: true` in a real customer fork. Both the button and checkout helper enforce the gate; missing/invalid/unverified numbers cannot open checkout.

Copy `.env.example` to a local ignored `.env`, or set `PUBLIC_SITE_URL` in the eventual hosting build settings, **only after the actual HTTPS origin is supplied**. Leave it blank for local work. It overrides the canonical origin for metadata, sitemap and QR at build time without editing shared components. Paths, query strings, credentials, insecure URLs, local hosts and reserved placeholder domains are rejected. No public domain has been selected for this template. Do not guess a Pages hostname.

The fallback `.example` origin is local-demo-only: QR download/printing is disabled until it is replaced. Configuring a real public URL does not enable WhatsApp checkout or indexing. Public fictional demos should remain `isDemo: true` and `allowIndexing: false`.

Only assets registered in `src/config/assets.ts` may be referenced by the business/menu configuration. Register reliable license/source evidence before adding client-owned or licensed photos. Read `ASSET-LICENSES.md` and `assets/evidence/verified-images.json`. Unverified images have been removed from `public/` and are quarantined locally; original JPEGs and quarantined files are excluded from Git. Products without accurate approved images use the original neutral placeholder. Do not substitute an unrelated food image merely to fill a card.

## Create a separate customer repository

Use the Git provider’s template/duplicate workflow, or clone and point the new clone at a new repository you own. Do not push customer content back to the master template. Create a separate hosting project and domain for each client. No multi-tenant routing or tenant IDs are needed.

```sh
git clone <template-repository-url> customer-coffee
cd customer-coffee
git remote remove origin
git remote add origin <new-customer-repository-url>
npm ci
```

Create the remote repository yourself or approve its creation separately. Commands here are instructions, not automatically executed actions.

## Brand and business

Edit `src/config/business.ts`:

| Field | Purpose |
| --- | --- |
| `name`, `tagline`, `logo` | Identity. Put the new mark in `public/branding/`. SVG or PNG recommended. |
| `domain` | Canonical HTTPS root origin, such as `https://coffee.example.com`; no subdirectory. Used by metadata, sitemap and QR. |
| `isDemo`, `whatsappVerified` | Keep the demo true and number verification false. Real customer ordering requires a non-demo site, a valid recipient and explicit owner verification. |
| `allowIndexing` | False by default; demo pages always emit noindex. Enable only for an approved real customer launch. |
| `description`, `seo` | Page description, default title, share image and locale. |
| `address`, `hours` | Verified address and human-readable opening hours. |
| `whatsapp` | International number, e.g. `+62 812 ...`; Indonesian leading `0` normalizes to `62`. Use digits only after normalization. |
| `instagram` | Full HTTPS Instagram profile URL, or blank to omit. |
| `mapsUrl` | Real HTTPS Maps directions/listing link. No map embed or API key. |
| `hero`, `story`, `philosophy`, `coffeeQuality` | Approved shop-specific introduction, story, values and coffee information. Remove fictional wording for a real customer. |
| `images`, `gallery` | Local image paths and truthful descriptive alt text. Hero has 800px and 1600px variants. |
| `bestsellers` | Product IDs selected by the shop. Verify claims before publishing. |
| `promotion` | Approved promotional banner text. Do not promise discounts without shop approval. |

Colors live in `src/config/theme.ts`. Use six-digit hex colors; primary theme values become CSS variables. Recheck contrast after changing colors. Typography uses local system fonts, so there are no external font requests. Generic layout copy may be translated as a separate design/localization task; shop identity and operational details require no reusable component edits.

The build validates key URL, contact, color, price, ID, option and category constraints. Validation cannot verify ownership of a number or accuracy of business claims. Review every content field. Production configuration refuses a missing number, Maps destination or `.example` domain.

## Products and pricing

Edit `src/data/menu.ts`. The seed format creates complete products, and the exported `Product` interface supports independent option groups per item. Add a category to `categories` when needed. Prices are integer Rupiah; do not enter decimal strings or formatted text.

```ts
{
  id: 'kopi-kelapa',
  name: 'Kopi Kelapa',
  category: 'Milk Coffee',
  price: 28000,
  description: 'Espresso, milk, and a gentle coconut finish.',
  image: '/images/kopi-kelapa.webp',
  imageAlt: 'Kopi Kelapa served over ice',
  available: true,
  featured: true,
  variants: [{ id: 'size', label: 'Size', options: [
    { id: 'regular', label: 'Regular', price: 0 },
    { id: 'large', label: 'Large', price: 6000 },
  ] }],
  addons: [{ id: 'shot', label: 'Extra shot', price: 6000 }],
}
```

Keep IDs stable for retained products; changing an ID drops the old saved selection. Unavailable, deleted or invalid entries are discarded from restored carts. Variant/add-on prices are **surcharges**, added to the base product price. `available: false` disables ordering. Shared demo drink options are defined at the top of the menu file; adjust recipes/options to actual products before launch. Add/remove option groups through the data, not the modal component.

The bag stores only product IDs, selections and quantities. Prices are always recalculated from the current catalog. Limits: 99 per identical selection, 50 selections, 500 characters of notes. Notes are not persisted. Browser storage may be disabled, in which case the bag works only in the current page session. Taxes, delivery, discounts and service charges are not calculated; the shop confirms the final amount.

## Images

Replace illustrative stock photos with client-approved photos for accurate menu representation. Use local optimized WebP, natural dimensions where possible, and preserve source licensing records. Menu cards intentionally crop photos. Hero accepts a smaller and larger image via `srcset`; below-the-fold images load lazily. Source assets are kept outside `public/` to avoid shipping originals. To regenerate supplied image variants:

```sh
node scripts/optimize-images.mjs
```

Original source JPEGs are intentionally not distributed in Git. A fresh clone can use the tracked verified WebP derivatives directly; to re-optimize, obtain the approved sources from the recorded primary pages first. If using new files, update that optional script or optimize manually, record provenance, and register the approved paths. Test the production output for broken images.

## Domain and QR

Set the final `domain`, rebuild, deploy, and visit `/qr/`. Check the printed URL, download SVG, then scan the actual printed proof on at least two phones. SVG includes a quiet zone and high-contrast modules. QR and metadata update at build time; changing DNS alone cannot change an already printed QR. Do not print cards using temporary preview URLs or the `.example` domain.

## Before launch

Run `npm run qa`, `npm audit`, and Lighthouse. Update tests that deliberately assert the demo brand/domain/catalog when preparing the client fork; keep functional behavior and arithmetic assertions. Confirm the real WhatsApp recipient by opening a prepared message, then verify the final quote with the owner. Never describe opening WhatsApp as order acceptance or payment.
