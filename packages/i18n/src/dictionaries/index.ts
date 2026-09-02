import type { Locale } from '../locale'
import { en, type Dictionary } from './en'
import { si } from './si'

export const dictionaries: Record<Locale, Dictionary> = { en, si }

export { en, si }
export type { Dictionary } from './en'
