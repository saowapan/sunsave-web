# Sunsave Demo — Web

The customer-facing frontend for the Sunsave demo solar quote service:
a landing page, a multi-step signup wizard, and shareable quote pages.

Built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and
**React Hook Form + Zod**. It talks to the [NestJS API](../sunsave-api) over a
small typed HTTP client.

> This is one half of a two-repo project. For the full architecture, the quote
> model, and the engineering decisions behind it, see the
> **[API repo README](../sunsave-api/README.md)** — that is the main writeup.
> Not affiliated with Sunsave; a portfolio demo using illustrative data.

## Live demo

- **Web:** <https://sunsave-web.vercel.app/>
- **API:** <https://sunsave-api.onrender.com/api/health>

Note: The API is hosted on Render's free tier, so the first request after a period
of inactivity may take ~30 seconds to wake the instance.

---

## Highlights

- **URL-driven wizard.** The current step lives in the query string
  (`/signup?step=region`), so the flow is shareable, refresh-safe, and works
  with the browser back button. (using `sessionStorage`)
- **Server-rendered quote pages.** `/quote/:id` is an async server component
  that fetches on the server and ships fully-rendered HTML, with dynamic
  `generateMetadata` so a shared link previews the actual savings figure.
- **Server-component-first.** Only genuinely interactive leaves (e.g. the
  share button) are `'use client'`; the rest renders on the server, keeping
  the client JS footprint small.
- **Shared validation rules.** The wizard validates against the same Zod
  schema shape the API enforces, so client and server agree on what a valid
  quote request is.

---

## Running locally

The API and a Postgres instance must be running first — see the
[API README](../sunsave-api/README.md).

```bash
pnpm install
cp .env.example .env.local     # NEXT_PUBLIC_API_URL=http://localhost:3000/api
pnpm run dev                   # http://localhost:3001
```

The dev server runs on **port 3001** (the API uses 3000).

---
