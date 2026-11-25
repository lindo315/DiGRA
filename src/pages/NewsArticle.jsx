import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams } from 'react-router-dom'
import { FiArrowLeft, FiArrowRight, FiMail, FiUsers } from 'react-icons/fi'
import PixelDivider from '../components/PixelDivider'
import NewsCard from '../components/cards/NewsCard'
import NotFound from './NotFound'
import { useContent, usePage } from '../content/ContentContext'
import { ACCENTS, NEWS_CATEGORY_COLOURS, ink, onDark } from '../lib/theme'
import { Inline, SmartLink, safeUrl } from '../lib/text'
import usePageTitle from '../lib/usePageTitle'

/** One block of an article. Older content used { h: … } style blocks, so both are read. */
export function Block({ block, colour }) {
  const b = typeof block === 'string' ? { type: 'p', text: block } : block.type ? block
    : block.h ? { type: 'h', text: block.h } : block.list ? { type: 'list', text: block.list.join('\n') }
    : block.quote ? { type: 'quote', text: block.quote } : block.note ? { type: 'note', text: block.note } : {}
  const text = b.text || ''
  switch (b.type) {
    case 'p':
      return text.trim() ? <p className="font-dm-sans text-text-primary/90 text-lg leading-[1.75]"><Inline text={text} /></p> : null
    case 'h':
      return <h2 className="font-rajdhani font-bold text-deep-purple text-[28px] sm:text-[32px] leading-tight pt-6">{text}</h2>
    case 'list':
      return (
        <ul className="space-y-2.5 pl-1">
          {text.split('\n').map((t) => t.trim()).filter(Boolean).map((item, i) => (
            <li key={i} className="flex gap-3 font-dm-sans text-text-primary/90 text-lg leading-[1.7]">
              <span className="mt-[11px] w-2 h-2 flex-shrink-0" style={{ background: colour }} aria-hidden="true" />
              <span><Inline text={item} /></span>
            </li>
          ))}
        </ul>
      )
    case 'quote':
      return (
        <p className="font-rajdhani font-bold text-deep-purple text-2xl sm:text-[28px] leading-snug py-5 px-6 my-2 bg-bg-tint" style={{ borderLeft: `5px solid ${colour}` }}>
          {text}
        </p>
      )
    case 'note':
      return <p className="font-dm-sans italic text-text-secondary text-base leading-[1.7]"><Inline text={text} /></p>
    case 'image':
      return safeUrl(b.url) ? (
        <figure className="my-4">
          <img src={safeUrl(b.url)} alt={b.alt || ''} loading="lazy" className="w-full shadow-[6px_6px_0_rgba(28,10,58,0.12)]" />
          {text && <figcaption className="font-dm-sans text-text-secondary text-sm mt-3">{text}</figcaption>}
        </figure>
      ) : null
    case 'button':
      return safeUrl(b.url) ? (
        <p>
          <SmartLink to={b.url} className="inline-flex items-center gap-2 min-h-11 px-6 py-3 bg-accent-gold text-deep-purple font-rajdhani font-bold uppercase tracking-wider text-sm shadow-[3px_3px_0_rgba(0,0,0,0.25)] hover:-translate-y-0.5 transition-transform">
            {text || 'Find out more'} <FiArrowRight aria-hidden="true" />
          </SmartLink>
        </p>
      ) : null
    default:
      return null
  }
}

