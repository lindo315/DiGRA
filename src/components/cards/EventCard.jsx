import { motion } from 'framer-motion'
import { FiMapPin } from 'react-icons/fi'

const TYPE_COLOURS = {
  Symposium:    '#F5A623',
  Workshop:     '#3DE87A',
  Seminar:      '#00CFDD',
  Conference:   '#B45FFF',
  Talk:         '#E94560',
  Webinar:      '#00CFDD',
  'Game Jam':   '#F5A623',
  'Launch Event': '#FF6B35',
}

/* ── Timeline row: used on Events page ── */
function EventCardTimeline({ event, isPast = false, isLast = false }) {
  const colour = TYPE_COLOURS[event.type] || '#F5A623'

  return (
    <div className={`relative flex gap-6 ${isPast ? 'opacity-55' : ''}`}>
      {/* Timeline spine */}
      <div className="flex flex-col items-center flex-shrink-0">
        {/* Date bubble */}
        <div
          className="flex flex-col items-center justify-center w-14 h-14 border-2 z-10"
          style={{ borderColor: colour, background: `${colour}12` }}
        >
          <span className="font-rajdhani font-bold text-xl leading-none" style={{ color: colour }}>
            {event.day !== 'TBA' ? event.day : '–'}
          </span>
          <span className="font-rajdhani text-[9px] uppercase tracking-wider" style={{ color: `${colour}90` }}>
            {event.month !== 'TBA' ? event.month : event.date !== 'TBA' ? event.date : 'TBA'}
          </span>
        </div>
        {/* Connecting line */}
        {!isLast && (
          <div
            className="w-[2px] flex-1 mt-1"
            style={{ background: `linear-gradient(180deg, ${colour}40 0%, transparent 100%)` }}
          />
        )}
      </div>

      {/* Content */}
      <motion.div
        className="flex-1 mb-8 border border-white/8 p-5 hover:border-white/20 transition-colors duration-200 relative overflow-hidden"
        style={{ background: `${colour}07` }}
        whileHover={{ x: 4 }}
        transition={{ duration: 0.15 }}
      >
        {/* Corner pixel accent */}
        <div
          className="absolute bottom-0 right-0 w-16 h-16 opacity-[0.07] pointer-events-none"
          aria-hidden="true"
          style={{
            background: `repeating-linear-gradient(45deg, ${colour} 0, ${colour} 2px, transparent 0, transparent 50%)`,
            backgroundSize: '6px 6px',
          }}
        />

        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span
            className="font-rajdhani text-xs font-bold uppercase tracking-[1.5px] px-2 py-0.5"
            style={{ color: colour, background: `${colour}18` }}
          >
            {event.type}
          </span>
          {isPast && (
            <span className="font-rajdhani text-xs font-semibold uppercase tracking-[1.5px] px-2 py-0.5 bg-white/10 text-white/40">
              PAST
            </span>
          )}
        </div>

        <h3 className="font-rajdhani font-bold text-white text-xl leading-tight mb-2">
          {event.title}
        </h3>

        <div className="flex items-center gap-1 text-white/45 text-sm mb-3 font-dm-sans">
          <FiMapPin size={12} className="flex-shrink-0" />
          <span className="truncate">{event.location}</span>
        </div>

        <p className="font-dm-sans text-white/50 text-sm leading-relaxed line-clamp-2">
          {event.description}
        </p>
      </motion.div>
    </div>
  )
}

/* ── Default card: used on Home page grid ── */
export default function EventCard({ event, isPast = false, variant = 'default', isLast = false }) {
  if (variant === 'timeline') {
    return <EventCardTimeline event={event} isPast={isPast} isLast={isLast} />
  }

  const colour = TYPE_COLOURS[event.type] || '#F5A623'

  return (
    <motion.article
      className={`flex gap-4 bg-surface border border-border-light p-5 group ${isPast ? 'opacity-60' : ''}`}
      whileHover={{ scale: 1.01, boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }}
      transition={{ duration: 0.2 }}
    >
      {/* Date block */}
      <div
        className="flex-shrink-0 flex flex-col items-center justify-center px-4 py-3 min-w-[64px]"
        style={{ background: `${colour}18`, borderLeft: `3px solid ${colour}` }}
      >
        <span className="font-rajdhani font-bold text-3xl leading-none" style={{ color: colour }}>
          {event.day}
        </span>
        <span className="font-rajdhani font-light text-xs uppercase" style={{ color: `${colour}99` }}>
          {event.month}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <span
            className="font-rajdhani text-xs font-semibold uppercase tracking-[1.5px] px-2 py-0.5"
            style={{ color: colour, background: `${colour}15` }}
          >
            {event.type}
          </span>
          {isPast && (
            <span className="font-rajdhani text-xs font-semibold uppercase tracking-[1.5px] px-2 py-0.5 bg-white/20 text-white/50">
              PAST
            </span>
          )}
        </div>
        <h3 className="font-rajdhani font-bold text-text-primary text-xl leading-tight mb-2 group-hover:text-deep-purple transition-colors">
          {event.title}
        </h3>
        <div className="flex items-center gap-1 text-text-secondary text-sm mb-2 font-dm-sans">
          <FiMapPin size={12} className="flex-shrink-0" />
          <span className="truncate">{event.location}</span>
        </div>
        <p className="font-dm-sans text-text-secondary text-sm leading-relaxed line-clamp-2">
          {event.description}
        </p>
      </div>
    </motion.article>
  )
}
