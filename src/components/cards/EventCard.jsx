import { motion } from 'framer-motion'
import { FiMapPin } from 'react-icons/fi'

const TYPE_COLOURS = {
  Symposium: '#F5A623',
  Workshop: '#3DE87A',
  Seminar: '#00CFDD',
  Conference: '#B45FFF',
  Talk: '#E94560',
}

export default function EventCard({ event, isPast = false }) {
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
