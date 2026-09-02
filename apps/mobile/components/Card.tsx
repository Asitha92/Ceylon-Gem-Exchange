import { fontSize, neutral, radii, spacing } from '@ceylon-gems/ui-tokens'
import { type ReactNode } from 'react'
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native'
import { useFontFamily } from '../hooks/useFontFamily'
import { GlassSurface } from './primitives/GlassSurface'
import { PressableScale } from './primitives/PressableScale'

interface CardProps {
  onPress?: () => void
  /**
   * Required when `onPress` is set — `PressableScale` marks itself as a
   * single accessibility element, which silences the individual text nodes
   * inside `children` for screen readers, so the card's own label is the
   * only thing that gets announced otherwise.
   */
  accessibilityLabel?: string
  clarity?: number
  style?: StyleProp<ViewStyle>
  children: ReactNode
}

// Generic glass surface for grouped content — ad tiles, profile sections,
// settings groups. Non-interactive unless `onPress` is given, in which case
// it gets the shared press-scale feedback.
export function Card({ onPress, accessibilityLabel, clarity = 55, style, children }: CardProps) {
  if (onPress) {
    return (
      <PressableScale onPress={onPress} accessibilityLabel={accessibilityLabel}>
        <GlassSurface clarity={clarity} radius={radii.lg} style={[styles.card, style]}>
          {children}
        </GlassSurface>
      </PressableScale>
    )
  }

  return (
    <GlassSurface clarity={clarity} radius={radii.lg} style={[styles.card, style]}>
      {children}
    </GlassSurface>
  )
}

interface ListRowProps {
  title: string
  subtitle?: string
  leading?: ReactNode
  trailing?: ReactNode
  onPress?: () => void
  style?: StyleProp<ViewStyle>
}

// Single settings/menu row (Account Settings, My Ads, My Membership) — icon
// + title/subtitle + optional trailing control (chevron, Toggle, value).
export function ListRow({ title, subtitle, leading, trailing, onPress, style }: ListRowProps) {
  const fonts = useFontFamily()
  const content = (
    <View style={[styles.row, style]}>
      {leading}
      <View style={styles.rowText}>
        <Text style={[styles.rowTitle, { fontFamily: fonts.medium }]} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={[styles.rowSubtitle, { fontFamily: fonts.regular }]} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {trailing}
    </View>
  )

  if (!onPress) return content

  return (
    <PressableScale
      onPress={onPress}
      accessibilityLabel={subtitle ? `${title}, ${subtitle}` : title}
      scaleTo={0.99}
    >
      {content}
    </PressableScale>
  )
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  rowText: {
    flex: 1,
  },
  rowTitle: {
    fontSize: fontSize.base,
    color: neutral.white,
  },
  rowSubtitle: {
    fontSize: fontSize.sm,
    color: 'rgba(255,255,255,0.55)',
    marginTop: 2,
  },
})
