import { motion } from 'framer-motion'
import { FiCheckCircle, FiMail, FiMapPin } from 'react-icons/fi'
import { FaDiscord } from 'react-icons/fa'
import PageHero from '../components/PageHero'
import PixelDivider from '../components/PixelDivider'
import SectionWrapper from '../components/SectionWrapper'
import Heading from '../components/Heading'
import SocialIcon, { socialProfiles } from '../components/SocialIcon'
import { useContent, usePage } from '../content/ContentContext'
import { accent, ink } from '../lib/theme'
import { Inline, SmartLink, safeUrl } from '../lib/text'
import { FieldError, Honeypot, SendError, emailOk, inputClass, labelClass, useSiteForm } from '../components/FormBits'
import usePageTitle from '../lib/usePageTitle'

function ContactForm({ s }) {
  const f = useSiteForm('contact', { name: '', email: '', subject: '', message: '' }, (v) => {
    const e = {}
    if (!v.name.trim()) e.name = `${s.name_label || 'Name'} is required`
    if (!v.email.trim()) e.email = `${s.email_label || 'Email'} is required`
    else if (!emailOk(v.email)) e.email = 'Enter an email address like name@example.com'
    if (!v.message.trim()) e.message = `${s.message_label || 'Message'} is required`
    return e
  })
  const subjects = (s.subject_options || []).filter(Boolean)

  if (f.submitted) {
    return (
      <motion.div className="text-center py-16 bg-bg-tint" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} role="status">
        <FiCheckCircle size={48} className="text-ink-green mx-auto mb-4" aria-hidden="true" />
        <h3 className="font-rajdhani font-bold text-deep-purple text-3xl mb-3">{s.success_title}</h3>
        <p className="font-dm-sans text-text-secondary text-base max-w-md mx-auto">{s.success_text}</p>
      </motion.div>
    )
  }
  return (
    <form onSubmit={f.onSubmit} noValidate className="relative flex flex-col gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="contact-name" className={labelClass}>{s.name_label} *</label>
          <input id="contact-name" type="text" autoComplete="name" value={f.form.name} onChange={f.set('name')} className={inputClass(f.errors.name)} aria-invalid={!!f.errors.name} aria-describedby={f.errors.name ? 'contact-name-err' : undefined} />
          <FieldError id="contact-name-err">{f.errors.name}</FieldError>
        </div>
        <div>
          <label htmlFor="contact-email" className={labelClass}>{s.email_label} *</label>
          <input id="contact-email" type="email" autoComplete="email" value={f.form.email} onChange={f.set('email')} className={inputClass(f.errors.email)} aria-invalid={!!f.errors.email} aria-describedby={f.errors.email ? 'contact-email-err' : undefined} />
          <FieldError id="contact-email-err">{f.errors.email}</FieldError>
        </div>
      </div>
      {subjects.length > 0 && (
        <div>
          <label htmlFor="contact-subject" className={labelClass}>{s.subject_label}</label>
          <select id="contact-subject" value={f.form.subject} onChange={f.set('subject')} className={inputClass(false)}>
            <option value="">Select</option>
            {subjects.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
      )}
      <div>
        <label htmlFor="contact-message" className={labelClass}>{s.message_label} *</label>
        <textarea id="contact-message" rows={6} value={f.form.message} onChange={f.set('message')} placeholder={s.message_placeholder} className={`${inputClass(f.errors.message)} resize-y`} aria-invalid={!!f.errors.message} aria-describedby={f.errors.message ? 'contact-message-err' : undefined} />
        <FieldError id="contact-message-err">{f.errors.message}</FieldError>
      </div>
      <Honeypot id="contact-website" value={f.honeypot} onChange={f.setHoneypot} />
      <SendError kind={f.sendError} email={f.email} />
      <button type="submit" disabled={f.sending} className="self-start bg-accent-gold text-deep-purple font-rajdhani font-bold uppercase tracking-wider px-8 py-4 shadow-[4px_4px_0_rgba(0,0,0,0.25)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_rgba(0,0,0,0.3)] transition-all duration-200 disabled:opacity-60 disabled:cursor-wait">
        {f.sending ? 'Sending…' : s.button}
      </button>
    </form>
  )
}

