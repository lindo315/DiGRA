import { useState } from 'react'
import { motion } from 'framer-motion'
import PageHero from '../components/PageHero'
import PixelDivider from '../components/PixelDivider'
import SectionWrapper from '../components/SectionWrapper'
import CtaBanner from '../components/CtaBanner'
import Heading from '../components/Heading'
import TeamCard from '../components/cards/TeamCard'
import TeamMemberModal from '../components/TeamMemberModal'
import { useContent, usePage } from '../content/ContentContext'
import { accent, ink } from '../lib/theme'
import { Paras, SmartLink } from '../lib/text'
import usePageTitle from '../lib/usePageTitle'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }
const BULLETS = ['#F5A623', '#00CFDD', '#E94560', '#3DE87A', '#B45FFF', '#FF6B35']

function Who({ s }) {
  return (
    <section id="who" className="bg-surface py-20 md:py-28">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-10 items-start">
          <SectionWrapper className="lg:col-span-3">
            <Heading eyebrow={s.eyebrow} title={s.title} tone="violet" rule={false} className="mb-6" />
            <Paras text={s.text} className="font-dm-sans text-text-secondary text-base leading-relaxed mb-4" />
          </SectionWrapper>
          {(s.facts || []).length > 0 && (
            <SectionWrapper className="lg:col-span-2" delay={0.15}>
              <div className="bg-deep-purple p-5 sm:p-8 relative overflow-hidden">
                {s.facts_title && <h3 className="font-rajdhani font-semibold text-accent-gold uppercase tracking-[2px] text-sm mb-6 pl-2">{s.facts_title}</h3>}
                <dl className="space-y-4 pl-2">
                  {s.facts.map(({ label, value }, i) => (
                    <div key={i} className="flex flex-col gap-0.5">
                      <dt className="font-rajdhani font-light text-sm uppercase tracking-wider text-accent-gold">{label}</dt>
                      <dd className="font-dm-sans font-medium text-white text-base">{value}</dd>
                    </div>
                  ))}
                </dl>
                <div className="absolute left-0 top-0 bottom-0 w-1 flex flex-col" aria-hidden="true">
                  {['#B45FFF', '#F5A623', '#00CFDD', '#3DE87A', '#E94560', '#FF6B35'].map((c) => <div key={c} className="flex-1" style={{ background: c }} />)}
                </div>
              </div>
            </SectionWrapper>
          )}
        </div>
      </div>
    </section>
  )
}

