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

---

## Highlights

- **URL-driven wizard.** The current step lives in the query string
  (`/signup?step=region`), so the flow is shareable, refresh-safe, and works
  with the browser back button. Answers persist in `sessionStorage` and are
  cleared after a successful submit.
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

## Project structure

```
src/
├── app/
│   ├── page.tsx              # landing page
│   ├── layout.tsx            # fonts (Fraunces + Outfit) + theme
│   ├── signup/
│   │   ├── page.tsx          # wizard router (reads ?step=)
│   │   ├── _components/      # OptionGrid, BackLink
│   │   └── _steps/           # one component per step
│   └── quote/[id]/
│       ├── page.tsx          # server-rendered results
│       ├── share-button.tsx  # client island
│       ├── loading.tsx       # Suspense fallback
│       └── not-found.tsx     # 404 state
└── lib/
    ├── contracts.ts          # shared types + Zod schemas (see note below)
    ├── api-client.ts         # typed API façade
    ├── use-wizard-state.ts   # sessionStorage-backed wizard state hook
    └── wizard-steps.ts       # step order, labels, navigation helpers
```

> **Note:** `contracts.ts` currently duplicates the API's domain types. The
> planned improvement is a shared workspace package as the single source of
> truth — see the API README's "What I would do next".

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

_A portfolio demo by May Kongpia. Not affiliated with Sunsave._
