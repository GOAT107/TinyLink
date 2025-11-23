# TinyLink

TinyLink is a minimal URL shortener with click statistics and a simple management dashboard.

## Stack

- Next.js (App Router, TypeScript)
- PostgreSQL (e.g. Neon)
- Prisma
- Tailwind CSS

## Features

- Create short links with optional custom codes (`[A-Za-z0-9]{6,8}`)
- 302 redirects from `/:code` to the target URL
- Click tracking (`totalClicks`, `lastClickedAt`)
- Dashboard (`/`) to list, search, and delete links
- Stats page for a single code (`/code/:code`)
- Healthcheck (`/healthz`)

## API

- `POST /api/links` – Create link (409 if code exists)
- `GET /api/links` – List all links
- `GET /api/links/:code` – Stats for one code
- `DELETE /api/links/:code` – Delete link
- `GET /:code` – Redirect and increment counters
- `GET /healthz` – Returns `{ ok: true, version: "1.0", ... }`

## Environment

Example `.env`:

```env
DATABASE_URL="postgresql://user:password@host:port/dbname?sslmode=require"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

## Local development

```bash
npm install
npx prisma migrate dev --name init_links
npm run dev
```

App runs at http://localhost:3000.

## Deployment (Vercel)

1. Push this repo to GitHub.
2. In [Vercel](https://vercel.com), create a new project from the repo.
3. Add environment variables in **Project Settings → Environment Variables**:
   - `DATABASE_URL` – your production Postgres/Neon connection string
   - `NEXT_PUBLIC_BASE_URL` – your Vercel URL, e.g. `https://tinylink-yourname.vercel.app`
4. Deploy the project.
5. Run Prisma migrations against the production DB:

```bash
# From your machine, pointing to the same DATABASE_URL used on Vercel:
export DATABASE_URL="postgresql://user:password@host:port/dbname?sslmode=require"
npx prisma migrate deploy
```
6. Verify:
	•	/healthz returns { ok: true, ... }
	•	/ dashboard can create links
	•	/:code redirects and tracks clicks
