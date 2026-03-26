import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import PixelDivider from '../components/PixelDivider'
import PixelSprite from '../components/PixelSprite'
import SectionWrapper from '../components/SectionWrapper'
import NewsCard from '../components/cards/NewsCard'
import EventCard from '../components/cards/EventCard'
import { news } from '../data/news'
import { events } from '../data/events'
import { FiArrowRight } from 'react-icons/fi'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const MISSION_ITEMS = [
  {
    sprite: 'book',
    title: 'Research',
    description: 'Produce original research on African games — from cultural analysis to game design theory — and publish it internationally.',
    colour: '#E94560',
  },
  {
    sprite: 'community',
    title: 'Community',
    description: 'Build a network of game scholars, students, educators, and developers across South Africa and the continent.',
    colour: '#F5A623',
  },
  {
    sprite: 'globe',
    title: 'Connection',
    description: 'Get African work into international publications and connect local researchers with the global game studies community.',
    colour: '#00CFDD',
  },
]

const HERO_BLOCKS = [
  { sprite: 'book',    label: 'Research', tag: 'Scholarship',     bg: '#F5A623', fg: '#1C0A3A' },
  { sprite: 'gamepad', label: 'Play',     tag: 'African Games',   bg: '#00CFDD', fg: '#1C0A3A' },
  { sprite: 'africa',  label: 'Africa',   tag: 'Pan-Continental', bg: '#E94560', fg: '#FFFFFF' },
]

