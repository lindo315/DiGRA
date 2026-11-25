import { motion } from 'framer-motion'
import { FiExternalLink, FiDownload } from 'react-icons/fi'
import PageHero from '../components/PageHero'
import PixelDivider from '../components/PixelDivider'
import SectionWrapper from '../components/SectionWrapper'
import ResearchCard from '../components/cards/ResearchCard'
import CtaBanner from '../components/CtaBanner'
import Heading from '../components/Heading'
import { useContent, usePage } from '../content/ContentContext'
import { accent, ink } from '../lib/theme'
import { Paras, SmartLink, safeUrl } from '../lib/text'
import usePageTitle from '../lib/usePageTitle'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }
const ROTATE = ['#F5A623', '#00CFDD', '#3DE87A', '#B45FFF', '#E94560', '#FF6B35']

function Field({ s }) {
  return (
    <section id="field" className="bg-surface py-20 md:py-28">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-10 items-start">
          <SectionWrapper className="lg:col-span-3">
            <Heading eyebrow={s.eyebrow} title={s.title} tone="cyan" rule={false} className="mb-6" />
            <Paras text={s.text} className="font-dm-sans text-text-secondary text-base leading-relaxed mb-4" />
          </SectionWrapper>
          <SectionWrapper className="lg:col-span-2 flex flex-col gap-4" delay={0.15}>
            {(s.asides || []).map(({ title, text, colour }, i) => (
              <div key={i} className="bg-bg-tint p-6 border-l-4" style={{ borderColor: accent(colour) }}>
                <p className="font-rajdhani font-semibold text-text-primary text-sm uppercase tracking-wider mb-2">{title}</p>
                <p className="font-dm-sans text-text-secondary text-base leading-relaxed">{text}</p>
              </div>
            ))}
          </SectionWrapper>
        </div>
      </div>
    </section>
  )
}

