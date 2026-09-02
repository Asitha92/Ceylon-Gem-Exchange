import { neutral, radii, spacing, fontSize } from '@ceylon-gems/ui-tokens'
import { useRef, useState, type ReactNode } from 'react'
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
  Text,
  type NativeSyntheticEvent,
  type StyleProp,
  type TextInputKeyPressEventData,
  type TextInputProps,
  type ViewStyle,
} from 'react-native'
import { useFontFamily } from '../hooks/useFontFamily'
import { GlassSurface } from './primitives/GlassSurface'

interface TextFieldProps extends Pick<
  TextInputProps,
  | 'value'
  | 'onChangeText'
  | 'placeholder'
  | 'secureTextEntry'
  | 'keyboardType'
  | 'autoCapitalize'
  | 'editable'
  | 'multiline'
> {
  label?: string
  error?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  style?: StyleProp<ViewStyle>
}

// The glass text field used for every form across the mockups (email,
// password, name, ad title/description). Focus and error both shift the
// border color rather than changing layout, so the field never jumps.
export function TextField({
  label,
  error,
  leftIcon,
  rightIcon,
  style,
  multiline,
  ...inputProps
}: TextFieldProps) {
  const [focused, setFocused] = useState(false)
  const fonts = useFontFamily()

  const rim = error ? '255,140,125' : neutral.glassRim
  const borderOverride = error
    ? { borderColor: neutral.danger.border }
    : focused
      ? { borderColor: 'rgba(255,255,255,0.4)' }
      : null

  return (
    <View style={style}>
      {label ? <Text style={[styles.label, { fontFamily: fonts.medium }]}>{label}</Text> : null}
      <GlassSurface
        rim={rim}
        clarity={50}
        style={[styles.fieldSurface, multiline && styles.fieldSurfaceMultiline, borderOverride]}
      >
        {leftIcon}
        <TextInput
          {...inputProps}
          multiline={multiline}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholderTextColor="rgba(255,255,255,0.4)"
          accessibilityLabel={label}
          accessibilityHint={error}
          style={[styles.input, { fontFamily: fonts.regular }, multiline && styles.inputMultiline]}
        />
        {rightIcon}
      </GlassSurface>
      {error ? (
        <Text
          style={[styles.error, { fontFamily: fonts.regular }]}
          accessibilityRole="alert"
          accessibilityLiveRegion="polite"
        >
          {error}
        </Text>
      ) : null}
    </View>
  )
}

interface SearchBarProps {
  value: string
  onChangeText: (text: string) => void
  onClear?: () => void
  placeholder?: string
  /** Screen-reader label for the clear (✕) button — pass a translated string; defaults to English. */
  clearAccessibilityLabel?: string
  leftIcon?: ReactNode
  style?: StyleProp<ViewStyle>
}

// Full-pill search field (Home header, Saved Searches).
export function SearchBar({
  value,
  onChangeText,
  onClear,
  placeholder,
  clearAccessibilityLabel = 'Clear search',
  leftIcon,
  style,
}: SearchBarProps) {
  const fonts = useFontFamily()

  return (
    <GlassSurface radius={radii.full} clarity={50} style={[styles.searchSurface, style]}>
      {leftIcon}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="rgba(255,255,255,0.4)"
        accessibilityLabel={placeholder}
        style={[styles.input, { fontFamily: fonts.regular }]}
        returnKeyType="search"
      />
      {value.length > 0 && onClear ? (
        <Pressable
          onPress={onClear}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel={clearAccessibilityLabel}
        >
          <Text style={styles.searchClear}>✕</Text>
        </Pressable>
      ) : null}
    </GlassSurface>
  )
}

interface OtpInputProps {
  length?: number
  value: string
  onChangeText: (text: string) => void
  autoFocus?: boolean
}

// One glass cell per digit (Verification, Email Verification, Reset
// Password OTP screens). Value lives in the parent as a single string;
// this just splits/joins it and manages per-cell focus.
export function OtpInput({ length = 6, value, onChangeText, autoFocus }: OtpInputProps) {
  const fonts = useFontFamily()
  const inputs = useRef<Array<TextInput | null>>([])
  const digits = Array.from({ length }, (_, i) => value[i] ?? '')

  const setDigit = (index: number, char: string) => {
    const next = digits.slice()
    next[index] = char
    onChangeText(next.join('').slice(0, length))
    if (char && index < length - 1) {
      inputs.current[index + 1]?.focus()
    }
  }

  const handleKeyPress =
    (index: number) => (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
      if (e.nativeEvent.key === 'Backspace' && !digits[index] && index > 0) {
        inputs.current[index - 1]?.focus()
      }
    }

  return (
    <View style={styles.otpRow}>
      {digits.map((digit, index) => (
        <GlassSurface key={index} clarity={50} radius={radii.md} style={styles.otpCell}>
          <TextInput
            ref={(ref) => {
              inputs.current[index] = ref
            }}
            value={digit}
            onChangeText={(text) => setDigit(index, text.replace(/[^0-9]/g, '').slice(-1))}
            onKeyPress={handleKeyPress(index)}
            keyboardType="number-pad"
            maxLength={1}
            autoFocus={Boolean(autoFocus) && index === 0}
            accessibilityLabel={`Digit ${index + 1} of ${length}`}
            style={[styles.otpDigit, { fontFamily: fonts.semibold }]}
            textAlign="center"
          />
        </GlassSurface>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  label: {
    fontSize: fontSize.sm,
    color: 'rgba(255,255,255,0.75)',
    marginBottom: spacing.xs,
  },
  fieldSurface: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    minHeight: 52,
  },
  fieldSurfaceMultiline: {
    alignItems: 'flex-start',
    paddingVertical: spacing.md,
    minHeight: 120,
  },
  input: {
    flex: 1,
    fontSize: fontSize.base,
    color: neutral.white,
    paddingVertical: spacing.md,
  },
  inputMultiline: {
    paddingVertical: 0,
    textAlignVertical: 'top',
  },
  error: {
    fontSize: fontSize.xs,
    color: neutral.danger.text,
    marginTop: spacing.xs,
  },
  searchSurface: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    minHeight: 48,
  },
  searchClear: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: fontSize.sm,
    paddingHorizontal: spacing.xs,
  },
  otpRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  otpCell: {
    width: 48,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpDigit: {
    width: '100%',
    height: '100%',
    fontSize: fontSize.xl,
    color: neutral.white,
  },
})
