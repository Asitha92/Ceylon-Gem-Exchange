import {
  defaultGemTone,
  fontSize,
  gemTones,
  neutral,
  radii,
  spacing,
  type GemTone,
} from '@ceylon-gems/ui-tokens'
import { LinearGradient } from 'expo-linear-gradient'
import { type ReactNode } from 'react'
import { Platform, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native'
import { useFontFamily } from '../hooks/useFontFamily'
import { GlassSurface } from './primitives/GlassSurface'
import { PressableScale } from './primitives/PressableScale'

interface ButtonProps {
  label: string
  onPress?: () => void
  disabled?: boolean
  loading?: boolean
  tone?: GemTone
  /** Uses the semantic danger gradient instead of the gem tone — delete/remove actions. */
  danger?: boolean
  icon?: ReactNode
  style?: StyleProp<ViewStyle>
}

// Primary CTA — the full-width gradient pill used for "Sign in", "Post ad",
// "Save changes" etc. across every mockup. The colored glow shadow only
// renders on iOS (Android's `elevation` has no color channel); Android gets
// a plain dark elevation shadow instead, a real platform limitation.
export function Button({
  label,
  onPress,
  disabled,
  loading,
  tone = defaultGemTone,
  danger,
  icon,
  style,
}: ButtonProps) {
  const palette = gemTones[tone]
  const fonts = useFontFamily()
  const isDisabled = disabled || loading
  const gradient: readonly [string, string] = danger
    ? [neutral.danger.ctaFrom, neutral.danger.ctaTo]
    : palette.cta
  const glowRgb = danger ? '214,58,52' : palette.halo

  return (
    <PressableScale
      onPress={onPress}
      disabled={isDisabled}
      accessibilityLabel={label}
      accessibilityState={{ busy: loading }}
      style={style}
    >
      <LinearGradient
        colors={[`${gradient[0]}0.92)`, `${gradient[1]}0.92)`]}
        style={[
          styles.pill,
          Platform.select({
            ios: {
              shadowColor: `rgba(${glowRgb},0.45)`,
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 1,
              shadowRadius: 14,
            },
            android: { elevation: 4 },
          }),
        ]}
      >
        {icon}
        <Text
          style={[styles.label, { fontFamily: fonts.semibold, color: neutral.white }]}
          numberOfLines={1}
        >
          {loading ? '…' : label}
        </Text>
      </LinearGradient>
    </PressableScale>
  )
}

interface GhostButtonProps {
  label: string
  onPress?: () => void
  disabled?: boolean
  icon?: ReactNode
  style?: StyleProp<ViewStyle>
}

// Secondary action — plain glass fill, no gradient. Used for "Cancel",
// "Not now", filter-sheet secondary actions.
export function GhostButton({ label, onPress, disabled, icon, style }: GhostButtonProps) {
  const fonts = useFontFamily()
  return (
    <PressableScale onPress={onPress} disabled={disabled} accessibilityLabel={label} style={style}>
      <GlassSurface radius={radii.full} clarity={45} style={styles.pill}>
        {icon}
        <Text
          style={[styles.label, { fontFamily: fonts.medium, color: neutral.white }]}
          numberOfLines={1}
        >
          {label}
        </Text>
      </GlassSurface>
    </PressableScale>
  )
}

interface IconButtonProps {
  icon: ReactNode
  onPress?: () => void
  active?: boolean
  disabled?: boolean
  tone?: GemTone
  accessibilityLabel: string
  style?: StyleProp<ViewStyle>
}

// Circular glass button for icon-only actions (back arrow, search, heart,
// notification bell). `active` swaps the flat glass fill for the tone's CTA
// gradient — the "filled" state used for e.g. a saved/favorited heart.
export function IconButton({
  icon,
  onPress,
  active,
  disabled,
  tone = defaultGemTone,
  accessibilityLabel,
  style,
}: IconButtonProps) {
  const palette = gemTones[tone]
  // Only announce a selected state when `active` is meaningfully a toggle
  // (e.g. a favorite heart) — most IconButton uses are plain one-shot
  // actions (back, search) with no on/off state to report.
  const toggleState = active === undefined ? undefined : { selected: active }

  if (active) {
    return (
      <PressableScale
        onPress={onPress}
        disabled={disabled}
        accessibilityLabel={accessibilityLabel}
        accessibilityState={toggleState}
        hitSlop={6}
        style={style}
      >
        <LinearGradient
          colors={[`${palette.cta[0]}0.9)`, `${palette.cta[1]}0.9)`]}
          style={styles.iconCircle}
        >
          {icon}
        </LinearGradient>
      </PressableScale>
    )
  }

  return (
    <PressableScale
      onPress={onPress}
      disabled={disabled}
      accessibilityLabel={accessibilityLabel}
      accessibilityState={toggleState}
      hitSlop={6}
      style={style}
    >
      <GlassSurface radius={radii.full} clarity={55} style={styles.iconCircle}>
        {icon}
      </GlassSurface>
    </PressableScale>
  )
}

interface SegmentOption<T extends string> {
  label: string
  value: T
}

interface SegmentedControlProps<T extends string> {
  options: SegmentOption<T>[]
  value: T
  onChange: (value: T) => void
  tone?: GemTone
  style?: StyleProp<ViewStyle>
}

// The pill-track multi-way toggle used for e.g. Buy/Rent, Grid/List,
// currency selection. Track is a flat glass surface; the active segment
// gets the tone's CTA gradient.
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  tone = defaultGemTone,
  style,
}: SegmentedControlProps<T>) {
  const palette = gemTones[tone]
  const fonts = useFontFamily()

  return (
    <GlassSurface
      radius={radii.full}
      clarity={45}
      accessibilityRole="tablist"
      style={[styles.segmentTrack, style]}
    >
      {options.map((option) => {
        const isActive = option.value === value
        return (
          <PressableScale
            key={option.value}
            onPress={() => onChange(option.value)}
            accessibilityRole="tab"
            accessibilityLabel={option.label}
            accessibilityState={{ selected: isActive }}
            style={styles.segmentItemWrapper}
          >
            {isActive ? (
              <LinearGradient
                colors={[`${palette.cta[0]}0.9)`, `${palette.cta[1]}0.9)`]}
                style={styles.segmentItem}
              >
                <Text
                  style={[
                    styles.segmentLabel,
                    { fontFamily: fonts.semibold, color: neutral.white },
                  ]}
                  numberOfLines={1}
                >
                  {option.label}
                </Text>
              </LinearGradient>
            ) : (
              <View style={styles.segmentItem}>
                <Text
                  style={[
                    styles.segmentLabel,
                    { fontFamily: fonts.medium, color: 'rgba(255,255,255,0.6)' },
                  ]}
                  numberOfLines={1}
                >
                  {option.label}
                </Text>
              </View>
            )}
          </PressableScale>
        )
      })}
    </GlassSurface>
  )
}

