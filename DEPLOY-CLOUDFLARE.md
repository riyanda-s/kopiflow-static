# Deploy a commercial customer website to Cloudflare Pages

The output is entirely static. Use **Pages**, not an Astro SSR adapter or Worker. Cloudflare account limits and service terms may change; review [Pages limits](https://developers.cloudflare.com/pages/platform/limits/) and the applicable account terms before committing to a customer’s hosting arrangement.

## Prepare

1. Create one customer repository and one customer-owned Cloudflare account/project. Get explicit authorization before creating external resources or publishing.
2. Complete [CONFIGURATION.md](CONFIGURATION.md), set the intended production `domain`, verify business content and set `isDemo: false`.
3. Run `npm ci`, `npm run qa`, `npm audit`. Commit source and `package-lock.json`. Keep `dist/` and `node_modules/` untracked.

## Git-connected Pages

1. In Cloudflare, go to **Workers & Pages → Create → Pages → Connect to Git** (dashboard labels may vary).
2. Select the customer repository and production branch, normally `main`.
3. Select Astro or configure manually:

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | Repository root |
| Node version | `24` via build environment `NODE_VERSION` |
| Canonical origin | `PUBLIC_SITE_URL` set to the approved final HTTPS root origin |
| Runtime bindings/secrets | None |

4. The lockfile supplies deterministic npm dependencies. No Cloudflare adapter, database, KV, functions directory or API key is needed.
5. Deploy after authorization. Preview branches must not become the canonical domain in configuration. Test generated `/`, `/menu/`, `/about/`, `/visit/`, `/privacy/`, `/qr/`, `/robots.txt`, `/sitemap.xml` and a nonexistent page.

The repo includes a generated `404.html`, preserving a real missing-page experience rather than an SPA fallback. Trailing slash URLs have directory index files.

`public/_headers` supplies Pages security headers, including a same-origin content security policy. Images and the generated QR data URL are allowed; external scripts, embeds and forms are not. Review this policy before adding integrations. Astro's local preview does not emulate Pages response headers, so verify them on the authorized deployment. Other hosts may ignore `_headers`; equivalent headers can be configured through their settings without changing application code.

## Custom domain

1. From the Pages project choose **Custom domains → Set up a custom domain**. Enter the approved domain in the Pages dashboard first.
2. Follow the displayed DNS setup. Apex domains generally require a zone in the same Cloudflare account; external subdomains can use the instructed CNAME. Use Cloudflare’s current instructions instead of guessing DNS values.
3. Wait for domain verification and HTTPS certificate issuance. Confirm both desired hostname and redirects; choose one canonical hostname.
4. Make `business.domain` match that final HTTPS origin. Rebuild/redeploy if it changed.
5. Confirm canonical/OG links, sitemap, and QR on production. Scan before printing QR materials.

For an eventual fictional public demo, keep `isDemo: true`, `whatsappVerified: false` and `allowIndexing: false`. Do not enable customer ordering merely to configure the origin. Production customer checkout additionally requires owner verification of the actual recipient, approved real content and explicit launch authorization. No actual public-demo origin has been selected in this repository.

Domain registration and renewals are customer expenses, not included in free hosting. This project does not purchase or configure domains automatically.

## Manual upload alternative

Run `npm ci && npm run build` locally, then use Pages Direct Upload to upload the **contents of `dist/`**. Select Git integration or Direct Upload intentionally; switching project workflow later can require a new project. Do not upload the repository or source photos as the website.

## Updates and rollback

Make approved edits in the customer repository, run checks, and push to the production branch. Use the Pages deployment history to roll back a failed release. Keep the prior source commit and configuration. Menu availability is a build-time snapshot, not live inventory. Prices saved in a browser are recalculated after the new site loads.

## Verify the deployment

- HTTPS works on the chosen hostname; no mixed assets or console errors.
- All routes work directly and after refresh; a random path returns 404.
- Add a customized drink; inspect the WhatsApp recipient/message and estimate. Opening WhatsApp preserves the bag.
- Test mobile navigation, cart and blocked-tab fallback.
- Scan the exported and printed QR; ensure it opens the final menu URL.
- Rerun Lighthouse on the deployed domain; local scores do not guarantee CDN or real-device results.

Official references: [Astro on Pages](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/), [build configuration](https://developers.cloudflare.com/pages/configuration/build-configuration/), [custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/). This template uses only the static configuration.
