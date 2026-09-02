import { ClerkProvider } from '@clerk/expo'
import { tokenCache } from '@clerk/expo/token-cache'
import { defaultGemTone, gemTones, neutral } from '@ceylon-gems/ui-tokens'
import { Stack } from 'expo-router'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useFontFamily } from '../hooks/useFontFamily'
import { useSyncDeviceLocale } from '../hooks/useSyncDeviceLocale'
import { useTranslation } from '../hooks/useTranslation'
import { LocaleProvider } from '../providers/LocaleProvider'

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!

if (!publishableKey) {
  throw new Error('Add your Clerk Publishable Key to the .env file')
}

const tone = gemTones[defaultGemTone]

// Native stack (expo-router's default, backed by react-native-screens) —
// not a bare Slot — so a real screen like locale-settings gets an actual
// native header + back gesture, per the RN skill's navigation rules.
// Needs to live inside both ClerkProvider (useAuth) and LocaleProvider
// (useLocale) subtrees.
function AppLayout() {
  useSyncDeviceLocale()
  const fonts = useFontFamily()
  const t = useTranslation()

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerStyle: { backgroundColor: tone.screen[1] },
        headerTintColor: neutral.white,
        headerTitleStyle: { fontFamily: fonts.semibold },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: tone.screen[1] },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen
        name="locale-settings"
        options={{ headerShown: true, title: t.localeSettings.title }}
      />
    </Stack>
  )
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LocaleProvider>
        <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
          <AppLayout />
        </ClerkProvider>
      </LocaleProvider>
    </GestureHandlerRootView>
  )
}
