// 4px-based scale, named rather than numerically indexed so it reads clearly
// at the call site (spacing.md vs spacing[4]).
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 64,
} as const

export type SpacingToken = keyof typeof spacing
