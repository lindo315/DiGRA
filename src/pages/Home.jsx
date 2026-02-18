import { Link } from 'react-router-dom';
import { FaFlask, FaUsers, FaGlobe } from 'react-icons/fa';
import HeroSection from '../components/HeroSection';
import SectionHeader from '../components/SectionHeader';
import NewsCard from '../components/NewsCard';
import EventCard from '../components/EventCard';
import CTABanner from '../components/CTABanner';
import { news } from '../data/news';
import { events } from '../data/events';
import styles from './Home.module.css';

export default function Home() {
  const latestNews = news.slice(0, 3);
  const upcomingEvents = events.filter((e) => e.status === 'upcoming').slice(0, 3);

  return (
    <>
      <HeroSection />

      {/* Mission Strip */}
      <section className={`${styles.missionStrip} section-white`}>
        <div className="container">
          <div className={styles.missionGrid}>
            <div className={styles.missionCard}>
              <div className={styles.missionIcon}>
                <FaFlask size={24} />
              </div>
              <h3>Research</h3>
              <p>
                Advancing rigorous academic research on games in the South African
                and broader African context — from cultural analysis to game design theory.
              </p>
            </div>
            <div className={styles.missionCard}>
              <div className={styles.missionIcon} style={{ backgroundColor: 'rgba(245,166,35,0.12)', color: 'var(--color-accent-gold)' }}>
                <FaUsers size={24} />
              </div>
              <h3>Community</h3>
              <p>
                Building an inclusive network of game scholars, students, developers, and
                practitioners united by a commitment to understanding games in African contexts.
              </p>
            </div>
            <div className={styles.missionCard}>
              <div className={styles.missionIcon} style={{ backgroundColor: 'rgba(26,26,46,0.08)', color: 'var(--color-primary)' }}>
                <FaGlobe size={24} />
              </div>
              <h3>Connection</h3>
              <p>
                Linking South African game studies to the global DiGRA community and beyond —
                amplifying African voices in international game research conversations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className={`${styles.newsSection} section-bg`}>
        <div className="container">
          <SectionHeader
            title="Latest News & Updates"
            subtitle="Stay informed about DiGRA SA announcements, events, and research highlights."
          />
          <div className={styles.newsGrid}>
            {latestNews.map((item) => (
              <NewsCard key={item.id} {...item} />
            ))}
          </div>
          <div className={styles.sectionLink}>
            <Link to="/research" className={styles.viewAllLink}>
              View all news & updates →
            </Link>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className={`${styles.eventsSection} section-white`}>
        <div className="container">
          <SectionHeader
            title="Upcoming Events"
            subtitle="Join us at our upcoming symposia, workshops, and seminars across South Africa."
          />
          <div className={styles.eventsList}>
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} {...event} />
            ))}
          </div>
          <div className={styles.sectionLink}>
            <Link to="/events" className={styles.viewAllLink}>
              View all events →
            </Link>
          </div>
        </div>
      </section>

      {/* About Teaser */}
      <section className={`${styles.aboutTeaser} section-bg`}>
        <div className="container">
          <div className={styles.aboutGrid}>
            <div className={styles.aboutText}>
              <p className={styles.aboutEyebrow}>Who We Are</p>
              <h2>Grounding Game Studies in the African Experience</h2>
              <div className={styles.goldBar} />
              <p>
                DiGRA South Africa is the official South African regional chapter of the Digital
                Games Research Association (DiGRA), the world&apos;s leading international academic
                organisation dedicated to the study of digital games and play.
              </p>
              <p>
                We exist to create a home for game scholarship that is rooted in South African and
                African realities — acknowledging the continent&apos;s rich histories, diverse cultures,
                and unique relationship with digital technology. We welcome researchers, educators,
                postgraduate students, game developers, and industry professionals.
              </p>
              <Link to="/about" className={styles.aboutLink}>
                About DiGRA SA →
              </Link>
            </div>
            <div className={styles.aboutVisual} aria-hidden="true">
              <div className={styles.visualBlock}>
                <div className={styles.visualInner}>
                  <span className={styles.visualDiamond} />
                  <p className={styles.visualQuote}>
                    "Ubuntu — I am because we are. Game studies in South Africa begins here."
                  </p>
                  <p className={styles.visualCaption}>DiGRA South Africa · Est. 2025</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <CTABanner
        headline="Ready to be part of the conversation?"
        subtext="Join DiGRA South Africa and connect with a growing community of game researchers, educators, and industry professionals across the continent."
        buttonText="Become a Member"
        buttonLink="/membership"
      />
    </>
  );
}
