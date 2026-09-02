export interface Country {
  name: string
  dial: string
  flag: string
  /** Local-format example shown as the phone field's placeholder. */
  hint: string
}

// Matches the Signup design's country picker exactly — Sri Lanka first as
// the default (this is a Sri Lankan gem marketplace), then the buyer/dealer
// markets the mockup calls out.
export const countries: Country[] = [
  { name: 'Sri Lanka', dial: '+94', flag: '🇱🇰', hint: '71 234 5678' },
  { name: 'India', dial: '+91', flag: '🇮🇳', hint: '98765 43210' },
  { name: 'Thailand', dial: '+66', flag: '🇹🇭', hint: '81 234 5678' },
  { name: 'Singapore', dial: '+65', flag: '🇸🇬', hint: '8123 4567' },
  { name: 'United Arab Emirates', dial: '+971', flag: '🇦🇪', hint: '50 123 4567' },
  { name: 'Hong Kong', dial: '+852', flag: '🇭🇰', hint: '5123 4567' },
  { name: 'United Kingdom', dial: '+44', flag: '🇬🇧', hint: '7400 123456' },
  { name: 'United States', dial: '+1', flag: '🇺🇸', hint: '212 555 0184' },
  { name: 'Switzerland', dial: '+41', flag: '🇨🇭', hint: '78 123 45 67' },
  { name: 'Japan', dial: '+81', flag: '🇯🇵', hint: '90 1234 5678' },
  { name: 'Australia', dial: '+61', flag: '🇦🇺', hint: '412 345 678' },
  { name: 'Germany', dial: '+49', flag: '🇩🇪', hint: '1512 3456789' },
]

export const defaultCountryIndex = 0