export default function Home() {
  const upcomingEvents = events.filter((e) => e.status === 'upcoming').slice(0, 4)
  const latestNews = news.slice(0, 3)

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="pt-16"
    >
      {/* HERO */}
      <section className="dark-textured relative overflow-hidden min-h-[calc(100vh-64px)] max-h-[900px] flex flex-col justify-between">
        {/* Glow */}
        <div
          className="pointer-events-none absolute right-0 top-0 h-[250px] w-[250px] sm:h-[400px] sm:w-[400px] md:h-[500px] md:w-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(0,207,221,0.08) 0%, transparent 70%)' }}
          aria-hidden="true"
        />

        <div className="container mx-auto py-10 md:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center w-full">
            {/* Left: 60% */}
            <div className="lg:col-span-3">
              <motion.p
                className="font-rajdhani font-semibold text-accent-gold text-sm uppercase tracking-[3px] mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                <span className="text-accent-gold mr-2">■</span>
                Official Regional Chapter · DiGRA International
              </motion.p>

              <motion.h1
                className="font-rajdhani font-bold text-4xl sm:text-5xl md:text-7xl leading-[1.05] mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <span className="text-white block">Game Studies in Africa,</span>
                <span className="text-accent-gold block">
                  For Africa.
                </span>
              </motion.h1>

              <motion.p
                className="font-dm-sans text-white/65 text-base sm:text-lg max-w-[560px] leading-relaxed mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.5 }}
              >
                DiGRA South Africa is the official regional chapter of the Digital Games Research
                Association — connecting game researchers, educators, students, and industry across
                the continent.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <Link
                  to="/membership"
                  className="w-full sm:w-auto text-center bg-accent-gold text-deep-purple font-rajdhani font-bold uppercase tracking-wider px-8 py-4 shadow-[4px_4px_0_rgba(0,0,0,0.25)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_rgba(0,0,0,0.3)] transition-all duration-200"
                >
                  Join the Chapter
                </Link>
                <Link
                  to="/about"
                  className="w-full sm:w-auto text-center border-2 border-white text-white font-rajdhani font-bold uppercase tracking-wider px-8 py-4 hover:bg-white hover:text-deep-purple transition-all duration-200"
                >
                  Learn More
                </Link>
              </motion.div>
            </div>

            {/* Right: 40% — Pixel art hero blocks */}
            <div className="lg:col-span-2 hidden md:flex justify-center items-center">
              <motion.div
                className="relative"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <div className="flex flex-col w-56">
                  {HERO_BLOCKS.map(({ sprite, label, tag, bg, fg }, i) => (
                    <div key={label}>
                      {i > 0 && <PixelDivider variant={i === 1 ? 'warm' : 'cool'} height={14} />}
                      <motion.div
                        className="px-6 py-8 flex flex-col items-center justify-center gap-2 relative overflow-hidden cursor-default"
                        style={{ background: bg }}
                        whileHover={{ scale: 1.03 }}
                        transition={{ duration: 0.15 }}
                      >
                        {/* Corner dot grid */}
                        <div
                          className="absolute top-0 right-0 w-14 h-14 opacity-20"
                          aria-hidden="true"
                          style={{
                            background: `repeating-linear-gradient(45deg, ${fg} 0, ${fg} 1.5px, transparent 0, transparent 50%)`,
                            backgroundSize: '5px 5px',
                          }}
                        />
                        {/* Bottom shimmer line */}
                        <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: `${fg}40` }} />
                        <PixelSprite name={sprite} colour={fg} size={44} />
                        <div className="text-center">
                          <p
                            className="font-rajdhani font-bold text-xl tracking-[4px] uppercase leading-none"
                            style={{ color: fg }}
                          >
                            {label}
                          </p>
                          <p
                            className="font-dm-sans text-[10px] tracking-[2px] uppercase mt-1"
                            style={{ color: `${fg}80` }}
                          >
                            {tag}
                          </p>
                        </div>
                      </motion.div>
                    </div>
                  ))}
                </div>

                {/* Outer colour bloom */}
                <div
                  className="absolute -inset-6 -z-10 blur-2xl opacity-40"
                  aria-hidden="true"
                  style={{
                    background: 'linear-gradient(180deg, rgba(245,166,35,0.6) 0%, rgba(0,207,221,0.6) 50%, rgba(233,69,96,0.6) 100%)',
                  }}
                />
                {/* Corner accents */}
                <div
                  className="absolute -right-8 -top-8 w-24 h-24 opacity-15"
                  aria-hidden="true"
                  style={{
                    background: 'repeating-linear-gradient(45deg, #00CFDD 0, #00CFDD 2px, transparent 0, transparent 50%)',
                    backgroundSize: '8px 8px',
                  }}
                />
                <div
                  className="absolute -left-8 -bottom-8 w-20 h-20 opacity-10"
                  aria-hidden="true"
                  style={{
                    background: 'repeating-linear-gradient(45deg, #B45FFF 0, #B45FFF 2px, transparent 0, transparent 50%)',
                    backgroundSize: '8px 8px',
                  }}
                />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <motion.div
          className="border-t border-accent-gold/20 bg-deep-purple/80 backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <div className="container mx-auto py-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
              {[
                { label: 'Part of DiGRA International', value: 'Est. 2003' },
                { label: 'Pan-African Scope', value: 'Continent-wide reach' },
                { label: 'Open to All', value: 'Researchers · Students · Industry' },
              ].map(({ label, value }) => (
                <div key={label} className="px-6 py-3 text-center sm:text-left first:pl-0">
                  <p className="font-rajdhani font-semibold text-white text-sm">{label}</p>
                  <p className="font-dm-sans text-white/50 text-xs mt-0.5">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      <PixelDivider variant="warm" />

      {/* MISSION STRIP */}
      <section className="bg-surface py-16 md:py-24">
        <div className="container mx-auto">
          <SectionWrapper>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {MISSION_ITEMS.map(({ sprite, title, description, colour }) => (
                <div key={title} className="group">
                  <div
                    className="w-12 h-12 flex items-center justify-center mb-4"
                    style={{ background: `${colour}18` }}
                  >
                    <PixelSprite name={sprite} colour={colour} size={28} />
                  </div>
                  <h3 className="font-rajdhani font-semibold text-deep-purple text-xl mb-2">
                    {title}
                  </h3>
                  <p className="font-dm-sans text-text-secondary text-sm leading-relaxed">
                    {description}
                  </p>
                  <div
                    className="mt-4 h-[2px] w-12 group-hover:w-full transition-all duration-300"
                    style={{ background: colour }}
                  />
                </div>
              ))}
            </div>
          </SectionWrapper>
        </div>
      </section>

      <PixelDivider variant="cool" />

      {/* LATEST NEWS */}
      <section className="dark-textured py-16 md:py-24">
        <div className="container mx-auto">
          <SectionWrapper>
            <div className="mb-10">
              <p className="font-rajdhani font-semibold text-accent-gold text-sm uppercase tracking-[3px] mb-2">
                Latest Updates
              </p>
              <h2 className="font-rajdhani font-bold text-white text-3xl sm:text-4xl mb-3">
                News & Updates
              </h2>
              <div className="w-16 h-[2px] bg-accent-cyan" />
              <p className="font-dm-sans text-white/50 mt-3 text-base">
                What's happening in the chapter.
              </p>
            </div>
          </SectionWrapper>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {latestNews.map((item, i) => (
              <motion.div
                key={item.id}
                variants={fadeUp}
                style={{ marginTop: i === 1 ? '-16px' : '0' }}
              >
                <NewsCard item={item} />
              </motion.div>
            ))}
          </motion.div>

          <SectionWrapper className="mt-8 flex justify-end">
            <Link
              to="/research"
              className="font-rajdhani font-semibold text-accent-gold uppercase tracking-wider text-sm flex items-center gap-2 hover:gap-3 transition-all duration-200"
            >
              View All News <FiArrowRight />
            </Link>
          </SectionWrapper>
        </div>
      </section>

      {/* UPCOMING EVENTS */}
      <section className="bg-bg-tint py-16 md:py-24">
        <div className="container mx-auto">
          <SectionWrapper>
            <div className="text-center mb-10">
              <h2 className="font-rajdhani font-bold text-deep-purple text-3xl sm:text-4xl mb-3">
                Upcoming Events
              </h2>
              <div
                className="w-16 h-[3px] mx-auto mb-3"
                style={{ background: 'linear-gradient(90deg, #F5A623, #FF6B35)' }}
              />
              <p className="font-dm-sans text-text-secondary">
                Where the chapter meets, presents, and connects.
              </p>
            </div>
          </SectionWrapper>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {upcomingEvents.map((event) => (
              <motion.div key={event.id} variants={fadeUp}>
                <EventCard event={event} />
              </motion.div>
            ))}
          </motion.div>

          <SectionWrapper className="mt-8 flex justify-center">
            <Link
              to="/events"
              className="font-rajdhani font-semibold text-deep-purple uppercase tracking-wider text-sm flex items-center gap-2 hover:gap-3 transition-all duration-200 hover:text-accent-gold"
            >
              See All Events <FiArrowRight />
            </Link>
          </SectionWrapper>
        </div>
      </section>

      <PixelDivider variant="full" />

      {/* ABOUT TEASER */}
      <section className="bg-surface py-16 md:py-24">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center">
            {/* Left: 55% */}
            <SectionWrapper className="lg:col-span-3">
              <p className="font-rajdhani font-semibold text-accent-gold text-sm uppercase tracking-[3px] mb-3">
                Who We Are
              </p>
              <h2 className="font-rajdhani font-bold text-deep-purple text-3xl sm:text-4xl mb-6">
                About DiGRA South Africa
              </h2>
              <p className="font-dm-sans text-text-secondary text-base leading-relaxed mb-4">
                DiGRA South Africa is the official South African chapter of the Digital Games
                Research Association — the world's largest academic organisation dedicated to the
                study of digital games.
              </p>
              <p className="font-dm-sans text-text-secondary text-base leading-relaxed mb-6">
                We exist to grow game studies in Africa. That means building research capacity,
                connecting scholars across the continent, and making sure African perspectives reach
                international journals, conferences, and conversations.
              </p>
              <Link
                to="/about"
                className="font-rajdhani font-semibold text-accent-gold uppercase tracking-wider text-sm flex items-center gap-2 hover:gap-3 transition-all duration-200"
              >
                Learn More About Us <FiArrowRight />
              </Link>
            </SectionWrapper>

            {/* Right: 45% — Decorative tile */}
            <SectionWrapper className="lg:col-span-2" delay={0.2}>
              <div className="bg-deep-purple p-8 relative overflow-hidden">
                <PixelDivider variant="warm" height={14} />
                <div className="py-10 text-center">
                  <p className="font-orbitron text-accent-gold text-2xl leading-tight mb-4">
                    "I am because we are"
                  </p>
                  <p className="font-dm-sans italic text-white/40 text-sm">
                    — Ubuntu Philosophy
                  </p>
                </div>
                <div
                  className="absolute bottom-2 right-2 w-16 h-16 opacity-15"
                  aria-hidden="true"
                  style={{
                    background: 'repeating-linear-gradient(45deg, #B45FFF 0, #B45FFF 2px, transparent 0, transparent 50%)',
                    backgroundSize: '6px 6px',
                  }}
                />
              </div>
            </SectionWrapper>
          </div>
        </div>
      </section>

      {/* WHY IT MATTERS */}
      <section className="dark-textured py-16 md:py-24">
        <div className="container mx-auto">
          <SectionWrapper>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div>
                <p className="font-rajdhani font-semibold text-accent-violet text-sm uppercase tracking-[3px] mb-3">
                  The Gap We're Filling
                </p>
                <h2 className="font-rajdhani font-bold text-white text-3xl sm:text-4xl mb-6">
                  African Games. African Scholarship.
                </h2>
                <p className="font-dm-sans text-white/60 text-base leading-relaxed mb-4">
                  Global game studies has a blind spot. The canonical texts treat Western, Japanese,
                  and North American game cultures as defaults — as if games exist outside of geography
                  and history.
                </p>
                <p className="font-dm-sans text-white/60 text-base leading-relaxed mb-6">
                  South African game culture is distinct: shaped by post-apartheid demographics,
                  mobile-first access patterns, a growing independent development industry, and
                  rich indigenous play traditions that predate digital games entirely.
                </p>
                <Link
                  to="/research"
                  className="font-rajdhani font-semibold text-accent-cyan uppercase tracking-wider text-sm flex items-center gap-2 hover:gap-3 transition-all duration-200"
                >
                  Explore our Research <FiArrowRight />
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {[
                  { sprite: 'scroll',    colour: '#F5A623', title: 'Publish',   desc: 'Peer-reviewed research in international game studies venues.' },
                  { sprite: 'community', colour: '#00CFDD', title: 'Network',   desc: 'Connect scholars, students, and developers across the continent.' },
                  { sprite: 'trophy',    colour: '#3DE87A', title: 'Represent', desc: 'Get African voices into global conferences and conversations.' },
                  { sprite: 'lightning', colour: '#B45FFF', title: 'Build',     desc: 'Grow the infrastructure for game studies to flourish in Africa.' },
                ].map(({ sprite, colour, title, desc }) => (
                  <div
                    key={title}
                    className="flex items-start gap-4 p-4 border border-white/5 hover:border-white/15 transition-colors duration-200"
                    style={{ background: `${colour}06` }}
                  >
                    <div
                      className="flex-shrink-0 w-9 h-9 flex items-center justify-center mt-0.5"
                      style={{ background: `${colour}18` }}
                    >
                      <PixelSprite name={sprite} colour={colour} size={20} />
                    </div>
                    <div>
                      <h4 className="font-rajdhani font-semibold text-white text-base mb-0.5">{title}</h4>
                      <p className="font-dm-sans text-white/45 text-sm leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </SectionWrapper>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="bg-mid-purple py-16 md:py-20">
        <div className="container mx-auto">
          <SectionWrapper>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h2 className="font-rajdhani font-bold text-white text-3xl md:text-4xl mb-2">
                  Join the chapter.
                </h2>
                <p className="font-dm-sans text-white/50 text-base">
                  Be part of building African game studies from the ground up.
                </p>
              </div>
              <Link
                to="/membership"
                className="flex-shrink-0 bg-accent-gold text-deep-purple font-rajdhani font-bold uppercase tracking-wider px-8 py-4 shadow-[4px_4px_0_rgba(0,0,0,0.25)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_rgba(0,0,0,0.3)] transition-all duration-200"
              >
                Become a Member
              </Link>
            </div>
          </SectionWrapper>
        </div>
      </section>
    </motion.main>
  )
}
