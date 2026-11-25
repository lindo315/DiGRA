import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import seed from './seed.json'
import { sectionOrder } from './schema'
import { splitEvents, sortNews } from './normalize'

const ContentContext = createContext(null)

// Content comes from the database (/api/content.php). If the API can't be
// reached (local development without PHP, or a database outage), the site
// falls back to the copy bundled at build time, so it is never blank.
async function loadContent() {
  const res = await fetch('/api/content.php', { headers: { Accept: 'application/json' }, cache: 'no-cache' })
  if (!res.ok) throw new Error('content ' + res.status)
  const data = await res.json()
  if (!data?.ok || !data.settings || !data.collections) throw new Error('bad content')
  return data
}

function build(raw, source) {
  const settings = { ...seed.settings, ...raw.settings }
  const c = raw.collections || {}
  const { events, upcoming, past } = splitEvents(c.events || [])
  return {
    source,
    settings,
    site: settings.site || {},
    nav: settings.nav || {},
    footer: settings.footer || {},
    team: c.team || [],
    events,
    upcomingEvents: upcoming,
    pastEvents: past,
    news: sortNews(c.news || []),
    researchAreas: c.research_areas || [],
    journals: c.journals || [],
    teaching: c.teaching || [],
  }
}

export function ContentProvider({ children }) {
  const [state, setState] = useState(null)

  useEffect(() => {
    let alive = true
    const fallback = setTimeout(() => alive && setState((s) => s || build(seed, 'bundled')), 6000)
    loadContent()
      .then((d) => alive && setState(build(d, 'live')))
      .catch(() => alive && setState(build(seed, 'bundled')))
      .finally(() => clearTimeout(fallback))
    return () => { alive = false; clearTimeout(fallback) }
  }, [])

  if (!state) {
    return (
      <div className="min-h-screen bg-deep-purple flex items-center justify-center" role="status" aria-live="polite">
        <span className="sr-only">Loading</span>
        <div className="flex gap-1.5" aria-hidden="true">
          {['#F5A623', '#00CFDD', '#E94560'].map((c, i) => (
            <span key={c} className="w-3 h-3 animate-pulse" style={{ background: c, animationDelay: `${i * 150}ms` }} />
          ))}
        </div>
      </div>
    )
  }
  return <ContentContext.Provider value={state}>{children}</ContentContext.Provider>
}

export function useContent() {
  return useContext(ContentContext)
}

/**
 * Text for one page. `p.hero`, `p.paths`, … are always objects (never undefined),
 * and `sections` lists the visible movable sections in the saved order.
 */
export function usePage(key) {
  const { settings } = useContent()
  return useMemo(() => {
    const raw = settings[key] || {}
    const fallback = seed.settings[key] || {}
    const p = new Proxy(raw, {
      get: (t, k) => (k in t && t[k] != null ? t[k] : fallback[k] ?? {}),
    })
    const sections = sectionOrder(key, raw._sections).filter((s) => s.show !== false).map((s) => s.key)
    return { p, sections }
  }, [settings, key])
}
