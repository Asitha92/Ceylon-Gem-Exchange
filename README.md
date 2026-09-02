# Ceylon Gems

Monorepo for Ceylon Gems — a listing marketplace for Sri Lankan gemstones and lapidary equipment.

## Structure

```
apps/
  mobile/       Expo (React Native) app — primary client for Phase 0/1
  api/          NestJS backend
  web/          Next.js web app — scaffolded later
packages/
  ui-tokens/    Shared design tokens (color, type, spacing)
  api-client/   Typed API client generated from the NestJS OpenAPI spec
  i18n/         Shared EN / SI translation dictionaries (Tamil deferred)
  config/       Shared config (eslint, tsconfig, etc.)
```

## Getting started

```bash
nvm use          # Node 20+
pnpm install
pnpm dev          # runs all apps in dev mode via Turborepo
```

Requires pnpm (`packageManager` field pins the version) and Node >= 20.

## Sequencing

Building the mobile app + backend mechanism first, entirely against a local
Docker stack (Postgres, Redis, Typesense, MinIO) — no cloud account needed to
start. The web app and AWS/staging deployment are deliberately deferred until
the mobile app and backend work end-to-end.

## Docs

- [Authentication](docs/authentication.md) — Clerk + our `users` table: sign-in, webhook sync, API auth guards, locale detection
- [Design tokens](docs/design-tokens.md) — gem-tone color palettes, typography, spacing, radii (`packages/ui-tokens`)
- [Component kit](docs/component-kit.md) — the mobile app's shared UI components (`apps/mobile/components`)
