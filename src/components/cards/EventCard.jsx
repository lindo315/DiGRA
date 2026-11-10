import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiMapPin, FiArrowRight } from 'react-icons/fi'
import { ACCENTS, EVENT_TYPE_COLOURS, ink } from '../../lib/theme'

const show = (v) => (v && v !== 'TBA' ? v : null)

/* ── Timeline row: used for past events on the Events page (light background) ── */
function EventCardTimeline({ event, isPast = false, isLast = false }) {
  const colour = EVENT_TYPE_COLOURS[event.type] || ACCENTS.gold
  const text = ink(colour)

  return (
    <div className="relative flex gap-4 sm:gap-6">
      {/* Timeline spine */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div
          className="flex flex-col items-center justify-center w-16 h-16 border-2 bg-surface z-10"
          style={{ borderColor: colour }}
        >
          <span className="font-rajdhani font-bold text-2xl leading-none" style={{ color: text }}>
            {show(event.day) || '–'}
          </span>
          <span className="font-rajdhani font-semibold text-sm uppercase tracking-wider leading-tight" style={{ color: text }}>
            {show(event.month) || 'TBA'}
          </span>
        </div>
        {!isLast && (
          <div
            className="w-[2px] flex-1 mt-1"
            style={{ background: `linear-gradient(180deg, ${colour} 0%, ${colour}00 100%)` }}
            aria-hidden="true"
          />
        )}
      </div>

      {/* Content */}
      <motion.article
        className="flex-1 mb-8 bg-surface border border-border-light p-5 sm:p-6 hover:shadow-[0_10px_30px_rgba(28,10,58,0.10)] transition-shadow duration-200 relative overflow-hidden"
        style={{ borderTop: `3px solid ${colour}` }}
        whileHover={{ x: 4 }}
        transition={{ duration: 0.15 }}
      >
        <div
          className="absolute bottom-0 right-0 w-16 h-16 opacity-[0.12] pointer-events-none"
          aria-hidden="true"
          style={{
            background: `repeating-linear-gradient(45deg, ${colour} 0, ${colour} 2px, transparent 0, transparent 50%)`,
            backgroundSize: '6px 6px',
          }}
        />

        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span
            className="font-rajdhani text-sm font-bold uppercase tracking-[1.5px] px-2 py-0.5"
            style={{ color: text, background: `${colour}1f` }}
          >
            {event.type}
          </span>
          {isPast && (
            <span className="font-rajdhani text-sm font-bold uppercase tracking-[1.5px] px-2 py-0.5 bg-deep-purple/10 text-text-secondary">
              Past
            </span>
          )}
          <span className="font-dm-sans text-sm text-text-secondary">{event.date}</span>
        </div>

        <h3 className="font-rajdhani font-bold text-deep-purple text-[22px] leading-tight mb-2">
          {event.title}
        </h3>

        <div className="flex items-center gap-1.5 text-text-secondary text-sm mb-3 font-dm-sans">
          <FiMapPin size={14} className="flex-shrink-0" aria-hidden="true" />
          <span>{event.location}</span>
        </div>

        <p className="font-dm-sans text-text-secondary text-base leading-[1.7] line-clamp-3">
          {event.description}
        </p>

        {event.newsSlug && (
          <Link
            to={`/news/${event.newsSlug}`}
            className="inline-flex items-center gap-2 min-h-11 mt-2 font-rajdhani font-bold uppercase tracking-wider text-sm hover:gap-3 transition-all"
            style={{ color: text }}
          >
            Read the recap <FiArrowRight aria-hidden="true" />
          </Link>
        )}
      </motion.article>
    </div>
  )
}

/* ── Default card: white card used in grids (Home, Events) ── */
export default function EventCard({ event, isPast = false, variant = 'default', isLast = false }) {
  if (variant === 'timeline') {
    return <EventCardTimeline event={event} isPast={isPast} isLast={isLast} />
  }

  const colour = EVENT_TYPE_COLOURS[event.type] || ACCENTS.gold
  const text = ink(colour)

  return (
    <motion.article
      className={`flex gap-4 h-full bg-surface border border-border-light p-5 group ${isPast ? 'opacity-80' : ''}`}
      whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,0,0,0.18)' }}
      transition={{ duration: 0.2 }}
    >
      {/* Date block */}
      <div
        className="flex-shrink-0 flex flex-col items-center justify-center px-3 py-3 min-w-[68px] self-start"
        style={{ background: `${colour}1f`, borderLeft: `3px solid ${colour}` }}
      >
        <span className="font-rajdhani font-bold text-3xl leading-none" style={{ color: text }}>
          {show(event.day) || '–'}
        </span>
        <span className="font-rajdhani font-semibold text-sm uppercase" style={{ color: text }}>
          {show(event.month) || 'TBA'}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span
            className="font-rajdhani text-sm font-bold uppercase tracking-[1.5px] px-2 py-0.5"
            style={{ color: text, background: `${colour}1f` }}
          >
            {event.type}
          </span>
        </div>
        <h3 className="font-rajdhani font-bold text-text-primary text-[22px] leading-tight mb-2">
          {event.title}
        </h3>
        <div className="flex items-center gap-1.5 text-text-secondary text-sm mb-2 font-dm-sans">
          <FiMapPin size={14} className="flex-shrink-0" aria-hidden="true" />
          <span className="truncate">{event.location}</span>
        </div>
        <p className="font-dm-sans text-text-secondary text-base leading-[1.7] line-clamp-3">
          {event.description}
        </p>
      </div>
    </motion.article>
  )
}
