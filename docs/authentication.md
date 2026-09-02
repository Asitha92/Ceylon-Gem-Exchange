# Authentication

Ceylon Gems uses Clerk for identity and credentials, and its own Postgres
`users` table for everything Clerk doesn't own — role, locale, status,
and anything the rest of the product needs to join against. The two are
linked by one column: `users.clerk_id`.

Mobile (Expo) is the only client today; web (Next.js) is deferred per the
Phase 0 plan and will reuse the same API-side pieces (`ClerkAuthGuard`,
`RolesGuard`) with `@clerk/nextjs` instead of `@clerk/expo` on the client.

## Division of ownership

| Owns                                                                 | Where                                     |
| -------------------------------------------------------------------- | ----------------------------------------- |
| Credentials, sessions, MFA, OAuth (Google/Apple), phone-OTP delivery | Clerk                                     |
| `role`, `locale`, `status`, and all other business data              | Our `users` table (Postgres, via Drizzle) |
| The link between the two                                             | `users.clerk_id` (unique)                 |

The API never asks Clerk "what's this user's role" — role lives in our own
database, because it's ours to define and query alongside everything else
(listings, orders, etc.) in Phase 1.

## The five flows

### 1. Sign-in (mobile)

The Expo app uses `@clerk/expo` (**not** `@clerk/clerk-expo` — that package
is deprecated in favor of Clerk's "Core 3" architecture). `ClerkProvider`
wraps the root layout
(`apps/mobile/app/_layout.tsx`) with a `SecureStore`-backed token cache, so
sessions survive app restarts without the token ever touching plain storage.

Sign-in methods: email+password, Google, Apple, phone-OTP (UC-8 in the
functional spec). Once signed in, `useAuth().getToken()` returns a
short-lived JWT the app attaches to every API call as
`Authorization: Bearer <token>`.

### 2. Sign-up (mobile)

`apps/mobile/app/sign-up.tsx` — phone is the primary identifier (matching
the design and Sri Lankan dealers' actual usage), email optional. Uses
`useSignUp()` from `@clerk/expo`, which resolves to Clerk's newer **"Future"
signals API** in the version actually installed (`@clerk/react` 6.14.8) —
not the classic Resource API most Clerk docs and examples still show. See
the API surface comparison table in `CLAUDE.md` before writing any more
Clerk flow code; the two APIs look similar but differ in almost every
method name and return shape.

```
signUp.password({ phoneNumber, password, firstName, lastName, emailAddress? })
  --status !== 'complete'-->  signUp.verifications.sendPhoneCode()
  --navigate-->  /verify-phone
  --signUp.verifications.verifyPhoneCode({ code })-->  signUp.finalize()
  --session active-->  redirect home
```

`/verify-phone` is a placeholder screen (no design provided for it yet) —
built with the same component kit and gem-tone theming so it doesn't look
out of place, but it should be replaced once a real design exists. It reads
`signUp.phoneNumber` directly off the same reactive `signUp` object rather
than needing it passed through navigation params, since Clerk's client SDK
keeps sign-up state in memory for the lifetime of the `ClerkProvider`.

### 3. User sync (webhook)

Clerk is the source of truth for _when_ an account exists — our `users` row
gets created by a webhook, not by anything the mobile app calls directly.

```
Clerk  --user.created/updated/deleted-->  POST /webhooks/clerk  --upsert/delete-->  users table
```

- `apps/api/src/webhooks/clerk-webhook.controller.ts` verifies the request
  using the `svix` package directly against `req.rawBody` — **not**
  `@clerk/backend`'s `verifyWebhook()`, which expects a Fetch API `Request`
  and doesn't fit Express/Nest's req/res model.
- `req.rawBody` requires `rawBody: true` in `NestFactory.create()`
  (`apps/api/src/main.ts`) — signatures are computed over the exact raw
  bytes, not the JSON-parsed body.
- `user.created`/`user.updated` → upsert by `clerk_id`. `user.deleted` →
  delete the row. (No soft-delete/retention policy yet — that's a Phase 1
  decision once other tables reference `users.id`.)

**Local dev requires a public URL.** Clerk's servers can't reach
`localhost`, so webhook testing needs a tunnel:

```bash
cloudflared tunnel --url http://localhost:3000
```

Take the resulting `https://*.trycloudflare.com` URL, register it in the
Clerk dashboard (**Webhooks → Add Endpoint**, URL = `<tunnel>/webhooks/clerk`,
events = `user.created`, `user.updated`, `user.deleted`), and copy the
signing secret into `.env` as `CLERK_WEBHOOK_SIGNING_SECRET`. The quick
tunnel is free and needs no account, but the URL is ephemeral — if the
`cloudflared` process restarts, update the endpoint URL in Clerk's dashboard
again.

### 4. Authenticated API requests

```
Mobile app  --Bearer <JWT>-->  ClerkAuthGuard  --request.auth populated-->  [RolesGuard]  --DB role lookup-->  handler
```

- `ClerkAuthGuard` (`apps/api/src/auth/clerk-auth.guard.ts`) extracts the
  Bearer token and verifies it via `@clerk/backend`'s `verifyToken()`
  against `CLERK_SECRET_KEY`. On success it sets `request.auth` to the
  decoded JWT payload (`request.auth.sub` is the Clerk user ID). Missing or
  invalid tokens get a 401.
- `RolesGuard` (`apps/api/src/auth/roles.guard.ts`) is optional, applied
  after `ClerkAuthGuard` via `@UseGuards(ClerkAuthGuard, RolesGuard)` +
  `@Roles('admin', 'moderator')`. It looks up the caller's `role` in our own
  `users` table (not Clerk) and throws 403 if it doesn't match. Guard order
  matters — an unauthenticated request never reaches the DB lookup.

### 5. Locale sync

```
LocaleProvider resolves locale  --isSignedIn && isReady-->  PATCH /me { locale }  --upsert-->  users.locale
```

- `LocaleProvider` (`apps/mobile/providers/LocaleProvider.tsx`) is the single
  source of truth for the app's active language (`en`/`si` — Tamil is a
  deliberately deferred product decision, not built yet). It persists an
  explicit user choice via `expo-secure-store`, falling back to the device
  locale (`expo-localization`, via `apps/mobile/lib/locale.ts`) only when
  nothing's been stored yet.
- `useSyncDeviceLocale()` (`apps/mobile/hooks/useSyncDeviceLocale.ts`,
  despite the now slightly stale name) pushes whatever `LocaleProvider`
  resolves to the backend whenever it changes and the user is signed in — it
  no longer re-detects the device locale itself, so it can't clobber an
  explicit switch made in the app's language settings screen
  (`apps/mobile/app/locale-settings.tsx`).
- `PATCH /me` upserts rather than assuming the webhook already created the
  row — it can legitimately run before the webhook has fired.

## Environment variables

| Variable                            | Where                     | Purpose                                                                                                                                                      |
| ----------------------------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `CLERK_SECRET_KEY`                  | `apps/api` (`.env`, root) | Verifying JWTs and calling Clerk's backend API                                                                                                               |
| `CLERK_WEBHOOK_SIGNING_SECRET`      | `apps/api` (`.env`, root) | Verifying webhook signatures (Svix)                                                                                                                          |
| `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` | `apps/mobile` (`.env`)    | Client-side Clerk SDK init — safe to expose                                                                                                                  |
| `EXPO_PUBLIC_API_URL`               | `apps/mobile` (`.env`)    | Where the app sends API requests. iOS simulator: `localhost` works; Android emulator needs `10.0.2.2`; a physical device needs the host's LAN IP or a tunnel |

Both `.env` files are gitignored; `.env.example` in each app is the tracked
template.

## Known limitations

- **Can't fabricate a real Clerk-issued JWT in a test/script.** Clerk signs
  session tokens with RS256 using a private key only Clerk holds — unlike
  the webhook signature (HMAC via a shared secret we do have), there's no
  way to mint a valid one locally. `ClerkAuthGuard` and `RolesGuard` are
  verified thoroughly on their negative paths (missing/garbage/malformed
  tokens, wrong role, unknown `clerk_id`) and on their own logic in
  isolation against real Postgres rows — but a full "real sign-in → real
  JWT → 200 response" round trip needs an actual interactive sign-in
  through the app.
- **No soft-delete policy on `user.deleted`.** The row is hard-deleted.
  Revisit once other tables have foreign keys into `users.id`.

## Local testing runbook

1. `pnpm docker:up` — Postgres, Redis, Typesense, MinIO
2. `pnpm --filter @ceylon-gems/api run db:migrate` — apply schema
3. `pnpm --filter @ceylon-gems/api run build && pnpm --filter @ceylon-gems/api run start`
4. `cloudflared tunnel --url http://localhost:3000` — for webhook testing only
5. Register/update the webhook endpoint in Clerk's dashboard if the tunnel URL changed
6. `pnpm --filter @ceylon-gems/mobile run start` — then sign in through the app to exercise the full chain for real
