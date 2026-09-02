import { dictionaries } from '@ceylon-gems/i18n'
import { useLocale } from '../providers/LocaleProvider'

// Returns the resolved dictionary for the active locale — access copy as
// `t.common.continue`, not a string-keyed lookup, so a typo or a key
// missing from one locale is a compile error instead of a runtime miss.
export function useTranslation() {
  const { locale } = useLocale()
  return dictionaries[locale]
}
