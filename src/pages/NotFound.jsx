import { motion } from 'framer-motion'
import { useEffect } from 'react'
import PageHero from '../components/PageHero'
import { usePage } from '../content/ContentContext'
import { SmartLink } from '../lib/text'
import usePageTitle from '../lib/usePageTitle'

export default function NotFound() {
  const { p } = usePage('not_found')
  const m = p.main
  usePageTitle(m.title)
  useEffect(() => {
    // Ask search engines not to index missing pages (the server returns 200 for app routes)
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex'
    document.head.appendChild(meta)
    return () => meta.remove()
  }, [])

  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
      <PageHero title={m.title} breadcrumb="Error 404" accentColor="red" subtitle={m.text} />
      <section className="bg-surface py-16 md:py-24">
        <div className="container mx-auto flex flex-wrap gap-4">
          {m.button?.label && (
            <SmartLink to={m.button.url} className="bg-accent-gold text-deep-purple font-rajdhani font-bold uppercase tracking-wider px-8 py-4 shadow-[4px_4px_0_rgba(0,0,0,0.25)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200">
              {m.button.label}
            </SmartLink>
          )}
          <SmartLink to="/contact" className="border-2 border-deep-purple text-deep-purple font-rajdhani font-bold uppercase tracking-wider px-8 py-4 hover:bg-deep-purple hover:text-white transition-all duration-200">
            Contact
          </SmartLink>
        </div>
      </section>
    </motion.main>
  )
}
