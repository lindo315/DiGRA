// Turns raw saved content into the shapes the page components use.

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const LONG_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

function parts(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '')
  return m ? { y: +m[1], m: +m[2] - 1, d: +m[3] } : null
}

/** "2026-12-03" → "3 December 2026" */
export function longDate(iso) {
  const p = parts(iso)
  return p ? `${p.d} ${LONG_MONTHS[p.m]} ${p.y}` : ''
}

/** Start/end → "3–8 December 2026", "30 Nov – 2 Dec 2026", "2 June 2026" */
export function dateRange(start, end) {
  const a = parts(start)
  const b = parts(end)
  if (!a) return ''
  if (!b || start === end) return longDate(start)
  if (a.y === b.y && a.m === b.m) return `${a.d}–${b.d} ${LONG_MONTHS[a.m]} ${a.y}`
  if (a.y === b.y) return `${a.d} ${MONTHS[a.m]} – ${b.d} ${MONTHS[b.m]} ${a.y}`
  return `${longDate(start)} – ${longDate(end)}`
}

export function today() {
  const d = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function normalizeEvent(e, now = today()) {
  const p = parts(e.start_date)
  const last = e.end_date || e.start_date
  let status = e.status === 'upcoming' || e.status === 'past' ? e.status : 'upcoming'
  if (last && (e.status === 'auto' || !e.status)) status = last < now ? 'past' : 'upcoming'
  return {
    ...e,
    status,
    date: e.date_label || dateRange(e.start_date, e.end_date) || 'Date TBA',
    day: p ? String(p.d).padStart(2, '0') : '',
    month: p ? MONTHS[p.m] : 'TBA',
    startDate: e.start_date,
    endDate: e.end_date,
    locationUrl: e.location_url,
    newsSlug: e.news_slug,
    links: (e.links || []).filter((l) => l && l.url),
  }
}

export function splitEvents(list) {
  const events = list.map((e) => normalizeEvent(e))
  const upcoming = events
    .filter((e) => e.status === 'upcoming')
    .sort((a, b) => (a.start_date || '9999').localeCompare(b.start_date || '9999'))
  const past = events
    .filter((e) => e.status === 'past')
    .sort((a, b) => (b.start_date || '').localeCompare(a.start_date || ''))
  return { events, upcoming, past }
}

export function normalizeNews(n) {
  return {
    ...n,
    date: n.date_label || longDate(n.publish_date),
    imageAlt: n.image_alt,
    body: Array.isArray(n.body) ? n.body : [],
  }
}

export function sortNews(list) {
  // Newest first by date; stories without a date keep their admin order at the end.
  return list
    .map((n, i) => ({ n: normalizeNews(n), i }))
    .sort((a, b) => {
      const da = a.n.publish_date || ''
      const db = b.n.publish_date || ''
      if (da && db && da !== db) return db.localeCompare(da)
      if (da && !db) return -1
      if (!da && db) return 1
      return a.i - b.i
    })
    .map((x) => x.n)
}
