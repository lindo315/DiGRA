import { motion } from 'framer-motion'
import { FiCheck, FiCheckCircle } from 'react-icons/fi'
import PageHero from '../components/PageHero'
import PixelDivider from '../components/PixelDivider'
import PixelSprite from '../components/PixelSprite'
import SectionWrapper from '../components/SectionWrapper'
import Heading from '../components/Heading'
import { usePage } from '../content/ContentContext'
import { accent } from '../lib/theme'
import { Paras } from '../lib/text'
import { FieldError, Honeypot, SendError, emailOk, inputClass, labelClass, useSiteForm } from '../components/FormBits'
import usePageTitle from '../lib/usePageTitle'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }

function Benefits({ s }) {
  return (
    <section id="benefits" className="bg-surface py-20 md:py-28">
      <div className="container mx-auto">
        <SectionWrapper><Heading eyebrow={s.eyebrow} title={s.title} tone="gold" center /></SectionWrapper>
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
          {(s.items || []).map(({ sprite, title, text, colour: c }, i) => {
            const colour = accent(c)
            return (
              <motion.div key={i} variants={fadeUp} className="flex flex-col p-6 border-t-2 hover:shadow-md transition-shadow duration-200" style={{ borderTopColor: colour }}>
                <div className="mb-4"><PixelSprite name={sprite} colour={colour} size={28} /></div>
                <h3 className="font-rajdhani font-bold text-text-primary text-xl mb-2">{title}</h3>
                <p className="font-dm-sans text-text-secondary text-base leading-relaxed">{text}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

function Eligibility({ s }) {
  return (
    <section id="eligibility" className="pixel-grid-sparse py-20 md:py-28">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 items-start">
          <SectionWrapper>
            <Heading eyebrow={s.eyebrow} title={s.title} tone="green" rule={false} className="mb-4" />
            {s.text && <p className="font-dm-sans text-text-secondary text-base leading-relaxed">{s.text}</p>}
          </SectionWrapper>
          <SectionWrapper delay={0.15}>
            <ul className="bg-surface border border-border-light p-6 space-y-3">
              {(s.items || []).filter(Boolean).map((item, i) => (
                <li key={i} className="flex items-start gap-3 font-dm-sans text-text-primary text-base">
                  <FiCheck size={16} className="flex-shrink-0 mt-1 text-ink-green" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </SectionWrapper>
        </div>
      </div>
    </section>
  )
}

function Tiers({ s }) {
  const tiers = s.items || []
  return (
    <section id="tiers" className="bg-bg-tint py-20 md:py-28">
      <div className="container mx-auto">
        <SectionWrapper><Heading eyebrow={s.eyebrow} title={s.title} tone="violet" center /></SectionWrapper>
        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
          {tiers.map((tier, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className={`relative flex flex-col p-8 ${tier.badge ? 'border-2 border-accent-gold bg-white shadow-[4px_4px_0_rgba(245,166,35,0.3)]' : 'border border-border-light bg-white shadow-sm'}`}
            >
              {tier.badge && (
                <span className="absolute -top-3 left-6 font-rajdhani font-bold text-sm uppercase tracking-[2px] px-3 py-0.5 bg-accent-gold text-deep-purple">{tier.badge}</span>
              )}
              <h3 className="font-rajdhani font-bold text-deep-purple text-2xl mb-1">{tier.name}</h3>
              <p className="font-dm-sans text-text-secondary text-base mb-6">{tier.price}</p>
              <ul className="space-y-3 flex-1">
                {(tier.features || []).filter(Boolean).map((f, j) => (
                  <li key={j} className="flex items-start gap-2 font-dm-sans text-text-secondary text-base">
                    <FiCheck size={14} className="flex-shrink-0 mt-1.5 text-ink-gold" aria-hidden="true" />{f}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
        {s.note && <p className="font-dm-sans text-text-secondary text-base text-center mt-8">{s.note}</p>}
      </div>
    </section>
  )
}

function Steps({ s }) {
  const steps = s.items || []
  return (
    <section id="steps" className="bg-surface py-20 md:py-28">
      <div className="container mx-auto">
        <SectionWrapper><Heading eyebrow={s.eyebrow} title={s.title} tone="orange" center /></SectionWrapper>
        <ol className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4 max-w-5xl mx-auto">
          {steps.map((step, i) => (
            <li key={i} className="relative flex md:flex-col md:items-center gap-4 md:gap-0 md:text-center">
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-6 left-[calc(50%+28px)] right-[calc(-50%+28px)] h-[2px] bg-[repeating-linear-gradient(90deg,#F5A623_0,#F5A623_6px,transparent_6px,transparent_12px)]" aria-hidden="true" />
              )}
              <span className="relative z-10 flex-shrink-0 w-12 h-12 flex items-center justify-center bg-accent-gold text-deep-purple font-rajdhani font-bold text-xl shadow-[3px_3px_0_rgba(0,0,0,0.2)] md:mb-4">
                {i + 1}
              </span>
              <div>
                <h3 className="font-rajdhani font-semibold text-text-primary text-lg mb-1">{step.title}</h3>
                <p className="font-dm-sans text-text-secondary text-base leading-relaxed md:px-2">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function JoinForm({ s }) {
  const f = useSiteForm('membership', { name: '', email: '', institution: '', role: '', interests: '', heard: '' }, (v) => {
    const e = {}
    if (!v.name.trim()) e.name = `${s.name_label || 'Name'} is required`
    if (!v.email.trim()) e.email = `${s.email_label || 'Email'} is required`
    else if (!emailOk(v.email)) e.email = 'Enter an email address like name@example.com'
    return e
  })
  const first = f.form.name.trim().split(' ')[0]
  const opts = (list) => (list || []).filter(Boolean)

  return (
    <section id="form" className="bg-bg-tint py-20 md:py-28">
      <div className="container mx-auto">
        <SectionWrapper><Heading eyebrow={s.eyebrow} title={s.title} tone="gold" /></SectionWrapper>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-10 items-start">
          <div className="lg:col-span-3 bg-surface p-6 sm:p-8 border border-border-light">
            {f.submitted ? (
              <motion.div className="text-center py-16" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} role="status">
                <FiCheckCircle size={48} className="text-ink-green mx-auto mb-4" aria-hidden="true" />
                <h3 className="font-rajdhani font-bold text-deep-purple text-3xl mb-3">{(s.success_title || 'Thank you!').replace('{name}', first)}</h3>
                <p className="font-dm-sans text-text-secondary text-base max-w-md mx-auto">{s.success_text}</p>
              </motion.div>
            ) : (
              <form onSubmit={f.onSubmit} noValidate className="relative flex flex-col gap-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="membership-name" className={labelClass}>{s.name_label} *</label>
                    <input id="membership-name" type="text" autoComplete="name" value={f.form.name} onChange={f.set('name')} placeholder={s.name_placeholder} className={inputClass(f.errors.name)} aria-invalid={!!f.errors.name} aria-describedby={f.errors.name ? 'membership-name-err' : undefined} />
                    <FieldError id="membership-name-err">{f.errors.name}</FieldError>
                  </div>
                  <div>
                    <label htmlFor="membership-email" className={labelClass}>{s.email_label} *</label>
                    <input id="membership-email" type="email" autoComplete="email" value={f.form.email} onChange={f.set('email')} placeholder={s.email_placeholder} className={inputClass(f.errors.email)} aria-invalid={!!f.errors.email} aria-describedby={f.errors.email ? 'membership-email-err' : undefined} />
                    <FieldError id="membership-email-err">{f.errors.email}</FieldError>
                  </div>
                </div>
                <div>
                  <label htmlFor="membership-institution" className={labelClass}>{s.institution_label}</label>
                  <input id="membership-institution" type="text" autoComplete="organization" value={f.form.institution} onChange={f.set('institution')} placeholder={s.institution_placeholder} className={inputClass(false)} />
                </div>
                {opts(s.role_options).length > 0 && (
                  <div>
                    <label htmlFor="membership-role" className={labelClass}>{s.role_label}</label>
                    <select id="membership-role" value={f.form.role} onChange={f.set('role')} className={inputClass(false)}>
                      <option value="">Select</option>
                      {opts(s.role_options).map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                )}
                <div>
                  <label htmlFor="membership-interests" className={labelClass}>{s.interests_label}</label>
                  <textarea id="membership-interests" rows={4} value={f.form.interests} onChange={f.set('interests')} placeholder={s.interests_placeholder} className={`${inputClass(false)} resize-y`} />
                </div>
                {opts(s.heard_options).length > 0 && (
                  <div>
                    <label htmlFor="membership-heard" className={labelClass}>{s.heard_label}</label>
                    <select id="membership-heard" value={f.form.heard} onChange={f.set('heard')} className={inputClass(false)}>
                      <option value="">Select</option>
                      {opts(s.heard_options).map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                )}
                <Honeypot id="membership-website" value={f.honeypot} onChange={f.setHoneypot} />
                <SendError kind={f.sendError} email={f.email} />
                <button type="submit" disabled={f.sending} className="self-start bg-accent-gold text-deep-purple font-rajdhani font-bold uppercase tracking-wider px-8 py-4 shadow-[4px_4px_0_rgba(0,0,0,0.25)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_rgba(0,0,0,0.3)] transition-all duration-200 disabled:opacity-60 disabled:cursor-wait">
                  {f.sending ? 'Sending…' : s.button}
                </button>
              </form>
            )}
          </div>
          <aside className="lg:col-span-2 bg-deep-purple p-6 sm:p-8 relative overflow-hidden">
            <Paras text={s.text} className="font-dm-sans text-white/85 text-base leading-relaxed mb-4 [&_a]:text-accent-gold" />
            {opts(s.next_steps).length > 0 && (
              <ol className="space-y-4">
                {opts(s.next_steps).map((t, i) => (
                  <li key={i} className="flex gap-3 items-start font-dm-sans text-white text-base">
                    <span className="w-7 h-7 shrink-0 flex items-center justify-center bg-accent-gold text-deep-purple font-rajdhani font-bold">{i + 1}</span>
                    <span className="pt-0.5">{t}</span>
                  </li>
                ))}
              </ol>
            )}
            <div className="absolute bottom-2 right-2 w-16 h-16 opacity-15" aria-hidden="true" style={{ background: 'repeating-linear-gradient(45deg, #F5A623 0, #F5A623 2px, transparent 0, transparent 50%)', backgroundSize: '6px 6px' }} />
          </aside>
        </div>
      </div>
    </section>
  )
}

export default function Membership() {
  const { p, sections } = usePage('membership_page')
  usePageTitle(p.hero.title)
  const render = {
    benefits: () => <Benefits s={p.benefits} />,
    eligibility: () => <Eligibility s={p.eligibility} />,
    tiers: () => <Tiers s={p.tiers} />,
    steps: () => <Steps s={p.steps} />,
    form: () => <JoinForm s={p.form} />,
  }
  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
      <PageHero title={p.hero.title} subtitle={p.hero.subtitle} breadcrumb={p.hero.breadcrumb} accentColor="gold" />
      {sections.map((key, i) => (
        <div key={key}>
          {i === 2 && <PixelDivider variant="warm" />}
          {render[key]?.()}
        </div>
      ))}
    </motion.main>
  )
}
