import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'
import PageHero from '../components/PageHero'
import PixelDivider from '../components/PixelDivider'
import SectionWrapper from '../components/SectionWrapper'
import EventCard from '../components/cards/EventCard'
import { events } from '../data/events'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

export default function Events() {
  const [pastOpen, setPastOpen] = useState(true)
  const upcoming = events.filter((e) => e.status === 'upcoming')
  const past = events.filter((e) => e.status === 'past')

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="pt-16"
    >
      <PageHero
        title="Events & Conferences"
        breadcrumb="Home / Events"
        accentColor="green"
        subtitle="Where the chapter gathers — online and in person."
      />

      {/* UPCOMING EVENTS */}
      <section id="upcoming" className="bg-surface py-16 md:py-24">
        <div className="container mx-auto">
          <SectionWrapper>
            <div className="mb-10">
              <p className="font-rajdhani font-semibold text-accent-green text-sm uppercase tracking-[3px] mb-2">
                What's Next
              </p>
              <h2 className="font-rajdhani font-bold text-deep-purple text-3xl sm:text-4xl mb-3">
                Upcoming Events
              </h2>
              <div className="w-16 h-[2px] bg-accent-green" />
            </div>
          </SectionWrapper>

          {upcoming.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.1 }}
            >
              {upcoming.map((event) => (
                <motion.div key={event.id} variants={fadeUp}>
                  <EventCard event={event} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-16">
              <p className="font-dm-sans text-text-secondary text-base">
                No upcoming events right now. Check back soon or join our newsletter.
              </p>
            </div>
          )}
        </div>
      </section>

      <PixelDivider variant="cool" />

      {/* PAST EVENTS */}
      <section id="past" className="bg-bg-tint py-16 md:py-24">
        <div className="container mx-auto">
          <SectionWrapper>
            <div className="mb-6">
              <p className="font-rajdhani font-semibold text-accent-cyan text-sm uppercase tracking-[3px] mb-2">
                Archive
              </p>
              <button
                className="flex items-center gap-3 group"
                onClick={() => setPastOpen(!pastOpen)}
              >
                <h2 className="font-rajdhani font-bold text-deep-purple text-3xl sm:text-4xl group-hover:text-accent-cyan transition-colors">
                  Past Events
                </h2>
                <div className="flex items-center gap-1 font-rajdhani text-text-secondary">
                  <span className="text-sm">2025</span>
                  {pastOpen ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
                </div>
              </button>
            </div>
          </SectionWrapper>

          <AnimatePresence initial={false}>
            {pastOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  variants={stagger}
                  initial="hidden"
                  animate="visible"
                >
                  {past.map((event) => (
                    <motion.div key={event.id} variants={fadeUp}>
                      <EventCard event={event} isPast />
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* HOST AN EVENT */}
      <section id="host" className="bg-surface py-16 md:py-24">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 items-center">
            <SectionWrapper>
              <p className="font-rajdhani font-semibold text-accent-orange text-sm uppercase tracking-[3px] mb-3">
                Get Involved
              </p>
              <h2 className="font-rajdhani font-bold text-deep-purple text-3xl sm:text-4xl mb-4">
                Host an Event
              </h2>
              <p className="font-dm-sans text-text-secondary text-base leading-relaxed mb-4">
                DiGRA SA supports members who want to organise events — symposia, workshops,
                reading groups, or panel discussions at their institutions.
              </p>
              <p className="font-dm-sans text-text-secondary text-base leading-relaxed mb-6">
                We can help with promotion, academic support, and connecting your event to the
                broader DiGRA network.
              </p>
              <Link
                to="/contact"
                className="inline-block bg-accent-gold text-deep-purple font-rajdhani font-bold uppercase tracking-wider px-8 py-4 shadow-[4px_4px_0_rgba(0,0,0,0.25)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_rgba(0,0,0,0.3)] transition-all duration-200"
              >
                Get in Touch
              </Link>
            </SectionWrapper>

            {/* Decorative block */}
            <SectionWrapper delay={0.2}>
              <div className="bg-deep-purple p-5 sm:p-8 relative overflow-hidden">
                <PixelDivider variant="full" height={14} />
                <div className="py-10">
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'Symposium', colour: '#F5A623' },
                      { label: 'Workshop', colour: '#3DE87A' },
                      { label: 'Seminar', colour: '#00CFDD' },
                      { label: 'Conference', colour: '#B45FFF' },
                      { label: 'Talk', colour: '#E94560' },
                      { label: 'Panel', colour: '#FF6B35' },
                    ].map(({ label, colour }) => (
                      <div
                        key={label}
                        className="flex items-center justify-center py-3 font-rajdhani text-xs font-semibold uppercase tracking-wider"
                        style={{ background: `${colour}20`, color: colour, border: `1px solid ${colour}30` }}
                      >
                        {label}
                      </div>
                    ))}
                  </div>
                  <p className="font-dm-sans text-white/40 text-sm text-center mt-6">
                    All formats welcome
                  </p>
                </div>
                <div
                  className="absolute bottom-2 right-2 w-14 h-14 opacity-15"
                  aria-hidden="true"
                  style={{
                    background: 'repeating-linear-gradient(45deg, #FF6B35 0, #FF6B35 2px, transparent 0, transparent 50%)',
                    backgroundSize: '6px 6px',
                  }}
                />
              </div>
            </SectionWrapper>
          </div>
        </div>
      </section>

      {/* WHAT TO EXPECT */}
      <section className="dark-textured py-14">
        <div className="container mx-auto">
          <SectionWrapper>
            <p className="font-rajdhani font-semibold text-accent-gold text-sm uppercase tracking-[3px] mb-2">
              What We Run
            </p>
            <h2 className="font-rajdhani font-bold text-white text-3xl mb-8">
              Event Formats
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { label: 'Research Symposia', colour: '#F5A623', desc: 'Full-day academic gatherings for presenting and workshopping research in progress.' },
                { label: 'Reading Groups', colour: '#00CFDD', desc: 'Informal, regular sessions where members work through game studies texts together.' },
                { label: 'Industry Panels', colour: '#3DE87A', desc: 'Dialogues between researchers and South African game developers on shared concerns.' },
                { label: 'Workshops', colour: '#B45FFF', desc: 'Practical skill-building sessions on research methods, writing for journals, and more.' },
                { label: 'Keynote Talks', colour: '#E94560', desc: 'Invited lectures from leading game scholars — local and international.' },
                { label: 'Online Events', colour: '#FF6B35', desc: 'Virtual-first events for members outside major cities, ensuring continental reach.' },
              ].map(({ label, colour, desc }) => (
                <div key={label} className="p-5 border border-white/8 hover:border-white/20 transition-colors duration-200" style={{ background: `${colour}07` }}>
                  <div className="w-6 h-[2px] mb-3" style={{ background: colour }} />
                  <h3 className="font-rajdhani font-semibold text-white text-base mb-2">{label}</h3>
                  <p className="font-dm-sans text-white/45 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </SectionWrapper>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-mid-purple py-16 md:py-20">
        <div className="container mx-auto">
          <SectionWrapper>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h2 className="font-rajdhani font-bold text-white text-3xl md:text-4xl mb-2">
                  Never miss an event.
                </h2>
                <p className="font-dm-sans text-white/50 text-base">
                  Become a member to get direct invitations and announcements.
                </p>
              </div>
              <Link
                to="/membership"
                className="flex-shrink-0 bg-accent-gold text-deep-purple font-rajdhani font-bold uppercase tracking-wider px-8 py-4 shadow-[4px_4px_0_rgba(0,0,0,0.25)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_rgba(0,0,0,0.3)] transition-all duration-200"
              >
                Join the Chapter
              </Link>
            </div>
          </SectionWrapper>
        </div>
      </section>
    </motion.main>
  )
}
