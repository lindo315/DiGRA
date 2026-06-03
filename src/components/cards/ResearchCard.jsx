import { motion } from 'framer-motion'
import {
  FaGlobeAfrica,
  FaBookOpen,
  FaGamepad,
  FaGraduationCap,
  FaChartBar,
  FaBalanceScale,
} from 'react-icons/fa'

const ICON_MAP = {
  FaGlobeAfrica,
  FaBookOpen,
  FaGamepad,
  FaGraduationCap,
  FaChartBar,
  FaBalanceScale,
}

const AREA_ACCENTS = {
  'African Game Cultures': { bg: 'rgba(245,166,35,0.06)', colour: '#F5A623' },
  'Decolonial Game Studies': { bg: 'rgba(233,69,96,0.06)', colour: '#E94560' },
  'Game Design & Development': { bg: 'rgba(0,207,221,0.06)', colour: '#00CFDD' },
  'Game Education & Pedagogy': { bg: 'rgba(61,232,122,0.06)', colour: '#3DE87A' },
  'Industry & Policy': { bg: 'rgba(255,107,53,0.06)', colour: '#FF6B35' },
  'Postcolonial Perspectives': { bg: 'rgba(180,95,255,0.06)', colour: '#B45FFF' },
}

export default function ResearchCard({ area }) {
  const Icon = ICON_MAP[area.icon] || FaGamepad
  const { bg, colour } = AREA_ACCENTS[area.title] || { bg: 'rgba(245,166,35,0.06)', colour: '#F5A623' }

  return (
    <motion.article
      className="flex flex-col p-6 group"
      style={{ background: bg, borderTop: `3px solid ${colour}` }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Icon size={28} style={{ color: colour }} className="mb-4" />
      <h3 className="font-rajdhani font-semibold text-text-primary text-xl mb-2">{area.title}</h3>
      <p className="font-dm-sans text-text-secondary text-sm leading-relaxed flex-1">
        {area.description}
      </p>
      {area.tags && area.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-4">
          {area.tags.map((tag) => (
            <span
              key={tag}
              className="font-rajdhani font-semibold text-[10px] uppercase tracking-wider px-2 py-0.5"
              style={{ color: colour, background: `${colour}15`, border: `1px solid ${colour}30` }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </motion.article>
  )
}
