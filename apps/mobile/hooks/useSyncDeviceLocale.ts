import { useAuth } from '@clerk/expo'
import { useEffect } from 'react'
import { useLocale } from '../providers/LocaleProvider'

// Pushes the app's active locale (the user's stored preference, or the
// device-detected fallback if they haven't picked one) to the backend
// whenever it changes and the user is signed in. LocaleProvider is the
// source of truth — an explicit switch there always wins, this just keeps
// the backend in sync with it.
export function useSyncDeviceLocale() {
  const { isSignedIn, getToken } = useAuth()
  const { locale, isReady } = useLocale()

  useEffect(() => {
    if (!isSignedIn || !isReady) return

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
        body: JSON.stringify({ locale }),
      }).catch(() => {
        // Best-effort — a failed sync just means the backend stays on the
        // previous value until the next change or sign-in.
      })
    }

    void sync()

    return () => {
      cancelled = true
    }
  }, [isSignedIn, isReady, locale, getToken])
}
