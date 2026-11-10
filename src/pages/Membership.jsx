import { useState, useRef } from 'react'
import { submitForm, CONTACT_EMAIL } from '../lib/submitForm'
import { motion } from 'framer-motion'
import { FiCheck, FiCheckCircle } from 'react-icons/fi'
import PageHero from '../components/PageHero'
import PixelDivider from '../components/PixelDivider'
import PixelSprite from '../components/PixelSprite'
import SectionWrapper from '../components/SectionWrapper'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const BENEFITS = [
  {
    sprite: 'community',
    title: 'Community Access',
    description: 'Join a network of game scholars, students, educators, and developers across South Africa.',
    colour: '#F5A623',
  },
  {
    sprite: 'book',
    title: 'DiGRA Resources',
    description: 'Access DiGRA International publications, the digital library, and member-only materials.',
    colour: '#00CFDD',
  },
  {
    sprite: 'calendar',
    title: 'Events & Conferences',
    description: 'Invitations to DiGRA SA events, workshops, and the annual DiGRA International conference.',
    colour: '#3DE87A',
  },
  {
    sprite: 'mail',
    title: 'Newsletter',
    description: 'Regular updates on African game studies research, calls for papers, and opportunities.',
    colour: '#B45FFF',
  },
]

const ELIGIBILITY = [
  'Academic researchers in game studies or related fields',
  'Postgraduate students (Honours, Masters, PhD)',
  'Undergraduate students with a research interest in games',
  'Game educators at any level',
  'Game developers with interest in research',
  'Independent scholars and critics',
  'Anyone interested in games as a serious field of study',
]

const STEPS = [
  { num: '1', title: 'Fill in the Form', desc: 'Complete the expression of interest form below.' },
  { num: '2', title: 'We Follow Up', desc: 'The committee reviews and reaches out within two weeks.' },
  { num: '3', title: 'Confirm & Pay', desc: 'Confirm your membership tier and pay the annual fee.' },
  { num: '4', title: 'Welcome', desc: "You're in. Get access to resources, events, and the community." },
]

const TIERS = [
  {
    id: 'student',
    title: 'Student',
    badge: null,
    price: 'TBC / year',
    features: ['Full chapter membership', 'Access to events', 'Newsletter', 'DiGRA library access'],
  },
  {
    id: 'regular',
    title: 'Regular',
    badge: 'Most Common',
    price: 'TBC / year',
    features: ['Full chapter membership', 'Access to events', 'Newsletter', 'DiGRA library access', 'Voting rights', 'Eligibility for committee roles'],
  },
  {
    id: 'institutional',
    title: 'Institutional',
    badge: null,
    price: 'TBC / year',
    features: ['Institutional membership', 'Multiple member seats', 'All regular benefits', 'Institutional listing on site'],
  },
]

