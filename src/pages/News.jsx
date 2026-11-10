import { motion } from 'framer-motion'
import PageHero from '../components/PageHero'
import NewsCard from '../components/cards/NewsCard'
import { news } from '../data/news'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
}

export default function News() {
  const [featured, ...rest] = news

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="pt-16"
    >
      <PageHero
        title="News & Updates"
        breadcrumb="Home / News"
        accentColor="violet"
        subtitle="Announcements, event recaps and writing from the chapter."
      />

      <section className="pixel-grid-dark py-20 md:py-28" aria-labelledby="news-list-title">
        <div className="container mx-auto">
          <h2 id="news-list-title" className="sr-only">All news</h2>
          {featured && (
            <motion.div className="mb-6" variants={fadeUp} initial="hidden" animate="visible">
              <NewsCard item={featured} variant="featured" />
            </motion.div>
          )}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.05 }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
          >
            {rest.map((item) => (
              <motion.div key={item.id} variants={fadeUp}>
                <NewsCard item={item} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </motion.main>
  )
}
