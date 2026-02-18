import SectionHeader from '../components/SectionHeader';
import TeamCard from '../components/TeamCard';
import CTABanner from '../components/CTABanner';
import { team } from '../data/team';
import styles from './About.module.css';

const aims = [
  'Establish game studies as legitimate and valued scholarship within South African academic institutions.',
  'Build an interconnected network of scholars, researchers, educators, and practitioners across Southern Africa.',
  'Link academic game research communities to professional and industry game research communities.',
  'Support teaching, postgraduate development, and early-career researchers in the field of game studies.',
  'Promote South African and African game scholarship on the global stage through publications and international collaborations.',
  'Encourage inclusive, diverse, and transdisciplinary research that centres African perspectives on games and play.',
];

const goals = [
  {
    number: '01',
    title: 'Advance Game Scholarship',
    description:
      'Foster rigorous academic research on digital and non-digital games in South African and African contexts, contributing original knowledge to the global field of game studies.',
  },
  {
    number: '02',
    title: 'Build an Inclusive Community',
    description:
      'Create a welcoming, open community that brings together researchers, students, educators, developers, and enthusiasts from diverse backgrounds, disciplines, and career stages.',
  },
  {
    number: '03',
    title: 'Connect Locally and Globally',
    description:
      'Serve as the bridge between South African game studies and the international DiGRA community, ensuring African voices are heard in global conversations about games and play.',
  },
  {
    number: '04',
    title: 'Centre African Experience',
    description:
      'Actively challenge Eurocentric frameworks in game studies and develop alternative approaches grounded in African philosophies, histories, and cultural contexts.',
  },
];

export default function About() {
  return (
    <>
      {/* Page Hero */}
      <div className="page-hero">
        <div className="page-hero-inner">
          <p className="page-hero-breadcrumb">Home / About</p>
          <h1>About DiGRA South Africa</h1>
          <p>Grounding game studies in African experience, community, and scholarship.</p>
        </div>
      </div>

      {/* About Section */}
      <section id="who-we-are" className={`${styles.aboutSection} section-white`}>
        <div className="container">
          <div className={styles.aboutGrid}>
            <div className={styles.aboutBody}>
              <SectionHeader title="Who We Are" />
              <p>
                DiGRA South Africa is the official South African regional chapter of the Digital
                Games Research Association (DiGRA) International — the world&apos;s premier academic
                organisation dedicated to the study of digital games, founded in 2003. As a chapter,
                we operate within the global DiGRA framework while maintaining a specific focus on
                South African and African contexts.
              </p>
              <p>
                We were established in 2025 to address a significant gap: the need for a dedicated
                South African scholarly home for game studies. Games are a major cultural, creative,
                and economic force in South Africa, yet academic research on games has historically
                been scattered, under-resourced, and disconnected from global scholarly conversations.
              </p>
              <p>
                DiGRA SA exists to change that — by building infrastructure for game scholarship,
                facilitating networking and collaboration, hosting events, supporting publications,
                and advocating for game studies as a legitimate and important field within South
                African academia and beyond.
              </p>
            </div>
            <div className={styles.infoBox}>
              <h3 className={styles.infoBoxHeading}>Key Facts</h3>
              <ul className={styles.infoList}>
                <li>
                  <span className={styles.infoLabel}>Founded</span>
                  <span className={styles.infoValue}>2025</span>
                </li>
                <li>
                  <span className={styles.infoLabel}>Region</span>
                  <span className={styles.infoValue}>South Africa & Southern Africa</span>
                </li>
                <li>
                  <span className={styles.infoLabel}>Parent Organisation</span>
                  <span className={styles.infoValue}>DiGRA International (Est. 2003)</span>
                </li>
                <li>
                  <span className={styles.infoLabel}>Status</span>
                  <span className={styles.infoValue}>Newly Established Chapter</span>
                </li>
                <li>
                  <span className={styles.infoLabel}>Scope</span>
                  <span className={styles.infoValue}>Open & Inclusive</span>
                </li>
                <li>
                  <span className={styles.infoLabel}>Focus</span>
                  <span className={styles.infoValue}>Game Studies in African Contexts</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Goals */}
      <section id="mission" className={`${styles.goalsSection} section-bg`}>
        <div className="container">
          <SectionHeader
            title="Our Mission & Goals"
            subtitle="Four pillars that guide everything DiGRA South Africa does."
            align="center"
          />
          <div className={styles.goalsGrid}>
            {goals.map((goal) => (
              <div key={goal.number} className={styles.goalCard}>
                <span className={styles.goalNumber}>{goal.number}</span>
                <h3 className={styles.goalTitle}>{goal.title}</h3>
                <p className={styles.goalDesc}>{goal.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Aims */}
      <section id="our-aims" className={`${styles.aimsSection} section-white`}>
        <div className="container">
          <div className={styles.aimsGrid}>
            <div>
              <SectionHeader
                title="Our Aims"
                subtitle="The specific objectives that shape our work as a chapter of DiGRA International."
              />
            </div>
            <ul className={styles.aimsList}>
              {aims.map((aim, i) => (
                <li key={i} className={styles.aimItem}>
                  <span className={styles.aimBullet} />
                  <p>{aim}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Team */}
      <section id="our-team" className={`${styles.teamSection} section-bg`}>
        <div className="container">
          <SectionHeader
            title="Meet the Founding Committee"
            subtitle="The team behind DiGRA South Africa."
          />
          <div className={styles.teamGrid}>
            {team.map((member) => (
              <TeamCard key={member.id} {...member} />
            ))}
          </div>
        </div>
      </section>

      {/* DiGRA International Connection */}
      <section className={`${styles.parentSection} section-white`}>
        <div className="container">
          <div className={styles.parentBox}>
            <div className={styles.parentText}>
              <h2>Our Connection to DiGRA International</h2>
              <div className="gold-bar" style={{ marginBottom: '24px' }} />
              <p>
                DiGRA South Africa is an official regional chapter of the Digital Games Research
                Association (DiGRA) International. Founded in 2003, DiGRA International is the
                world&apos;s leading academic organisation for the study of digital games. It hosts
                the premier annual DiGRA conference, publishes the ToDiGRA journal, and maintains
                an open-access digital library of game studies scholarship.
              </p>
              <p>
                As a chapter, DiGRA SA operates with autonomy to address local needs while benefiting
                from the resources, networks, and prestige of the global DiGRA community. Our members
                have access to DiGRA International resources, discounts on conference registration,
                and the opportunity to participate in shaping the future of global game studies.
              </p>
              <a
                href="https://digra.org"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.parentLink}
              >
                Visit DiGRA International →
              </a>
            </div>
            <div className={styles.parentVisual} aria-hidden="true">
              <div className={styles.parentBadge}>
                <span className={styles.badgeDiamond} />
                <p className={styles.badgeText}>Official Chapter</p>
                <p className={styles.badgeOrg}>DiGRA International</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTABanner
        headline="Be part of building something new."
        subtext="DiGRA SA is at its founding stage — your involvement now shapes what we become. Join us."
        buttonText="Join DiGRA SA"
        buttonLink="/membership"
      />
    </>
  );
}
