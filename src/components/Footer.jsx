import { Link } from 'react-router-dom'
import { FiMail, FiMapPin, FiArrowRight } from 'react-icons/fi'
import SocialIcon from './SocialIcon'
import { CONTACT_EMAIL, SOCIAL_LINKS } from '../data/site'
import PixelDivider from './PixelDivider'

export default function Footer() {
  return (
    <footer className="dark-textured">
      <PixelDivider variant="full" />

      <div className="container mx-auto py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
          {/* Col 1: Brand */}
          <div>
            <div className="font-orbitron font-bold text-accent-gold tracking-[4px] text-base mb-1">
              DiGRA SA
            </div>
            <div className="font-rajdhani font-light text-white/70 text-sm tracking-[2px] uppercase mb-4">
              South Africa Chapter
            </div>
            <p className="font-dm-sans text-white/70 text-base leading-relaxed mb-4">
              The official South African chapter of the Digital Games Research Association.
            </p>
            <a
              href="https://digra.org"
              target="_blank"
              rel="noopener noreferrer"
              className="font-dm-sans text-accent-gold text-base hover:underline"
            >
              DiGRA International ↗
            </a>
            <Link
              to="/membership#join-form"
              className="mt-6 inline-flex items-center gap-2 min-h-11 bg-accent-gold text-deep-purple font-rajdhani font-bold uppercase tracking-wider px-5 text-sm shadow-[3px_3px_0_rgba(0,0,0,0.3)] hover:-translate-y-0.5 hover:shadow-[4px_5px_0_rgba(0,0,0,0.35)] transition-all"
            >
              Join the Chapter <FiArrowRight aria-hidden="true" />
            </Link>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h2 className="font-rajdhani font-semibold text-accent-gold uppercase tracking-[2px] text-sm mb-4">
              Quick Links
            </h2>
            <ul className="space-y-2">
              {['Home', 'About', 'Events', 'Research', 'News', 'Membership', 'Contact'].map((label) => (
                <li key={label}>
                  <Link
                    to={label === 'Home' ? '/' : `/${label.toLowerCase()}`}
                    className="font-dm-sans text-white/60 text-base hover:text-accent-gold transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Resources */}
          <div>
            <h2 className="font-rajdhani font-semibold text-accent-gold uppercase tracking-[2px] text-sm mb-4">
              Resources
            </h2>
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
                      className="font-dm-sans text-white/60 text-base hover:text-accent-gold transition-colors"
                    >
                      {label}
                    </a>
                  ) : (
                    <Link
                      to={href}
                      className="font-dm-sans text-white/60 text-base hover:text-accent-gold transition-colors"
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
            <h2 className="font-rajdhani font-semibold text-accent-gold uppercase tracking-[2px] text-sm mb-4">
              Get in Touch
            </h2>
            <div className="space-y-3 mb-6">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="flex items-center gap-2 font-dm-sans text-white/60 text-base hover:text-accent-gold transition-colors"
              >
                <FiMail size={14} />
                {CONTACT_EMAIL}
              </a>
              <div className="flex items-center gap-2 font-dm-sans text-white/60 text-base">
                <FiMapPin size={14} />
                South Africa
              </div>
            </div>
            {SOCIAL_LINKS.length > 0 && (
              <div className="flex gap-2">
                {SOCIAL_LINKS.map(({ network, name, url }) => (
                  <a
                    key={network}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`DiGRA SA on ${name}`}
                    className="flex items-center justify-center w-11 h-11 text-white/80 hover:text-accent-gold hover:scale-110 transition-all duration-200"
                  >
                    <SocialIcon network={network} size={20} />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container mx-auto py-4">
          <p className="font-dm-sans text-white/70 text-base">
            © {new Date().getFullYear()} DiGRA South Africa. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
