import {
  defaultGemTone,
  fontSize,
  gemTones,
  neutral,
  radii,
  spacing,
  type GemTone,
} from '@ceylon-gems/ui-tokens'
import { type ReactNode } from 'react'
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native'
import { useFontFamily } from '../hooks/useFontFamily'
import { GlassSurface } from './primitives/GlassSurface'
import { PressableScale } from './primitives/PressableScale'

interface TabItem<T extends string> {
  label: string
  value: T
}

interface SegmentedTabsProps<T extends string> {
  tabs: TabItem<T>[]
  value: T
  onChange: (value: T) => void
  tone?: GemTone
  style?: StyleProp<ViewStyle>
}

// Page-level section tabs (Listing Detail's Details/Seller/Reviews,
// Profile's Ads/Reviews) — an underline indicator under plain text, not a
// filled pill like Button.tsx's SegmentedControl (that one is for choosing
// a value like a filter; this one is for switching page sections).
export function SegmentedTabs<T extends string>({
  tabs,
  value,
  onChange,
  tone = defaultGemTone,
  style,
}: SegmentedTabsProps<T>) {
  const palette = gemTones[tone]
  const fonts = useFontFamily()

  return (
    <View style={[styles.tabsRow, style]}>
      {tabs.map((tab) => {
        const isActive = tab.value === value
        return (
          <PressableScale
            key={tab.value}
            onPress={() => onChange(tab.value)}
            accessibilityRole="tab"
            accessibilityLabel={tab.label}
            style={styles.tabItem}
            scaleTo={0.98}
          >
            <Text
              style={[
                styles.tabLabel,
                {
                  fontFamily: isActive ? fonts.semibold : fonts.medium,
                  color: isActive ? neutral.white : 'rgba(255,255,255,0.5)',
                },
              ]}
            >
              {tab.label}
            </Text>
            <View style={[styles.tabIndicator, isActive && { backgroundColor: palette.accent }]} />
          </PressableScale>
        )
      })}
    </View>
  )
}

interface NavItem<T extends string> {
  value: T
  label: string
  icon: (active: boolean) => ReactNode
}

interface BottomNavBarProps<T extends string> {
  items: NavItem<T>[]
  value: T
  onChange: (value: T) => void
  tone?: GemTone
}

// Fixed bottom tab bar (Home/Search/Post/Saved/Profile). A single glass
// surface spanning the bar, active item's icon+label tinted with the tone
// accent — no per-item pill fill in the mockups, just a color shift.
export function BottomNavBar<T extends string>({
  items,
  value,
  onChange,
  tone = defaultGemTone,
}: BottomNavBarProps<T>) {
  const palette = gemTones[tone]
  const fonts = useFontFamily()

  return (
    <GlassSurface clarity={35} radius={radii.lg} style={styles.navBar}>
      {items.map((item) => {
        const isActive = item.value === value
        const color = isActive ? palette.accent : 'rgba(255,255,255,0.5)'
        return (
          <PressableScale
            key={item.value}
            onPress={() => onChange(item.value)}
            accessibilityRole="tab"
            accessibilityLabel={item.label}
            style={styles.navItem}
          >
            {item.icon(isActive)}
            <Text style={[styles.navLabel, { fontFamily: fonts.medium, color }]}>{item.label}</Text>
          </PressableScale>
        )
      })}
    </GlassSurface>
  )
}

const styles = StyleSheet.create({
  tabsRow: {
    flexDirection: 'row',
    gap: spacing.xl,
  },
  tabItem: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  tabLabel: {
    fontSize: fontSize.sm,
  },
  tabIndicator: {
    height: 2,
    width: '100%',
    borderRadius: 1,
    backgroundColor: 'transparent',
  },
  navBar: {
    flexDirection: 'row',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
    paddingVertical: spacing.xs,
  },
  navLabel: {
    fontSize: fontSize.xs,
  },
})
