import { Show, useUser } from '@clerk/expo'
import { colorsLight, fontFamilies, fontSize, spacing } from '@ceylon-gems/ui-tokens'
import { StyleSheet, Text, View } from 'react-native'

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ceylon Gems</Text>
      <Show when="signed-in" fallback={<Text style={styles.subtitle}>Not signed in.</Text>}>
        <SignedInGreeting />
      </Show>
    </View>
  )
}

function SignedInGreeting() {
  const { user } = useUser()
  const name = user?.primaryEmailAddress?.emailAddress ?? user?.primaryPhoneNumber?.phoneNumber
  return <Text style={styles.subtitle}>Signed in{name ? ` as ${name}` : ''}.</Text>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colorsLight.background,
  },
  title: {
    fontSize: fontSize['2xl'],
    fontFamily: fontFamilies.en.semibold,
    color: colorsLight.ink,
  },
  subtitle: {
    fontFamily: fontFamilies.en.regular,
    color: colorsLight.inkMuted,
  },
})
