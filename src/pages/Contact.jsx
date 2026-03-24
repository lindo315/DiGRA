import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiMail, FiMapPin, FiTwitter, FiLinkedin, FiFacebook, FiCheckCircle } from 'react-icons/fi'
import PageHero from '../components/PageHero'
import PixelDivider from '../components/PixelDivider'
import SectionWrapper from '../components/SectionWrapper'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [errors, setErrors] = useState({})

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.message.trim()) e.message = 'Message is required'
    return e
  }

  function handleSubmit(evt) {
    evt.preventDefault()
    const e = validate()
    if (Object.keys(e).length > 0) {
      setErrors(e)
      return
    }
    setSubmitted(true)
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
      <div className="bg-accent-gold/10 border-l-4 border-accent-gold py-4">
        <div className="container mx-auto">
          <p className="font-dm-sans text-text-primary text-sm">
            DiGRA SA is newly established — we're building something new and welcome all enquiries.
          </p>
        </div>
      </div>

      {/* CONTACT SECTION */}
      <section id="contact-form" className="bg-surface py-16 md:py-24">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-10 items-start">
            {/* Form: 55% */}
            <div className="lg:col-span-3">
              <SectionWrapper>
                <div className="mb-8">
                  <p className="font-rajdhani font-light text-accent-orange text-sm uppercase tracking-[3px] mb-2">
                    Send a Message
                  </p>
                  <h2 className="font-rajdhani font-bold text-deep-purple text-4xl">
                    Contact Us
                  </h2>
                </div>
              </SectionWrapper>

              {submitted ? (
                <motion.div
                  className="text-center py-16"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <FiCheckCircle size={48} className="text-accent-green mx-auto mb-4" />
                  <h3 className="font-rajdhani font-bold text-deep-purple text-3xl mb-3">
                    Message Sent
                  </h3>
                  <p className="font-dm-sans text-text-secondary text-base max-w-md mx-auto">
                    Thanks for reaching out. We'll get back to you as soon as we can.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className={labelClass}>Name *</label>
                      <input
                        type="text"
                        className={inputClass('name')}
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Your name"
                      />
                      {errors.name && <p className="font-dm-sans text-accent-red text-xs mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label className={labelClass}>Email *</label>
                      <input
                        type="email"
                        className={inputClass('email')}
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="you@email.com"
                      />
                      {errors.email && <p className="font-dm-sans text-accent-red text-xs mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Subject</label>
                    <select
                      className={inputClass('subject')}
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    >
                      <option value="">Select a subject</option>
                      <option value="membership">Membership enquiry</option>
                      <option value="events">Events & hosting</option>
                      <option value="research">Research collaboration</option>
                      <option value="press">Press & media</option>
                      <option value="general">General enquiry</option>
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>Message *</label>
                    <textarea
                      className={`${inputClass('message')} resize-none`}
                      rows={6}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="What's on your mind?"
                    />
                    {errors.message && <p className="font-dm-sans text-accent-red text-xs mt-1">{errors.message}</p>}
                  </div>

                  <button
                    type="submit"
                    className="w-full md:w-auto md:self-start bg-accent-gold text-deep-purple font-rajdhani font-bold uppercase tracking-wider px-10 py-4 shadow-[4px_4px_0_rgba(0,0,0,0.25)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_rgba(0,0,0,0.3)] transition-all duration-200"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>

            {/* Info panel: 45% */}
            <SectionWrapper className="lg:col-span-2" delay={0.15}>
              <div className="bg-deep-purple p-8">
                <h3 className="font-rajdhani font-bold text-white text-xl mb-6">
                  Contact Info
                </h3>
                <div className="space-y-5 mb-8">
                  <a
                    href="mailto:info@digrasa.org"
                    className="flex items-center gap-3 font-dm-sans text-white/70 text-sm hover:text-accent-gold transition-colors group"
                  >
                    <FiMail size={16} className="text-accent-gold flex-shrink-0" />
                    info@digrasa.org
                  </a>
                  <div className="flex items-center gap-3 font-dm-sans text-white/70 text-sm">
                    <FiMapPin size={16} className="text-accent-orange flex-shrink-0" />
                    South Africa
                  </div>
                </div>
                <p className="font-rajdhani font-light text-white/40 text-xs uppercase tracking-wider mb-4">
                  Follow Us
                </p>
                <div className="flex gap-4">
                  {[
                    { Icon: FiTwitter, label: 'Twitter/X' },
                    { Icon: FiLinkedin, label: 'LinkedIn' },
                    { Icon: FiFacebook, label: 'Facebook' },
                  ].map(({ Icon, label }) => (
                    <a
                      key={label}
                      href="#"
                      aria-label={label}
                      className="text-white/50 hover:text-accent-gold hover:scale-110 transition-all duration-200"
                    >
                      <Icon size={20} />
                    </a>
                  ))}
                </div>
              </div>
            </SectionWrapper>
          </div>
        </div>
      </section>

      <PixelDivider variant="full" />

      {/* QUICK LINKS */}
      <section className="bg-surface py-12">
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
                  <p className="font-dm-sans text-text-secondary text-sm mb-3">{desc}</p>
                  <Link
                    to={link}
                    className="font-rajdhani font-semibold text-xs uppercase tracking-wider transition-colors"
                    style={{ color: colour }}
                  >
                    {linkLabel}
                  </Link>
                </div>
              ))}
            </div>
          </SectionWrapper>
        </div>
      </section>

      {/* STAY CONNECTED */}
      <section id="stay-connected" className="bg-bg-tint py-16 md:py-24">
        <div className="container mx-auto">
          <SectionWrapper>
            <div className="mb-10">
              <p className="font-rajdhani font-light text-accent-cyan text-sm uppercase tracking-[3px] mb-2">
                Follow Along
              </p>
              <h2 className="font-rajdhani font-bold text-deep-purple text-4xl mb-3">
                Stay Connected
              </h2>
              <div className="w-16 h-[2px] bg-accent-cyan" />
            </div>
          </SectionWrapper>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {[
              { Icon: FiTwitter, name: 'Twitter / X', handle: '@DiGRASA', colour: '#00CFDD', desc: 'News, updates, and calls for papers.' },
              { Icon: FiLinkedin, name: 'LinkedIn', handle: 'DiGRA South Africa', colour: '#B45FFF', desc: 'Professional announcements and events.' },
              { Icon: FiFacebook, name: 'Facebook', handle: 'DiGRA South Africa', colour: '#3DE87A', desc: 'Community discussions and updates.' },
            ].map(({ Icon, name, handle, colour, desc }) => (
              <motion.a
                key={name}
                href="#"
                className="flex flex-col items-start p-6 bg-surface border border-border-light hover:border-accent-gold/40 transition-all duration-200 group"
                variants={fadeUp}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <Icon size={24} style={{ color: colour }} className="mb-3" />
                <h3 className="font-rajdhani font-bold text-text-primary text-lg mb-1">{name}</h3>
                <p className="font-rajdhani text-xs uppercase tracking-wider mb-3" style={{ color: colour }}>
                  {handle}
                </p>
                <p className="font-dm-sans text-text-secondary text-sm">{desc}</p>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </section>
    </motion.main>
  )
}
