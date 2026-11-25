import { FiMail, FiMapPin, FiArrowRight, FiLock } from 'react-icons/fi'
import { FaDiscord } from 'react-icons/fa'
import SocialIcon, { socialProfiles } from './SocialIcon'
import PixelDivider from './PixelDivider'
import { useContent } from '../content/ContentContext'
import { SmartLink, safeUrl } from '../lib/text'

export default function Footer() {
  const { site, footer } = useContent()
  const profiles = socialProfiles(site).filter((s) => s.network !== 'discord')
  const credits = (site.credits || []).filter((c) => c.name)
  const email = site.contact_email

  return (
    <footer className="dark-textured">
      <PixelDivider variant="full" />

      <div className="container mx-auto py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {/* Brand */}
          <div>
            <div className="font-orbitron font-bold text-accent-gold tracking-[4px] text-base mb-1">
              {footer.title || site.short_name}
            </div>
            {footer.subtitle && (
              <div className="font-rajdhani font-light text-white/70 text-sm tracking-[2px] uppercase mb-4">
                {footer.subtitle}
              </div>
            )}
            {footer.blurb && <p className="font-dm-sans text-white/70 text-base leading-relaxed mb-4">{footer.blurb}</p>}
            {footer.join?.label && (
              <SmartLink
                to={footer.join.url}
                className="inline-flex items-center gap-2 min-h-11 bg-accent-gold text-deep-purple font-rajdhani font-bold uppercase tracking-wider text-sm px-5 shadow-[3px_3px_0_rgba(0,0,0,0.3)] hover:-translate-y-0.5 transition-transform"
              >
                {footer.join.label} <FiArrowRight aria-hidden="true" />
              </SmartLink>
            )}
          </div>

          {/* Link columns */}
          {(footer.columns || []).map((col, ci) => (
            <div key={ci}>
              <h2 className="font-rajdhani font-semibold text-accent-gold uppercase tracking-[2px] text-sm mb-4">{col.heading}</h2>
              <ul className="space-y-2">
                {(col.links || []).filter((l) => l.label && l.url).map((l, li) => (
                  <li key={li}>
                    <SmartLink to={l.url} className="font-dm-sans text-white/70 text-base hover:text-accent-gold transition-colors inline-flex min-h-8 items-center">
                      {l.label}{/^https?:/.test(l.url) ? ' ↗' : ''}
                    </SmartLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <h2 className="font-rajdhani font-semibold text-accent-gold uppercase tracking-[2px] text-sm mb-4">
              {footer.contact_heading || 'Get in Touch'}
            </h2>
            <div className="space-y-3 mb-5">
              {email && (
                <a href={`mailto:${email}`} className="flex items-center gap-2 font-dm-sans text-white/70 text-base hover:text-accent-gold transition-colors break-all">
                  <FiMail size={14} className="shrink-0" aria-hidden="true" />
                  {email}
                </a>
              )}
              {site.location_label && (
                <div className="flex items-center gap-2 font-dm-sans text-white/70 text-base">
                  <FiMapPin size={14} aria-hidden="true" />
                  {site.location_label}
                </div>
              )}
            </div>
            {safeUrl(site.discord_url) && (
              <a
                href={safeUrl(site.discord_url)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 min-h-11 px-4 mb-4 font-rajdhani font-bold uppercase tracking-wider text-sm text-white bg-[#4752C4] shadow-[3px_3px_0_rgba(0,0,0,0.3)] hover:-translate-y-0.5 transition-transform"
              >
                <FaDiscord size={18} aria-hidden="true" /> {site.discord_label || 'Join our Discord'}
              </a>
            )}
            {profiles.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {profiles.map(({ network, label, url }) => (
                  <a
                    key={network + url}
                    href={safeUrl(url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${site.short_name || 'DiGRA SA'} on ${label}`}
                    className="flex items-center justify-center w-11 h-11 text-white/80 hover:text-accent-gold transition-colors"
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
        <div className="container mx-auto py-5 flex flex-col md:flex-row md:items-start md:justify-between gap-3">
          <div className="font-dm-sans text-white/70 text-sm">
            <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
            {footer.legal && <p className="mt-1 text-white/60">{footer.legal}</p>}
            {footer.admin_label !== '' && (
              <a
                href="/admin"
                rel="nofollow"
                className="mt-3 inline-flex items-center gap-2 min-h-10 px-3 border border-white/25 text-white/80 font-rajdhani font-semibold uppercase tracking-wider text-xs hover:text-accent-gold hover:border-accent-gold transition-colors"
              >
                <FiLock aria-hidden="true" /> {footer.admin_label || 'Admin login'}
              </a>
            )}
          </div>
          {credits.length > 0 && (
            <p className="font-dm-sans text-white/70 text-sm md:text-right">
              {site.credit_label || 'Website made by'}{' '}
              {credits.map((c, i) => (
                <span key={i}>
                  {i > 0 && (i === credits.length - 1 ? ' and ' : ', ')}
                  {c.email ? (
                    <a href={`mailto:${c.email}`} className="text-white hover:text-accent-gold underline underline-offset-2 decoration-white/30" title={c.email}>
                      {c.name}
                    </a>
                  ) : (
                    <span className="text-white">{c.name}</span>
                  )}
                </span>
              ))}
              <span className="block text-white/60 mt-0.5">
                {credits.filter((c) => c.email).map((c, i) => (
                  <span key={i}>{i > 0 && ' · '}<a href={`mailto:${c.email}`} className="hover:text-accent-gold">{c.email}</a></span>
                ))}
              </span>
            </p>
          )}
        </div>
      </div>
    </footer>
  )
}
