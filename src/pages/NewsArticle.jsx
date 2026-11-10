import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link, useParams } from 'react-router-dom'
import { FiArrowLeft, FiArrowRight, FiMail, FiUsers } from 'react-icons/fi'
import PixelDivider from '../components/PixelDivider'
import NewsCard from '../components/cards/NewsCard'
import NotFound from './NotFound'
import { news, getNewsBySlug } from '../data/news'
import { ACCENTS, NEWS_CATEGORY_COLOURS, ink, onDark } from '../lib/theme'

function Block({ block, colour }) {
  if (typeof block === 'string') {
    return <p className="font-dm-sans text-text-primary/90 text-lg leading-[1.75]">{block}</p>
  }
  if (block.h) {
    return (
      <h2 className="font-rajdhani font-bold text-deep-purple text-[28px] sm:text-[32px] leading-tight pt-6">
        {block.h}
      </h2>
    )
  }
  if (block.list) {
    return (
      <ul className="space-y-2.5 pl-1">
        {block.list.map((item) => (
          <li key={item} className="flex gap-3 font-dm-sans text-text-primary/90 text-lg leading-[1.7]">
            <span className="mt-[11px] w-2 h-2 flex-shrink-0" style={{ background: colour }} aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    )
  }
  if (block.quote) {
    return (
      <p
        className="font-rajdhani font-bold text-deep-purple text-2xl sm:text-[28px] leading-snug py-5 px-6 my-2 bg-bg-tint"
        style={{ borderLeft: `5px solid ${colour}` }}
      >
        {block.quote}
      </p>
    )
  }
  if (block.note) {
    return <p className="font-dm-sans italic text-text-secondary text-base leading-[1.7]">{block.note}</p>
  }
  return null
}

export default function NewsArticle() {
  const { slug } = useParams()
  const item = getNewsBySlug(slug)

  useEffect(() => {
    if (item) document.title = `${item.title} | DiGRA South Africa`
    return () => {
      document.title = 'DiGRA South Africa: Digital Games Research Association'
    }
  }, [item])

  if (!item) return <NotFound />

  const colour = NEWS_CATEGORY_COLOURS[item.category] || ACCENTS.gold
  const more = news.filter((n) => n.slug !== item.slug).slice(0, 3)

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="pt-16"
    >
      {/* Article header */}
      <header className="dark-textured relative overflow-hidden pt-12 pb-14 sm:pt-16 sm:pb-20" style={{ borderBottom: `3px solid ${colour}55` }}>
        <div
          className="pointer-events-none absolute right-0 top-0 h-[360px] w-[360px] rounded-full"
          style={{ background: `radial-gradient(circle, ${colour}1f 0%, transparent 70%)` }}
          aria-hidden="true"
        />
        <div className="container mx-auto relative z-10 max-w-4xl">
          <Link
            to="/news"
            className="inline-flex items-center gap-2 min-h-11 font-rajdhani font-semibold uppercase tracking-wider text-sm text-white/80 hover:text-accent-gold transition-colors mb-6"
          >
            <FiArrowLeft aria-hidden="true" /> All news
          </Link>
          <div className="flex items-center gap-3 flex-wrap mb-5">
            <span
              className="font-rajdhani font-bold text-sm uppercase tracking-[2px] px-2.5 py-0.5"
              style={{ color: onDark(colour), background: `${colour}20`, border: `1px solid ${colour}40` }}
            >
              {item.category}
            </span>
            <span className="font-dm-sans text-white/75 text-sm">{item.date}</span>
          </div>
          <h1 className="font-rajdhani font-bold text-white text-4xl sm:text-5xl md:text-[56px] leading-[1.08] mb-5">
            {item.title}
          </h1>
          {item.author && <p className="font-dm-sans text-white/80 text-base">By {item.author}</p>}
        </div>
      </header>

      <article className="bg-surface pb-24 md:pb-32">
        {item.image && (
          <div className="container mx-auto max-w-5xl">
            <figure className="-mt-8 sm:-mt-10 relative z-10">
              <img
                src={item.image}
                alt={item.imageAlt || ''}
                decoding="async"
                className="w-full aspect-[4/3] sm:aspect-[16/9] object-cover shadow-[8px_8px_0_rgba(28,10,58,0.15)]"
              />
            </figure>
          </div>
        )}

        <div className="container mx-auto max-w-3xl pt-12 md:pt-16">
          <div className="space-y-6">
            {item.body.map((block, i) => (
              <Block key={i} block={block} colour={colour} />
            ))}
          </div>

          {item.deadline && (
            <aside className="mt-12 p-6 sm:p-8 bg-deep-purple" style={{ borderLeft: `5px solid ${colour}` }}>
              <p className="font-rajdhani font-bold uppercase tracking-[2px] text-sm mb-2" style={{ color: onDark(colour) }}>
                Closes {item.deadline}
              </p>
              <p className="font-dm-sans text-white/85 text-base leading-[1.7] mb-5">
                Talk to any Board member, or email us and we'll put you in touch.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/about#committee"
                  className="inline-flex items-center gap-2 min-h-11 px-5 py-2.5 bg-accent-gold text-deep-purple font-rajdhani font-bold uppercase tracking-wider text-sm shadow-[3px_3px_0_rgba(0,0,0,0.3)] hover:-translate-y-0.5 transition-transform"
                >
                  <FiUsers aria-hidden="true" /> Meet the Board
                </Link>
                <a
                  href="mailto:info@digrasa.co.za?subject=Board%20nomination"
                  className="inline-flex items-center gap-2 min-h-11 px-5 py-2.5 border-2 border-white/70 text-white font-rajdhani font-bold uppercase tracking-wider text-sm hover:bg-white hover:text-deep-purple transition-colors"
                >
                  <FiMail aria-hidden="true" /> info@digrasa.co.za
                </a>
              </div>
            </aside>
          )}

          <div className="mt-14 pt-8 border-t border-border-light flex flex-wrap items-center justify-between gap-4">
            <Link
              to="/news"
              className="inline-flex items-center gap-2 min-h-11 font-rajdhani font-bold uppercase tracking-wider text-sm hover:gap-3 transition-all"
              style={{ color: ink(colour) }}
            >
              <FiArrowLeft aria-hidden="true" /> Back to all news
            </Link>
            <Link
              to="/membership"
              className="inline-flex items-center gap-2 min-h-11 px-6 py-3 bg-accent-gold text-deep-purple font-rajdhani font-bold uppercase tracking-wider text-sm shadow-[3px_3px_0_rgba(0,0,0,0.25)] hover:-translate-y-0.5 transition-transform"
            >
              Join the Chapter <FiArrowRight aria-hidden="true" />
            </Link>
          </div>
        </div>
      </article>

      {more.length > 0 && (
        <>
          <PixelDivider variant="full" />
          <section className="pixel-grid-dark py-20 md:py-28">
            <div className="container mx-auto">
              <h2 className="font-rajdhani font-bold text-white text-[32px] sm:text-[40px] mb-10">More from DiGRA SA</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {more.map((n) => (
                  <NewsCard key={n.id} item={n} />
                ))}
              </div>
            </div>
          </section>
        </>
      )}
    </motion.main>
  )
}
