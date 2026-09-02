import Svg, { Circle, Path, Rect } from 'react-native-svg'

interface IconProps {
  size?: number
  color?: string
  strokeWidth?: number
}

// Ported directly from the Claude Design mockups' inline SVGs (exact path
// data), not swapped for a generic icon library — the brief is pixel
// fidelity to the provided designs, and a different icon set (even a good
// one) would read as a different stroke weight/style throughout the app.

export function PersonIcon({ size = 17, color = '#fff', strokeWidth = 1.7 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Circle cx="10" cy="6.5" r="3.2" stroke={color} strokeWidth={strokeWidth} />
      <Path
        d="M3.8 17c.6-3.2 3.1-4.8 6.2-4.8s5.6 1.6 6.2 4.8"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </Svg>
  )
}

export function MailIcon({ size = 17, color = '#fff', strokeWidth = 1.7 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Rect
        x="2.5"
        y="5"
        width="15"
        height="10"
        rx="2.2"
        stroke={color}
        strokeWidth={strokeWidth}
      />
      <Path d="M3 6l7 5 7-5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  )
}

export function LockIcon({ size = 17, color = '#fff', strokeWidth = 1.7 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Rect
        x="3.5"
        y="8.5"
        width="13"
        height="9"
        rx="2.5"
        stroke={color}
        strokeWidth={strokeWidth}
      />
      <Path
        d="M6.75 8.5V6a3.25 3.25 0 0 1 6.5 0v2.5"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </Svg>
  )
}

interface EyeIconProps extends IconProps {
  /** true = password currently shown (renders with a slash through the eye). */
  revealed?: boolean
}

export function EyeIcon({
  size = 18,
  color = 'rgba(255,255,255,0.55)',
  strokeWidth = 1.7,
  revealed,
}: EyeIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <Path
        d="M1.5 11S5 4.5 11 4.5 20.5 11 20.5 11 17 17.5 11 17.5 1.5 11 1.5 11z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <Circle cx="11" cy="11" r="2.8" stroke={color} strokeWidth={strokeWidth} />
      {revealed ? (
        <Path d="M3 19 19 3" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      ) : null}
    </Svg>
  )
}

export function ChevronDownIcon({
  size = 10,
  color = 'rgba(255,255,255,0.6)',
  strokeWidth = 1.6,
}: IconProps) {
  const height = size * 0.7
  return (
    <Svg width={size} height={height} viewBox="0 0 10 7" fill="none">
      <Path
        d="M1 1.5 5 5.5l4-4"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export function ArrowRightIcon({ size = 17, color = '#fff', strokeWidth = 2 }: IconProps) {
  const height = (size / 18) * 14
  return (
    <Svg width={size} height={height} viewBox="0 0 18 14" fill="none">
      <Path
        d="M1 7h15m-5.5-5.5L16.5 7l-5.5 5.5"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export function CheckIcon({ size = 11, color = '#04121f', strokeWidth = 2.2 }: IconProps) {
  const height = (size / 12) * 10
  return (
    <Svg width={size} height={height} viewBox="0 0 12 10" fill="none">
      <Path
        d="M1 5l3.2 3.2L11 1.4"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export function CloseIcon({
  size = 12,
  color = 'rgba(255,255,255,0.8)',
  strokeWidth = 1.8,
}: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 12 12" fill="none">
      <Path
        d="M1 1l10 10M11 1L1 11"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </Svg>
  )
}

export function SearchIcon({
  size = 16,
  color = 'rgba(255,255,255,0.55)',
  strokeWidth = 1.8,
}: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Circle cx="8.5" cy="8.5" r="6" stroke={color} strokeWidth={strokeWidth} />
      <Path d="M13.5 13.5 18 18" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  )
}

interface GemIconProps {
  size?: number
  ink?: string
  inkSoft?: string
  strokeWidth?: number
}

// The brand mark shown in every screen's header row.
export function GemIcon({
  size = 20,
  ink = '#fff',
  inkSoft = 'rgba(255,255,255,0.75)',
  strokeWidth = 1.7,
}: GemIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M7 3h10l4 6-9 12L3 9z"
        stroke={ink}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      <Path d="M3 9h18M9.5 9 12 21 14.5 9" stroke={inkSoft} strokeWidth={strokeWidth * 0.7} />
    </Svg>
  )
}
