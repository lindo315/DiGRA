import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'
import { ACCENTS, NEWS_CATEGORY_COLOURS, onDark } from '../../lib/theme'

function colourFor(item) {
  return NEWS_CATEGORY_COLOURS[item.category] || ACCENTS.gold
}

function Meta({ item, colour, size = 'sm' }) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span
        className={`font-rajdhani font-bold uppercase tracking-[2px] px-2.5 py-0.5 ${size === 'sm' ? 'text-sm' : 'text-sm'}`}
        style={{ color: onDark(colour), background: `${colour}20`, border: `1px solid ${colour}40` }}
      >
        {item.category}
      </span>
      <span className="font-dm-sans text-white/70 text-sm">{item.date}</span>
    </div>
  )
}

/* ── Featured: large editorial hero card, with photo when available ── */
function NewsCardFeatured({ item }) {
  const colour = colourFor(item)

  return (
    <motion.article
      className="relative h-full min-h-[460px] overflow-hidden border border-white/10 group bg-light-purple/40"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Link to={`/news/${item.slug}`} className={`flex flex-col justify-end h-full min-h-[460px] p-6 sm:p-8 ${item.image ? 'pt-56 sm:pt-8' : ''}`}>
        {item.image && (
          <>
            <img
              src={item.image}
              alt=""
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover grayscale-[20%] group-hover:scale-[1.03] transition-transform duration-500"
            />
            {/* Duotone + readability overlay */}
            <div className="absolute inset-0 bg-deep-purple/30 mix-blend-multiply" aria-hidden="true" />
            <div
              className="absolute inset-0"
              aria-hidden="true"
              style={{ background: 'linear-gradient(180deg, rgba(28,10,58,0) 0%, rgba(28,10,58,0.1) 30%, rgba(28,10,58,0.85) 62%, rgba(28,10,58,0.98) 100%)' }}
            />
            <div className="absolute inset-0 pixel-overlay opacity-40" aria-hidden="true" />
          </>
        )}

        {!item.image && (
          <>
            <div
              className="absolute top-0 right-0 w-28 h-28 opacity-15 pointer-events-none"
              aria-hidden="true"
              style={{
                background: `repeating-linear-gradient(45deg, ${colour} 0, ${colour} 2px, transparent 0, transparent 50%)`,
                backgroundSize: '8px 8px',
              }}
            />
            <div
              className="absolute bottom-0 left-0 w-48 h-48 opacity-10 blur-2xl pointer-events-none"
              aria-hidden="true"
              style={{ background: colour }}
            />
          </>
        )}

        <div className="relative z-10">
          <div className="mb-4">
            <Meta item={item} colour={colour} />
          </div>
          <h3
            className="font-rajdhani font-bold text-white text-[28px] sm:text-[34px] leading-tight mb-3 group-hover:text-accent-gold transition-colors duration-200"
            style={{ maxWidth: '560px' }}
          >
            {item.title}
          </h3>
          {item.author && (
            <p className="font-dm-sans text-white/75 text-sm mb-3">By {item.author}</p>
          )}
          <p className="font-dm-sans text-white/85 text-base leading-[1.7] mb-5" style={{ maxWidth: '520px' }}>
            {item.excerpt}
          </p>
          <span
            className="inline-flex items-center gap-2 font-rajdhani font-bold text-sm uppercase tracking-wider group-hover:gap-3 transition-all duration-200"
            style={{ color: onDark(colour) }}
          >
            Read the full story <FiArrowRight size={15} aria-hidden="true" />
          </span>
        </div>
      </Link>
    </motion.article>
  )
}

/* ── Secondary: compact horizontal card ── */
function NewsCardSecondary({ item }) {
  const colour = colourFor(item)

  return (
    <motion.article
      className="bg-light-purple/30 border border-white/10 group hover:border-white/25 transition-colors"
      whileHover={{ x: 4 }}
      transition={{ duration: 0.15 }}
    >
      <Link to={`/news/${item.slug}`} className="flex gap-4 p-5 min-h-11">
        <div className="flex-shrink-0 w-[3px] self-stretch" style={{ background: colour }} aria-hidden="true" />
        <div className="flex-1 min-w-0">
          <div className="mb-2">
            <Meta item={item} colour={colour} />
          </div>
          <h3 className="font-rajdhani font-bold text-white text-lg leading-tight group-hover:text-accent-gold transition-colors duration-200 line-clamp-2">
            {item.title}
          </h3>
          {item.deadline && (
            <p className="font-dm-sans text-sm text-accent-gold mt-1.5">Closes {item.deadline}</p>
          )}
        </div>
        <FiArrowRight
          size={16}
          aria-hidden="true"
          className="flex-shrink-0 self-center text-white/50 group-hover:text-white transition-colors duration-200"
        />
      </Link>
    </motion.article>
  )
}

/* ── Default: dark grid card (News page) ── */
export default function NewsCard({ item, variant = 'default' }) {
  if (variant === 'featured') return <NewsCardFeatured item={item} />
  if (variant === 'secondary') return <NewsCardSecondary item={item} />

  const colour = colourFor(item)

  return (
    <motion.article
      className="bg-light-purple/40 border border-white/10 group h-full hover:border-white/25 transition-colors"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Link to={`/news/${item.slug}`} className="flex flex-col h-full">
        {item.image && (
          <div className="relative aspect-[16/9] overflow-hidden">
            <img src={item.image} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" />
            <div className="absolute inset-0 bg-deep-purple/25 mix-blend-multiply" aria-hidden="true" />
          </div>
        )}
        <div className="p-6 flex flex-col flex-1">
          <div className="mb-4">
            <Meta item={item} colour={colour} />
          </div>
          <h3 className="font-rajdhani font-bold text-white text-[22px] leading-tight mb-3 group-hover:text-accent-gold transition-colors duration-200">
            {item.title}
          </h3>
          <p className="font-dm-sans text-white/80 text-base leading-[1.7] flex-1">{item.excerpt}</p>
          <div
            className="mt-5 h-[2px] w-12 group-hover:w-full transition-all duration-300"
            style={{ background: colour }}
            aria-hidden="true"
          />
        </div>
      </Link>
    </motion.article>
  )
}
