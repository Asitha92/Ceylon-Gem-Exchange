# Component kit

`apps/mobile/components/` — app-local, not a shared package. There's a
single current consumer (the mobile app), so the same reasoning behind
keeping native dependencies in the app rather than a shared package
(autolinking only scans the app's own `node_modules`) applies to the styling
layer too: no `packages/ui-components` until there's a second real consumer.

Every component reads color from `@ceylon-gems/ui-tokens`
([design tokens](./design-tokens.md)) and font from
`apps/mobile/hooks/useFontFamily.ts`, which resolves the active locale via
`LocaleProvider` — components never hardcode `en`.

```ts
import { Button, Card, ListRow /* ... */ } from '../components'
```

## The two primitives

Everything else in the kit is built on these.

### `PressableScale`

The shared press interaction — `Gesture.Tap` (react-native-gesture-handler)
driving a Reanimated scale-down, not `Pressable`'s JS-thread
`onPressIn`/`onPressOut` (per the RN skill's animation rules). Also the
single place accessibility semantics for every interactive component get
applied.

```ts
interface PressableScaleProps {
  onPress?: () => void
  disabled?: boolean
  accessibilityLabel?: string
  accessibilityRole?: 'button' | 'tab' | 'switch' | 'checkbox'
  accessibilityState?: Omit<AccessibilityState, 'disabled'> // merged with { disabled }
  hitSlop?: Insets | number
  style?: StyleProp<ViewStyle>
  children: ReactNode
  scaleTo?: number // default 0.96; 1 = no visible feedback
}
```

- Respects the system's reduced-motion setting (`useReducedMotion()` from
  Reanimated) — the scale animation's duration drops to 0 when it's on,
  rather than ignoring the preference.
- Sets `accessible` on its wrapping view, which means **the individual text
  nodes of whatever you nest inside it are silenced for screen readers** —
  only the container's own `accessibilityLabel` gets announced. Anything
  built on `PressableScale` with rich children (see `ListRow`, `Card`) has
  to fold that content into `accessibilityLabel` itself; watch for the same
  trap in any new component.
- Pass `accessibilityState={{ selected }}` or `{{ checked }}` for
  tab/switch/checkbox roles — the label alone doesn't tell a screen reader
  which option is currently active.

**Requires `GestureHandlerRootView` wrapping the app root** (already set up
in `apps/mobile/app/_layout.tsx`) — without it, every component built on
this primitive (i.e. nearly the whole kit) throws
`GestureDetector must be used as a descendant of GestureHandlerRootView` at
render time. This is easy to miss because `tsc`/`eslint`/`expo export` all
stay clean without it — only an actual run surfaces the crash.

### `GlassSurface`

Reassembles the mockups' CSS `backdrop-filter: blur() saturate()`
glassmorphism from three RN-native layers, since React Native has no
backdrop-filter: `expo-blur`'s `BlurView` (the actual blur) + a translucent
tint `View` on top + a border whose top edge is overridden to a brighter
rgba (faking the mockups' inset light-catching highlight). Saturation boost
has no RN equivalent and is dropped.

```ts
interface GlassSurfaceProps {
  clarity?: number // 0 (milky) – 100 (near-invisible); default 55
  rim?: string // RGB triple, e.g. gemTones.sapphire.rim; default neutral.glassRim (untinted)
  radius?: number // shared by blur/tint/border layers — pass a radii token, not the outer style
  accessibilityRole?: AccessibilityRole // e.g. "tablist" for a SegmentedControl/BottomNavBar track
  style?: StyleProp<ViewStyle>
  children?: ReactNode
}
```

Always set corner rounding via the `radius` prop, not the outer `style` —
the blur and tint layers need the same radius to clip correctly, and `style`
alone only rounds the outer container.

## Buttons (`Button.tsx`)

| Component          | Purpose                                                                                                                                                                                                                                                                                                                                         |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Button`           | Primary CTA — full-width gradient pill (Sign in, Post ad, Save changes). Colored glow shadow on iOS only (Android's `elevation` has no color channel — a real platform limitation, not an oversight). `danger` swaps the tone gradient for the semantic danger one (delete/remove actions).                                                     |
| `GhostButton`      | Secondary action — flat glass fill, no gradient (Cancel, Not now).                                                                                                                                                                                                                                                                              |
| `IconButton`       | Circular glass button for icon-only actions, 48×48pt + 6pt hitSlop. `active` swaps the flat glass fill for the tone's CTA gradient (a filled/favorited state) and reports `accessibilityState.selected` — only when `active` is explicitly passed, since most `IconButton`s are one-shot actions (back, search) with no on/off state to report. |
| `SegmentedControl` | Pill-track multi-way value picker (Buy/Rent, currency). Wrapping surface is `accessibilityRole="tablist"`; each segment is `"tab"` with `accessibilityState.selected`.                                                                                                                                                                          |
| `Chip`             | Small selectable pill for filters/tags. `accessibilityRole="checkbox"` + `accessibilityState.checked`; 6pt hitSlop since its visual size is deliberately small.                                                                                                                                                                                 |

```tsx
<Button label={t.common.continue} onPress={submit} />
<Button label={t.deleteAccount.confirmButton} danger onPress={confirmDelete} />
<IconButton icon={<HeartIcon />} active={isFavorited} accessibilityLabel="Favorite" onPress={toggleFavorite} />
<SegmentedControl
  options={[{ label: 'English', value: 'en' }, { label: 'සිංහල', value: 'si' }]}
  value={locale}
  onChange={setLocale}
/>
```

## Inputs (`Input.tsx`)

| Component   | Purpose                                                                                                                                                                                                                                                                                                                                                                                            |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `TextField` | Glass text field used across every form (email, password, ad title/description). Focus and error both shift the border color, never layout, so the field doesn't jump. `label` and `error` are associated with the underlying `TextInput` via `accessibilityLabel`/`accessibilityHint`; the error text itself is `accessibilityRole="alert"` with a live region so it's announced when it appears. |
| `SearchBar` | Full-pill search field (Home header, Saved Searches). The clear (✕) button's screen-reader label is a prop (`clearAccessibilityLabel`, English default) — pass the translated string from a screen rather than relying on the default.                                                                                                                                                             |
| `OtpInput`  | One glass cell per digit (phone/email verification). Value lives in the parent as a single string; manages per-cell focus and backspace-to-previous-cell internally. Each cell is labeled `"Digit N of length"` for screen readers.                                                                                                                                                                |

```tsx
<TextField label={t.auth.signIn.emailLabel} placeholder="you@example.com" value={email} onChangeText={setEmail} error={emailError} />
<SearchBar value={query} onChangeText={setQuery} onClear={() => setQuery('')} placeholder={t.home.searchPlaceholder} clearAccessibilityLabel="Clear search" />
<OtpInput length={6} value={code} onChangeText={setCode} autoFocus />
```

## `Toggle`

The pill switch used on Account Settings / Notifications rows.
`accessibilityState.checked` reflects `value`; track color and thumb
position animate on the UI thread, snapping instantly under reduced motion.
The thumb is a plain white circle, not glass — small enough that a real
blur would be imperceptible and not worth a second `BlurView` per row.

```tsx
<Toggle
  value={notificationsEnabled}
  onValueChange={setNotificationsEnabled}
  accessibilityLabel={t.accountSettings.notifications}
/>
```

## Cards (`Card.tsx`)

| Component | Purpose                                                                                                                                                                                                                                     |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Card`    | Generic glass surface for grouped content. Non-interactive unless `onPress` is given; pass `accessibilityLabel` when it is, since `PressableScale`'s wrapper otherwise silences whatever rich content is inside.                            |
| `ListRow` | Single settings/menu row — leading icon + title/subtitle + optional trailing control (chevron, `Toggle`, value). Its accessibility label folds `subtitle` into `title` (`"Notifications, Push alerts for new offers"`) for the same reason. |

```tsx
<Card>
  <ListRow title={t.accountSettings.notifications} subtitle="Push alerts for new offers" trailing={<Toggle ... />} />
  <ListRow title={t.profile.myAds} subtitle="3 active listings" onPress={() => router.push('/my-ads')} />
</Card>
```

## `Badge`

Small status pill (Verified, Sold, membership tier). Flat tinted fill, no
blur and no press state — badges aren't interactive anywhere in the
mockups. `variant`: `accent` (default) | `success` | `warning` | `danger` |
`neutral`.

```tsx
<Badge label="Verified" />
<Badge label="Sold" variant="danger" />
```

## Modals (`Modal.tsx`)

| Component       | Purpose                                                                                                                                                                                                                   |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `BottomSheet`   | Native `<Modal>` + slide animation (no custom gesture-driven JS sheet) for filter panels, share sheets, pickers. Tapping the dimmed backdrop closes it; its label is a prop (`closeAccessibilityLabel`, English default). |
| `ConfirmDialog` | Centered confirmation (delete account, discard changes, log out). `destructive` routes the confirm button through `Button`'s `danger` gradient.                                                                           |

Both set `accessibilityViewIsModal` so VoiceOver doesn't navigate into
whatever's behind them while open (a documented, safe no-op on Android,
which has no exact equivalent concept).

```tsx
<ConfirmDialog
  visible={confirmVisible}
  title={t.deleteAccount.title}
  message={t.deleteAccount.warning}
  confirmLabel={t.deleteAccount.confirmButton}
  cancelLabel={t.common.cancel}
  destructive
  onConfirm={handleDelete}
  onCancel={() => setConfirmVisible(false)}
/>
```

## Tabs (`Tabs.tsx`)

| Component       | Purpose                                                                                                                                                                                                                                                                    |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SegmentedTabs` | Page-level section tabs (Listing Detail's Details/Seller, Profile's Ads/Reviews) — an underline indicator under plain text. Not the same as `Button.tsx`'s `SegmentedControl`, which is a filled pill for choosing a _value_ (e.g. a filter), not switching page sections. |
| `BottomNavBar`  | Fixed bottom tab bar (Home/Search/Post/Saved/Profile) — one glass surface spanning the bar, active item's icon+label tinted with the tone accent.                                                                                                                          |

Both wrap their items in `accessibilityRole="tablist"` with per-item
`"tab"` + `accessibilityState.selected`.

```tsx
<SegmentedTabs tabs={[{ label: 'Details', value: 'details' }, { label: 'Seller', value: 'seller' }]} value={tab} onChange={setTab} />
<BottomNavBar items={navItems} value={activeTab} onChange={setActiveTab} />
```

## `Avatar`

Profile photo (headers, list rows, Profile screen), falling back to a glass
circle with initials when there's no photo. `accessibilityLabel` (e.g. a
seller's name) is optional and meaningful: when given, the avatar is
announced as an image with that label; when omitted, it's hidden from
screen readers entirely (`importantForAccessibility="no-hide-descendants"`)
rather than announcing bare initials or "image" with no context — the
common case where a `ListRow`'s own title already identifies the person.

```tsx
<Avatar uri={seller.photoUrl} initials="AS" badge="verified" accessibilityLabel={seller.name} />
```

## Progress (`ProgressMeter.tsx`)

| Component     | Purpose                                                                                                                                        |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `ProgressBar` | Linear fill bar (profile-completion meter, upload progress). `accessibilityRole="progressbar"` + `accessibilityValue`.                         |
| `StepMeter`   | Discrete step dots (Signup's multi-step flow, Post Ad's wizard). Same progressbar semantics, plus an auto-generated `"Step N of total"` label. |

```tsx
<ProgressBar progress={0.6} />
<StepMeter totalSteps={4} currentStep={1} />
```

## Known limitations

- **No exhaustive contrast audit.** See [design tokens](./design-tokens.md#known-limitation) — glass surfaces' real contrast depends on whatever renders behind them.
- **Verified on iOS Simulator only**, via `expo start --ios` + screenshots, not a physical device or Android emulator. `expo start` also rewrites `apps/mobile/tsconfig.json` and deletes `apps/mobile/expo-env.d.ts` as a side effect of regenerating typed routes — `git checkout` those two files after any verification run, before committing.
- **VoiceOver/TalkBack walkthroughs weren't performed end-to-end** — the accessibility work (roles, states, labels, reduced motion, hit targets) is verified by code review and a visual on-device check, not a recorded screen-reader pass.
