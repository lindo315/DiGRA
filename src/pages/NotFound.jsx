import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import PageHero from '../components/PageHero'

export default function NotFound() {
  useEffect(() => {
    // Tell search engines not to index missing pages (the server returns 200 for SPA routes)
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex'
    document.head.appendChild(meta)
    return () => meta.remove()
  }, [])

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="pt-16"
    >
      <PageHero
        title="Page not found"
        breadcrumb="Error 404"
        accentColor="red"
        subtitle="That page doesn't exist — it may have moved, or the link may be mistyped."
      />
      <section className="bg-surface py-16 md:py-24">
        <div className="container mx-auto flex flex-wrap gap-4">
          <Link
            to="/"
            className="bg-accent-gold text-deep-purple font-rajdhani font-bold uppercase tracking-wider px-8 py-4 shadow-[4px_4px_0_rgba(0,0,0,0.25)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200"
          >
            Back to Home
          </Link>
          <Link
            to="/contact"
            className="border-2 border-deep-purple text-deep-purple font-rajdhani font-bold uppercase tracking-wider px-8 py-4 hover:bg-deep-purple hover:text-white transition-all duration-200"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </motion.main>
  )
}
