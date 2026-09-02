import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { StyleSheet, Text, View } from 'react-native'

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ceylon Gems</Text>
      <SignedOut>
        <Text style={styles.subtitle}>Not signed in.</Text>
      </SignedOut>
      <SignedIn>
        <SignedInGreeting />
      </SignedIn>
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
    gap: 8,
    backgroundColor: '#faf9f7',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#1b1c20',
  },
  subtitle: {
    color: '#6b665a',
  },
})