function Mission({ s }) {
  const goals = s.goals || []
  return (
    <section id="mission" className="bg-bg-tint py-20 md:py-28">
      <div className="container mx-auto">
        <SectionWrapper>
          <Heading title={s.title} tone="violet" center className="mb-8" />
          {s.text && <p className="font-dm-sans text-text-secondary text-lg leading-relaxed mb-12 text-center max-w-3xl mx-auto">{s.text}</p>}
        </SectionWrapper>
        <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-0 max-w-5xl mx-auto" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
          {goals.map(({ colour: c, title, text }, i) => {
            const colour = accent(c)
            return (
              <motion.div key={i} variants={fadeUp} className="flex gap-4 sm:gap-5 items-start p-5 sm:p-8 border border-border-light bg-surface/60">
                <span className="font-rajdhani font-bold text-[32px] sm:text-[40px] md:text-5xl leading-none flex-shrink-0 w-12 sm:w-16" style={{ color: ink(colour) }} aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="pt-1">
                  <div className="w-6 h-[2px] mb-3" style={{ background: colour }} />
                  <h3 className="font-rajdhani font-semibold text-text-primary text-xl mb-2">{title}</h3>
                  <p className="font-dm-sans text-text-secondary text-base leading-relaxed">{text}</p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

function Aims({ s }) {
  return (
    <section id="aims" className="pixel-grid-sparse py-20 md:py-28">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 items-start">
          <SectionWrapper>
            <Heading eyebrow={s.eyebrow} title={s.title} tone="green" rule={false} className="mb-4" />
            {s.text && <p className="font-dm-sans text-text-secondary text-base leading-relaxed">{s.text}</p>}
          </SectionWrapper>
          <ul className="space-y-3">
            {(s.items || []).filter(Boolean).map((aim, i) => (
              <li key={i} className="flex items-start gap-3 font-dm-sans text-text-primary text-base bg-surface p-4 border border-border-light">
                <span className="flex-shrink-0 w-3 h-3 mt-1.5" style={{ background: BULLETS[i % BULLETS.length] }} aria-hidden="true" />
                {aim}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

function Board({ s, onSelect }) {
  const { team } = useContent()
  const leaders = team.filter((m) => m.featured && !m.vacant)
  const others = team.filter((m) => !m.featured || m.vacant)
  const card = (member, variant) => (
    <motion.div key={member.id ?? member.name + member.role} variants={fadeUp} className="h-full">
      <TeamCard member={member} variant={variant} labels={s} onClick={() => onSelect(member)} />
    </motion.div>
  )
  return (
    <section id="board" className="pixel-grid-light py-20 md:py-28">
      <div className="container mx-auto">
        <SectionWrapper>
          <Heading eyebrow={s.eyebrow} title={s.title} tone="orange" className="mb-3" />
          {s.note && <p className="font-dm-sans text-text-secondary text-base mb-10">{s.note}</p>}
        </SectionWrapper>
        {leaders.length > 0 && (
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5 lg:max-w-[66%]" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.05 }}>
            {leaders.map((m) => card(m, 'leader'))}
          </motion.div>
        )}
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.02 }}>
          {others.map((m) => card(m))}
        </motion.div>
      </div>
    </section>
  )
}

function Intl({ s }) {
  return (
    <section id="intl" className="pixel-grid-sparse py-20 md:py-28">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 items-center">
          <SectionWrapper>
            <Heading eyebrow={s.eyebrow} title={s.title} tone="cyan" rule={false} className="mb-4" />
            <Paras text={s.text} className="font-dm-sans text-text-secondary text-base leading-relaxed mb-4" />
          </SectionWrapper>
          <SectionWrapper delay={0.2}>
            <div className="bg-deep-purple p-5 sm:p-8 relative overflow-hidden">
              {s.card_label && <p className="font-rajdhani text-accent-gold uppercase tracking-[2px] text-sm mb-2">{s.card_label}</p>}
              {s.card_title && <p className="font-orbitron text-white text-2xl font-bold mb-4">{s.card_title}</p>}
              {s.card_text && <p className="font-dm-sans text-white/70 text-base mb-6">{s.card_text}</p>}
              {s.link?.label && (
                <SmartLink to={s.link.url} className="inline-flex items-center min-h-11 font-rajdhani font-bold uppercase tracking-wider text-sm text-deep-purple bg-accent-cyan px-5 shadow-[3px_3px_0_rgba(0,0,0,0.3)] hover:-translate-y-0.5 transition-transform">
                  {s.link.label}
                </SmartLink>
              )}
              <div
                className="absolute top-2 right-2 w-16 h-16 opacity-15" aria-hidden="true"
                style={{ background: 'repeating-linear-gradient(45deg, #00CFDD 0, #00CFDD 2px, transparent 0, transparent 50%)', backgroundSize: '6px 6px' }}
              />
            </div>
          </SectionWrapper>
        </div>
      </div>
    </section>
  )
}

function Values({ s }) {
  const items = (s.items || []).slice(0, 4)
  if (!items.length) return null
  return (
    <section className="dark-textured py-12 md:py-16">
      <div className="container mx-auto">
        <SectionWrapper>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5">
            {items.map(({ label, text, colour }, i) => (
              <div key={i} className="bg-deep-purple px-4 py-6 sm:px-6 sm:py-8 text-center">
                <div className="w-8 h-[2px] mx-auto mb-4" style={{ background: accent(colour) }} />
                <p className="font-rajdhani font-bold text-white text-base mb-1">{label}</p>
                <p className="font-dm-sans text-white/70 text-base">{text}</p>
              </div>
            ))}
          </div>
        </SectionWrapper>
      </div>
    </section>
  )
}

export default function About() {
  const { p, sections } = usePage('about')
  const [selected, setSelected] = useState(null)
  usePageTitle(p.hero.title)
  const render = {
    who: () => <Who s={p.who} />,
    mission: () => <Mission s={p.mission} />,
    aims: () => <Aims s={p.aims} />,
    board: () => <Board s={p.board} onSelect={setSelected} />,
    intl: () => <Intl s={p.intl} />,
    values: () => <Values s={p.values} />,
    cta: () => <CtaBanner cta={p.cta} />,
  }
  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
      <PageHero title={p.hero.title} subtitle={p.hero.subtitle} breadcrumb={p.hero.breadcrumb} accentColor="violet" />
      {sections.map((key, i) => (
        <div key={key}>
          {i > 0 && i % 2 === 0 && key !== 'cta' && key !== 'values' && <PixelDivider variant={i % 4 ? 'warm' : 'cool'} />}
          {render[key]?.()}
        </div>
      ))}
      <TeamMemberModal member={selected} onClose={() => setSelected(null)} />
    </motion.main>
  )
}
