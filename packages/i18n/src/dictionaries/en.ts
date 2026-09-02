// The dictionary's shape — every locale (including this one) is typed
// against this explicitly, rather than derived via `typeof en`, so a
// translation's string content doesn't get pinned to English's literal
// values. `si.ts` (and any future locale) implementing this interface means
// adding a key here without a matching entry there is a compile error, not
// a silently missing string.
//
// Namespaced by screen/feature, mirroring the 21-screen Claude Design
// corpus; `common` holds copy shared across screens (button labels, generic
// confirmations) rather than being tied to one of them.
//
// Full per-screen copy is seeded in a follow-up task — this is deliberately
// a small, real slice (enough to prove the dictionary end to end) rather
// than placeholder text for every screen.
export interface Dictionary {
  common: {
    continue: string
    cancel: string
    save: string
    delete: string
    notNow: string
    search: string
  }
}

export const en: Dictionary = {
  common: {
    continue: 'Continue',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    notNow: 'Not now',
    search: 'Search',
  },
}
