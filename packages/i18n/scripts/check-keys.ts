import { en } from '../src/dictionaries/en'
import { si } from '../src/dictionaries/si'

// Belt-and-braces alongside the `si: Dictionary` exact-match typing in
// si.ts: that already fails `tsc` on a missing/extra key, but this gives a
// dedicated, readable CI failure naming the exact dot-path — and keeps
// working even if the dictionary typing is ever loosened (e.g. to
// `Partial<Dictionary>`) for pragmatic reasons down the line.
function leafPaths(value: unknown, prefix = ''): string[] {
  if (typeof value !== 'object' || value === null) {
    return [prefix]
  }
  return Object.entries(value).flatMap(([key, nested]) =>
    leafPaths(nested, prefix ? `${prefix}.${key}` : key),
  )
}

const enPaths = new Set(leafPaths(en))
const siPaths = new Set(leafPaths(si))

const missingFromSi = [...enPaths].filter((path) => !siPaths.has(path)).sort()
const extraInSi = [...siPaths].filter((path) => !enPaths.has(path)).sort()

if (missingFromSi.length === 0 && extraInSi.length === 0) {
  console.error(`✓ ${enPaths.size} translation keys match between en and si`)
  process.exit(0)
}

if (missingFromSi.length > 0) {
  console.error(`Missing from si.ts (${missingFromSi.length}):`)
  for (const path of missingFromSi) console.error(`  - ${path}`)
}

if (extraInSi.length > 0) {
  console.error(`In si.ts but not en.ts (${extraInSi.length}):`)
  for (const path of extraInSi) console.error(`  - ${path}`)
}

process.exit(1)
