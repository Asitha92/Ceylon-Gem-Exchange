import { defaultGemTone, gemTones, spacing } from '@ceylon-gems/ui-tokens'
import { ScrollView, StyleSheet, View } from 'react-native'
import { Card, ListRow, SegmentedControl } from '../components'
import { useTranslation } from '../hooks/useTranslation'
import { useLocale } from '../providers/LocaleProvider'

const tone = gemTones[defaultGemTone]

// UC-2 (switch language): a real, reachable settings screen, not the
// kitchen-sink demo — `setLocale` persists through LocaleProvider, so the
// choice survives app restarts. Only Language is interactive here; Currency
// and Location are shown as read-only info until those features actually
// exist, rather than wiring up controls that don't do anything yet.
export default function LocaleSettingsScreen() {
  const t = useTranslation()
  const { locale, setLocale } = useLocale()

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.languageCard}>
          <ListRow title={t.localeSettings.language} />
          <SegmentedControl
            options={[
              { label: 'English', value: 'en' },
              { label: 'සිංහල', value: 'si' },
            ]}
            value={locale}
            onChange={setLocale}
          />
        </Card>

        <Card>
          <ListRow title={t.localeSettings.currency} subtitle="LKR" />
          <ListRow title={t.localeSettings.location} subtitle="Sri Lanka" />
        </Card>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tone.screen[1],
  },
  content: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  languageCard: {
    gap: spacing.md,
  },
})