function Areas({ s }) {
  const { researchAreas } = useContent()
  if (!researchAreas.length) return null
  return (
    <section id="areas" className="pixel-grid-light py-20 md:py-28">
      <div className="container mx-auto">
        <SectionWrapper><Heading eyebrow={s.eyebrow} title={s.title} tone="violet" /></SectionWrapper>
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.05 }}>
          {researchAreas.map((area) => (
            <motion.div key={area.id ?? area.title} variants={fadeUp} className="h-full"><ResearchCard area={area} /></motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function Library({ s }) {
  return (
    <section id="library" className="bg-surface py-20 md:py-28">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 items-center">
          <SectionWrapper>
            <Heading eyebrow={s.eyebrow} title={s.title} tone="gold" rule={false} className="mb-4" />
            <Paras text={s.text} className="font-dm-sans text-text-secondary text-base leading-relaxed mb-4" />
            {s.link?.label && (
              <SmartLink to={s.link.url} className="inline-block mt-2 bg-accent-gold text-deep-purple font-rajdhani font-bold uppercase tracking-wider px-8 py-4 shadow-[4px_4px_0_rgba(0,0,0,0.25)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_rgba(0,0,0,0.3)] transition-all duration-200">
                {s.link.label}
              </SmartLink>
            )}
          </SectionWrapper>
          <SectionWrapper delay={0.2}>
            <div className="bg-deep-purple p-5 sm:p-8 relative overflow-hidden">
              {s.card_label && <p className="font-rajdhani text-accent-gold uppercase tracking-[2px] text-sm mb-2">{s.card_label}</p>}
              <p className="font-orbitron text-white text-2xl font-bold mb-6">{s.title}</p>
              <dl className="grid grid-cols-2 gap-4">
                {(s.facts || []).map(({ label, value }, i) => (
                  <div key={i} className="border-l-2 border-accent-gold/40 pl-3">
                    <dt className="font-rajdhani text-sm text-white/70 uppercase tracking-wider">{label}</dt>
                    <dd className="font-dm-sans text-white font-medium">{value}</dd>
                  </div>
                ))}
              </dl>
              <div className="absolute top-2 right-2 w-16 h-16 opacity-15" aria-hidden="true" style={{ background: 'repeating-linear-gradient(45deg, #F5A623 0, #F5A623 2px, transparent 0, transparent 50%)', backgroundSize: '6px 6px' }} />
            </div>
          </SectionWrapper>
        </div>
      </div>
    </section>
  )
}

function Journals({ s }) {
  const { journals } = useContent()
  if (!journals.length) return null
  return (
    <section id="journals" className="bg-bg-tint py-20 md:py-28">
      <div className="container mx-auto">
        <SectionWrapper><Heading eyebrow={s.eyebrow} title={s.title} tone="red" /></SectionWrapper>
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
          {journals.map((j, i) => {
            const colour = ROTATE[i % 4]
            return (
              <motion.article key={j.id ?? j.name} variants={fadeUp} whileHover={{ y: -4 }} className="bg-surface p-6 border-t-2 flex flex-col" style={{ borderTopColor: colour }}>
                <h3 className="font-rajdhani font-bold text-text-primary text-lg leading-tight mb-3">{j.name}</h3>
                <p className="font-dm-sans text-text-secondary text-base leading-relaxed mb-4 flex-1">{j.description}</p>
                {safeUrl(j.url) && (
                  <SmartLink to={j.url} className="font-rajdhani font-semibold text-sm uppercase tracking-wider min-h-11 inline-flex items-center" style={{ color: ink(colour) }}>
                    {s.link_label || 'Visit →'}<span className="sr-only"> {j.name}</span>
                  </SmartLink>
                )}
              </motion.article>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

function Teaching({ s }) {
  const { teaching } = useContent()
  if (!teaching.length) return null
  return (
    <section id="teaching" className="bg-surface py-20 md:py-28">
      <div className="container mx-auto">
        <SectionWrapper>
          <Heading eyebrow={s.eyebrow} title={s.title} tone="green" className={s.text ? 'mb-4' : 'mb-10'} />
          {s.text && <p className="font-dm-sans text-text-secondary text-base leading-relaxed mb-10 max-w-2xl">{s.text}</p>}
        </SectionWrapper>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {teaching.map((t, i) => {
            const colour = ROTATE[i % ROTATE.length]
            const url = safeUrl(t.url)
            return (
              <motion.div key={t.id ?? t.title} whileHover={{ y: -3 }} className="border border-border-light p-6 hover:border-accent-gold/40 transition-colors duration-200 flex flex-col">
                <div className="w-8 h-1 mb-4" style={{ background: colour }} />
                <h3 className="font-rajdhani font-semibold text-text-primary text-xl mb-2">{t.title}</h3>
                <p className="font-dm-sans text-text-secondary text-base leading-relaxed flex-1">{t.description}</p>
                {url ? (
                  <SmartLink to={url} className="mt-4 inline-flex items-center gap-2 min-h-11 font-rajdhani font-bold uppercase tracking-wider text-sm" style={{ color: ink(colour) }}>
                    {/\.pdf$/i.test(url) ? <>Download <FiDownload aria-hidden="true" /></> : <>Open <FiExternalLink aria-hidden="true" /></>}
                    <span className="sr-only"> {t.title}</span>
                  </SmartLink>
                ) : (
                  t.status && <p className="font-rajdhani text-sm uppercase tracking-wider text-text-secondary mt-4">{t.status}</p>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function Contribute({ s }) {
  return (
    <section className="dark-textured py-16 md:py-20">
      <div className="container mx-auto">
        <SectionWrapper>
          <Heading eyebrow={s.eyebrow} title={s.title} dark rule={false} className="mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(s.items || []).map(({ title, text, colour }, i) => (
              <div key={i} className="border-l-2 pl-5" style={{ borderColor: accent(colour) }}>
                <h3 className="font-rajdhani font-bold text-white text-lg mb-2">{title}</h3>
                <p className="font-dm-sans text-white/70 text-base leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </SectionWrapper>
      </div>
    </section>
  )
}

export default function Research() {
  const { p, sections } = usePage('research_page')
  usePageTitle(p.hero.title)
  const render = {
    field: () => <Field s={p.field} />,
    areas: () => <Areas s={p.areas} />,
    library: () => <Library s={p.library} />,
    journals: () => <Journals s={p.journals} />,
    teaching: () => <Teaching s={p.teaching} />,
    contribute: () => <Contribute s={p.contribute} />,
    cta: () => <CtaBanner cta={p.cta} />,
  }
  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
      <PageHero title={p.hero.title} subtitle={p.hero.subtitle} breadcrumb={p.hero.breadcrumb} accentColor="cyan" />
      {sections.map((key, i) => (
        <div key={key}>
          {i === 2 && <PixelDivider variant="cool" />}
          {render[key]?.()}
        </div>
      ))}
    </motion.main>
  )
}
