# TinyLink

TinyLink is a minimal, database-backed URL shortener built with Next.js. It includes a dashboard for creating and managing links, a stats page for individual codes, and API routes that power both the UI and programmatic access.

## Features
- Create new short links with generated or custom codes (6–8 alphanumeric characters).
- Redirect visitors from `/:code` while incrementing click counts and storing the last clicked timestamp.
- Dashboard with table search, refresh, deletion, and inline error states.
- Code-specific stats page that surfaces clicks, last clicked time, and creation metadata.
- Health check endpoint that reports uptime and app version for monitoring.

## Tech stack
- **Framework:** Next.js 14 (App Router, TypeScript)
- **Database:** PostgreSQL with Prisma ORM
- **Styling:** Tailwind CSS

## Project structure
- `app/page.tsx` – dashboard UI for listing, searching, creating, and deleting links.
- `app/code/[code]/page.tsx` – stats view for a single code.
- `app/[code]/route.ts` – redirect handler that increments counters.
- `app/api/links` – CRUD API for links (`GET`/`POST` and `/[code]` `GET`/`DELETE`).
- `app/healthz/route.ts` – health check with version and uptime.
- `lib/` – shared helpers for Prisma, validation, code generation, and formatting.
- `prisma/schema.prisma` – data model for persisted links.

## Data model
The Prisma schema defines a `Link` table with the fields used throughout the app:

```prisma
model Link {
  id            String   @id @default(cuid())
  code          String   @unique
  targetUrl     String
  totalClicks   Int      @default(0)
  lastClickedAt DateTime?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

## Prerequisites
- Node.js 18+
- PostgreSQL database (local or hosted, e.g., Neon)

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file with your database connection and base URL:
   ```env
   DATABASE_URL="postgresql://user:password@host:port/dbname?sslmode=require"
   NEXT_PUBLIC_BASE_URL="http://localhost:3000"
   ```
3. Generate the Prisma client and run migrations (updates the target database):
   ```bash
   npx prisma migrate dev --name init_links
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
   The app runs at http://localhost:3000.

## API quick reference
- `POST /api/links` – create a link. Accepts `{ url, code? }`; returns `409` on duplicate codes or `400` on invalid input.
- `GET /api/links` – list all links sorted by creation time.
- `GET /api/links/:code` – fetch metadata for a single code.
- `DELETE /api/links/:code` – remove a link.
- `GET /:code` – redirect to the target URL and record a click.
- `GET /healthz` – returns `{ ok, version, uptimeSeconds, timestamp }`.

## Running checks
- Lint the project:
  ```bash
  npm run lint
  ```
- Build the production bundle (runs Prisma client generation, lint, and type checks):
  ```bash
  npm run build
  ```

## Deployment
1. Push the repository to your Git provider.
2. Create a new project on Vercel (or your preferred host) using this repo.
3. Configure environment variables in the hosting platform:
   - `DATABASE_URL` – production Postgres connection string
   - `NEXT_PUBLIC_BASE_URL` – the deployed site URL, e.g., `https://your-app.vercel.app`
4. Deploy, then run Prisma migrations against the production database:
   ```bash
   npx prisma migrate deploy
   ```
5. Smoke test the deployment:
   - `GET /healthz` returns `{ ok: true, ... }`.
   - Creating a link in the dashboard populates the table.
   - Visiting `/:code` redirects and increments click counts.

## Pre-deployment checklist
- Environment variables are set for the target environment.
- `npm run build` completes successfully.
- Prisma migrations have been applied to the production database.
- API endpoints respond with expected status codes (including 404/409 paths).
