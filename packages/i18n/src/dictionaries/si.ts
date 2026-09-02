import type { Dictionary } from './en'

// Typed as the full `Dictionary`, not `Partial` — a key added to `en.ts`
// without a matching entry here fails `tsc`, so the dictionaries can never
// silently drift apart.
export const si: Dictionary = {
  common: {
    continue: 'ඉදිරියට',
    cancel: 'අවලංගු කරන්න',
    save: 'සුරකින්න',
    delete: 'මකන්න',
    notNow: 'දැන් නොවේ',
    search: 'සොයන්න',
  },
}
