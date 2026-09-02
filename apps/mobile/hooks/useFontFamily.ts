import { fontFamilies } from '@ceylon-gems/ui-tokens'
import { useLocale } from '../providers/LocaleProvider'

// Every text-rendering component in the kit reads its font through this one
// hook, so it's the only place that needs to know the active locale lives
// in LocaleProvider.
export function useFontFamily() {
  const { locale } = useLocale()
  return fontFamilies[locale]
}
