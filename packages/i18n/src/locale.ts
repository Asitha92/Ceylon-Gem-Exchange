// English + Sinhala only for now — Tamil is a deliberately deferred product
// decision (see CLAUDE.md), not an oversight. Don't add a `ta` entry here
// until that's explicitly picked back up.
export const SUPPORTED_LOCALES = ['en', 'si'] as const
export type Locale = (typeof SUPPORTED_LOCALES)[number]

export const defaultLocale: Locale = 'en'

export function isSupportedLocale(value: string | null | undefined): value is Locale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value ?? '')
}
