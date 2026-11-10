// Shared colour tokens.
//
// Accent colours are bright and read well on the dark purple surfaces.
// On white/tinted surfaces they fail WCAG AA, so text there must use the
// matching "ink" shade via ink(). Fills, borders and icons can keep the
// bright accent.

export const ACCENTS = {
  gold: '#F5A623',
  red: '#E94560',
  cyan: '#00CFDD',
  green: '#3DE87A',
  orange: '#FF6B35',
  violet: '#B45FFF',
}

// AA-compliant (≥ 5:1 on white and #F5F0FF) text shades of each accent.
const INK = {
  '#F5A623': '#8D5A06',
  '#E94560': '#BC1632',
  '#00CFDD': '#006F77',
  '#3DE87A': '#0E7633',
  '#FF6B35': '#B73100',
  '#B45FFF': '#7B2CC7',
}

/** Darker text shade of an accent, for use on light backgrounds. */
export function ink(hex) {
  return INK[(hex || '').toUpperCase()] || hex
}

// Lighter shades for the two accents that fall below AA on mid-purple panels.
const ON_DARK = {
  '#E94560': '#FF7A90',
  '#B45FFF': '#C98CFF',
}

/** Accent shade that stays readable as text on any of the purple surfaces. */
export function onDark(hex) {
  return ON_DARK[(hex || '').toUpperCase()] || hex
}

export const EVENT_TYPE_COLOURS = {
  Symposium: ACCENTS.gold,
  Workshop: ACCENTS.green,
  'Founding Workshop': ACCENTS.gold,
  Seminar: ACCENTS.cyan,
  Conference: ACCENTS.violet,
  Talk: ACCENTS.red,
  Panel: ACCENTS.violet,
  Webinar: ACCENTS.cyan,
  'Game Jam': ACCENTS.gold,
  'Launch Event': ACCENTS.orange,
  'Industry Event': ACCENTS.green,
}

export const NEWS_CATEGORY_COLOURS = {
  Announcement: ACCENTS.gold,
  Event: ACCENTS.green,
  Community: ACCENTS.cyan,
  Research: ACCENTS.violet,
}
