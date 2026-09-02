import { neutral, radii } from '@ceylon-gems/ui-tokens'
import { BlurView } from 'expo-blur'
import { type ReactNode } from 'react'
import {
  StyleSheet,
  View,
  type AccessibilityRole,
  type StyleProp,
  type ViewStyle,
} from 'react-native'

interface GlassSurfaceProps {
  /**
   * 0 (milky, low clarity) to 100 (near-invisible, high clarity) — the same
   * `glassClarity` control every .dc.html mockup exposes. Defaults to the
   * mid value used across most cards/sheets in the design.
   */
  clarity?: number
  /**
   * RGB triple string (e.g. `gemTones.sapphire.rim`) tinting the border and
   * top highlight. Defaults to a tone-neutral white, matching the design's
   * untinted glass surfaces (cards, sheets, inputs).
   */
  rim?: string
  /** Corner radius shared by the blur, tint, and border layers — pass a `radii` token, not the outer `style`. */
  radius?: number
  /** e.g. "tablist" when this surface is the track for a SegmentedControl/SegmentedTabs group. */
  accessibilityRole?: AccessibilityRole
  style?: StyleProp<ViewStyle>
  children?: ReactNode
}

// The web mockups build "glass" from `backdrop-filter: blur() saturate()` +
// a translucent fill + a border that's brighter on top (an inset highlight
// faking light catching the top edge). React Native has no backdrop-filter,
// so this reassembles the same read from three native-friendly layers:
// BlurView (the actual blur), a translucent tint View on top of it, and a
// border whose top edge is overridden to a brighter rgba than the rest.
// Saturation boost has no RN equivalent and is dropped.
export function GlassSurface({
  clarity = 55,
  rim = neutral.glassRim,
  radius = radii.md,
  accessibilityRole,
  style,
  children,
}: GlassSurfaceProps) {
  const c = Math.max(0, Math.min(100, clarity)) / 100
  const fillAlpha = 0.14 - c * 0.11
  const rimAlpha = 0.1 + c * 0.22
  const sheenAlpha = 0.16 + c * 0.3
  const intensity = Math.round(20 + c * 60)

  return (
    <View
      accessibilityRole={accessibilityRole}
      style={[styles.clip, { borderRadius: radius }, style]}
    >
      <BlurView intensity={intensity} tint="dark" style={StyleSheet.absoluteFill} />
      <View
        pointerEvents="none"
        style={[
          styles.tint,
          {
            borderRadius: radius,
            backgroundColor: `rgba(255,255,255,${fillAlpha})`,
            borderColor: `rgba(${rim},${rimAlpha})`,
            borderTopColor: `rgba(255,255,255,${sheenAlpha})`,
          },
        ]}
      />
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  clip: {
    overflow: 'hidden',
  },
  tint: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 1,
  },
})
