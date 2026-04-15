# Woo Tong — Digital Design Agency

A React + Vite site with a built-in admin panel, ready to deploy on **Cloudflare Pages**.

## Deploy to Cloudflare Pages

1. Push this repo to GitHub
2. Go to [Cloudflare Pages](https://pages.cloudflare.com) → **Create a project** → **Connect to Git**
3. Select your repo and use these build settings:

| Setting | Value |
|---|---|
| Framework preset | Vite |
| Build command | `npm run build` |
| Build output directory | `dist` |

4. Click **Save and Deploy** — that's it. Cloudflare handles HTTPS automatically.

## Local development

```bash
npm install
npm run dev
```

## Admin panel

Navigate to `/#/admin` on your deployed site (e.g. `https://yoursite.pages.dev/#/admin`).

Default password: `admin123` — change it in the Security tab of the admin panel.

> **Note:** Content is stored in each visitor's `localStorage`. This means admin edits
> only affect the browser you edit in. For a shared CMS across all visitors, wire up
> the `save()` function in `ContentProvider` to a backend API or Cloudflare KV.
