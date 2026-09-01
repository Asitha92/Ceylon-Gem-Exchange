import { StyleSheet, Text, View } from 'react-native'

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ceylon Gems</Text>
      <Text style={styles.subtitle}>The mechanism is running.</Text>
    </View>
  )
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
