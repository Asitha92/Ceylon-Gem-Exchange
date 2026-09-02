import { type ReactNode } from 'react'
import { type StyleProp, type ViewStyle } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

interface PressableScaleProps {
  onPress?: () => void
  disabled?: boolean
  accessibilityLabel?: string
  accessibilityRole?: 'button' | 'tab' | 'switch' | 'checkbox'
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
  style,
  children,
  scaleTo = 0.96,
}: PressableScaleProps) {
  const pressed = useSharedValue(0)

  const tap = Gesture.Tap()
    .enabled(!disabled)
    .onBegin(() => {
      pressed.set(withTiming(1, { duration: 90 }))
    })
    .onFinalize(() => {
      pressed.set(withTiming(0, { duration: 160 }))
    })
    .onEnd(() => {
      if (onPress) runOnJS(onPress)()
    })

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(pressed.get(), [0, 1], [1, scaleTo]) }],
  }))

  return (
    <GestureDetector gesture={tap}>
      <Animated.View
        accessible
        accessibilityRole={accessibilityRole}
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ disabled }}
        style={[style, animatedStyle, disabled && { opacity: 0.5 }]}
      >
        {children}
      </Animated.View>
    </GestureDetector>
  )
}
