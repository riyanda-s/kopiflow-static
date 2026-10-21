# Personal noncommercial demo on Vercel

Vercel Hobby is restricted to personal noncommercial use. A paid client website, freelance sales funnel, commercial portfolio promotion, or commercial template demonstration may not qualify. Verify your specific use against [Hobby plan rules](https://vercel.com/docs/plans/hobby) and [Vercel terms](https://vercel.com/legal/terms). Use Cloudflare Pages for the intended commercial customer delivery; see [DEPLOY-CLOUDFLARE.md](DEPLOY-CLOUDFLARE.md).

## Authorized eligible personal demo

1. Keep the demo fictional and `isDemo: true`. Do not expose private customer information.
2. Create/import a repository in your Vercel account only after approval.
3. Select Astro, repository root, Node 24, build command **`npm run build`**, output directory **`dist`**.
4. No adapter, serverless functions, environment secrets, API routes, or Vercel SDK is necessary.
5. After the project URL is assigned, update `business.domain` to that HTTPS origin and redeploy. Otherwise QR/canonical links remain placeholders.
6. Confirm routes, images, 404, QR, mobile cart and metadata. Demo checkout remains disabled intentionally.

For an authorized custom domain, add it through Vercel project settings, follow the dashboard’s DNS and HTTPS instructions, update `business.domain`, rebuild, and verify metadata/QR again. Do not purchase a domain without approval.

To migrate, connect the same repository to Cloudflare Pages using `npm run build` and `dist`. Change `business.domain` only when the canonical hostname changes. No source architecture changes are required.
