import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'
import PixelDivider from '../components/PixelDivider'
import SectionWrapper from '../components/SectionWrapper'
import ResearchCard from '../components/cards/ResearchCard'
import { researchAreas, journals } from '../data/research'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const TEACHING = [
  {
    title: 'Course Syllabi',
    description: 'Sample syllabi for game studies courses designed for South African higher education contexts.',
    colour: '#F5A623',
  },
  {
    title: 'Introductory Texts',
    description: 'Curated reading lists for students entering game studies for the first time.',
    colour: '#00CFDD',
  },
  {
    title: 'African Reading List',
    description: 'A focused collection of scholarship on games from and about the African continent.',
    colour: '#3DE87A',
  },
]

export default function Research() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="pt-16"
    >
      <PageHero
        title="Research & Resources"
        breadcrumb="Home / Research"
        accentColor="cyan"
        subtitle="Scholarship on African games — produced here, read everywhere."
      />

      {/* GAME STUDIES IN SA */}
      <section id="game-studies" className="bg-surface py-16 md:py-24">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-10 items-start">
            {/* Left: editorial text */}
            <SectionWrapper className="lg:col-span-3">
              <p className="font-rajdhani font-light text-accent-cyan text-sm uppercase tracking-[3px] mb-3">
                The Field
              </p>
              <h2 className="font-rajdhani font-bold text-deep-purple text-4xl mb-6">
                Game Studies in South Africa
              </h2>
              <p className="font-dm-sans text-text-secondary text-base leading-relaxed mb-4">
                Game studies as a discipline has grown significantly since the early 2000s — but
                African contexts have been systematically underrepresented in international
                scholarship. Most canonical game studies texts treat Western, Japanese, and North
                American game cultures as the default.
              </p>
              <p className="font-dm-sans text-text-secondary text-base leading-relaxed mb-4">
                South African game culture is distinct: shaped by post-apartheid demographics,
                mobile-first access patterns, a small but active development industry, and rich
                indigenous game traditions that predate digital games entirely.
              </p>
              <p className="font-dm-sans text-text-secondary text-base leading-relaxed">
                DiGRA SA exists to produce, publish, and disseminate research that takes this
                context seriously.
              </p>
            </SectionWrapper>

            {/* Right: pull-quote panels */}
            <SectionWrapper className="lg:col-span-2 flex flex-col gap-4" delay={0.15}>
              <div className="bg-bg-tint p-6 border-l-4 border-accent-cyan">
                <p className="font-rajdhani font-semibold text-text-primary text-sm uppercase tracking-wider mb-2">
                  Did You Know?
                </p>
                <p className="font-dm-sans text-text-secondary text-sm leading-relaxed">
                  South Africa has one of the most active independent game development scenes on
                  the continent, with dedicated studios in Cape Town, Johannesburg, and Pretoria.
                </p>
              </div>
              <div className="bg-bg-tint p-6 border-l-4 border-accent-violet">
                <p className="font-rajdhani font-semibold text-text-primary text-sm uppercase tracking-wider mb-2">
                  Our Approach
                </p>
                <p className="font-dm-sans text-text-secondary text-sm leading-relaxed">
                  We apply African philosophy, ubuntu principles, and decolonial methodology
                  to game research — not as a critique of existing work, but as an expansion of it.
                </p>
              </div>
            </SectionWrapper>
          </div>
        </div>
      </section>

      <PixelDivider variant="cool" />

      {/* RESEARCH AREAS */}
      <section id="research-areas" className="bg-bg-tint py-16 md:py-24">
        <div className="container mx-auto">
          <SectionWrapper>
            <div className="mb-10">
              <p className="font-rajdhani font-light text-accent-violet text-sm uppercase tracking-[3px] mb-2">
                What We Study
              </p>
              <h2 className="font-rajdhani font-bold text-deep-purple text-4xl mb-3">
                Research Areas
              </h2>
              <div className="w-16 h-[2px] bg-accent-violet" />
            </div>
          </SectionWrapper>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.05 }}
          >
            {researchAreas.map((area) => (
              <motion.div key={area.id} variants={fadeUp}>
                <ResearchCard area={area} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* DiGRA DIGITAL LIBRARY */}
      <section id="library" className="bg-surface py-16 md:py-24">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 items-center">
            <SectionWrapper>
              <p className="font-rajdhani font-light text-accent-gold text-sm uppercase tracking-[3px] mb-3">
                Open Access
              </p>
              <h2 className="font-rajdhani font-bold text-deep-purple text-4xl mb-4">
                DiGRA Digital Library
              </h2>
              <p className="font-dm-sans text-text-secondary text-base leading-relaxed mb-4">
                The DiGRA Digital Library hosts thousands of conference papers, journal articles,
                and proceedings — all freely accessible. It's one of the largest open-access
                repositories in game studies.
              </p>
              <p className="font-dm-sans text-text-secondary text-base leading-relaxed mb-6">
                As a DiGRA SA member, you gain direct pathways to contribute to the library
                through DiGRA International conferences and publications.
              </p>
              <a
                href="https://dl.digra.org"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-accent-gold text-deep-purple font-rajdhani font-bold uppercase tracking-wider px-8 py-4 shadow-[4px_4px_0_rgba(0,0,0,0.25)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_rgba(0,0,0,0.3)] transition-all duration-200"
              >
                Visit the Library ↗
              </a>
            </SectionWrapper>

            <SectionWrapper delay={0.2}>
              <div className="bg-deep-purple p-5 sm:p-8 relative overflow-hidden">
                <p className="font-rajdhani text-accent-gold uppercase tracking-[2px] text-sm mb-2">
                  Open Access Repository
                </p>
                <p className="font-orbitron text-white text-2xl font-bold mb-3">
                  DiGRA Digital Library
                </p>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  {[
                    { label: 'Papers', value: '5,000+' },
                    { label: 'Years', value: '2003–present' },
                    { label: 'Access', value: 'Free & Open' },
                    { label: 'Format', value: 'PDF / HTML' },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="font-rajdhani text-xs text-white/40 uppercase tracking-wider">{label}</p>
                      <p className="font-dm-sans text-white font-medium">{value}</p>
                    </div>
                  ))}
                </div>
                <div
                  className="absolute bottom-2 right-2 w-14 h-14 opacity-15"
                  aria-hidden="true"
                  style={{
                    background: 'repeating-linear-gradient(45deg, #F5A623 0, #F5A623 2px, transparent 0, transparent 50%)',
                    backgroundSize: '6px 6px',
                  }}
                />
              </div>
            </SectionWrapper>
          </div>
        </div>
      </section>

      <PixelDivider variant="warm" />

      {/* JOURNALS */}
      <section id="journals" className="bg-bg-tint py-16 md:py-24">
        <div className="container mx-auto">
          <SectionWrapper>
            <div className="mb-10">
              <p className="font-rajdhani font-light text-accent-red text-sm uppercase tracking-[3px] mb-2">
                Publish
              </p>
              <h2 className="font-rajdhani font-bold text-deep-purple text-4xl mb-3">
                Journals & Publications
              </h2>
              <div className="w-16 h-[2px] bg-accent-red" />
            </div>
          </SectionWrapper>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {journals.map((journal, i) => {
              const colours = ['#F5A623', '#00CFDD', '#3DE87A', '#B45FFF']
              const colour = colours[i % colours.length]
              return (
                <motion.div
                  key={journal.id}
                  className="bg-surface p-6 border-t-2 flex flex-col"
                  style={{ borderTopColor: colour }}
                  variants={fadeUp}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 className="font-rajdhani font-bold text-text-primary text-base leading-tight mb-3 flex-1">
                    {journal.name}
                  </h3>
                  <p className="font-dm-sans text-text-secondary text-xs leading-relaxed mb-4">
                    {journal.description}
                  </p>
                  <a
                    href={journal.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-rajdhani font-semibold text-xs uppercase tracking-wider transition-colors"
                    style={{ color: colour }}
                  >
                    Visit →
                  </a>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* TEACHING RESOURCES */}
      <section id="teaching" className="bg-surface py-16 md:py-24">
        <div className="container mx-auto">
          <SectionWrapper>
            <div className="mb-10">
              <p className="font-rajdhani font-light text-accent-green text-sm uppercase tracking-[3px] mb-2">
                Teach
              </p>
              <h2 className="font-rajdhani font-bold text-deep-purple text-4xl mb-3">
                Teaching Resources
              </h2>
              <div className="w-16 h-[2px] bg-accent-green" />
            </div>
          </SectionWrapper>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {TEACHING.map(({ title, description, colour }) => (
              <motion.div
                key={title}
                className="border border-border-light p-6 group hover:border-accent-gold/40 transition-colors duration-200"
                variants={fadeUp}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
              >
                <div
                  className="w-8 h-1 mb-4"
                  style={{ background: colour }}
                />
                <h3 className="font-rajdhani font-semibold text-text-primary text-xl mb-2">
                  {title}
                </h3>
                <p className="font-dm-sans text-text-secondary text-sm leading-relaxed">
                  {description}
                </p>
                <p className="font-rajdhani text-xs uppercase tracking-wider text-text-secondary/60 mt-4">
                  Coming Soon
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CALL TO CONTRIBUTE */}
      <section className="dark-textured py-14">
        <div className="container mx-auto">
          <SectionWrapper>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  colour: '#F5A623',
                  heading: 'Submit a Paper',
                  body: "DiGRA SA members can submit to DiGRA International conferences and the chapter's own publications. We welcome empirical, critical, and creative work.",
                },
                {
                  colour: '#00CFDD',
                  heading: 'Propose a Project',
                  body: 'Have a research idea rooted in African game culture? Pitch it to the committee. We can help connect you with collaborators and resources.',
                },
                {
                  colour: '#3DE87A',
                  heading: 'Join a Reading Group',
                  body: 'We run informal reading groups for members to engage with game studies texts together. A good entry point for early-career researchers.',
                },
              ].map(({ colour, heading, body }) => (
                <div key={heading} className="border-l-2 pl-5" style={{ borderColor: colour }}>
                  <h3 className="font-rajdhani font-bold text-white text-lg mb-2">{heading}</h3>
                  <p className="font-dm-sans text-white/50 text-sm leading-relaxed">{body}</p>
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
                  Contribute to the field.
                </h2>
                <p className="font-dm-sans text-white/50 text-base">
                  Join DiGRA SA to access resources and publish through our network.
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
