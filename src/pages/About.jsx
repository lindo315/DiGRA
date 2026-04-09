import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'
import PixelDivider from '../components/PixelDivider'
import SectionWrapper from '../components/SectionWrapper'
import TeamCard from '../components/cards/TeamCard'
import TeamMemberModal from '../components/TeamMemberModal'
import { team } from '../data/team'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const GOALS = [
  {
    num: '01',
    colour: '#F5A623',
    title: 'Build national academic legitimacy for game studies',
    desc: 'Publish peer-reviewed research on African games — from cultural analysis to game design theory — in international venues.',
  },
  {
    num: '02',
    colour: '#00CFDD',
    title: 'Strengthen local and regional research networks',
    desc: 'Train the next generation of African game scholars through mentorship, workshops, and access to DiGRA International resources.',
  },
  {
    num: '03',
    colour: '#3DE87A',
    title: 'Connect academia with industry and professional practice',
    desc: 'Link game researchers across South Africa and the continent into a working network — not just a mailing list.',
  },
  {
    num: '04',
    colour: '#E94560',
    title: 'Promote African scholarship in global DiGRA spaces',
    desc: 'Get African voices into DiGRA International conferences, panels, and publications on an ongoing basis.',
  },
]

const AIMS = [
  'Build national academic legitimacy for game studies',
  'Strengthen local and regional research networks',
  'Connect academia with industry and professional practice',
  'Promote African scholarship in global DiGRA spaces',
]

const ACCENT_BULLETS = ['#F5A623', '#00CFDD', '#E94560', '#3DE87A', '#B45FFF', '#FF6B35', '#F5A623']

