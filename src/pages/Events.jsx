import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiCalendar, FiMapPin, FiExternalLink, FiChevronDown, FiChevronUp } from 'react-icons/fi'
import PageHero from '../components/PageHero'
import PixelDivider from '../components/PixelDivider'
import SectionWrapper from '../components/SectionWrapper'
import EventCard from '../components/cards/EventCard'
import CtaBanner from '../components/CtaBanner'
import Heading from '../components/Heading'
import { useContent, usePage } from '../content/ContentContext'
import { ACCENTS, EVENT_TYPE_COLOURS, accent, onDark } from '../lib/theme'
import { Paras, SmartLink, safeUrl } from '../lib/text'
import usePageTitle from '../lib/usePageTitle'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }
const FORMAT_COLOURS = ['#F5A623', '#3DE87A', '#00CFDD', '#B45FFF', '#E94560', '#FF6B35']

function FeaturedEventCard({ event, label, moreLabel }) {
  const colour = EVENT_TYPE_COLOURS[event.type] || ACCENTS.gold
  const text = onDark(colour)
  const dateLabel = event.date && event.date !== 'TBA' ? event.date.trim() : 'Date TBA'

  return (
    <motion.article
      className="relative overflow-hidden bg-deep-purple p-6 sm:p-10 mb-8"
      style={{ borderLeft: `5px solid ${colour}` }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background pixel accent */}
      <div
        className="absolute top-0 right-0 w-56 h-56 opacity-[0.08] pointer-events-none"
        aria-hidden="true"
        style={{
          background: `repeating-linear-gradient(45deg, ${colour} 0, ${colour} 2px, transparent 0, transparent 50%)`,
          backgroundSize: '8px 8px',
        }}
      />

      <div className="relative flex items-center gap-3 mb-5 flex-wrap">
        <span
          className="font-rajdhani font-bold text-sm uppercase tracking-[2px] px-2 py-0.5"
          style={{ background: `${colour}22`, color: text, border: `1px solid ${colour}40` }}
        >
          {label || '◆ Featured'}
        </span>
        <span
          className="font-rajdhani font-bold text-sm uppercase tracking-[2px] px-2 py-0.5"
          style={{ background: `${colour}14`, color: text }}
        >
          {event.type}
        </span>
      </div>

      <h3 className="relative font-rajdhani font-bold text-white text-[28px] sm:text-4xl md:text-[44px] leading-tight mb-5 max-w-3xl">
        {event.title}
      </h3>

      <div className="relative flex flex-wrap gap-x-6 gap-y-2 text-base font-dm-sans text-white/80 mb-6">
        <span className="flex items-center gap-2">
          <FiCalendar size={16} style={{ color: colour }} aria-hidden="true" />
          {dateLabel}
        </span>
        <span className="flex items-center gap-2">
          <FiMapPin size={16} style={{ color: colour }} aria-hidden="true" />
          {event.locationUrl ? (
            <a
              href={safeUrl(event.locationUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-white transition-colors"
            >
              {event.location}
            </a>
          ) : (
            event.location
          )}
        </span>
      </div>

      <div className="relative space-y-4 max-w-3xl mb-2">
        <Paras text={event.description} className="font-dm-sans text-white/75 text-base sm:text-lg leading-[1.7]" />
      </div>

      {event.newsSlug && (
        <div className="relative mt-4"><SmartLink to={`/news/${event.newsSlug}`} className="font-rajdhani font-bold uppercase tracking-wider text-sm text-accent-gold underline underline-offset-4">{moreLabel || 'More about this event'}</SmartLink></div>
      )}
      {event.links?.length > 0 && (
        <div className="relative flex flex-wrap gap-3 mt-7">
          {event.links.map(({ label, url }, i) => (
            <SmartLink
              key={i}
              to={url}
              className={`inline-flex items-center gap-2 min-h-11 px-5 py-2.5 font-rajdhani font-bold uppercase tracking-wider text-sm transition-all duration-200 ${
                i === 0
                  ? 'bg-accent-gold text-deep-purple shadow-[3px_3px_0_rgba(0,0,0,0.3)] hover:-translate-y-0.5 hover:shadow-[4px_5px_0_rgba(0,0,0,0.35)]'
                  : 'border-2 border-white/70 text-white hover:bg-white hover:text-deep-purple'
              }`}
            >
              {label} {/^https?:/.test(url) && <FiExternalLink size={14} aria-hidden="true" />}
            </SmartLink>
          ))}
        </div>
      )}

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px]"
        style={{ background: `linear-gradient(90deg, ${colour}60, transparent)` }}
      />
    </motion.article>
  )
}

function Upcoming({ s }) {
  const { upcomingEvents: upcoming } = useContent()
  const [featured, ...rest] = upcoming
  const pills = (s.pills || []).filter(Boolean).map((t) => t.replace('{count}', `${upcoming.length} ${upcoming.length === 1 ? 'event' : 'events'}`))
  return (
    <section id="upcoming" className="bg-surface py-20 md:py-28">
      <div className="container mx-auto">
        <SectionWrapper>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <Heading eyebrow={s.eyebrow} title={s.title} tone="green" className="" />
            {pills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {pills.map((label, i) => (
                  <span key={i} className="font-rajdhani font-semibold text-sm uppercase tracking-wider px-3 py-1 bg-bg-tint text-text-secondary border border-border-light">{label}</span>
                ))}
              </div>
            )}
          </div>
        </SectionWrapper>
        {featured ? (
          <>
            <FeaturedEventCard event={featured} label={s.featured_label} moreLabel={s.more_label} />
            {rest.length > 0 && (
              <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-4" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
                {rest.map((event) => (
                  <motion.div key={event.id ?? event.title} variants={fadeUp}><EventCard event={event} /></motion.div>
                ))}
              </motion.div>
            )}
          </>
        ) : (
          <p className="font-dm-sans text-text-secondary text-lg">{s.empty}</p>
        )}
      </div>
    </section>
  )
}

