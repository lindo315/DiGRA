import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiMapPin, FiBriefcase } from 'react-icons/fi'

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

export default function TeamMemberModal({ member, onClose }) {
  const colour = member ? hashColour(member.name) : '#F5A623'
  const initials = member ? getInitials(member.name) : ''

  // ESC to close + body scroll lock
  useEffect(() => {
    if (!member) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', handleKey)
    }
  }, [member, onClose])

  return createPortal(
    <AnimatePresence>
      {member && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={member.name}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none"
          >
            <motion.div
              className="pointer-events-auto bg-surface w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto"
              style={{ borderTop: `4px solid ${colour}` }}
              initial={{ opacity: 0, y: 60, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.97 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              {/* Close button */}
              <div className="flex justify-end p-4 pb-0">
                <button
                  onClick={onClose}
                  className="text-text-secondary hover:text-text-primary transition-colors p-1"
                  aria-label="Close"
                >
                  <FiX size={22} />
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-0 sm:gap-8 p-6 pt-2">
                {/* Photo column */}
                <div className="flex-shrink-0 flex flex-col items-center sm:items-start mb-5 sm:mb-0">
                  <div
                    className="overflow-hidden"
                    style={{
                      width: '140px',
                      height: '160px',
                      background: `${colour}18`,
                      border: `2px solid ${colour}30`,
                    }}
                  >
                    {member.photo ? (
                      <img
                        src={member.photo}
                        alt={member.name}
                        className="w-full h-full object-cover object-top"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span
                          className="font-rajdhani font-bold text-white text-3xl"
                          style={{ color: colour }}
                        >
                          {initials}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Info column */}
                <div className="flex-1 min-w-0">
                  <p
                    className="font-rajdhani font-bold text-xs uppercase tracking-[2px] mb-1"
                    style={{ color: colour }}
                  >
                    {member.role}
                  </p>
                  <h2 className="font-rajdhani font-bold text-deep-purple text-2xl sm:text-3xl leading-tight mb-3">
                    {member.name}
                  </h2>

                  <div className="flex flex-col gap-2 mb-5 pb-5 border-b border-border-light">
                    <div className="flex items-center gap-2 font-dm-sans text-text-secondary text-sm">
                      <FiMapPin size={14} style={{ color: colour, flexShrink: 0 }} />
                      {member.institution}
                    </div>
                    {member.department && (
                      <div className="flex items-center gap-2 font-dm-sans text-text-secondary text-sm">
                        <FiBriefcase size={14} style={{ color: colour, flexShrink: 0 }} />
                        {member.department}
                      </div>
                    )}
                  </div>

                  {member.bio ? (
                    <div>
                      <p className="font-rajdhani font-semibold text-xs uppercase tracking-[2px] text-text-secondary mb-2">
                        About
                      </p>
                      <p className="font-dm-sans text-text-secondary text-sm leading-relaxed">
                        {member.bio}
                      </p>
                    </div>
                  ) : (
                    <p className="font-dm-sans text-text-secondary/50 text-sm italic">
                      Full bio coming soon.
                    </p>
                  )}

                  {member.researchInterests && member.researchInterests.length > 0 && (
                    <div className="mt-5">
                      <p className="font-rajdhani font-semibold text-xs uppercase tracking-[2px] text-text-secondary mb-3">
                        Research Interests
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {member.researchInterests.map((interest) => (
                          <span
                            key={interest}
                            className="font-dm-sans text-xs px-3 py-1"
                            style={{
                              background: `${colour}15`,
                              color: colour,
                              border: `1px solid ${colour}30`,
                            }}
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  )
}
