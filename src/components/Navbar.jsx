import { useState, useRef, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { FiMenu, FiX, FiChevronDown } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'

const NAV_ITEMS = [
  { to: '/', label: 'Home', sections: [] },
  {
    to: '/about', label: 'About',
    sections: [
      { label: 'Who We Are', hash: '#who-we-are' },
      { label: 'Mission & Goals', hash: '#mission' },
      { label: 'Our Aims', hash: '#aims' },
      { label: 'Founding Committee', hash: '#committee' },
      { label: 'DiGRA International', hash: '#digra-international' },
    ],
  },
  {
    to: '/events', label: 'Events',
    sections: [
      { label: 'Upcoming Events', hash: '#upcoming' },
      { label: 'Past Events', hash: '#past' },
      { label: 'Host an Event', hash: '#host' },
    ],
  },
  {
    to: '/research', label: 'Research',
    sections: [
      { label: 'Game Studies in SA', hash: '#game-studies' },
      { label: 'Research Areas', hash: '#research-areas' },
      { label: 'DiGRA Library', hash: '#library' },
      { label: 'Journals', hash: '#journals' },
      { label: 'Teaching Resources', hash: '#teaching' },
    ],
  },
  {
    to: '/membership', label: 'Membership',
    sections: [
      { label: 'Member Benefits', hash: '#benefits' },
      { label: 'Who Can Join', hash: '#eligibility' },
      { label: 'Membership Tiers', hash: '#tiers' },
      { label: 'How to Join', hash: '#how-to-join' },
      { label: 'Join Now', hash: '#join-form' },
    ],
  },
  {
    to: '/contact', label: 'Contact',
    sections: [
      { label: 'Send a Message', hash: '#contact-form' },
      { label: 'Stay Connected', hash: '#stay-connected' },
    ],
  },
]

function NavDropdown({ item, onClose }) {
  if (!item.sections.length) return null
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50 min-w-[200px]"
    >
      {/* Arrow */}
      <div className="absolute top-[6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-deep-purple border-l border-t border-accent-gold/30 rotate-45" />

      <div className="relative bg-deep-purple border border-accent-gold/20 shadow-2xl shadow-black/50 overflow-hidden">
        {/* Top accent line */}
        <div className="h-[2px] bg-gradient-to-r from-accent-gold via-accent-orange to-accent-violet" />

        {item.sections.map(({ label, hash }) => (
          <Link
            key={hash}
            to={`${item.to}${hash}`}
            onClick={onClose}
            className="block px-5 py-2.5 font-rajdhani font-semibold text-xs uppercase tracking-[1.5px] text-white/60 hover:text-accent-gold hover:bg-accent-gold/5 transition-colors duration-150 border-b border-white/5 last:border-0"
          >
            {label}
          </Link>
        ))}
      </div>
    </motion.div>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const closeTimer = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function openDropdown(label) {
    clearTimeout(closeTimer.current)
    setActiveDropdown(label)
  }

  function scheduleClose() {
    closeTimer.current = setTimeout(() => setActiveDropdown(null), 120)
  }

  function closeDropdown() {
    clearTimeout(closeTimer.current)
    setActiveDropdown(null)
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-accent-gold/30 ${
        scrolled ? 'shadow-lg shadow-black/30 bg-deep-purple/95 backdrop-blur-sm' : 'bg-deep-purple'
      }`}
    >
      <div className="container mx-auto flex items-center justify-between py-3">

        {/* Logo — image only */}
        <Link to="/" className="flex items-center" onClick={closeDropdown}>
          <img
            src="/digra-logo.png"
            alt="DiGRA SA"
            className="h-10 w-auto"
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'block'
            }}
          />
          {/* Fallback text shown only if image fails */}
          <span
            className="font-orbitron font-bold text-accent-gold tracking-[4px] text-sm hidden"
            aria-hidden="true"
          >
            DiGRA SA
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_ITEMS.map((item) => (
            <div
              key={item.to}
              className="relative"
              onMouseEnter={() => openDropdown(item.label)}
              onMouseLeave={scheduleClose}
            >
              <NavLink
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-1 font-rajdhani font-semibold text-sm uppercase tracking-wider transition-colors duration-200 pb-0.5 ${
                    isActive
                      ? 'text-accent-gold border-b-2 border-accent-gold'
                      : 'text-white/70 hover:text-white border-b-2 border-transparent'
                  }`
                }
              >
                {item.label}
                {item.sections.length > 0 && (
                  <FiChevronDown
                    size={12}
                    className={`transition-transform duration-150 ${activeDropdown === item.label ? 'rotate-180' : ''}`}
                  />
                )}
              </NavLink>

              <AnimatePresence>
                {activeDropdown === item.label && item.sections.length > 0 && (
                  <NavDropdown
                    item={item}
                    onClose={closeDropdown}
                  />
                )}
              </AnimatePresence>
            </div>
          ))}

          <Link
            to="/membership"
            className="bg-accent-gold text-deep-purple font-rajdhani font-bold uppercase tracking-wider px-5 py-2 text-sm shadow-[3px_3px_0_rgba(0,0,0,0.25)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0_rgba(0,0,0,0.3)] transition-all duration-200 ml-2"
          >
            Join Us
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <FiMenu size={24} />
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="fixed top-0 right-0 bottom-0 w-72 bg-deep-purple z-50 md:hidden flex flex-col border-l border-accent-gold/20 overflow-y-auto"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
            >
              <div className="flex items-center justify-between p-6 border-b border-white/10 sticky top-0 bg-deep-purple">
                <span className="font-orbitron font-bold text-accent-gold tracking-[3px] text-sm">
                  DiGRA SA
                </span>
                <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white" aria-label="Close menu">
                  <FiX size={24} />
                </button>
              </div>

              <div className="flex flex-col py-2">
                {NAV_ITEMS.map((item) => (
                  <div key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.to === '/'}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        `font-rajdhani font-semibold uppercase tracking-wider text-base px-6 h-12 flex items-center border-l-4 transition-all ${
                          isActive
                            ? 'text-accent-gold border-accent-gold bg-accent-gold/5'
                            : 'text-white/70 border-transparent hover:text-white hover:border-white/20'
                        }`
                      }
                    >
                      {item.label}
                    </NavLink>

                    {/* Mobile section links */}
                    {item.sections.length > 0 && (
                      <div className="pl-8 pb-2">
                        {item.sections.map(({ label, hash }) => (
                          <Link
                            key={hash}
                            to={`${item.to}${hash}`}
                            onClick={() => setOpen(false)}
                            className="block py-1.5 font-rajdhani text-xs uppercase tracking-wider text-white/35 hover:text-accent-gold/80 transition-colors"
                          >
                            {label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                <div className="px-6 mt-4 border-t border-white/10 pt-4">
                  <Link
                    to="/membership"
                    onClick={() => setOpen(false)}
                    className="block bg-accent-gold text-deep-purple font-rajdhani font-bold uppercase tracking-wider px-5 py-3 text-center shadow-[3px_3px_0_rgba(0,0,0,0.25)]"
                  >
                    Join Us
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  )
}
