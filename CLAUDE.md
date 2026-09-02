# Ceylon Gems

A listing marketplace for Sri Lankan gemstones and lapidary equipment (Zepla Labs). Sellers post verified, certificate-backed listings; buyers browse and contact them directly — no buyer/seller payments in Phase 1, no commission, ever. Full plan lives in Confluence (space ZLP, "Ceylon Gems — End-to-End Development Plan").

## Commits

Author commits as **Asitha Senarathne \<uaasenarathne@gmail.com\>** (set as this repo's local `git config user.name`/`user.email` — doesn't affect the global identity). Do not append a `Co-Authored-By: Claude` trailer in this repo.

## Verifying a change

Run all three before calling a task done: `pnpm lint`, `pnpm typecheck`, and **`pnpm format:check`**. The formatter is easy to forget since it doesn't block anything — several files (a Nest guard, a mobile hook, `app.json`) went uncaught for multiple tasks before a `format:check` run caught them. If it's not clean, `pnpm format` and re-verify nothing functional changed. If touching `packages/i18n`, also run `pnpm check-i18n` (its own CI job, "Translations") — the `si: Dictionary` exact-match typing already catches a missing/extra key at `tsc` time, but this gives a dedicated, readable failure naming the exact dot-path and keeps working even if that typing is ever loosened.

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
- **Languages:** English and Sinhala are live now, wired from the navigation layer down; Tamil is a real product target but deliberately deferred — don't stub it (no `ta` entries, no Tamil fallback keys) until it's explicitly picked back up

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
- **Fonts embedded at build time** via the `expo-font` config plugin (Jost, Noto Sans Sinhala) — not `useFonts` runtime loading, since brand type is on every screen. Tamil font is intentionally not wired up yet (product decision — English + Sinhala only for now).
- **`expo install`, not `pnpm add`, for every native/Expo package** — it also rewrites `package.json` scripts sometimes (e.g. flipped `android`/`ios` from `expo start --*` to `expo run:*`, which triggers a full native build). Check `git diff package.json` after any `expo install`, not just the dependency lines.
- **RN has no `backdrop-filter`.** The entire design is CSS glassmorphism; the real equivalent is `expo-blur`'s native `BlurView` wrapping a tinted/bordered `View` — architecturally different from the web version, not a drop-in.
- **TypeScript stays at 5.9.3, deliberately, in `apps/mobile`.** `expo-doctor` expects `~6.0.3` for SDK 57, but that version never shipped stable (`npm view typescript dist-tags` shows only a `6.0.0-beta` tag; `latest` jumped straight to 7.x, which is incompatible with `typescript-eslint`). Excluded via `expo.install.exclude` in `apps/mobile/package.json` so `expo-doctor` stops flagging it — don't "fix" this by installing the beta compiler.
- **`StyleSheet.absoluteFillObject` was removed in RN 0.86** (only `StyleSheet.absoluteFill`, the pre-registered style, remains — confirmed absent from both the runtime and `types_generated`). Anywhere the old object needed spreading alongside other style props (e.g. a blur overlay with a border), write the four `position/top/left/right/bottom` literals directly instead.
- **pnpm 10 blocks all dependency install/postinstall scripts by default.** A real one got blocked here (`esbuild`'s postinstall, which links its prebuilt platform binary) — surfaced as an easy-to-miss "Ignored build scripts" warning at the end of `pnpm install` output, not a failure. Allow-list via `onlyBuiltDependencies` in `pnpm-workspace.yaml`, then `pnpm rebuild <pkg>` to actually run it (a plain `pnpm install` afterwards does not retroactively rebuild an already-installed package).

## Locale switching (`apps/mobile/providers/LocaleProvider.tsx`)

`LocaleProvider` (wrapping the whole app, outside `ClerkProvider`, in `app/_layout.tsx`) is the single source of truth for the active language — `en`/`si` only, per the Tamil-deferred decision above. Persists the user's explicit choice via `expo-secure-store` (reused rather than adding AsyncStorage for one string — it's already a direct dependency for Clerk's token cache); falls back to the device locale only when nothing's been stored yet. `useSyncDeviceLocale` (despite the now slightly stale name) pushes whatever `LocaleProvider` resolves to the backend on sign-in/change — it no longer re-detects the device locale itself, so it can't clobber an explicit switch. `useFontFamily` is the only component-kit file that reads locale directly; everything else renders text through it.

## Component kit (`apps/mobile/components/`)

App-local, not a shared package (single current consumer — `monorepo-native-deps-in-app` applies to the styling layer too, not just native modules). Two primitives everything else builds on: `PressableScale` (Gesture.Tap + Reanimated press-scale, replaces `Pressable`'s JS-thread press callbacks per the RN skill) and `GlassSurface` (`BlurView` + a translucent tint `View` + a border whose top edge is a brighter rgba, reassembling the mockups' `backdrop-filter: blur() saturate()` glass formula from three RN-native layers — saturation has no equivalent and is dropped). Everything else — `Button`/`GhostButton`/`IconButton`/`SegmentedControl`/`Chip`, `TextField`/`SearchBar`/`OtpInput`, `Toggle`, `Card`/`ListRow`, `Badge`, `BottomSheet`/`ConfirmDialog`, `SegmentedTabs`/`BottomNavBar`, `Avatar`, `ProgressBar`/`StepMeter` — is built on those two. All text styling reads its font through `hooks/useFontFamily.ts`, which reads the active locale from `LocaleProvider`.

**`GestureHandlerRootView` must wrap the app root** (`app/_layout.tsx`, outside `LocaleProvider`) — every `PressableScale`-based component (i.e. nearly the whole kit, since `PressableScale` is one of the two shared primitives) uses `GestureDetector` internally, which throws `GestureDetector must be used as a descendant of GestureHandlerRootView` at render time without it. This was missed for an entire task cycle because the kit had only ever been verified with `tsc`/`eslint`/`expo export` — bundling successfully proves the JS resolves, not that it renders. **A real UI/navigation change needs an actual run** (`expo start --ios` against a simulator, screenshot or visual check) before calling it verified, not just a clean bundle.

**Running `expo start` rewrites two tracked files as a side effect**: it deletes `apps/mobile/expo-env.d.ts` and rewrites `apps/mobile/tsconfig.json`'s `include` (dropping `.expo/types/**/*.ts` and `expo-env.d.ts`) while regenerating typed-routes types. Neither is an intended change — `git checkout -- apps/mobile/tsconfig.json apps/mobile/expo-env.d.ts` after any verification run that used the dev server, before committing.

**Accessibility pass (component kit)**: `PressableScale` sets `accessible` on its wrapping `View`, which silences the individual text nodes of anything nested inside it for screen readers — only the container's `accessibilityLabel` gets announced. `ListRow` and interactive `Card` account for this (label combines title+subtitle, or takes an explicit `accessibilityLabel` prop); watch for the same trap in any new component that wraps rich children in `PressableScale`. Tab-like groups (`SegmentedControl`, `SegmentedTabs`, `BottomNavBar`) need `accessibilityState={{ selected }}` per item, not just a label — the label alone doesn't tell a screen reader which one is active. `PressableScale` and `Toggle` both call Reanimated's `useReducedMotion()` and skip/zero their animation duration when it's on. Hardcoded English strings inside component-kit internals (a modal's backdrop-close, a search bar's clear button) are real i18n/a11y gaps since they never go through `useTranslation` — exposed as props with an English default (`closeAccessibilityLabel`, `clearAccessibilityLabel`) rather than left hardcoded, so a screen can pass the translated string.

## i18n dictionary (`packages/i18n/`)

Framework-agnostic (no React dependency), mirroring `ui-tokens`' split — the shared package holds plain data, `apps/mobile/hooks/useTranslation.ts` is the thin app-local hook that combines it with `useLocale()`. `Dictionary` (`src/dictionaries/en.ts`) is an explicit interface with `string` leaves, not `typeof en`, so `si.ts` translates the same shape with its own literal content instead of being pinned to English's string literals; typing `si: Dictionary` (not `Partial`) means a key added to `en` without a matching Sinhala entry is a `tsc` error, not a silent runtime fallback — most of task 7 (CI check for missing keys) for free. Namespaced by screen, mirroring the 21-screen Claude Design corpus (`common` holds copy shared across screens rather than being tied to one). Access is `t.common.continue`, a plain object read, not a string-keyed lookup — a typo doesn't compile. `SUPPORTED_LOCALES`/`Locale`/`defaultLocale`/`isSupportedLocale` live here now (moved out of `apps/mobile/lib/locale.ts`, which keeps only the Expo-specific `detectDeviceLocale`) since both the mobile app and this package needed the same list.

Both `en.ts` and `si.ts` are seeded with real first-pass copy across the core MVP screens (auth, home, listing detail, post ad, profile/account, notifications, saved searches, my ads, membership) — not placeholder text, but also not yet reviewed by a native Sinhala speaker; that review is its own pre-launch task per the Confluence risk register ("Trilingual content drift"). Dynamic values (counts, prices, names) are deliberately never dictionary entries — only the static label around them is; components interpolate the value at the call site.

## Navigation (`apps/mobile/app/_layout.tsx`)

Root layout uses expo-router's `Stack` (native-stack under the hood), not a bare `Slot` — needed for a real screen to get an actual native header/back gesture per the RN skill. `screenOptions` sets a shared dark header (background/tint/font from the active gem tone and locale) once; individual `Stack.Screen` entries only override `headerShown`/`title`. UC-2 (switch language) lives at `app/locale-settings.tsx` — a real route, reached from a globe `IconButton` wrapped in expo-router's `Link` (`asChild`) — not the kitchen-sink demo; only its Language section is interactive, Currency/Location are read-only placeholders until those features exist rather than wired-up controls that do nothing.

## Design tokens (from the real design corpus)

Source of truth: the 21-screen Claude Design mockup set (`packages/ui-tokens/src/colors.ts`), not the Confluence brand page — that page's ivory/gold/Cormorant Garamond system turned out to be stale and was superseded. Three dark, glassmorphic "gem tone" themes (Sapphire default, Padparadscha, Emerald), each with its own screen gradient, glow colors, accent, and CTA gradient. Single typeface (Jost) for both display and UI, weight-differentiated rather than family-differentiated. No light mode exists yet — treat any "light theme" request as new design work, not a token lookup.
