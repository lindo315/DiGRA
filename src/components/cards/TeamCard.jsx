import { motion } from 'framer-motion'

const ACCENT_COLOURS = ['#F5A623', '#00CFDD', '#E94560', '#3DE87A', '#B45FFF', '#FF6B35']

function hashColour(name) {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return ACCENT_COLOURS[Math.abs(hash) % ACCENT_COLOURS.length]
}

function getInitials(name) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export default function TeamCard({ member }) {
  const colour = hashColour(member.name)
  const initials = getInitials(member.name)

  return (
    <motion.article
      className="bg-surface flex items-start gap-4 p-5"
      style={{ borderLeft: `4px solid ${colour}` }}
      whileHover={{ scale: 1.01, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
      transition={{ duration: 0.2 }}
    >
      {/* Avatar */}
      <div
        className="flex-shrink-0 w-12 h-12 flex items-center justify-center font-rajdhani font-bold text-white text-lg"
        style={{ background: colour }}
      >
        {initials}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-rajdhani font-semibold text-text-primary text-lg leading-tight">
          {member.name}
        </h3>
        <p
          className="font-rajdhani font-light text-xs uppercase tracking-wider mb-1"
          style={{ color: colour }}
        >
          {member.role}
        </p>
        <p className="font-dm-sans italic text-text-secondary text-sm mb-2">{member.institution}</p>
        <p className="font-dm-sans text-text-secondary text-sm leading-relaxed line-clamp-2">
          {member.bio.split('.')[0] + '.'}
        </p>
      </div>
    </motion.article>
  )
}
