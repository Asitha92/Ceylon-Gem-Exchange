import * as SecureStore from 'expo-secure-store'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { defaultLocale, isSupportedLocale, type Locale } from '@ceylon-gems/i18n'
import { detectDeviceLocale } from '../lib/locale'

const STORAGE_KEY = 'locale-preference'

interface LocaleContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  /** True until the stored preference (or the device fallback) has been read once. */
  isReady: boolean
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

// The single source of truth for the app's active language. Reused
// `expo-secure-store` for persistence rather than pulling in
// AsyncStorage for one small string — it's already a direct dependency
// (Clerk's token cache) and comfortably handles a value this size.
export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    let cancelled = false

    SecureStore.getItemAsync(STORAGE_KEY)
      .then((stored) => {
        if (cancelled) return
        setLocaleState(isSupportedLocale(stored) ? stored : detectDeviceLocale())
      })
      .finally(() => {
        if (!cancelled) setIsReady(true)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    void SecureStore.setItemAsync(STORAGE_KEY, next)
  }, [])

  const value = useMemo(() => ({ locale, setLocale, isReady }), [locale, setLocale, isReady])

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  const context = useContext(LocaleContext)
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider')
  }
  return context
}
