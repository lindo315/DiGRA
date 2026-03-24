import { Link } from 'react-router-dom'
import { FiMail, FiMapPin, FiTwitter, FiLinkedin, FiFacebook } from 'react-icons/fi'
import PixelDivider from './PixelDivider'

export default function Footer() {
  return (
    <footer className="dark-textured">
      <PixelDivider variant="full" />

      <div className="container mx-auto py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
          {/* Col 1: Brand */}
          <div>
            <div className="font-orbitron font-bold text-accent-gold tracking-[4px] text-base mb-1">
              DiGRA SA
            </div>
            <div className="font-rajdhani font-light text-white/50 text-xs tracking-[2px] uppercase mb-4">
              South Africa Chapter
            </div>
            <p className="font-dm-sans text-white/50 text-sm leading-relaxed mb-4">
              The official South African chapter of the Digital Games Research Association.
            </p>
            <a
              href="https://digra.org"
              target="_blank"
              rel="noopener noreferrer"
              className="font-dm-sans text-accent-gold text-sm hover:underline"
            >
              DiGRA International ↗
            </a>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h3 className="font-rajdhani font-semibold text-accent-gold uppercase tracking-[2px] text-sm mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {['Home', 'About', 'Events', 'Research', 'Membership', 'Contact'].map((label) => (
                <li key={label}>
                  <Link
                    to={label === 'Home' ? '/' : `/${label.toLowerCase()}`}
                    className="font-dm-sans text-white/60 text-sm hover:text-accent-gold transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Resources */}
          <div>
            <h3 className="font-rajdhani font-semibold text-accent-gold uppercase tracking-[2px] text-sm mb-4">
              Resources
            </h3>
            <ul className="space-y-2">
              {[
                { label: 'DiGRA Digital Library', href: 'https://dl.digra.org' },
                { label: 'ToDiGRA Journal', href: 'https://todigra.org' },
                { label: 'Game Studies Journal', href: 'http://gamestudies.org' },
                { label: 'DiGRA International', href: 'https://digra.org' },
                { label: 'Join the Chapter', href: '/membership' },
              ].map(({ label, href }) => (
                <li key={label}>
                  {href.startsWith('http') ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-dm-sans text-white/60 text-sm hover:text-accent-gold transition-colors"
                    >
                      {label}
                    </a>
                  ) : (
                    <Link
                      to={href}
                      className="font-dm-sans text-white/60 text-sm hover:text-accent-gold transition-colors"
                    >
                      {label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div>
            <h3 className="font-rajdhani font-semibold text-accent-gold uppercase tracking-[2px] text-sm mb-4">
              Get in Touch
            </h3>
            <div className="space-y-3 mb-6">
              <a
                href="mailto:info@digrasa.org"
                className="flex items-center gap-2 font-dm-sans text-white/60 text-sm hover:text-accent-gold transition-colors"
              >
                <FiMail size={14} />
                info@digrasa.org
              </a>
              <div className="flex items-center gap-2 font-dm-sans text-white/60 text-sm">
                <FiMapPin size={14} />
                South Africa
              </div>
            </div>
            <div className="flex gap-4">
              {[FiTwitter, FiLinkedin, FiFacebook].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="text-white/50 hover:text-accent-gold hover:scale-110 transition-all duration-200"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container mx-auto py-4">
          <p className="font-dm-sans text-white/40 text-sm">
            © 2025 DiGRA South Africa. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