function InfoPanel({ s }) {
  const { site } = useContent()
  const profiles = socialProfiles(site).filter((x) => x.network !== 'discord')
  const discord = safeUrl(site.discord_url)
  return (
    <div className="bg-deep-purple p-6 sm:p-8 relative overflow-hidden">
      <h3 className="font-rajdhani font-bold text-white text-xl mb-6">{s.title}</h3>
      <div className="space-y-4 mb-6">
        {site.contact_email && (
          <a href={`mailto:${site.contact_email}`} className="flex items-center gap-3 font-dm-sans text-white/85 text-base hover:text-accent-gold transition-colors break-all">
            <FiMail size={16} className="text-accent-gold flex-shrink-0" aria-hidden="true" />{site.contact_email}
          </a>
        )}
        {site.location_label && (
          <p className="flex items-center gap-3 font-dm-sans text-white/85 text-base">
            <FiMapPin size={16} className="text-accent-orange flex-shrink-0" aria-hidden="true" />{site.location_label}
          </p>
        )}
      </div>
      {discord && (
        <a href={discord} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 mb-6 bg-[#4752C4] text-white hover:-translate-y-0.5 transition-transform shadow-[3px_3px_0_rgba(0,0,0,0.3)]">
          <FaDiscord size={26} aria-hidden="true" />
          <span>
            <span className="block font-rajdhani font-bold uppercase tracking-wider">{site.discord_label || 'Join our Discord'}</span>
            {site.discord_text && <span className="block font-dm-sans text-sm text-white/90">{site.discord_text}</span>}
          </span>
        </a>
      )}
      {profiles.length > 0 && (
        <div>
          <p className="font-rajdhani font-semibold text-white/80 text-sm uppercase tracking-wider mb-3">{s.follow_title}</p>
          <div className="flex flex-wrap gap-2">
            {profiles.map(({ network, label, url }) => (
              <a key={network + url} href={safeUrl(url)} target="_blank" rel="noopener noreferrer" aria-label={`${site.short_name} on ${label}`} className="flex items-center justify-center w-11 h-11 bg-white/5 text-white/80 hover:text-accent-gold hover:bg-white/10 transition-colors">
                <SocialIcon network={network} size={20} />
              </a>
            ))}
          </div>
        </div>
      )}
      <div className="absolute bottom-2 right-2 w-16 h-16 opacity-15" aria-hidden="true" style={{ background: 'repeating-linear-gradient(45deg, #FF6B35 0, #FF6B35 2px, transparent 0, transparent 50%)', backgroundSize: '6px 6px' }} />
    </div>
  )
}

function Quick({ s }) {
  const items = s.items || []
  if (!items.length) return null
  return (
    <section className="bg-bg-tint py-16 md:py-20">
      <div className="container mx-auto">
        <SectionWrapper>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {items.map(({ title, text, link, colour: c }, i) => {
              const colour = accent(c)
              return (
                <div key={i} className="bg-surface p-6 border-t-2" style={{ borderTopColor: colour }}>
                  <h3 className="font-rajdhani font-bold text-text-primary text-lg mb-1">{title}</h3>
                  {text && <p className="font-dm-sans text-text-secondary text-base mb-3">{text}</p>}
                  {link?.label && (
                    <SmartLink to={link.url} className="font-rajdhani font-bold uppercase tracking-wider text-sm min-h-11 inline-flex items-center" style={{ color: ink(colour) }}>
                      {link.label}
                    </SmartLink>
                  )}
                </div>
              )
            })}
          </div>
        </SectionWrapper>
      </div>
    </section>
  )
}

function StayConnected({ s }) {
  const { site } = useContent()
  const profiles = socialProfiles(site)
  if (!profiles.length) return null
  return (
    <section className="bg-surface py-16 md:py-20">
      <div className="container mx-auto">
        <SectionWrapper><Heading eyebrow={s.eyebrow} title={s.title} tone="cyan" /></SectionWrapper>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {profiles.map(({ network, label, url }) => (
            <a key={network + url} href={safeUrl(url)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-5 border border-border-light hover:border-accent-gold hover:-translate-y-0.5 transition-all">
              <span className={`w-11 h-11 flex items-center justify-center ${network === 'discord' ? 'bg-[#4752C4] text-white' : 'bg-deep-purple text-accent-gold'}`}>
                <SocialIcon network={network} size={20} />
              </span>
              <span className="font-rajdhani font-bold text-text-primary text-lg">{label}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function Contact() {
  const { p, sections } = usePage('contact_page')
  usePageTitle(p.hero.title)
  const render = { quick: () => <Quick s={p.quick} />, social: () => <StayConnected s={p.social} /> }
  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
      <PageHero title={p.hero.title} subtitle={p.hero.subtitle} breadcrumb={p.hero.breadcrumb} accentColor="orange" />
      {p.notice.text && (
        <div className="bg-bg-tint border-b border-border-light">
          <div className="container mx-auto py-4">
            <p className="font-dm-sans text-text-primary text-base"><Inline text={p.notice.text} /></p>
          </div>
        </div>
      )}
      <section id="form" className="bg-surface py-16 md:py-24">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 md:gap-10 items-start">
            <div className="lg:col-span-3">
              <SectionWrapper><Heading eyebrow={p.form.eyebrow} title={p.form.title} tone="orange" className="mb-8" /></SectionWrapper>
              <ContactForm s={p.form} />
            </div>
            <SectionWrapper className="lg:col-span-2" delay={0.15}><InfoPanel s={p.info} /></SectionWrapper>
          </div>
        </div>
      </section>
      <PixelDivider variant="full" />
      {sections.map((key) => <div key={key}>{render[key]?.()}</div>)}
    </motion.main>
  )
}