function Past({ s }) {
  const { pastEvents: past } = useContent()
  const [open, setOpen] = useState(true)
  return (
    <section id="past" className="bg-bg-tint py-20 md:py-28">
      <div className="container mx-auto">
        <SectionWrapper>
          <div className="mb-8">
            {s.eyebrow && <p className="font-rajdhani font-semibold text-ink-cyan text-sm uppercase tracking-[3px] mb-2">{s.eyebrow}</p>}
            <button onClick={() => setOpen(!open)} className="flex items-center gap-3 group min-h-11" aria-expanded={open} aria-controls="past-list">
              <h2 className="font-rajdhani font-bold text-deep-purple text-[32px] sm:text-[40px] group-hover:text-ink-cyan transition-colors">{s.title}</h2>
              <span className="flex items-center gap-1 font-rajdhani text-text-secondary">
                <span className="text-sm">({past.length})</span>
                {open ? <FiChevronUp size={20} aria-hidden="true" /> : <FiChevronDown size={20} aria-hidden="true" />}
              </span>
            </button>
            <div className="w-16 h-[2px] bg-accent-cyan" />
          </div>
        </SectionWrapper>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div id="past-list" className="overflow-hidden" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
              {past.length > 0 ? (
                <div className="max-w-3xl">
                  {past.map((event, i) => (
                    <EventCard key={event.id ?? event.title} event={event} variant="timeline" isPast isLast={i === past.length - 1} recapLabel={s.recap_label} />
                  ))}
                </div>
              ) : (
                <p className="font-dm-sans text-text-secondary text-base py-8">{s.empty}</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

function Host({ s }) {
  const formats = (s.formats || []).filter(Boolean)
  return (
    <section id="host" className="bg-surface py-20 md:py-28">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 items-center">
          <SectionWrapper>
            <Heading eyebrow={s.eyebrow} title={s.title} tone="orange" rule={false} className="mb-4" />
            <Paras text={s.text} className="font-dm-sans text-text-secondary text-base leading-relaxed mb-4" />
            {s.button?.label && (
              <SmartLink to={s.button.url} className="inline-block mt-2 bg-accent-gold text-deep-purple font-rajdhani font-bold uppercase tracking-wider px-8 py-4 shadow-[4px_4px_0_rgba(0,0,0,0.25)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_rgba(0,0,0,0.3)] transition-all duration-200">
                {s.button.label}
              </SmartLink>
            )}
          </SectionWrapper>
          {formats.length > 0 && (
            <SectionWrapper delay={0.2}>
              <div className="bg-deep-purple p-5 sm:p-8 relative overflow-hidden">
                <div className="py-10">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                    {formats.map((label, i) => {
                      const colour = FORMAT_COLOURS[i % FORMAT_COLOURS.length]
                      return (
                        <span key={i} className="flex items-center justify-center text-center px-2 py-3 font-rajdhani text-sm font-semibold uppercase tracking-wider" style={{ background: `${colour}20`, color: onDark(colour), border: `1px solid ${colour}30` }}>
                          {label}
                        </span>
                      )
                    })}
                  </div>
                  {s.formats_note && <p className="font-dm-sans text-white/70 text-base text-center mt-6">{s.formats_note}</p>}
                </div>
                <div className="absolute bottom-2 right-2 w-14 h-14 opacity-15" aria-hidden="true" style={{ background: 'repeating-linear-gradient(45deg, #FF6B35 0, #FF6B35 2px, transparent 0, transparent 50%)', backgroundSize: '6px 6px' }} />
              </div>
            </SectionWrapper>
          )}
        </div>
      </div>
    </section>
  )
}

function Formats({ s }) {
  return (
    <section className="dark-textured py-16 md:py-20">
      <div className="container mx-auto">
        <SectionWrapper>
          <Heading eyebrow={s.eyebrow} title={s.title} dark rule={false} className="mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(s.items || []).map(({ title, text, colour: c }, i) => {
              const colour = accent(c)
              return (
                <div key={i} className="p-5 border border-white/10 hover:border-white/20 transition-colors duration-200" style={{ background: `${colour}07` }}>
                  <div className="w-6 h-[2px] mb-3" style={{ background: colour }} />
                  <h3 className="font-rajdhani font-semibold text-white text-lg mb-2">{title}</h3>
                  <p className="font-dm-sans text-white/70 text-base leading-relaxed">{text}</p>
                </div>
              )
            })}
          </div>
        </SectionWrapper>
      </div>
    </section>
  )
}

export default function Events() {
  const { p, sections } = usePage('events_page')
  usePageTitle(p.hero.title)
  const render = {
    upcoming: () => <Upcoming s={p.upcoming} />,
    past: () => <Past s={p.past} />,
    host: () => <Host s={p.host} />,
    formats: () => <Formats s={p.formats} />,
    cta: () => <CtaBanner cta={p.cta} />,
  }
  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
      <PageHero title={p.hero.title} subtitle={p.hero.subtitle} breadcrumb={p.hero.breadcrumb} accentColor="green" />
      {sections.map((key, i) => (
        <div key={key}>
          {i === 2 && <PixelDivider variant="warm" />}
          {render[key]?.()}
        </div>
      ))}
    </motion.main>
  )
}
