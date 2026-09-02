import { Show, useUser } from '@clerk/expo'
import {
  defaultGemTone,
  fontFamilies,
  fontSize,
  gemTones,
  neutral,
  spacing,
} from '@ceylon-gems/ui-tokens'
import { StyleSheet, Text, View } from 'react-native'

const tone = gemTones[defaultGemTone]

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
    // Flat mid-stop as a placeholder — the real gradient + ambient glow
    // background is a task 3 component (GlassSurface / screen background),
    // not something to hand-roll here.
    backgroundColor: tone.screen[1],
  },
  title: {
    fontSize: fontSize['2xl'],
    fontFamily: fontFamilies.en.semibold,
    color: neutral.white,
  },
  subtitle: {
    fontFamily: fontFamilies.en.regular,
    color: `rgba(255,255,255,0.6)`,
  },
})
