import { motion } from 'framer-motion'
import { FiArrowRight } from 'react-icons/fi'

const CATEGORY_COLOURS = {
  Announcement: '#F5A623',
  Event:        '#3DE87A',
  Community:    '#00CFDD',
  Research:     '#B45FFF',
}

/* ── Featured: large editorial hero card ── */
function NewsCardFeatured({ item }) {
  const colour = CATEGORY_COLOURS[item.category] || '#F5A623'

  return (
    <motion.article
      className="relative flex flex-col justify-end bg-light-purple/40 border border-white/10 p-8 group cursor-pointer overflow-hidden min-h-[320px]"
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      {/* Pixel corner accent */}
      <div
        className="absolute top-0 right-0 w-28 h-28 opacity-10 pointer-events-none"
        aria-hidden="true"
        style={{
          background: `repeating-linear-gradient(45deg, ${colour} 0, ${colour} 2px, transparent 0, transparent 50%)`,
          backgroundSize: '8px 8px',
        }}
      />
      {/* Colour bloom */}
      <div
        className="absolute bottom-0 left-0 w-48 h-48 opacity-10 blur-2xl pointer-events-none"
        aria-hidden="true"
        style={{ background: colour }}
      />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-5">
          <span
            className="font-rajdhani text-xs font-bold uppercase tracking-[2px] px-3 py-1"
            style={{ color: colour, background: `${colour}20`, border: `1px solid ${colour}35` }}
          >
            {item.category}
          </span>
          <span className="font-dm-sans text-white/40 text-xs">{item.date}</span>
        </div>

        <h3
          className="font-rajdhani font-bold text-white text-2xl sm:text-3xl leading-tight mb-4 group-hover:text-accent-gold transition-colors duration-200"
          style={{ maxWidth: '520px' }}
        >
          {item.title}
        </h3>

        <p className="font-dm-sans text-white/55 text-sm leading-relaxed mb-5" style={{ maxWidth: '480px' }}>
          {item.excerpt}
        </p>

        <span
          className="inline-flex items-center gap-2 font-rajdhani font-semibold text-xs uppercase tracking-wider group-hover:gap-3 transition-all duration-200"
          style={{ color: colour }}
        >
          Read More <FiArrowRight size={13} />
        </span>
      </div>
    </motion.article>
  )
}

/* ── Secondary: compact horizontal card ── */
function NewsCardSecondary({ item }) {
  const colour = CATEGORY_COLOURS[item.category] || '#F5A623'

  return (
    <motion.article
      className="flex gap-4 bg-light-purple/25 border border-white/8 p-5 group cursor-pointer"
      whileHover={{ x: 4 }}
      transition={{ duration: 0.15 }}
    >
      {/* Colour strip */}
      <div className="flex-shrink-0 w-[3px] self-stretch" style={{ background: colour }} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <span
            className="font-rajdhani text-[10px] font-bold uppercase tracking-[1.5px] px-2 py-0.5"
            style={{ color: colour, background: `${colour}15` }}
          >
            {item.category}
          </span>
          <span className="font-dm-sans text-white/35 text-[10px]">{item.date}</span>
        </div>
        <h3 className="font-rajdhani font-bold text-white text-base leading-tight group-hover:text-accent-gold transition-colors duration-200 line-clamp-2">
          {item.title}
        </h3>
      </div>

      <FiArrowRight
        size={14}
        className="flex-shrink-0 self-center text-white/20 group-hover:text-white/60 transition-colors duration-200"
      />
    </motion.article>
  )
}

/* ── Default: original dark card (used on standalone news pages) ── */
export default function NewsCard({ item, variant = 'default' }) {
  if (variant === 'featured')  return <NewsCardFeatured item={item} />
  if (variant === 'secondary') return <NewsCardSecondary item={item} />

  const colour = CATEGORY_COLOURS[item.category] || '#F5A623'

  return (
    <motion.article
      className="bg-light-purple/40 border border-white/10 p-6 flex flex-col group cursor-pointer"
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <span
          className="font-rajdhani text-xs font-semibold uppercase tracking-[2px] px-2 py-1"
          style={{ color: colour, background: `${colour}15`, border: `1px solid ${colour}30` }}
        >
          {item.category}
        </span>
        <span className="font-dm-sans text-white/40 text-xs">{item.date}</span>
      </div>

      <h3 className="font-rajdhani font-bold text-white text-xl leading-tight mb-3 group-hover:text-accent-gold transition-colors duration-200">
        {item.title}
      </h3>

      <p className="font-dm-sans text-white/55 text-sm leading-relaxed flex-1">{item.excerpt}</p>

      <div
        className="mt-4 h-[2px] w-12 group-hover:w-full transition-all duration-300"
        style={{ background: colour }}
      />
    </motion.article>
  )
}
