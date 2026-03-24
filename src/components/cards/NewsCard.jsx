import { motion } from 'framer-motion'

const CATEGORY_COLOURS = {
  Announcement: '#F5A623',
  Event: '#3DE87A',
  Community: '#00CFDD',
  Research: '#B45FFF',
}

export default function NewsCard({ item }) {
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
