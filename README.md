# Visual Query Builder

A highly interactive, schema-driven visual query builder. Compose nested **AND/OR**
filter logic through a graphical interface and translate it live into **SQL**,
**MongoDB**, and **GraphQL** — then run it against a dataset and inspect the results.

> Built with Next.js (App Router) + TypeScript. This README is expanded with the full
> architecture write-up (recursive rendering, state, query engine, performance,
> trade-offs) as the project lands.

## Tech stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** with a ported design-token system (light/dark + brand accent)
- **Space Grotesk** / **JetBrains Mono** via `next/font`
- **Vitest** + **React Testing Library** for unit/integration tests
- CI via **GitHub Actions**; CD via **Vercel**

## Getting started

```bash
pnpm install
pnpm dev        # http://localhost:3000
```

## Scripts

| Script           | Description                          |
| ---------------- | ------------------------------------ |
| `pnpm dev`       | Start the dev server                 |
| `pnpm build`     | Production build                     |
| `pnpm start`     | Run the production build             |
| `pnpm lint`      | ESLint                               |
| `pnpm typecheck` | `tsc --noEmit`                       |
| `pnpm test`      | Run the test suite once (Vitest)     |
| `pnpm test:watch`| Watch mode                           |

## Project layout

```
src/
  app/                 App Router entry (layout, page, globals.css tokens)
  components/theme/     theme provider (light/dark + accent) — more UI lands per PR
  lib/                  utilities; the query engine is ported here next
  test/                 Vitest setup
```
