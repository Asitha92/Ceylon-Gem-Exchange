// Family names match what task 2 (font embedding via the expo-font config
// plugin) registers them as. Display faces carry the brand's serif
// character; UI faces stay legible at small sizes. Sinhala/Tamil get their
// own serif display face per the functional spec's UC-2 note ("serif
// Sinhala/Tamil display fonts preserve elegance").

export const fontFamilies = {
  display: {
    en: {
      regular: 'CormorantGaramond-Medium',
      semibold: 'CormorantGaramond-SemiBold',
      bold: 'CormorantGaramond-Bold',
    },
    si: {
      regular: 'NotoSerifSinhala-Medium',
      semibold: 'NotoSerifSinhala-SemiBold',
      bold: 'NotoSerifSinhala-Bold',
    },
    ta: {
      regular: 'NotoSerifTamil-Medium',
      semibold: 'NotoSerifTamil-SemiBold',
      bold: 'NotoSerifTamil-Bold',
    },
  },
  ui: {
    en: {
      regular: 'AlbertSans-Regular',
      medium: 'AlbertSans-Medium',
      semibold: 'AlbertSans-SemiBold',
      bold: 'AlbertSans-Bold',
    },
    si: {
      regular: 'NotoSansSinhala-Regular',
      medium: 'NotoSansSinhala-Medium',
      semibold: 'NotoSansSinhala-SemiBold',
      bold: 'NotoSansSinhala-Bold',
    },
    ta: {
      regular: 'NotoSansTamil-Regular',
      medium: 'NotoSansTamil-Medium',
      semibold: 'NotoSansTamil-SemiBold',
      bold: 'NotoSansTamil-Bold',
    },
  },
} as const

export type AppLocale = 'en' | 'si' | 'ta'

// A modest scale for mobile — not a generic default, sized for a listing
// marketplace where prices, titles, and captions need clear rhythm without
// many distinct sizes (per the RN skill: vary weight/color over size count).
export const fontSize = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 22,
  '2xl': 28,
  '3xl': 34,
} as const

export const lineHeight = {
  xs: 16,
  sm: 20,
  base: 24,
  lg: 26,
  xl: 30,
  '2xl': 36,
  '3xl': 42,
} as const

export type FontSizeToken = keyof typeof fontSize
