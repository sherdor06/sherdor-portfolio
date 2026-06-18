# Sherdor Ergashov — Portfolio

Personal portfolio website for **Sherdor Ergashov**, Flutter Developer (Tashkent, Uzbekistan).
A single, responsive landing page built with the App Router.

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · lucide-react · Inter (`next/font`).

## Local development

Requires Node.js and [pnpm](https://pnpm.io).

```bash
pnpm install   # install dependencies
pnpm dev       # start dev server → http://localhost:3000
pnpm build     # production build
pnpm start     # serve the production build
```

## Project structure

```
app/
  layout.tsx     # Inter font + SEO / Open Graph metadata
  page.tsx       # assembles all sections
  globals.css    # Tailwind import, smooth scroll, scroll-reveal utility
components/       # Header, Hero, Section, Reveal, About, Experience,
                  # Skills, Education, Languages, Interests, Footer, GithubIcon
lib/content.ts    # all page copy in one place (single source of truth)
```

## Deploy to Vercel

1. Push this repo to GitHub.
2. On [vercel.com](https://vercel.com), **Add New → Project** and import the repo.
3. Click **Deploy** — no configuration needed. Vercel auto-detects Next.js and uses pnpm
   from `pnpm-lock.yaml`.

After the first deploy, update `metadataBase` in [`app/layout.tsx`](app/layout.tsx) to the
real domain, and fill in the GitHub button URL in [`lib/content.ts`](lib/content.ts) (`github`).
