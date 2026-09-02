import { defaultLocale, isSupportedLocale, type Locale } from '@ceylon-gems/i18n'
import { getLocales } from 'expo-localization'

// Best-effort guess for a first launch with no stored preference yet — an
// explicit switch in the app always overrides this afterward. Device-locale
// detection is Expo-specific (unlike the rest of `@ceylon-gems/i18n`, which
// is platform-agnostic for eventual reuse on web), so it stays app-local.
export function detectDeviceLocale(): Locale {
  const code = getLocales()[0]?.languageCode
  return isSupportedLocale(code) ? code : defaultLocale
}
