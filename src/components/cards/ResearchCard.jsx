import { motion } from 'framer-motion'
import { accent, ink } from '../../lib/theme'
import PixelSprite from '../PixelSprite'

export default function ResearchCard({ area }) {
  const colour = accent(area.colour)
  const tags = (area.tags || []).filter(Boolean)
  return (
    <motion.article
      className="flex flex-col p-6 h-full"
      style={{ background: `${colour}0F`, borderTop: `3px solid ${colour}` }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <div className="mb-4"><PixelSprite name={area.icon || 'book'} colour={colour} size={28} /></div>
      <h3 className="font-rajdhani font-semibold text-text-primary text-xl mb-2">{area.title}</h3>
      <p className="font-dm-sans text-text-secondary text-base leading-relaxed flex-1">{area.description}</p>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-4">
          {tags.map((tag) => (
            <span key={tag} className="font-rajdhani font-semibold text-sm uppercase tracking-wider px-2 py-0.5" style={{ color: ink(colour), background: `${colour}15`, border: `1px solid ${colour}30` }}>
              {tag}
            </span>
          ))}
        </div>
      )}
    </motion.article>
  )
}