export default function NewsArticle() {
  const { slug } = useParams()
  const { news, site } = useContent()
  const { p } = usePage('news_page')
  const a = p.article
  const item = news.find((n) => n.slug === slug)
  usePageTitle(item?.title)

  useEffect(() => {
    if (!item?.excerpt) return
    const meta = document.querySelector('meta[name="description"]')
    const before = meta?.getAttribute('content')
    meta?.setAttribute('content', item.excerpt)
    return () => { if (meta && before) meta.setAttribute('content', before) }
  }, [item])

  if (!item) return <NotFound />

  const colour = NEWS_CATEGORY_COLOURS[item.category] || ACCENTS.gold
  const more = news.filter((n) => n.slug !== item.slug).slice(0, 3)
  const email = site.contact_email

  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
      <header className="dark-textured relative overflow-hidden pt-12 pb-14 sm:pt-16 sm:pb-20" style={{ borderBottom: `3px solid ${colour}55` }}>
        <div className="pointer-events-none absolute right-0 top-0 h-[360px] w-[360px] rounded-full" style={{ background: `radial-gradient(circle, ${colour}1f 0%, transparent 70%)` }} aria-hidden="true" />
        <div className="container mx-auto relative z-10 max-w-4xl">
          <SmartLink to="/news" className="inline-flex items-center gap-2 min-h-11 font-rajdhani font-semibold uppercase tracking-wider text-sm text-white/80 hover:text-accent-gold transition-colors mb-6">
            <FiArrowLeft aria-hidden="true" /> {a.back_label || 'All news'}
          </SmartLink>
          <div className="flex items-center gap-3 flex-wrap mb-5">
            {item.category && (
              <span className="font-rajdhani font-bold text-sm uppercase tracking-[2px] px-2.5 py-0.5" style={{ color: onDark(colour), background: `${colour}20`, border: `1px solid ${colour}40` }}>
                {item.category}
              </span>
            )}
            {item.date && <span className="font-dm-sans text-white/75 text-sm">{item.date}</span>}
          </div>
          <h1 className="font-rajdhani font-bold text-white text-4xl sm:text-5xl md:text-[56px] leading-[1.08] mb-5">{item.title}</h1>
          {item.author && <p className="font-dm-sans text-white/80 text-base">{a.by_label || 'By'} {item.author}</p>}
        </div>
      </header>

      <article className="bg-surface pb-24 md:pb-32">
        {safeUrl(item.image) && (
          <div className="container mx-auto max-w-5xl">
            <figure className="-mt-8 sm:-mt-10 relative z-10">
              <img src={safeUrl(item.image)} alt={item.imageAlt || ''} decoding="async" className="w-full aspect-[4/3] sm:aspect-[16/9] object-cover shadow-[8px_8px_0_rgba(28,10,58,0.15)]" />
            </figure>
          </div>
        )}

        <div className="container mx-auto max-w-3xl pt-12 md:pt-16">
          <div className="space-y-6">
            {item.body.map((block, i) => <Block key={i} block={block} colour={colour} />)}
          </div>

          {item.deadline && (
            <aside className="mt-12 p-6 sm:p-8 bg-deep-purple" style={{ borderLeft: `5px solid ${colour}` }}>
              <p className="font-rajdhani font-bold uppercase tracking-[2px] text-sm mb-2" style={{ color: onDark(colour) }}>
                {a.deadline_label || 'Closes'} {item.deadline}
              </p>
              {a.deadline_text && <p className="font-dm-sans text-white/85 text-base leading-[1.7] mb-5">{a.deadline_text}</p>}
              <div className="flex flex-wrap gap-3">
                {a.board_button && (
                  <SmartLink to="/about#board" className="inline-flex items-center gap-2 min-h-11 px-5 py-2.5 bg-accent-gold text-deep-purple font-rajdhani font-bold uppercase tracking-wider text-sm shadow-[3px_3px_0_rgba(0,0,0,0.3)] hover:-translate-y-0.5 transition-transform">
                    <FiUsers aria-hidden="true" /> {a.board_button}
                  </SmartLink>
                )}
                {email && (
                  <a href={`mailto:${email}?subject=${encodeURIComponent(item.title)}`} className="inline-flex items-center gap-2 min-h-11 px-5 py-2.5 border-2 border-white/70 text-white font-rajdhani font-bold uppercase tracking-wider text-sm hover:bg-white hover:text-deep-purple transition-colors break-all">
                    <FiMail aria-hidden="true" /> {email}
                  </a>
                )}
              </div>
            </aside>
          )}

          <div className="mt-14 pt-8 border-t border-border-light flex flex-wrap items-center justify-between gap-4">
            <SmartLink to="/news" className="inline-flex items-center gap-2 min-h-11 font-rajdhani font-bold uppercase tracking-wider text-sm hover:gap-3 transition-all" style={{ color: ink(colour) }}>
              <FiArrowLeft aria-hidden="true" /> {a.back_bottom || a.back_label || 'Back to all news'}
            </SmartLink>
            {a.join?.label && (
              <SmartLink to={a.join.url} className="inline-flex items-center gap-2 min-h-11 px-6 py-3 bg-accent-gold text-deep-purple font-rajdhani font-bold uppercase tracking-wider text-sm shadow-[3px_3px_0_rgba(0,0,0,0.25)] hover:-translate-y-0.5 transition-transform">
                {a.join.label} <FiArrowRight aria-hidden="true" />
              </SmartLink>
            )}
          </div>
        </div>
      </article>

      {more.length > 0 && (
        <>
          <PixelDivider variant="full" />
          <section className="pixel-grid-dark py-20 md:py-28">
            <div className="container mx-auto">
              <h2 className="font-rajdhani font-bold text-white text-[32px] sm:text-[40px] mb-10">{a.more_title || 'More from DiGRA SA'}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {more.map((n) => <NewsCard key={n.id ?? n.slug} item={n} readMore={p.list.read_more} />)}
              </div>
            </div>
          </section>
        </>
      )}
    </motion.main>
  )
}
