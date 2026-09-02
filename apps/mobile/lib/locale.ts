import { getLocales } from 'expo-localization'

// English + Sinhala only for now — Tamil is a deliberately deferred product
// decision (see CLAUDE.md), not an oversight. Don't add a `ta` entry here
// until that's explicitly picked back up.
export const SUPPORTED_LOCALES = ['en', 'si'] as const
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]

export const defaultLocale: SupportedLocale = 'en'

export function isSupportedLocale(value: string | null | undefined): value is SupportedLocale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value ?? '')
}

// Best-effort guess for a first launch with no stored preference yet — an
// explicit switch in the app always overrides this afterward.
export function detectDeviceLocale(): SupportedLocale {
  const code = getLocales()[0]?.languageCode
  return isSupportedLocale(code) ? code : defaultLocale
}
