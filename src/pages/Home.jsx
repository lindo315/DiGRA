import { motion } from 'framer-motion'
import { FiArrowRight, FiCalendar, FiMapPin } from 'react-icons/fi'
import { FaDiscord } from 'react-icons/fa'
import PixelDivider from '../components/PixelDivider'
import PixelSprite from '../components/PixelSprite'
import SectionWrapper from '../components/SectionWrapper'
import NewsCard from '../components/cards/NewsCard'
import EventCard from '../components/cards/EventCard'
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
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }

// Light text on red blocks, dark text on the other accents.
const fgFor = (colour) => (colour === 'red' ? '#FFFFFF' : '#1C0A3A')
const bgFor = (colour) => (colour === 'red' ? '#C2183A' : accent(colour))

function Hero({ h }) {
  const { upcomingEvents } = useContent()
  const next = upcomingEvents.find((e) => e.startDate) || upcomingEvents[0]
  const blocks = (h.blocks || []).slice(0, 4)
  const stats = (h.stats || []).filter((s) => s.label || s.value)

  return (
    <section className="dark-textured relative overflow-hidden lg:min-h-[calc(100vh-64px)] lg:max-h-[900px] flex flex-col justify-between">
      <div
        className="pointer-events-none absolute right-0 top-0 h-[250px] w-[250px] sm:h-[400px] sm:w-[400px] md:h-[500px] md:w-[500px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(0,207,221,0.08) 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="container mx-auto py-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center w-full">
          <div className="lg:col-span-3">
            {h.eyebrow && (
              <motion.p
                className="font-rajdhani font-semibold text-accent-gold text-sm uppercase tracking-[3px] mb-6"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }}
              >
                <span className="text-accent-gold mr-2" aria-hidden="true">■</span>
                {h.eyebrow}
              </motion.p>
            )}

            <motion.h1
              className="font-rajdhani font-bold text-[44px] sm:text-5xl md:text-[64px] leading-[1.05] mb-6"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}
            >
              <span className="text-white block">{h.title_1}</span>
              {h.title_2 && <span className="text-accent-gold block">{h.title_2}</span>}
            </motion.h1>

            {h.text && (
              <motion.p
                className="font-dm-sans text-white/85 text-lg max-w-[560px] leading-[1.7] mb-8"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.5 }}
              >
                {h.text}
              </motion.p>
            )}

            <motion.div
              className="flex flex-col sm:flex-row flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.5 }}
            >
              {h.primary?.label && (
                <SmartLink
                  to={h.primary.url}
                  className="w-full sm:w-auto text-center bg-accent-gold text-deep-purple font-rajdhani font-bold uppercase tracking-wider px-8 py-4 shadow-[4px_4px_0_rgba(0,0,0,0.25)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_rgba(0,0,0,0.3)] transition-all duration-200"
                >
                  {h.primary.label}
                </SmartLink>
              )}
              {h.secondary?.label && (
                <SmartLink
                  to={h.secondary.url}
                  className="w-full sm:w-auto text-center border-2 border-white text-white font-rajdhani font-bold uppercase tracking-wider px-8 py-4 hover:bg-white hover:text-deep-purple transition-all duration-200"
                >
                  {h.secondary.label}
                </SmartLink>
              )}
            </motion.div>

            {/* Next event, so the most time-sensitive thing is visible straight away */}
            {next && h.show_next !== false && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65, duration: 0.5 }}>
                <SmartLink
                  to="/events#upcoming"
                  className="mt-8 inline-flex flex-wrap items-center gap-x-4 gap-y-1 border-l-4 border-accent-cyan bg-white/5 hover:bg-white/10 transition-colors px-4 py-3 max-w-[560px]"
                >
                  <span className="font-rajdhani font-bold text-accent-cyan text-sm uppercase tracking-[2px]">{h.next_label || 'Next up'}</span>
                  <span className="font-rajdhani font-bold text-white text-lg leading-tight">{next.title}</span>
                  <span className="flex flex-wrap gap-x-4 font-dm-sans text-white/75 text-sm">
                    <span className="inline-flex items-center gap-1.5"><FiCalendar aria-hidden="true" />{next.date}</span>
                    {next.location && <span className="inline-flex items-center gap-1.5"><FiMapPin aria-hidden="true" />{next.location}</span>}
                  </span>
                </SmartLink>
              </motion.div>
            )}
          </div>

          {/* Pixel-art blocks */}
          {blocks.length > 0 && (
            <div className="lg:col-span-2 hidden md:flex justify-center items-center">
              <motion.div className="relative" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6, duration: 0.8 }}>
                <div className="flex flex-col w-56">
                  {blocks.map(({ sprite, label, tag, colour }, i) => {
                    const bg = bgFor(colour)
                    const fg = fgFor(colour)
                    return (
                      <div key={i}>
                        {i > 0 && <PixelDivider variant={i % 2 ? 'warm' : 'cool'} height={14} />}
                        <motion.div
                          className="px-6 py-8 flex flex-col items-center justify-center gap-2 relative overflow-hidden cursor-default"
                          style={{ background: bg }}
                          whileHover={{ scale: 1.03 }}
                          transition={{ duration: 0.15 }}
                        >
                          <div
                            className="absolute top-0 right-0 w-14 h-14 opacity-20" aria-hidden="true"
                            style={{ background: `repeating-linear-gradient(45deg, ${fg} 0, ${fg} 1.5px, transparent 0, transparent 50%)`, backgroundSize: '5px 5px' }}
                          />
                          <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: `${fg}40` }} />
                          <PixelSprite name={sprite} colour={fg} size={44} />
                          <div className="text-center">
                            <p className="font-rajdhani font-bold text-xl tracking-[4px] uppercase leading-none" style={{ color: fg }}>{label}</p>
                            {tag && <p className="font-dm-sans text-sm tracking-[2px] uppercase mt-1" style={{ color: fg }}>{tag}</p>}
                          </div>
                        </motion.div>
                      </div>
                    )
                  })}
                </div>
                <div
                  className="absolute -inset-6 -z-10 blur-2xl opacity-40" aria-hidden="true"
                  style={{ background: 'linear-gradient(180deg, rgba(245,166,35,0.6) 0%, rgba(0,207,221,0.6) 50%, rgba(233,69,96,0.6) 100%)' }}
                />
                <div
                  className="absolute -right-8 -top-8 w-24 h-24 opacity-15" aria-hidden="true"
                  style={{ background: 'repeating-linear-gradient(45deg, #00CFDD 0, #00CFDD 2px, transparent 0, transparent 50%)', backgroundSize: '8px 8px' }}
                />
              </motion.div>
            </div>
          )}
        </div>
      </div>

      {stats.length > 0 && (
        <motion.div
          className="border-t border-accent-gold/20 bg-deep-purple/80"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.5 }}
        >
          <div className="container mx-auto py-5">
            <div className={`grid grid-cols-1 ${['', 'sm:grid-cols-1', 'sm:grid-cols-2', 'sm:grid-cols-3', 'sm:grid-cols-4'][Math.min(stats.length, 4)]} divide-y sm:divide-y-0 sm:divide-x divide-white/10`}>
              {stats.map(({ label, value }, i) => (
                <div key={i} className="px-6 py-3 text-center sm:text-left first:pl-0">
                  <p className="font-rajdhani font-semibold text-white text-sm">{label}</p>
                  <p className="font-dm-sans text-white/70 text-base mt-0.5">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </section>
  )
}

function Paths({ s }) {
  const items = s.items || []
  return (
    <section className="bg-surface py-20 md:py-28" aria-labelledby="start-here-title">
      <div className="container mx-auto">
        <SectionWrapper>
          <Heading eyebrow={s.eyebrow} title={s.title} tone="violet" id="start-here-title" rule={false} className="mb-3" />
          {s.text && <p className="font-dm-sans text-text-secondary text-lg leading-[1.7] max-w-2xl mb-12">{s.text}</p>}
        </SectionWrapper>
        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }}>
          {items.map(({ audience, title, text, colour: c, links }, i) => {
            const colour = accent(c)
            return (
              <motion.article
                key={i}
                variants={fadeUp}
                className={`relative flex flex-col bg-surface border border-border-light p-7 hover:shadow-[0_14px_40px_rgba(28,10,58,0.12)] hover:-translate-y-1 transition-all duration-200 ${i === 1 ? 'md:translate-y-6 md:hover:translate-y-5' : ''}`}
                style={{ borderTop: `4px solid ${colour}` }}
              >
                <div
                  className="absolute top-0 right-0 w-20 h-20 opacity-[0.14] pointer-events-none" aria-hidden="true"
                  style={{ background: `repeating-linear-gradient(45deg, ${colour} 0, ${colour} 2px, transparent 0, transparent 50%)`, backgroundSize: '7px 7px' }}
                />
                <p className="font-rajdhani font-bold text-sm uppercase tracking-[2px] mb-2" style={{ color: ink(colour) }}>{audience}</p>
                <h3 className="font-rajdhani font-bold text-deep-purple text-2xl leading-tight mb-3">{title}</h3>
                <p className="font-dm-sans text-text-secondary text-base leading-[1.7] mb-6 flex-1">{text}</p>
                <ul className="space-y-1">
                  {(links || []).filter((l) => l.label && l.url).map((l, j) => (
                    <li key={j}>
                      <SmartLink to={l.url} className="inline-flex items-center gap-2 min-h-11 font-rajdhani font-bold uppercase tracking-wider text-sm hover:gap-3 transition-all" style={{ color: ink(colour) }}>
                        {l.label} <FiArrowRight aria-hidden="true" />
                      </SmartLink>
                    </li>
                  ))}
                </ul>
              </motion.article>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

function Events({ s }) {
  const { upcomingEvents } = useContent()
  const list = upcomingEvents.slice(0, Math.max(1, Number(s.count) || 4))
  return (
    <section className="pixel-grid-dark py-20 md:py-28" id="upcoming">
      <div className="container mx-auto">
        <SectionWrapper>
          <div className="flex items-end justify-between mb-12 gap-4 flex-wrap">
            <div>
              <p className="font-rajdhani font-semibold text-accent-gold text-sm uppercase tracking-[3px] mb-3">
                <span className="text-accent-gold mr-2" aria-hidden="true">■</span>{s.eyebrow}
              </p>
              <h2 className="font-rajdhani font-bold text-white text-4xl sm:text-5xl mb-3">{s.title}</h2>
              <div className="h-[3px] w-20" style={{ background: 'linear-gradient(90deg, #F5A623, #FF6B35)' }} />
            </div>
            {s.link_label && (
              <SmartLink to="/events" className="font-rajdhani font-semibold text-accent-gold uppercase tracking-wider text-sm flex items-center gap-2 hover:gap-3 transition-all duration-200 min-h-11">
                {s.link_label} <FiArrowRight aria-hidden="true" />
              </SmartLink>
            )}
          </div>
        </SectionWrapper>
        {list.length > 0 ? (
          <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
            {list.map((event) => (
              <motion.div key={event.id ?? event.title} variants={fadeUp}><EventCard event={event} /></motion.div>
            ))}
          </motion.div>
        ) : (
          <p className="font-dm-sans text-white/75 text-lg max-w-2xl">{s.empty}</p>
        )}
      </div>
    </section>
  )
}

function News({ s }) {
  const { news } = useContent()
  const latest = news.slice(0, Math.min(3, Math.max(1, Number(s.count) || 3)))
  if (!latest.length) return null
  return (
    <section className="dark-textured py-20 md:py-28">
      <div className="container mx-auto">
        <SectionWrapper>
          <div className="flex items-end justify-between mb-10 gap-4 flex-wrap">
            <Heading eyebrow={s.eyebrow} title={s.title} dark className="" />
            {s.link_label && (
              <SmartLink to="/news" className="font-rajdhani font-semibold text-accent-gold uppercase tracking-wider text-sm flex items-center gap-2 hover:gap-3 transition-all duration-200 min-h-11">
                {s.link_label} <FiArrowRight aria-hidden="true" />
              </SmartLink>
            )}
          </div>
        </SectionWrapper>
        <motion.div className="grid grid-cols-1 lg:grid-cols-5 gap-4" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
          <motion.div className={latest.length > 1 ? 'lg:col-span-3' : 'lg:col-span-5'} variants={fadeUp}>
            <NewsCard item={latest[0]} variant="featured" />
          </motion.div>
          {latest.length > 1 && (
            <div className="lg:col-span-2 flex flex-col gap-4">
              {latest.slice(1).map((item) => (
                <motion.div key={item.id ?? item.slug} variants={fadeUp}><NewsCard item={item} variant="secondary" /></motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}

function Mission({ s }) {
  return (
    <section className="pixel-grid-sparse py-20 md:py-28">
      <div className="container mx-auto">
        <SectionWrapper>
          <Heading eyebrow={s.eyebrow} title={s.title} tone="gold" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(s.items || []).map(({ sprite, title, text, colour: c }, i) => {
              const colour = accent(c)
              return (
                <div key={i} className="group">
                  <div className="w-12 h-12 flex items-center justify-center mb-4" style={{ background: `${colour}18` }}>
                    <PixelSprite name={sprite} colour={colour} size={28} />
                  </div>
                  <h3 className="font-rajdhani font-semibold text-deep-purple text-xl mb-2">{title}</h3>
                  <p className="font-dm-sans text-text-secondary text-base leading-relaxed">{text}</p>
                  <div className="mt-4 h-[2px] w-12 group-hover:w-full transition-all duration-300" style={{ background: colour }} />
                </div>
              )
            })}
          </div>
        </SectionWrapper>
      </div>
    </section>
  )
}

function About({ s }) {
  return (
    <section className="pixel-grid-light py-20 md:py-28">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center">
          <SectionWrapper className="lg:col-span-3">
            <Heading eyebrow={s.eyebrow} title={s.title} tone="gold" rule={false} className="mb-6" />
            <Paras text={s.text} className="font-dm-sans text-text-secondary text-base leading-relaxed mb-4" />
            {s.link?.label && (
              <SmartLink to={s.link.url} className="font-rajdhani font-semibold text-ink-gold uppercase tracking-wider text-sm inline-flex items-center gap-2 min-h-11 hover:gap-3 transition-all duration-200 mt-2">
                {s.link.label} <FiArrowRight aria-hidden="true" />
              </SmartLink>
            )}
          </SectionWrapper>
          {s.quote && (
            <SectionWrapper className="lg:col-span-2" delay={0.2}>
              <figure className="bg-deep-purple p-8 relative overflow-hidden">
                <PixelDivider variant="warm" height={14} />
                <blockquote className="pt-10 pb-4 text-center">
                  <p className="font-orbitron text-accent-gold text-2xl leading-tight">{s.quote}</p>
                </blockquote>
                {s.quote_source && <figcaption className="pb-6 text-center font-dm-sans italic text-white/70 text-base">{s.quote_source}</figcaption>}
                <div
                  className="absolute bottom-2 right-2 w-16 h-16 opacity-15" aria-hidden="true"
                  style={{ background: 'repeating-linear-gradient(45deg, #B45FFF 0, #B45FFF 2px, transparent 0, transparent 50%)', backgroundSize: '6px 6px' }}
                />
              </figure>
            </SectionWrapper>
          )}
        </div>
      </div>
    </section>
  )
}

const PERSON_COLOURS = ['#F5A623', '#00CFDD', '#E94560', '#3DE87A', '#B45FFF', '#FF6B35']

function People({ s }) {
  const { team, settings } = useContent()
  const vacantName = settings.about?.board?.vacant_name || 'Vacant seat'
  const people = team.filter((m) => s.include_vacant || !m.vacant).slice(0, Math.max(1, Number(s.count) || 4))
  if (!people.length) return null
  return (
    <section className="bg-surface py-20 md:py-28">
      <div className="container mx-auto">
        <SectionWrapper>
          <div className="flex items-end justify-between mb-10 gap-4 flex-wrap">
            <Heading eyebrow={s.eyebrow} title={s.title} tone="orange" className="" />
            {s.link_label && (
              <SmartLink to="/about#board" className="font-rajdhani font-semibold text-ink-gold uppercase tracking-wider text-sm flex items-center gap-2 hover:gap-3 transition-all duration-200 min-h-11">
                {s.link_label} <FiArrowRight aria-hidden="true" />
              </SmartLink>
            )}
          </div>
        </SectionWrapper>
        <motion.div className="grid grid-cols-2 sm:grid-cols-4 gap-4" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
          {people.map((member, i) => {
            const colour = PERSON_COLOURS[i % PERSON_COLOURS.length]
            return (
              <motion.div key={member.id ?? i} variants={fadeUp}>
                <SmartLink to="/about#board" className="block bg-bg-tint overflow-hidden group h-full" style={{ borderTop: `2px solid ${colour}` }}>
                  <div className="aspect-[4/3] overflow-hidden flex items-center justify-center" style={{ background: `${colour}10` }}>
                    {member.photo ? (
                      <img src={member.photo} alt="" loading="lazy" className="w-full h-full object-cover object-[50%_20%] group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <PixelSprite name="community" colour={colour} size={40} />
                    )}
                  </div>
                  <div className="p-4">
                    <p className="font-rajdhani font-bold text-sm uppercase tracking-[2px] mb-0.5 truncate" style={{ color: ink(colour) }}>{member.role}</p>
                    <p className="font-rajdhani font-bold text-text-primary text-base leading-tight">{member.vacant ? vacantName : member.name}</p>
                    {member.institution && <p className="font-dm-sans italic text-text-secondary text-base mt-1 truncate">{member.institution}</p>}
                  </div>
                </SmartLink>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

function Gap({ s }) {
  return (
    <section className="dark-textured py-20 md:py-28">
      <div className="container mx-auto">
        <SectionWrapper>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <Heading eyebrow={s.eyebrow} title={s.title} tone="violet" dark rule={false} className="mb-6" />
              <Paras text={s.text} className="font-dm-sans text-white/75 text-base leading-relaxed mb-4" />
              {s.link?.label && (
                <SmartLink to={s.link.url} className="font-rajdhani font-semibold text-accent-cyan uppercase tracking-wider text-sm inline-flex items-center gap-2 min-h-11 hover:gap-3 transition-all duration-200 mt-2">
                  {s.link.label} <FiArrowRight aria-hidden="true" />
                </SmartLink>
              )}
            </div>
            <div className="grid grid-cols-1 gap-3">
              {(s.points || []).map(({ sprite, colour: c, title, text }, i) => {
                const colour = accent(c)
                return (
                  <div key={i} className="flex items-start gap-4 p-4 border border-white/5 hover:border-white/15 transition-colors duration-200" style={{ background: `${colour}06` }}>
                    <div className="w-10 h-10 shrink-0 flex items-center justify-center" style={{ background: `${colour}18` }}>
                      <PixelSprite name={sprite} colour={colour} size={20} />
                    </div>
                    <div>
                      <h3 className="font-rajdhani font-bold text-white text-lg leading-tight">{title}</h3>
                      <p className="font-dm-sans text-white/70 text-base leading-relaxed">{text}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </SectionWrapper>
      </div>
    </section>
  )
}

function Discord({ s }) {
  const { site } = useContent()
  const url = safeUrl(site.discord_url)
  if (!url) return null
  return (
    <section className="bg-bg-tint py-16 md:py-20">
      <div className="container mx-auto">
        <SectionWrapper>
          <div className="relative bg-deep-purple overflow-hidden grid grid-cols-1 md:grid-cols-[auto_1fr_auto] items-center gap-6 md:gap-10 p-8 md:p-10 border-l-4 border-[#4752C4]">
            <div className="w-16 h-16 flex items-center justify-center bg-[#4752C4] shadow-[4px_4px_0_rgba(0,0,0,0.3)]" aria-hidden="true">
              <FaDiscord size={34} className="text-white" />
            </div>
            <div>
              {s.eyebrow && <p className="font-rajdhani font-semibold text-accent-cyan text-sm uppercase tracking-[3px] mb-1">{s.eyebrow}</p>}
              <h2 className="font-rajdhani font-bold text-white text-3xl leading-tight mb-2">{s.title}</h2>
              {s.text && <p className="font-dm-sans text-white/75 text-base leading-relaxed max-w-2xl">{s.text}</p>}
            </div>
            <a
              href={url} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#4752C4] text-white font-rajdhani font-bold uppercase tracking-wider px-7 py-4 shadow-[4px_4px_0_rgba(0,0,0,0.3)] hover:-translate-y-0.5 transition-transform"
            >
              <FaDiscord size={18} aria-hidden="true" /> {s.button || site.discord_label || 'Join our Discord'}
            </a>
            <div
              className="absolute -right-4 -bottom-4 w-24 h-24 opacity-15 pointer-events-none" aria-hidden="true"
              style={{ background: 'repeating-linear-gradient(45deg, #4752C4 0, #4752C4 2px, transparent 0, transparent 50%)', backgroundSize: '7px 7px' }}
            />
          </div>
        </SectionWrapper>
      </div>
    </section>
  )
}

const SECTIONS = { paths: Paths, events: Events, news: News, mission: Mission, about: About, people: People, gap: Gap, discord: Discord }
const DIVIDERS = ['warm', 'cool', 'full']

export default function Home() {
  const { p, sections } = usePage('home')
  usePageTitle()
  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
      <Hero h={p.hero} />
      {sections.map((key, i) => {
        if (key === 'cta') return <CtaBanner key={key} cta={p.cta} className="bg-light-purple" />
        const Section = SECTIONS[key]
        if (!Section) return null
        return (
          <div key={key}>
            {i % 2 === 0 && <PixelDivider variant={DIVIDERS[(i / 2) % 3]} />}
            <Section s={p[key]} />
          </div>
        )
      })}
    </motion.main>
  )
}
