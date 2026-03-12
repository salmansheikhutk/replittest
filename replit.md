# Fasaha — Arabic Grammar Learning Platform

An Arabic grammar learning platform for Sarf (morphology) and Nahw (syntax).

## Tech Stack
- **Frontend**: React 18, TypeScript, Vite, TailwindCSS, shadcn/ui, TanStack Query
- **Backend**: Express.js, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Routing**: wouter (client-side), Express (API)

## Project Structure
```
client/src/        — React frontend (pages, components, hooks)
server/            — Express backend (routes, storage, db)
shared/            — Shared types & schema (schema.ts, routes.ts)
migrations/        — Drizzle migration SQL files (auto-generated, do NOT hand-edit)
script/            — Build and seed scripts
tests/             — Vitest test suites (server, client, shared)
```

## Key Files
- `shared/schema.ts` — Drizzle schema for lessons and exercises tables
- `server/routes.ts` — API routes; also calls `seedDatabase()` on startup
- `server/index.ts` — Entry point; runs migrations in production, starts Express + Vite
- `drizzle.config.ts` — Drizzle Kit config (outputs to `./migrations`)
- `script/seed.ts` — Standalone seed script (`npm run db:seed`)

## Database
- **Dev**: Replit-managed PostgreSQL (DATABASE_URL provided automatically)
- **Prod**: Neon PostgreSQL (provisioned on first deploy)
- Tables: `lessons`, `exercises`
- Migrations run automatically on production startup via `migrate()`
- Seed data is inserted via `seedDatabase()` if tables are empty

## Scripts
- `npm run dev` — Start dev server (Express + Vite HMR)
- `npm run build` — Build for production (Vite client + esbuild server → dist/)
- `npm start` — Run production server (`node dist/index.cjs`)
- `npm run db:push` — Push schema changes to dev DB (no migration files)
- `npm run db:generate` — Generate migration SQL from schema
- `npm run db:seed` — Seed the database with lesson/exercise data
- `npm test` — Run Vitest test suite

## Deployment
- Replit Autoscale deployment
- Build: `npm run build`
- Run: `node dist/index.cjs`
- Migrations folder must be committed to git (it is NOT in .gitignore)