export default function Membership() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    institution: '',
    role: '',
    interests: '',
    heard: '',
  })
  const [errors, setErrors] = useState({})
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const startedAt = useRef(Date.now())

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email'
    return e
  }

  async function handleSubmit(evt) {
    evt.preventDefault()
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length > 0) return
    setSending(true)
    setSendError('')
    try {
      await submitForm('membership', { ...form, website: honeypot }, startedAt.current)
      setSubmitted(true)
    } catch (err) {
      if (err.fields) setErrors(err.fields)
      setSendError(err.fields ? 'Please check the highlighted fields.' : 'unsent')
    } finally {
      setSending(false)
    }
  }

  const inputClass = (field) =>
    `w-full font-dm-sans text-text-primary bg-white px-4 py-3 border-2 outline-none transition-all duration-200 ${
      errors[field]
        ? 'border-accent-red'
        : 'border-border-light focus:border-accent-gold focus:shadow-[0_0_0_3px_rgba(245,166,35,0.15)]'
    }`

  const labelClass = 'block font-rajdhani font-semibold text-text-primary text-sm uppercase tracking-wider mb-2'

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="pt-16"
    >
      <PageHero
        title="Join DiGRA South Africa"
        breadcrumb="Home / Membership"
        accentColor="gold"
        subtitle="Be part of the chapter that's building African game studies."
      />

      {/* WHY JOIN */}
      <section id="benefits" className="bg-surface py-24 md:py-32">
        <div className="container mx-auto">
          <SectionWrapper>
            <div className="text-center mb-10">
              <p className="font-rajdhani font-semibold text-ink-gold text-sm uppercase tracking-[3px] mb-2">
                Why Join?
              </p>
              <h2 className="font-rajdhani font-bold text-deep-purple text-[32px] sm:text-[40px] mb-3">
                Member Benefits
              </h2>
              <div className="w-16 h-[2px] bg-accent-gold mx-auto" />
            </div>
          </SectionWrapper>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.1 }}
          >
            {BENEFITS.map(({ sprite, title, description, colour }) => (
              <motion.div
                key={title}
                className="flex flex-col p-6 border-t-2 group hover:shadow-md transition-shadow duration-200"
                style={{ borderTopColor: colour }}
                variants={fadeUp}
              >
                <div className="mb-4">
                  <PixelSprite name={sprite} colour={colour} size={28} />
                </div>
                <h3 className="font-rajdhani font-bold text-text-primary text-xl mb-2">{title}</h3>
                <p className="font-dm-sans text-text-secondary text-base leading-relaxed">{description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <PixelDivider variant="warm" />

      {/* WHO CAN JOIN */}
      <section id="eligibility" className="pixel-grid-light py-24 md:py-32">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 items-start">
            <SectionWrapper>
              <p className="font-rajdhani font-semibold text-ink-green text-sm uppercase tracking-[3px] mb-3">
                Eligibility
              </p>
              <h2 className="font-rajdhani font-bold text-deep-purple text-[32px] sm:text-[40px] mb-3">
                Who Can Join?
              </h2>
              <div className="w-16 h-[2px] bg-accent-green mb-4" />
              <p className="font-dm-sans text-text-secondary text-base leading-relaxed">
                DiGRA SA is open to anyone with a genuine interest in games as a subject of serious
                study — regardless of your career stage, institutional affiliation, or background.
              </p>
            </SectionWrapper>

            <motion.ul
              className="space-y-3 mt-8 lg:mt-0"
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
            >
              {ELIGIBILITY.map((item) => (
                <motion.li
                  key={item}
                  className="flex items-start gap-3 font-dm-sans text-text-secondary text-base"
                  variants={fadeUp}
                >
                  <FiCheck size={16} className="flex-shrink-0 mt-1 text-ink-green" />
                  {item}
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </div>
      </section>

      {/* MEMBERSHIP TIERS */}
      <section id="tiers" className="pixel-grid-sparse py-24 md:py-32">
        <div className="container mx-auto">
          <SectionWrapper>
            <div className="text-center mb-10">
              <p className="font-rajdhani font-semibold text-ink-violet text-sm uppercase tracking-[3px] mb-2">
                Pricing
              </p>
              <h2 className="font-rajdhani font-bold text-deep-purple text-[32px] sm:text-[40px] mb-3">
                Membership Tiers
              </h2>
              <div className="w-16 h-[2px] bg-accent-violet mx-auto" />
            </div>
          </SectionWrapper>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto items-start"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.1 }}
          >
            {TIERS.map((tier) => (
              <motion.div
                key={tier.id}
                className={`flex flex-col p-5 sm:p-8 ${
                  tier.badge
                    ? 'border-2 border-accent-gold bg-white shadow-[4px_4px_0_rgba(245,166,35,0.3)]'
                    : 'border border-border-light bg-white shadow-sm'
                }`}
                variants={fadeUp}
              >
                {tier.badge && (
                  <div className="mb-3">
                    <span className="font-rajdhani font-bold text-sm uppercase tracking-[2px] text-ink-gold bg-accent-gold/10 px-3 py-1">
                      {tier.badge}
                    </span>
                  </div>
                )}
                <h3 className="font-rajdhani font-bold text-deep-purple text-2xl mb-1">
                  {tier.title}
                </h3>
                <p className="font-dm-sans text-text-secondary text-base mb-6">{tier.price}</p>
                <ul className="space-y-3 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 font-dm-sans text-text-secondary text-base">
                      <FiCheck size={14} className="flex-shrink-0 mt-0.5 text-ink-gold" />
                      {f}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <PixelDivider variant="cool" />

      {/* HOW TO JOIN — Stepper */}
      <section id="how-to-join" className="bg-bg-tint py-24 md:py-32">
        <div className="container mx-auto">
          <SectionWrapper>
            <div className="text-center mb-12">
              <p className="font-rajdhani font-semibold text-ink-orange text-sm uppercase tracking-[3px] mb-2">
                Process
              </p>
              <h2 className="font-rajdhani font-bold text-deep-purple text-[32px] sm:text-[40px] mb-3">
                How to Join
              </h2>
              <div className="w-16 h-[2px] bg-accent-orange mx-auto" />
            </div>
          </SectionWrapper>

          {/* Desktop stepper */}
          <div className="hidden md:flex items-start gap-0 max-w-4xl mx-auto">
            {STEPS.map((step, i) => (
              <div key={step.num} className="flex-1 flex flex-col items-center relative">
                {i < STEPS.length - 1 && (
                  <div className="absolute top-6 left-1/2 right-0 h-[2px] bg-accent-gold/30 z-0" />
                )}
                <div className="relative z-10 w-12 h-12 flex items-center justify-center bg-accent-gold font-rajdhani font-bold text-deep-purple text-xl mb-4">
                  {step.num}
                </div>
                <h3 className="font-rajdhani font-semibold text-text-primary text-lg text-center mb-1">
                  {step.title}
                </h3>
                <p className="font-dm-sans text-text-secondary text-base text-center leading-relaxed px-2">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Mobile stepper */}
          <div className="md:hidden flex flex-col gap-0 max-w-sm mx-auto">
            {STEPS.map((step, i) => (
              <div key={step.num} className="flex gap-4 items-start">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 flex items-center justify-center bg-accent-gold font-rajdhani font-bold text-deep-purple text-lg flex-shrink-0">
                    {step.num}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="w-[2px] h-8 bg-accent-gold/30 mt-1" />
                  )}
                </div>
                <div className="pb-6">
                  <h3 className="font-rajdhani font-semibold text-text-primary text-lg mb-1">{step.title}</h3>
                  <p className="font-dm-sans text-text-secondary text-base leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* JOIN FORM */}
      <section id="join-form" className="bg-surface py-24 md:py-32">
        <div className="container mx-auto">
          <SectionWrapper>
            <div className="mb-10">
              <p className="font-rajdhani font-semibold text-ink-gold text-sm uppercase tracking-[3px] mb-2">
                Expression of Interest
              </p>
              <h2 className="font-rajdhani font-bold text-deep-purple text-[32px] sm:text-[40px] mb-3">
                Join the Chapter
              </h2>
              <div className="w-16 h-[2px] bg-accent-gold" />
            </div>
          </SectionWrapper>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-10 items-start">
            {/* Form: 60% */}
            <div className="lg:col-span-3">
              {submitted ? (
                <motion.div
                  className="text-center py-16"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <FiCheckCircle size={48} className="text-ink-green mx-auto mb-4" />
                  <h3 className="font-rajdhani font-bold text-deep-purple text-3xl mb-3">
                    Thanks, {form.name.split(' ')[0]}!
                  </h3>
                  <p className="font-dm-sans text-text-secondary text-base max-w-md mx-auto">
                    We've received your expression of interest. The committee will be in touch within
                    two weeks.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="relative flex flex-col gap-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="membership-name" className={labelClass}>Full Name *</label>
                      <input
                        id="membership-name"
                        type="text"
                        className={inputClass('name')}
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Dr. Jane Smith"
                      />
                      {errors.name && <p className="font-dm-sans text-ink-red text-base mt-1.5" role="alert">{errors.name}</p>}
                    </div>
                    <div>
                      <label htmlFor="membership-email" className={labelClass}>Email *</label>
                      <input
                        id="membership-email"
                        type="email"
                        className={inputClass('email')}
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="jane@university.ac.za"
                      />
                      {errors.email && <p className="font-dm-sans text-ink-red text-base mt-1.5" role="alert">{errors.email}</p>}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="membership-institution" className={labelClass}>Institution / Affiliation</label>
                    <input
                      id="membership-institution"
                      type="text"
                      className={inputClass('institution')}
                      value={form.institution}
                      onChange={(e) => setForm({ ...form, institution: e.target.value })}
                      placeholder="University of the Witwatersrand"
                    />
                  </div>

                  <div>
                    <label htmlFor="membership-role" className={labelClass}>Role</label>
                    <select
                      id="membership-role"
                      className={inputClass('role')}
                      value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value })}
                    >
                      <option value="">Select your role</option>
                      <option value="Academic / Researcher">Academic / Researcher</option>
                      <option value="Postgraduate Student">Postgraduate Student</option>
                      <option value="Undergraduate Student">Undergraduate Student</option>
                      <option value="Educator">Educator</option>
                      <option value="Game Developer">Game Developer</option>
                      <option value="Independent Scholar">Independent Scholar</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="membership-interests" className={labelClass}>Research Interests</label>
                    <textarea
                      id="membership-interests"
                      className={`${inputClass('interests')} resize-none`}
                      rows={4}
                      value={form.interests}
                      onChange={(e) => setForm({ ...form, interests: e.target.value })}
                      placeholder="Tell us briefly about your interests in game studies..."
                    />
                  </div>

                  <div>
                    <label htmlFor="membership-heard" className={labelClass}>How did you hear about us?</label>
                    <select
                      id="membership-heard"
                      className={inputClass('heard')}
                      value={form.heard}
                      onChange={(e) => setForm({ ...form, heard: e.target.value })}
                    >
                      <option value="">Select</option>
                      <option value="DiGRA International">DiGRA International</option>
                      <option value="Colleague / Word of mouth">Colleague / Word of mouth</option>
                      <option value="Social media">Social media</option>
                      <option value="Web search">Web search</option>
                      <option value="Event / Conference">Event / Conference</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Honeypot: hidden from people, catches spam bots */}

                  <div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden">

                    <label htmlFor="membership-website">Leave this field empty</label>

                    <input id="membership-website" type="text" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />

                  </div>


                  {sendError && (

                    <div role="alert" className="border-l-4 border-ink-red bg-accent-red/5 px-4 py-3 font-dm-sans text-base text-text-primary">

                      {sendError === 'unsent' ? (

                        <>

                          Sorry, your message couldn't be sent just now. Please try again, or email us at{' '}

                          <a className="font-semibold underline text-ink-red" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.

                        </>

                      ) : (

                        sendError

                      )}

                    </div>

                  )}


                  <button

                    type="submit"

                    disabled={sending}

                    className="w-full md:w-auto md:self-start bg-accent-gold text-deep-purple font-rajdhani font-bold uppercase tracking-wider px-6 sm:px-10 py-4 shadow-[4px_4px_0_rgba(0,0,0,0.25)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_rgba(0,0,0,0.3)] transition-all duration-200 disabled:opacity-60 disabled:cursor-wait"

                  >

                    {sending ? 'Sending…' : 'Submit Expression of Interest'}

                  </button>
                </form>
              )}
            </div>

            {/* Sidebar: 40% */}
            <div className="lg:col-span-2">
              <div className="bg-deep-purple p-5 sm:p-8">
                <p className="font-rajdhani font-semibold text-accent-gold text-sm uppercase tracking-[2px] mb-6">
                  What you get
                </p>
                <div className="space-y-5">
                  {BENEFITS.map(({ sprite, title, description, colour }) => (
                    <div key={title} className="flex gap-4 items-start">
                      <div
                        className="flex-shrink-0 w-9 h-9 flex items-center justify-center mt-0.5"
                        style={{ background: `${colour}20` }}
                      >
                        <PixelSprite name={sprite} colour={colour} size={20} />
                      </div>
                      <div>
                        <p className="font-rajdhani font-semibold text-white text-sm mb-0.5">{title}</p>
                        <p className="font-dm-sans text-white/70 text-base leading-relaxed">{description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="dark-textured py-12 md:py-16">
        <div className="container mx-auto max-w-3xl">
          <SectionWrapper>
            <p className="font-rajdhani font-semibold text-accent-gold text-sm uppercase tracking-[3px] mb-2">
              FAQ
            </p>
            <h2 className="font-rajdhani font-bold text-white text-[32px] sm:text-[40px] mb-3">
              Common Questions
            </h2>
            <div className="w-16 h-[2px] bg-accent-gold mb-8" />
            <div className="space-y-0">
              {[
                {
                  q: 'Do I need an academic affiliation to join?',
                  a: 'No. DiGRA SA is open to independent scholars, game developers, critics, and anyone with a genuine interest in game studies. Institutional affiliation is not required.',
                },
                {
                  q: 'What does membership cost?',
                  a: 'Fees are yet to be finalised. We are committed to keeping them affordable. Submit an expression of interest and we will notify you once fees are set.',
                },
                {
                  q: 'Is there a student discount?',
                  a: 'Yes. The Student tier will be priced lower than the Regular tier. Full-time students at any level are eligible.',
                },
                {
                  q: 'Can I join from outside South Africa?',
                  a: 'Yes. While we are a South African chapter, our scope is Pan-African. Researchers based elsewhere in Africa are welcome to join.',
                },
              ].map(({ q, a }, i) => (
                <div
                  key={q}
                  className="py-5 border-b border-white/10"
                  style={{ borderTopWidth: i === 0 ? '1px' : '0', borderTopColor: 'rgba(255,255,255,0.1)' }}
                >
                  <p className="font-rajdhani font-semibold text-white text-base mb-2">{q}</p>
                  <p className="font-dm-sans text-white/70 text-base leading-relaxed">{a}</p>
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
                  Questions?
                </h2>
                <p className="font-dm-sans text-white/70 text-base">
                  Reach out — we're happy to talk through membership before you commit.
                </p>
              </div>
              <a
                href="mailto:info@digrasa.co.za"
                className="flex-shrink-0 border-2 border-white text-white font-rajdhani font-bold uppercase tracking-wider px-8 py-4 hover:bg-white hover:text-deep-purple transition-all duration-200"
              >
                Email Us
              </a>
            </div>
          </SectionWrapper>
        </div>
      </section>
    </motion.main>
  )
}
