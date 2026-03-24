import { motion } from 'framer-motion'

const ACCENT_COLOURS = {
  gold: '#F5A623',
  violet: '#B45FFF',
  green: '#3DE87A',
  cyan: '#00CFDD',
  orange: '#FF6B35',
  red: '#E94560',
}

export default function PageHero({ title, subtitle, breadcrumb, accentColor = 'gold' }) {
  const colour = ACCENT_COLOURS[accentColor] || ACCENT_COLOURS.gold

  return (
    <section
      className="dark-textured relative overflow-hidden py-12 sm:py-20 md:py-28"
      style={{ borderBottom: `3px solid ${colour}33` }}
    >
      {/* Radial glow */}
      <div
        className="pointer-events-none absolute right-0 top-0 h-[400px] w-[400px] rounded-full"
        style={{
          background: `radial-gradient(circle, ${colour}14 0%, transparent 70%)`,
        }}
        aria-hidden="true"
      />

      <div className="container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {breadcrumb && (
            <p
              className="mb-4 font-rajdhani text-sm uppercase tracking-[3px]"
              style={{ color: colour }}
            >
              {breadcrumb}
            </p>
          )}
          <h1 className="font-rajdhani text-3xl sm:text-5xl font-bold text-white md:text-6xl">{title}</h1>
          {subtitle && (
            <p className="mt-3 max-w-[600px] font-dm-sans text-base sm:text-lg text-white/65">{subtitle}</p>
          )}
        </motion.div>
      </div>
    </section>
  )
}
