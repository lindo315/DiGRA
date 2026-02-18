import { useState } from 'react';
import SectionHeader from '../components/SectionHeader';
import EventCard from '../components/EventCard';
import CTABanner from '../components/CTABanner';
import { events } from '../data/events';
import styles from './Events.module.css';

const pastEvents = events.filter((e) => e.status === 'past');
const upcomingEvents = events.filter((e) => e.status === 'upcoming');

export default function Events() {
  const [pastOpen, setPastOpen] = useState(true);

  return (
    <>
      {/* Page Hero */}
      <div className="page-hero">
        <div className="page-hero-inner">
          <p className="page-hero-breadcrumb">Home / Events</p>
          <h1>Events & Conferences</h1>
          <p>
            Symposia, workshops, seminars, and conferences connecting South African
            game researchers and practitioners.
          </p>
        </div>
      </div>

      {/* Upcoming Events */}
      <section id="upcoming-events" className={`${styles.eventsSection} section-white`}>
        <div className="container">
          <SectionHeader
            title="Upcoming Events"
            subtitle="Events you can attend, participate in, or submit to. Open to all."
          />
          {upcomingEvents.length > 0 ? (
            <div className={styles.eventsList}>
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} {...event} />
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>No upcoming events at this time. Check back soon — we&apos;re always planning something.</p>
            </div>
          )}
        </div>
      </section>

      {/* Past Events */}
      <section id="past-events" className={`${styles.pastSection} section-bg`}>
        <div className="container">
          <SectionHeader
            title="Past Events"
            subtitle="Previous DiGRA SA events and activities."
          />
          <div className={styles.accordion}>
            <button
              className={styles.accordionTrigger}
              onClick={() => setPastOpen(!pastOpen)}
              aria-expanded={pastOpen}
            >
              <span>2025</span>
              <span className={`${styles.accordionIcon} ${pastOpen ? styles.open : ''}`}>▼</span>
            </button>
            {pastOpen && (
              <div className={styles.accordionContent}>
                {pastEvents.length > 0 ? (
                  <div className={styles.eventsList}>
                    {pastEvents.map((event) => (
                      <EventCard key={event.id} {...event} />
                    ))}
                  </div>
                ) : (
                  <p className={styles.emptyNote}>No past events recorded yet.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Host an Event CTA */}
      <section id="host-event" className={`${styles.hostSection} section-white`}>
        <div className="container">
          <div className={styles.hostBox}>
            <div className={styles.hostText}>
              <SectionHeader
                title="Host an Event with DiGRA SA"
                subtitle="Are you an academic institution, research centre, or individual with an idea for a workshop, panel, or seminar on game studies? We'd love to hear from you."
              />
              <ul className={styles.hostList}>
                <li>
                  <span className={styles.hostBullet} />
                  <p>Propose workshops or seminars at your institution</p>
                </li>
                <li>
                  <span className={styles.hostBullet} />
                  <p>Co-organise panel discussions with DiGRA SA support</p>
                </li>
                <li>
                  <span className={styles.hostBullet} />
                  <p>Pitch reading groups, online talks, or special interest events</p>
                </li>
                <li>
                  <span className={styles.hostBullet} />
                  <p>Partner with DiGRA SA to bring international speakers to South Africa</p>
                </li>
              </ul>
              <a href="/contact" className="btn-primary" style={{ marginTop: '24px', display: 'inline-flex' }}>
                Get in Touch
              </a>
            </div>
            <div className={styles.hostVisual} aria-hidden="true">
              <div className={styles.hostDecor} />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTABanner
        headline="Don't miss the next DiGRA SA event."
        subtext="Join our mailing list by becoming a member and be the first to know about new events, calls for papers, and community gatherings."
        buttonText="Join the Chapter"
        buttonLink="/membership"
      />
    </>
  );
}
