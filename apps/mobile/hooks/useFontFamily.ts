import { fontFamilies, type SupportedLocale } from '@ceylon-gems/ui-tokens'

// Locale detection/switching lands in the next task (E0.3 #4). Every
// text-rendering component in the kit reads its font through this one hook
// so wiring in the real active locale later is a one-file change instead of
// touching every component that renders text.
export function useFontFamily() {
  const locale: SupportedLocale = 'en'
  return fontFamilies[locale]
}
