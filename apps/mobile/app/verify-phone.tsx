import { useSignUp } from '@clerk/expo'
import { defaultGemTone, fontSize, gemTones, spacing } from '@ceylon-gems/ui-tokens'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button, GhostButton, IconButton, OtpInput } from '../components'
import { LiveGradientBackground } from '../components/primitives/LiveGradientBackground'
import { useFontFamily } from '../hooks/useFontFamily'
import { useTranslation } from '../hooks/useTranslation'

const tone = gemTones[defaultGemTone]

// Placeholder screen — no design has been provided for phone verification
// yet, unlike Sign Up. Built with the same component kit and tone so it
// doesn't look out of place in the flow; replace with the real design
// when it's available. Reached from /sign-up after signUp.password()
// leaves the sign-up in a "needs phone verification" state.
export default function VerifyPhoneScreen() {
  const t = useTranslation()
  const fonts = useFontFamily()
  const router = useRouter()
  const { signUp } = useSignUp()

  const [code, setCode] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [resending, setResending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleVerify() {
    if (submitting || code.length < 6) return
    setSubmitting(true)
    setError(null)
    try {
      const { error: verifyError } = await signUp.verifications.verifyPhoneCode({ code })
      if (verifyError) {
        setError(verifyError.longMessage ?? 'Invalid code. Please try again.')
        return
      }
      if (signUp.status === 'complete') {
        await signUp.finalize()
        router.replace('/')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleResend() {
    if (resending) return
    setResending(true)
    setError(null)
    try {
      await signUp.verifications.sendPhoneCode()
    } catch {
      setError('Could not resend the code. Please try again.')
    } finally {
      setResending(false)
    }
  }

  return (
    <LiveGradientBackground>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={styles.backRow}>
          <IconButton
            icon={<Text style={styles.backGlyph}>←</Text>}
            accessibilityLabel={t.common.back}
            onPress={() => router.back()}
          />
        </View>
        <View style={styles.content}>
          <Text style={[styles.heading, { fontFamily: fonts.extrabold }]}>
            {t.auth.verifyPhone.title}
          </Text>
          <Text style={[styles.subtitle, { fontFamily: fonts.regular }]}>
            {t.auth.verifyPhone.subtitle}
          </Text>
          {signUp.phoneNumber ? (
            <Text style={[styles.phone, { fontFamily: fonts.medium }]}>
              {t.auth.verifyPhone.codeSentTo} {signUp.phoneNumber}
            </Text>
          ) : null}

          <OtpInput length={6} value={code} onChangeText={setCode} autoFocus />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Button
            label={t.auth.verifyPhone.submit}
            onPress={handleVerify}
            loading={submitting}
            disabled={code.length < 6}
            style={styles.submitButton}
          />

          <GhostButton
            label={t.auth.verifyPhone.resendCode}
            onPress={handleResend}
            disabled={resending}
            style={styles.resendButton}
          />
        </View>
      </SafeAreaView>
    </LiveGradientBackground>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  backRow: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
  },
  backGlyph: {
    color: '#fff',
    fontSize: fontSize.lg,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.lg,
  },
  heading: {
    fontSize: fontSize['2xl'],
    color: '#fff',
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: 'rgba(255,255,255,0.65)',
    marginTop: -spacing.md,
  },
  phone: {
    fontSize: fontSize.sm,
    color: tone.accent,
    marginTop: -spacing.md,
  },
  error: {
    fontSize: fontSize.sm,
    color: '#ff9b90',
  },
  submitButton: {
    marginTop: spacing.sm,
  },
  resendButton: {},
})
