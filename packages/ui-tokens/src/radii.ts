export const radii = {
  sm: 6, // chips, badges
  md: 10, // cards, inputs, buttons
  lg: 16, // modals, sheets
  full: 999, // pills, avatars
} as const

export type RadiusToken = keyof typeof radii
