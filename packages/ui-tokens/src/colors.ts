// Source of truth: the 21-screen Claude Design mockup set (Sign In through
// Account Settings). Every screen defines the identical three "gem tone"
// palettes below via its own tone() method — that consistency is what makes
// these real tokens rather than one mockup's local choice.
//
// Each tone is a complete dark, glassmorphic theme named after the gemstone
// it evokes. There is no light-mode data here: Account Settings has a
// Light/Dark/System toggle stub, but no screen in the set actually renders
// light colors, so inventing them now would just be a guess.

export type GemTone = 'sapphire' | 'padparadscha' | 'emerald'

export interface GemTonePalette {
  /** Phone-screen background gradient, top -> mid -> bottom. */
  screen: readonly [string, string, string]
  /** Three ambient glow colors (as [r, g, b]), screen-position varies per layout. */
  glow: readonly [
    readonly [number, number, number],
    readonly [number, number, number],
    readonly [number, number, number],
  ]
  /** Primary accent — links, active icons, progress fills. */
  accent: string
  /** Icon stroke color legible against this tone's glass fill. */
  ink: string
  /** High-contrast color for a checkmark/icon drawn on top of a filled accent shape. */
  tickInk: string
  /** Gradient stops for primary CTAs and active/selected states — each needs an alpha suffix, e.g. `${cta[0]}0.9)`. */
  cta: readonly [string, string]
  /** RGB triple (comma-joined, no wrapper) for borders at variable opacity: `rgba(${rim},0.3)`. */
  rim: string
  /** RGB triple (comma-joined, no wrapper) for glow/shadow at variable opacity: `rgba(${halo},0.5)`. */
  halo: string
}

export const gemTones: Record<GemTone, GemTonePalette> = {
  sapphire: {
    screen: ['#0d1c3c', '#0a1430', '#060b1a'],
    glow: [
      [70, 150, 255],
      [0, 220, 200],
      [150, 110, 255],
    ],
    accent: '#6fd3ff',
    ink: '#bfe4ff',
    tickInk: '#04121f',
    cta: ['rgba(110,200,255,', 'rgba(40,110,235,'],
    rim: '190,230,255',
    halo: '50,130,255',
  },
  padparadscha: {
    screen: ['#3a1a18', '#2a1216', '#150a0d'],
    glow: [
      [255, 140, 90],
      [255, 90, 140],
      [255, 200, 120],
    ],
    accent: '#ffb08a',
    ink: '#ffd8c2',
    tickInk: '#2a0f0b',
    cta: ['rgba(255,168,120,', 'rgba(232,86,80,'],
    rim: '255,214,190',
    halo: '255,120,80',
  },
  emerald: {
    screen: ['#0d3229', '#0a241f', '#051312'],
    glow: [
      [40, 220, 170],
      [120, 255, 200],
      [30, 160, 200],
    ],
    accent: '#6fe8bd',
    ink: '#c2ffe6',
    tickInk: '#052018',
    cta: ['rgba(90,235,190,', 'rgba(20,150,130,'],
    rim: '190,255,230',
    halo: '30,190,150',
  },
} as const

export const defaultGemTone: GemTone = 'sapphire'

// Tone-independent constants — identical across all 21 screens regardless of
// which gemTone is active.
export const neutral = {
  white: '#ffffff',
  /** The dark-navy tint layered over the animated background, top -> mid -> bottom. */
  overlay: ['rgba(6,11,26,0.42)', 'rgba(6,11,26,0.55)', 'rgba(6,11,26,0.72)'] as const,

  // Semantic, not tone-driven — same everywhere regardless of gem tone.
  danger: {
    text: '#ff8f80',
    textStrong: '#ff9b90',
    surface: 'rgba(255,120,105,0.09)',
    surfaceStrong: 'rgba(255,120,105,0.14)',
    border: 'rgba(255,140,125,0.28)',
    ctaFrom: 'rgba(255,132,116,',
    ctaTo: 'rgba(214,58,52,',
  },
  warning: { text: '#ffc65c', textStrong: '#ffd27a' },
  error: { text: '#ff6b5c', textStrong: '#ff9b90' },

  /** Default (tone-independent) glass fill/border when a component doesn't need tinting. */
  glassFill: 'rgba(255,255,255,',
  glassRim: '255,255,255',
} as const

// White-on-dark text hierarchy — the whole UI is built on these opacity
// steps rather than distinct grey hex values.
export const textOpacity = {
  primary: 1,
  secondary: 0.85,
  tertiary: 0.6,
  muted: 0.45,
  faint: 0.32,
} as const
