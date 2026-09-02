import { defaultGemTone, gemTones, type GemTone } from '@ceylon-gems/ui-tokens'
import { useEffect } from 'react'
import { StyleSheet } from 'react-native'
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { PressableScale } from './primitives/PressableScale'

interface ToggleProps {
  value: boolean
  onValueChange: (value: boolean) => void
  disabled?: boolean
  tone?: GemTone
  accessibilityLabel: string
}

// The pill switch used on Account Settings / Notifications rows. Track
// color and thumb position both animate on the UI thread; the thumb is a
// plain white circle rather than glass since it's small enough that a real
// blur would be imperceptible and not worth a second BlurView per row.
export function Toggle({
  value,
  onValueChange,
  disabled,
  tone = defaultGemTone,
  accessibilityLabel,
}: ToggleProps) {
  const palette = gemTones[tone]
  const progress = useSharedValue(value ? 1 : 0)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    progress.set(withTiming(value ? 1 : 0, { duration: reduceMotion ? 0 : 160 }))
  }, [value, progress, reduceMotion])

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.get(),
      [0, 1],
      ['rgba(255,255,255,0.16)', `${palette.cta[1]}0.9)`],
    ),
  }))

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.get() * 20 }],
  }))

  return (
    <PressableScale
      onPress={() => onValueChange(!value)}
      disabled={disabled}
      accessibilityRole="switch"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ checked: value }}
      scaleTo={0.98}
    >
      <Animated.View style={[styles.track, trackStyle]}>
        <Animated.View style={[styles.thumb, thumbStyle]} />
      </Animated.View>
    </PressableScale>
  )
}

const styles = StyleSheet.create({
  track: {
    width: 48,
    height: 28,
    borderRadius: 14,
    padding: 2,
    justifyContent: 'center',
  },
  thumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ffffff',
  },
})
