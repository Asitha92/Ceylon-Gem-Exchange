// Brand palette from the Confluence brand page and CLAUDE.md. Semantic
// "soft"/"muted" tones are derived from the five core brand colors, kept
// identical to the ones already used in the project's own artifacts so the
// app, docs, and any future artifacts read as one system.

export const colorsLight = {
  background: '#faf9f7',
  surface: '#ffffff',
  surfaceMuted: '#f3f0e9',

  ink: '#1b1c20',
  inkMuted: '#6b665a',
  border: '#e4dfd2',

  gold: '#a8852f',
  goldStrong: '#8a6c22',
  goldSoft: '#f1e6c9',

  green: '#1e7a54',
  greenSoft: '#dfefe6',

  red: '#b3402f',
  redSoft: '#f6e2dd',

  neutralSoft: '#eeece5',
} as const

export const colorsDark = {
  background: '#17171a',
  surface: '#1e1e21',
  surfaceMuted: '#242327',

  ink: '#f1eee6',
  inkMuted: '#a39d8d',
  border: '#3a3833',

  gold: '#d8b25c',
  goldStrong: '#e7c777',
  goldSoft: 'rgba(216,178,92,0.16)',

  green: '#5cb98a',
  greenSoft: 'rgba(92,185,138,0.14)',

  red: '#e08872',
  redSoft: 'rgba(224,136,114,0.14)',

  neutralSoft: '#2b2a2d',
} as const

export type ColorScheme = typeof colorsLight
export type ColorToken = keyof ColorScheme
