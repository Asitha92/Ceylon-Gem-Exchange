import { useAuth } from '@clerk/expo'
import { getLocales } from 'expo-localization'
import { useEffect } from 'react'

const SUPPORTED_LOCALES = ['en', 'si', 'ta'] as const
type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]

function detectSupportedLocale(): SupportedLocale {
  const code = getLocales()[0]?.languageCode
  return (SUPPORTED_LOCALES as readonly string[]).includes(code ?? '')
    ? (code as SupportedLocale)
    : 'en'
}

// Pushes the device's locale to the backend once per sign-in, as a sensible
// default ahead of the real language switcher (E0.3) — that switcher's
// explicit user choice should always win over this on future syncs.
export function useSyncDeviceLocale() {
  const { isSignedIn, getToken } = useAuth()

  useEffect(() => {
    if (!isSignedIn) return

    let cancelled = false

    async function sync() {
      const token = await getToken()
      if (!token || cancelled) return

      await fetch(`${process.env.EXPO_PUBLIC_API_URL}/me`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ locale: detectSupportedLocale() }),
      }).catch(() => {
        // Best-effort — a failed sync just means the default stays as-is
        // until the next sign-in.
      })
    }

    void sync()

    return () => {
      cancelled = true
    }
  }, [isSignedIn, getToken])
}
