import { type ReactNode } from 'react'
import { type AccessibilityState, type Insets, type StyleProp, type ViewStyle } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

interface PressableScaleProps {
  onPress?: () => void
  disabled?: boolean
  accessibilityLabel?: string
  accessibilityRole?: 'button' | 'tab' | 'switch' | 'checkbox'
  /** Merged with `{ disabled }` — pass `{ selected }` or `{ checked }` for tab/switch/checkbox roles so screen readers announce the current state, not just the label. */
  accessibilityState?: Omit<AccessibilityState, 'disabled'>
  /** Expands the touch target without changing visual size — use for anything smaller than the ~44pt platform minimum (icon buttons, chips). */
  hitSlop?: Insets | number
  style?: StyleProp<ViewStyle>
  children: ReactNode
  /** How far the scale shrinks on press. 1 = no visible feedback. */
  scaleTo?: number
}

// Shared press-scale interaction used by every interactive component in the
// kit. Runs on the UI thread via a worklet (per the RN skill's animation
// rules: GestureDetector + Reanimated, not Pressable's onPressIn/onPressOut
// JS-thread callbacks), and stores the press *state* (0 or 1), deriving the
// visual scale from it rather than storing the scale itself.
export function PressableScale({
  onPress,
  disabled = false,
  accessibilityLabel,
  accessibilityRole = 'button',
  accessibilityState,
  hitSlop,
  style,
  children,
  scaleTo = 0.96,
}: PressableScaleProps) {
  const pressed = useSharedValue(0)
  const reduceMotion = useReducedMotion()

  const tap = Gesture.Tap()
    .enabled(!disabled)
    .onBegin(() => {
      pressed.set(withTiming(1, { duration: reduceMotion ? 0 : 90 }))
    })
    .onFinalize(() => {
      pressed.set(withTiming(0, { duration: reduceMotion ? 0 : 160 }))
    })
    .onEnd(() => {
      if (onPress) runOnJS(onPress)()
    })

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(pressed.get(), [0, 1], [1, reduceMotion ? 1 : scaleTo]) }],
  }))

  return (
    <GestureDetector gesture={tap}>
      <Animated.View
        accessible
        accessibilityRole={accessibilityRole}
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ ...accessibilityState, disabled }}
        hitSlop={hitSlop}
        style={[style, animatedStyle, disabled && { opacity: 0.5 }]}
      >
        {children}
      </Animated.View>
    </GestureDetector>
  )
}
