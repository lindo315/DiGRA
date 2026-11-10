import { useState, useRef } from 'react'
import { submitForm, CONTACT_EMAIL } from '../lib/submitForm'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiMail, FiMapPin, FiCheckCircle } from 'react-icons/fi'
import SocialIcon from '../components/SocialIcon'
import { SOCIAL_LINKS } from '../data/site'
import { ACCENTS, ink } from '../lib/theme'
import PageHero from '../components/PageHero'
import PixelDivider from '../components/PixelDivider'
import SectionWrapper from '../components/SectionWrapper'


export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
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
    if (!form.message.trim()) e.message = 'Message is required'
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
      await submitForm('contact', { ...form, website: honeypot }, startedAt.current)
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
        title="Get in Touch"
        breadcrumb="Home / Contact"
        accentColor="orange"
        subtitle="We're a new chapter — questions and ideas are very welcome."
      />

      {/* NOTICE BANNER */}
      <div className="bg-[#FEF6E9] border-l-4 border-accent-gold py-4">
        <div className="container mx-auto">
          <p className="font-dm-sans text-text-primary text-base">
            DiGRA SA is newly established — we're building something new and welcome all enquiries.
          </p>
        </div>
      </div>

      {/* CONTACT SECTION */}
      <section id="contact-form" className="bg-surface py-24 md:py-32">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-10 items-start">
            {/* Form: 55% */}
            <div className="lg:col-span-3">
              <SectionWrapper>
                <div className="mb-8">
                  <p className="font-rajdhani font-semibold text-ink-orange text-sm uppercase tracking-[3px] mb-2">
                    Send a Message
                  </p>
                  <h2 className="font-rajdhani font-bold text-deep-purple text-[32px] sm:text-[40px] mb-3">
                    Contact Us
                  </h2>
                  <div className="w-16 h-[2px] bg-accent-orange" />
                </div>
              </SectionWrapper>

              {submitted ? (
                <motion.div
                  className="text-center py-16"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <FiCheckCircle size={48} className="text-ink-green mx-auto mb-4" />
                  <h3 className="font-rajdhani font-bold text-deep-purple text-3xl mb-3">
                    Message Sent
                  </h3>
                  <p className="font-dm-sans text-text-secondary text-base max-w-md mx-auto">
                    Thanks for reaching out. We'll get back to you as soon as we can.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="relative flex flex-col gap-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="contact-name" className={labelClass}>Name *</label>
                      <input
                        id="contact-name"
                        type="text"
                        className={inputClass('name')}
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Your name"
                      />
                      {errors.name && <p className="font-dm-sans text-ink-red text-base mt-1.5" role="alert">{errors.name}</p>}
                    </div>
                    <div>
                      <label htmlFor="contact-email" className={labelClass}>Email *</label>
                      <input
                        id="contact-email"
                        type="email"
                        className={inputClass('email')}
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="you@email.com"
                      />
                      {errors.email && <p className="font-dm-sans text-ink-red text-base mt-1.5" role="alert">{errors.email}</p>}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-subject" className={labelClass}>Subject</label>
                    <select
                      id="contact-subject"
                      className={inputClass('subject')}
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    >
                      <option value="">Select a subject</option>
                      <option value="Membership enquiry">Membership enquiry</option>
                      <option value="Events & hosting">Events & hosting</option>
                      <option value="Research collaboration">Research collaboration</option>
                      <option value="Press & media">Press & media</option>
                      <option value="General enquiry">General enquiry</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="contact-message" className={labelClass}>Message *</label>
                    <textarea
                      id="contact-message"
                      className={`${inputClass('message')} resize-none`}
                      rows={6}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="What's on your mind?"
                    />
                    {errors.message && <p className="font-dm-sans text-ink-red text-base mt-1.5" role="alert">{errors.message}</p>}
                  </div>

                  {/* Honeypot: hidden from people, catches spam bots */}

                  <div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden">

                    <label htmlFor="contact-website">Leave this field empty</label>

                    <input id="contact-website" type="text" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />

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

                    {sending ? 'Sending…' : 'Send Message'}

                  </button>
                </form>
              )}
            </div>

            {/* Info panel: 45% */}
            <SectionWrapper className="lg:col-span-2" delay={0.15}>
              <div className="bg-deep-purple p-5 sm:p-8">
                <h3 className="font-rajdhani font-bold text-white text-xl mb-6">
                  Contact Info
                </h3>
                <div className="space-y-5 mb-8">
                  <a
                    href="mailto:info@digrasa.co.za"
                    className="flex items-center gap-3 font-dm-sans text-white/70 text-base hover:text-accent-gold transition-colors group"
                  >
                    <FiMail size={16} className="text-accent-gold flex-shrink-0" />
                    info@digrasa.co.za
                  </a>
                  <div className="flex items-center gap-3 font-dm-sans text-white/70 text-base">
                    <FiMapPin size={16} className="text-accent-orange flex-shrink-0" />
                    South Africa
                  </div>
                </div>
                {SOCIAL_LINKS.length > 0 && (
                  <>
                    <p className="font-rajdhani font-semibold text-white/80 text-sm uppercase tracking-wider mb-3">Follow Us</p>
                    <div className="flex gap-2">
                      {SOCIAL_LINKS.map(({ network, name, url }) => (
                        <a key={network} href={url} target="_blank" rel="noopener noreferrer" aria-label={`DiGRA SA on ${name}`}
                          className="flex items-center justify-center w-11 h-11 text-white/80 hover:text-accent-gold transition-colors">
                          <SocialIcon network={network} size={20} />
                        </a>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </SectionWrapper>
          </div>
        </div>
      </section>

      <PixelDivider variant="full" />

      {/* QUICK LINKS */}
      <section className="pixel-grid-sparse py-12">
        <div className="container mx-auto">
          <SectionWrapper>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: 'Membership Enquiry', desc: 'Questions about joining DiGRA SA?', link: '/membership', linkLabel: 'View Membership →', colour: '#F5A623' },
                { title: 'Research Collaboration', desc: 'Want to co-author or run a project?', link: '/research', linkLabel: 'View Research →', colour: '#00CFDD' },
                { title: 'Host an Event', desc: 'Interested in running something at your institution?', link: '/events#host', linkLabel: 'View Events →', colour: '#3DE87A' },
              ].map(({ title, desc, link, linkLabel, colour }) => (
                <div key={title} className="p-5 border border-border-light" style={{ borderTopWidth: '3px', borderTopColor: colour }}>
                  <h3 className="font-rajdhani font-bold text-text-primary text-base mb-1">{title}</h3>
                  <p className="font-dm-sans text-text-secondary text-base mb-3">{desc}</p>
                  <Link
                    to={link}
                    className="font-rajdhani font-semibold text-sm uppercase tracking-wider transition-colors"
                    style={{ color: ink(colour) }}
                  >
                    {linkLabel}
                  </Link>
                </div>
              ))}
            </div>
          </SectionWrapper>
        </div>
      </section>

      {/* STAY CONNECTED: only shown once social links are set in src/data/site.js */}
      {SOCIAL_LINKS.length > 0 && (
        <section id="stay-connected" className="pixel-grid-light py-24 md:py-32">
          <div className="container mx-auto">
            <SectionWrapper>
              <div className="mb-10">
                <p className="font-rajdhani font-semibold text-ink-cyan text-sm uppercase tracking-[3px] mb-2">
                  Follow Along
                </p>
                <h2 className="font-rajdhani font-bold text-deep-purple text-[32px] sm:text-[40px] mb-3">
                  Stay Connected
                </h2>
                <div className="w-16 h-[2px] bg-accent-cyan" />
              </div>
            </SectionWrapper>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {SOCIAL_LINKS.map(({ network, name, handle, url, desc }, i) => {
                const colour = [ACCENTS.cyan, ACCENTS.violet, ACCENTS.green, ACCENTS.orange][i % 4]
                return (
                  <a
                    key={network}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-start p-6 bg-surface border border-border-light hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(28,10,58,0.12)] transition-all duration-200"
                    style={{ borderTop: `3px solid ${colour}` }}
                  >
                    <SocialIcon network={network} size={24} style={{ color: ink(colour) }} className="mb-3" />
                    <h3 className="font-rajdhani font-bold text-text-primary text-xl mb-1">{name}</h3>
                    <p className="font-rajdhani font-semibold text-sm uppercase tracking-wider mb-3" style={{ color: ink(colour) }}>{handle}</p>
                    <p className="font-dm-sans text-text-secondary text-base">{desc}</p>
                  </a>
                )
              })}
            </div>
          </div>
        </section>
      )}
    </motion.main>
  )
}