interface ChipProps {
  label: string
  selected?: boolean
  onPress?: () => void
  tone?: GemTone
  style?: StyleProp<ViewStyle>
}

// Small selectable pill for filters/tags (category chips on Post Ad,
// search-filter chips on Saved Searches).
export function Chip({ label, selected, onPress, tone = defaultGemTone, style }: ChipProps) {
  const palette = gemTones[tone]
  const fonts = useFontFamily()

  if (selected) {
    return (
      <PressableScale
        onPress={onPress}
        accessibilityRole="checkbox"
        accessibilityLabel={label}
        accessibilityState={{ checked: true }}
        hitSlop={6}
        style={style}
      >
        <LinearGradient
          colors={[`${palette.cta[0]}0.9)`, `${palette.cta[1]}0.9)`]}
          style={styles.chip}
        >
          <Text style={[styles.chipLabel, { fontFamily: fonts.medium, color: neutral.white }]}>
            {label}
          </Text>
        </LinearGradient>
      </PressableScale>
    )
  }

  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="checkbox"
      accessibilityLabel={label}
      accessibilityState={{ checked: false }}
      hitSlop={6}
      style={style}
    >
      <GlassSurface radius={radii.full} clarity={55} style={styles.chip}>
        <Text
          style={[styles.chipLabel, { fontFamily: fonts.medium, color: 'rgba(255,255,255,0.75)' }]}
        >
          {label}
        </Text>
      </GlassSurface>
    </PressableScale>
  )
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radii.full,
  },
  label: {
    fontSize: fontSize.base,
  },
  iconCircle: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentTrack: {
    flexDirection: 'row',
    padding: 4,
  },
  segmentItemWrapper: {
    flex: 1,
  },
  segmentItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    borderRadius: radii.full,
  },
  segmentLabel: {
    fontSize: fontSize.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  chipLabel: {
    fontSize: fontSize.sm,
  },
})