export default function About() {
  const [selectedMember, setSelectedMember] = useState(null)

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="pt-16"
    >
      <PageHero
        title="About DiGRA South Africa"
        breadcrumb="Home / About"
        accentColor="violet"
        subtitle="Who we are, what we're building, and why it matters."
      />

      {/* WHO WE ARE */}
      <section id="who-we-are" className="bg-surface py-16 md:py-24">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-10 items-start">
            {/* Left: body text */}
            <SectionWrapper className="lg:col-span-3">
              <p className="font-rajdhani font-semibold text-accent-violet text-sm uppercase tracking-[3px] mb-3">
                Who We Are
              </p>
              <h2 className="font-rajdhani font-bold text-deep-purple text-3xl sm:text-4xl mb-6">
                The South African Chapter
              </h2>
              <p className="font-dm-sans text-text-secondary text-base leading-relaxed mb-4">
                DiGRA South Africa is the official South African regional chapter of the Digital
                Games Research Association (DiGRA) International — the world's leading academic
                organisation dedicated to the study of digital games (founded 2003).
              </p>
              <p className="font-dm-sans text-text-secondary text-base leading-relaxed mb-4">
                DiGRA International has formally accepted the establishment of the DiGRA
                South Africa Chapter. As a regional chapter, DiGRA SA operates within DiGRA International's framework
                while addressing South African and African priorities in research, policy, industry
                partnerships, and community development.
              </p>
              {/* <p className="font-dm-sans text-text-secondary text-base leading-relaxed">
                We are in our founding phase — which means the chapter is being shaped right now,
                by its founding members. This is a good time to be part of it.
              </p> */}
            </SectionWrapper>

            {/* Right: Key Facts sidebar */}
            <SectionWrapper className="lg:col-span-2" delay={0.15}>
              <div className="bg-deep-purple p-5 sm:p-8 relative overflow-hidden" style={{ borderLeft: '4px solid rgba(180,95,255,0.6)' }}>
                <h3 className="font-rajdhani font-semibold text-accent-gold uppercase tracking-[2px] text-sm mb-6">
                  Key Facts
                </h3>
                <div className="space-y-4">
                  {[
                    { label: 'Founded', value: '2026' },
                    { label: 'Region', value: 'South Africa' },
                    { label: 'Parent Org', value: 'DiGRA International, Est. 2003' },
                    { label: 'Status', value: 'Officially Recognized' },
                    { label: 'Scope', value: 'Pan-African' },
                    { label: 'Focus', value: 'Game Studies & Culture' },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex flex-col gap-0.5">
                      <span className="font-rajdhani font-light text-xs uppercase tracking-wider text-accent-gold/60">
                        {label}
                      </span>
                      <span className="font-dm-sans font-medium text-white text-sm">{value}</span>
                    </div>
                  ))}
                </div>
                {/* Left-edge beadwork accent */}
                <div className="absolute left-0 top-0 bottom-0 w-1 flex flex-col">
                  {['#B45FFF', '#F5A623', '#00CFDD', '#3DE87A', '#E94560', '#FF6B35'].map((c, i) => (
                    <div key={i} className="flex-1" style={{ background: c }} />
                  ))}
                </div>
              </div>
            </SectionWrapper>
          </div>
        </div>
      </section>

      <PixelDivider variant="cool" />

      {/* MISSION & GOALS */}
      <section id="mission" className="bg-bg-tint py-16 md:py-24">
        <div className="container mx-auto">
          <SectionWrapper>
            <div className="text-center mb-12">
              <h2 className="font-rajdhani font-bold text-deep-purple text-3xl sm:text-4xl mb-3">
                Mission & Goals
              </h2>
              <div className="w-16 h-[2px] bg-accent-violet mx-auto" />
            </div>
            <p className="font-dm-sans text-text-secondary text-base leading-relaxed mb-8 text-center max-w-3xl mx-auto">
              To establish a sustainable, coherent, and collaborative national ecosystem for game
              studies, game research, and game-related academic activity across South Africa and
              the African continent.
            </p>
          </SectionWrapper>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-0 max-w-5xl mx-auto"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.1 }}
          >
            {GOALS.map(({ num, colour, title, desc }, i) => (
              <motion.div
                key={num}
                className="flex gap-4 sm:gap-5 items-start p-5 sm:p-8 border border-border-light"
                variants={fadeUp}
              >
                <span
                  className="font-rajdhani font-bold text-5xl leading-none flex-shrink-0 w-16"
                  style={{ color: colour }}
                >
                  {num}
                </span>
                <div className="pt-1">
                  <div className="w-6 h-[2px] mb-3" style={{ background: colour }} />
                  <h3 className="font-rajdhani font-semibold text-text-primary text-xl mb-2">{title}</h3>
                  <p className="font-dm-sans text-text-secondary text-sm leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* OUR AIMS */}
      <section id="aims" className="bg-surface py-16 md:py-24">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 items-start">
            <SectionWrapper>
              <p className="font-rajdhani font-semibold text-accent-green text-sm uppercase tracking-[3px] mb-3">
                Our Aims
              </p>
              <h2 className="font-rajdhani font-bold text-deep-purple text-3xl sm:text-4xl mb-4">
                What We're Here to Do
              </h2>
              <p className="font-dm-sans text-text-secondary text-base leading-relaxed">
                The chapter has a specific mandate: build the infrastructure for game studies to
                flourish in Africa. These are the concrete aims that guide everything we do.
              </p>
            </SectionWrapper>

            <motion.ul
              className="space-y-3"
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
            >
              {AIMS.map((aim, i) => (
                <motion.li
                  key={aim}
                  className="flex items-start gap-3 font-dm-sans text-text-secondary text-base"
                  variants={fadeUp}
                >
                  <span
                    className="flex-shrink-0 w-3 h-3 mt-1"
                    style={{ background: ACCENT_BULLETS[i % ACCENT_BULLETS.length] }}
                    aria-hidden="true"
                  />
                  {aim}
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </div>
      </section>

      <PixelDivider variant="warm" />

      {/* FOUNDING COMMITTEE */}
      <section id="committee" className="bg-bg-tint py-16 md:py-24">
        <div className="container mx-auto">
          <SectionWrapper>
            <div className="mb-10">
              <p className="font-rajdhani font-semibold text-accent-orange text-sm uppercase tracking-[3px] mb-2">
                The People
              </p>
              <h2 className="font-rajdhani font-bold text-deep-purple text-3xl sm:text-4xl">
                Founding Committee
              </h2>
              <p className="font-dm-sans text-text-secondary text-sm mt-2">
                All members formally accepted their roles at the 3 February 2026 meeting.
              </p>
            </div>
          </SectionWrapper>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.1 }}
          >
            {team.map((member) => (
              <motion.div key={member.id} variants={fadeUp}>
                <TeamCard member={member} onClick={() => setSelectedMember(member)} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* DiGRA INTERNATIONAL CONNECTION */}
      <section id="digra-international" className="bg-surface py-16 md:py-24">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 items-center">
            <SectionWrapper>
              <p className="font-rajdhani font-semibold text-accent-cyan text-sm uppercase tracking-[3px] mb-3">
                Our Parent Organisation
              </p>
              <h2 className="font-rajdhani font-bold text-deep-purple text-3xl sm:text-4xl mb-4">
                DiGRA International
              </h2>
              <p className="font-dm-sans text-text-secondary text-base leading-relaxed mb-4">
                DiGRA South Africa is an official regional chapter of DiGRA International — the
                Digital Games Research Association — established in 2003 as the world's leading
                academic organisation for game studies.
              </p>
              <p className="font-dm-sans text-text-secondary text-base leading-relaxed">
                Chapter membership gives you access to DiGRA's global network, publications,
                and annual conferences.
              </p>
            </SectionWrapper>

            <SectionWrapper delay={0.2}>
              <div className="bg-deep-purple p-5 sm:p-8 relative overflow-hidden">
                <p className="font-rajdhani text-accent-gold uppercase tracking-[2px] text-sm mb-2">
                  Official Chapter
                </p>
                <p className="font-orbitron text-white text-2xl font-bold mb-4">
                  DiGRA International
                </p>
                <p className="font-dm-sans text-white/50 text-sm mb-6">
                  Digital Games Research Association · Est. 2003
                </p>
                <a
                  href="https://digra.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-rajdhani font-semibold text-accent-gold uppercase tracking-wider text-sm hover:underline"
                >
                  Visit DiGRA International ↗
                </a>
                {/* Corner accent */}
                <div
                  className="absolute bottom-2 right-2 w-16 h-16 opacity-15"
                  aria-hidden="true"
                  style={{
                    background: 'repeating-linear-gradient(45deg, #00CFDD 0, #00CFDD 2px, transparent 0, transparent 50%)',
                    backgroundSize: '6px 6px',
                  }}
                />
              </div>
            </SectionWrapper>
          </div>
        </div>
      </section>

      {/* VALUES STRIP */}
      <section className="dark-textured py-14">
        <div className="container mx-auto">
          <SectionWrapper>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5">
              {[
                { label: 'Open Access', value: 'Knowledge for all', colour: '#F5A623' },
                { label: 'Ubuntu', value: '"I am because we are"', colour: '#00CFDD' },
                { label: 'Decolonial', value: 'Scholarship on our terms', colour: '#3DE87A' },
                { label: 'Pan-African', value: 'Beyond borders', colour: '#B45FFF' },
              ].map(({ label, value, colour }) => (
                <div key={label} className="bg-deep-purple px-4 py-6 sm:px-6 sm:py-8 text-center">
                  <div className="w-8 h-[2px] mx-auto mb-4" style={{ background: colour }} />
                  <p className="font-rajdhani font-bold text-white text-base mb-1">{label}</p>
                  <p className="font-dm-sans text-white/40 text-xs">{value}</p>
                </div>
              ))}
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
                  Be part of building something new.
                </h2>
                <p className="font-dm-sans text-white/50 text-base">
                  The chapter is in its founding phase. Now is the time.
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
      <TeamMemberModal member={selectedMember} onClose={() => setSelectedMember(null)} />
    </motion.main>
  )
}
