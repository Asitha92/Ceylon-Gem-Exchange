import { defaultGemTone, gemTones, neutral, type GemTone } from '@ceylon-gems/ui-tokens'
import { LinearGradient } from 'expo-linear-gradient'
import { useEffect, type ReactNode } from 'react'
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native'
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg'

interface GlowBlobProps {
  /** [r, g, b] */
  color: readonly [number, number, number]
  size: number
  /** Center position as a fraction of the container, 0–1. */
  top: number
  left: number
  /** Seconds for one drift cycle — deliberately different per blob so they don't move in lockstep. */
  duration: number
}

// One soft radial "glow" circle, slowly drifting and breathing. Reanimated
// drives a wrapping View's transform (GPU-friendly, per the RN skill) rather
// than animating the SVG gradient itself.
function GlowBlob({ color, size, top, left, duration }: GlowBlobProps) {
  const drift = useSharedValue(0)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (reduceMotion) return
    drift.set(withRepeat(withTiming(1, { duration, easing: Easing.inOut(Easing.sin) }), -1, true))
  }, [drift, duration, reduceMotion])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: (drift.get() - 0.5) * size * 0.3 },
      { translateY: (drift.get() - 0.5) * size * 0.22 },
      { scale: 1 + drift.get() * 0.12 },
    ],
  }))

  const [r, g, b] = color
  const rgb = `${r},${g},${b}`

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: 'absolute',
          top: `${top * 100}%`,
          left: `${left * 100}%`,
          width: size,
          height: size,
          marginTop: -size / 2,
          marginLeft: -size / 2,
        },
        animatedStyle,
      ]}
    >
      <Svg width={size} height={size}>
        <Defs>
          <RadialGradient id="glow" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={`rgb(${rgb})`} stopOpacity={0.4} />
            <Stop offset="100%" stopColor={`rgb(${rgb})`} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect width={size} height={size} fill="url(#glow)" />
      </Svg>
    </Animated.View>
  )
}

interface LiveGradientBackgroundProps {
  tone?: GemTone
  children?: ReactNode
  style?: StyleProp<ViewStyle>
}

// The screen-level animated background behind every glass surface — a
// 3-stop base gradient (tone.screen) plus three soft radial glow blobs
// (tone.glow) drifting slowly, topped with the same dark overlay gradient
// every screen uses to keep foreground content legible.
//
// This approximates the original web design's WebGL simplex-noise shader
// (moving color blend + film grain) rather than porting it: a true port
// needs react-native-skia's SkSL runtime effects, which requires a custom
// dev client instead of Expo Go — deliberately deferred. Grain specifically
// isn't reproduced at all here (no noise texture asset, and SVG's
// feTurbulence isn't reliably supported cross-platform in react-native-svg)
// — only the moving-gradient half of "living gradient" is real.
export function LiveGradientBackground({
  tone = defaultGemTone,
  children,
  style,
}: LiveGradientBackgroundProps) {
  const palette = gemTones[tone]
  const [glowA, glowB, glowC] = palette.glow

  return (
    <View style={[styles.fill, style]}>
      <LinearGradient
        colors={[palette.screen[0], palette.screen[1], palette.screen[2]]}
        locations={[0, 0.55, 1]}
        style={StyleSheet.absoluteFill}
      />
      <View style={StyleSheet.absoluteFill}>
        <GlowBlob color={glowA} size={420} top={0.06} left={0.82} duration={14000} />
        <GlowBlob color={glowB} size={380} top={0.42} left={0} duration={17000} />
        <GlowBlob color={glowC} size={460} top={1.04} left={0.55} duration={20000} />
      </View>
      <LinearGradient
        colors={neutral.overlay}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
    overflow: 'hidden',
  },
})
