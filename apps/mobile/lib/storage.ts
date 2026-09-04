import * as SecureStore from 'expo-secure-store'
import { Platform } from 'react-native'

// This project's tsconfig deliberately excludes the DOM lib (mixing it
// with React Native's own globals is a well-known source of type
// collisions), so `localStorage` isn't declared — narrow ambient shape for
// just this file rather than pulling in the whole DOM lib.
declare const localStorage: {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}

// expo-secure-store has no functioning web implementation (SDK 57) — it
// throws "ExpoSecureStore.default.getValueWithKeyAsync is not a function"
// at runtime on web, uncaught, since Keychain/Keystore-style encrypted
// storage doesn't meaningfully exist there anyway. `localStorage` is the
// right web equivalent for small, non-sensitive values like a locale
// preference — real secrets (Clerk's token cache) are a separate concern
// or not needed on web to begin with.
export async function getItem(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    return localStorage.getItem(key)
  }
  return SecureStore.getItemAsync(key)
}

export async function setItem(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    localStorage.setItem(key, value)
    return
  }
  await SecureStore.setItemAsync(key, value)
}
