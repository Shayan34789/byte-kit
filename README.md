# Byte-Kit

Fast, private developer tools that run entirely in the browser.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production build

The site is a static export. Build it, then serve the `out/` folder with any
static host (Vercel, Netlify, Cloudflare Pages, GitHub Pages, …):

```bash
npm run build
```

Set `NEXT_PUBLIC_SITE_URL` to the deployed site URL **before** building, so
metadata, schema markup, the sitemap, and `robots.txt` use the correct domain:

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com npm run build
```

If the site lives under a subpath (e.g. a GitHub Pages project site at
`https://<user>.github.io/<repo>/`), also set `NEXT_PUBLIC_BASE_PATH` to that
subpath so assets and links resolve correctly:

```bash
NEXT_PUBLIC_SITE_URL=https://<user>.github.io/<repo> NEXT_PUBLIC_BASE_PATH=/<repo> npm run build
```

## Deploying to GitHub Pages

This repo includes `.github/workflows/deploy.yml`, which builds the site and
deploys `out/` to GitHub Pages on every push to `main`. To enable it:

1. Push this repo to GitHub.
2. In the repo: **Settings → Pages → Build and deployment → Source** → select
   **GitHub Actions**.
3. Push to `main` (or run the workflow manually). The site will be live at
   `https://<user>.github.io/<repo>/`.

The workflow already sets `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_BASE_PATH`
for `shayan34789.github.io/byte-kit` — update them in the workflow file if the
repo name or a custom domain changes.
