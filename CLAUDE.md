# Ceylon Gems

A listing marketplace for Sri Lankan gemstones and lapidary equipment (Zepla Labs). Sellers post verified, certificate-backed listings; buyers browse and contact them directly — no buyer/seller payments in Phase 1, no commission, ever. Full plan lives in Confluence (space ZLP, "Ceylon Gems — End-to-End Development Plan").

## Commits

Author commits as **Asitha Senarathne \<uaasenarathne@gmail.com\>** (set as this repo's local `git config user.name`/`user.email` — doesn't affect the global identity). Do not append a `Co-Authored-By: Claude` trailer in this repo.

## Verifying a change

Run all three before calling a task done: `pnpm lint`, `pnpm typecheck`, and **`pnpm format:check`**. The formatter is easy to forget since it doesn't block anything — several files (a Nest guard, a mobile hook, `app.json`) went uncaught for multiple tasks before a `format:check` run caught them. If it's not clean, `pnpm format` and re-verify nothing functional changed.

## Local dev stack

`docker-compose.yml` at the repo root runs Postgres, Redis, Typesense, and MinIO (`pnpm docker:up`/`docker:down`). Postgres is published on host port **55432, not 5432** — this machine has a native PostgreSQL 18 install already bound to 5432, and connecting to "localhost:5432" silently hits that instead (same server on both `127.0.0.1` and `::1`, so switching to explicit IPv4 doesn't help — only a different port does). `apps/api` loads credentials from the root `.env` (shared with `docker-compose.yml`, gitignored; `.env.example` is the tracked template) via `ConfigModule.forRoot({ envFilePath: '../../.env' })`.

## Current sequencing

**Mobile app + backend mechanism first, entirely local, $0 infra.** The web app (Next.js) and AWS/staging deployment are deliberately deferred until the Expo app and NestJS API work end-to-end against a local Docker stack (Postgres, Redis, Typesense, MinIO). Don't scaffold `apps/web` or provision cloud infra unless explicitly asked — check the Phase 0 task list before assuming otherwise.

## Stack

- **Mobile:** Expo (React Native, TypeScript) — the primary client for now
- **API:** NestJS (TypeScript), designed as a persistent container (not serverless) so a WebSocket gateway can attach later for auctions
- **Web (later):** Next.js 15, App Router
- **DB:** PostgreSQL, Drizzle ORM, minor-unit money (`amount_cents`, `currency`)
- **Search:** Typesense
- **Auth:** Clerk (RN SDK for mobile now, web components later)
- **Monorepo:** Turborepo + pnpm — `apps/mobile`, `apps/api`, `apps/web` (later), `packages/{ui-tokens,api-client,i18n,config}`
- **Languages:** full trilingual product — English, Sinhala, Tamil — from the navigation layer down, not bolted on later

## React Native / Expo development standards

**Always use the `vercel-react-native-skills` skill when writing or reviewing React Native/Expo code in `apps/mobile`.** It has full explanations and before/after examples for every rule below — load it rather than relying on this summary for anything non-trivial.

The rules that matter most for this app:

- **Lists are the app.** Every gem/equipment browse screen is a list — always virtualize (FlashList or LegendList), never `ScrollView.map()`. Keep list items lightweight (no queries, no context, primitives as props), memoize them, and use `getItemType` for the mixed content feeds (e.g. featured + regular listings).
- **Images are the product.** Gem photos are the entire value proposition — use `expo-image` everywhere (never RN's `Image`), request appropriately-sized/compressed images in lists, and use `@nandorojo/galeria` for the listing-detail gallery (pinch-zoom, pan-to-close) instead of a hand-rolled lightbox modal.
- **Native navigation only.** `@react-navigation/native-stack` / expo-router's default stack, native bottom tabs — never the JS stack/tab navigators.
- **Animate `transform`/`opacity` only** (Reanimated), never `width`/`height`/`margin` — this matters for the gallery zoom, promoted-listing badges, and any card transitions.
- **Never crash on falsy render values.** `{count && <Text>...}` crashes when `count` is `0` — a live concern here since listing counts, prices, and view counts are frequently `0`. Use ternaries or early returns.
- **Monorepo native deps go in `apps/mobile`, not shared packages.** Autolinking only scans the app's own `node_modules` — any native module (Reanimated, gesture-handler, etc.) must be a direct dependency of `apps/mobile` even if a shared package also uses it. Pin exact versions across the workspace — **except** Expo-SDK-managed packages (`expo`, `expo-*`, `react`, `react-native`), which should keep the tilde ranges `expo install` writes. Those ranges are what `expo-doctor`/`expo install --check` use to detect SDK drift; forcing them exact fights that tooling. Always add new native/Expo packages via `expo install <pkg>` (run inside `apps/mobile`), not a bare `pnpm add`.
- **Native modals/menus over JS ones.** `presentationStyle="formSheet"` for sheets (e.g. the promotion picker, filter sheet), `zeego` for dropdown/context menus — not custom JS overlays.
- **Pressable, not TouchableOpacity/TouchableHighlight.**
- **Fonts embedded at build time** via the `expo-font` config plugin (Cormorant Garamond, Albert Sans, Noto Serif/Sans Sinhala & Tamil) — not `useFonts` runtime loading, since brand type is on every screen.

## Design tokens (from the brand system)

Ivory ground `#faf9f7` · ink `#1b1c20` · gold accent `#a8852f` · green (positive/unheated) `#1e7a54` · red (alerts) `#b3402f`. Display type: Cormorant Garamond. UI type: Albert Sans. Voice: precise, generous with facts, never hype — treatment disclosure and certificates are stated plainly.
