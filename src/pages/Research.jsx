import {
  FaGlobeAfrica,
  FaBookOpen,
  FaGamepad,
  FaGraduationCap,
  FaChartBar,
  FaBalanceScale,
} from 'react-icons/fa';
import { FiExternalLink } from 'react-icons/fi';
import SectionHeader from '../components/SectionHeader';
import CTABanner from '../components/CTABanner';
import { researchAreas, journals } from '../data/research';
import styles from './Research.module.css';

const iconMap = {
  FaGlobeAfrica: FaGlobeAfrica,
  FaBookOpen: FaBookOpen,
  FaGamepad: FaGamepad,
  FaGraduationCap: FaGraduationCap,
  FaChartBar: FaChartBar,
  FaBalanceScale: FaBalanceScale,
};

export default function Research() {
  return (
    <>
      {/* Page Hero */}
      <div className="page-hero">
        <div className="page-hero-inner">
          <p className="page-hero-breadcrumb">Home / Research</p>
          <h1>Research & Resources</h1>
          <p>
            Advancing game studies scholarship rooted in South African and African experience,
            and connecting our community to global resources.
          </p>
        </div>
      </div>

      {/* Game Studies in SA — editorial */}
      <section className={`${styles.landscapeSection} section-white`}>
        <div className="container">
          <div className={styles.landscapeGrid}>
            <div>
              <SectionHeader
                title="Game Studies in South Africa"
                subtitle="The landscape, the challenges, and the opportunity."
              />
              <p>
                South Africa has a rich, rapidly evolving relationship with games. The country has
                a growing indie game development scene, significant consumer engagement with games
                across all platforms, and a history of games being used in educational, therapeutic,
                and community contexts. Yet academic game studies has been slow to establish
                institutional roots on the continent.
              </p>
              <p>
                Historically, game studies in South Africa has been characterised by isolated
                pockets of interest — individual researchers working within larger departments of
                media studies, computer science, education, or cultural studies — without the
                infrastructure, community, or critical mass needed to constitute a coherent field.
                DiGRA SA exists to change this.
              </p>
              <p>
                The potential for game studies in South Africa is immense. Africa&apos;s relationship
                with digital games is shaped by infrastructural constraints, colonial histories,
                diverse cultural contexts, and rapidly growing youth populations with increasing
                access to mobile technology. These realities produce research questions that cannot
                be answered by frameworks developed in Europe or North America — and that demand
                locally grounded, decolonially informed scholarship.
              </p>
            </div>
            <div className={styles.landscapeSidebar}>
              <div className={styles.highlightBox}>
                <p className={styles.highlightLabel}>Did You Know?</p>
                <p className={styles.highlightText}>
                  Africa is the world&apos;s fastest-growing mobile gaming market. South Africa leads
                  the continent in games industry revenue. Yet game studies scholarship remains
                  vastly underrepresented in international journals.
                </p>
              </div>
              <div className={styles.highlightBox} style={{ marginTop: '20px' }}>
                <p className={styles.highlightLabel}>Our Approach</p>
                <p className={styles.highlightText}>
                  DiGRA SA actively encourages interdisciplinary, decolonial, and community-centred
                  approaches to game research — going beyond dominant Western frameworks to develop
                  methods and theories rooted in African experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Research Areas */}
      <section id="research-areas" className={`${styles.areasSection} section-bg`}>
        <div className="container">
          <SectionHeader
            title="Research Areas"
            subtitle="Key themes and topics in South African and African game studies."
            align="center"
          />
          <div className={styles.areasGrid}>
            {researchAreas.map((area) => {
              const IconComponent = iconMap[area.icon];
              return (
                <div key={area.id} className={styles.areaCard}>
                  {IconComponent && (
                    <div className={styles.areaIcon}>
                      <IconComponent size={22} />
                    </div>
                  )}
                  <h3 className={styles.areaTitle}>{area.title}</h3>
                  <p className={styles.areaDesc}>{area.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* DiGRA Digital Library Callout */}
      <section id="digital-library" className={`${styles.librarySection} section-white`}>
        <div className="container">
          <div className={styles.libraryCallout}>
            <div className={styles.libraryText}>
              <p className={styles.libraryEyebrow}>Open Access</p>
              <h2>DiGRA Digital Library</h2>
              <div className="gold-bar" style={{ marginBottom: '20px' }} />
              <p>
                The DiGRA Digital Library is a free, open-access archive of game studies
                scholarship — including papers from every DiGRA conference since 2003, articles
                from ToDiGRA, and other academic resources. As members of the DiGRA community,
                all DiGRA SA members have access to this invaluable resource.
              </p>
              <a
                href="https://digra.org/digital-library/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.libraryLink}
              >
                Browse the DiGRA Digital Library <FiExternalLink size={15} />
              </a>
            </div>
            <div className={styles.libraryDecor} aria-hidden="true">
              <div className={styles.libraryBadge}>
                <span className={styles.libBadgeDiamond} />
                <p>Open Access</p>
                <p>Game Studies Archive</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Journals & Publications */}
      <section id="journals" className={`${styles.journalsSection} section-bg`}>
        <div className="container">
          <SectionHeader
            title="Journals & Publications"
            subtitle="Key peer-reviewed journals for game studies scholarship."
          />
          <div className={styles.journalsList}>
            {journals.map((journal) => (
              <div key={journal.id} className={styles.journalCard}>
                <div className={styles.journalInfo}>
                  <h3 className={styles.journalName}>{journal.name}</h3>
                  <p className={styles.journalDesc}>{journal.description}</p>
                </div>
                <a
                  href={journal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.journalLink}
                >
                  Visit <FiExternalLink size={14} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Teaching Resources */}
      <section className={`${styles.teachingSection} section-white`}>
        <div className="container">
          <SectionHeader
            title="Teaching Resources"
            subtitle="Resources for educators integrating game studies into their teaching."
          />
          <div className={styles.resourcesGrid}>
            <div className={styles.resourceCard}>
              <h3>Game Studies Syllabi Collection</h3>
              <p>
                A curated collection of syllabi from game studies courses around the world —
                useful for designing new courses or finding inspiration for integrating games
                into existing curricula.
              </p>
              <a
                href="https://digra.org"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.resourceLink}
              >
                Access via DiGRA →
              </a>
            </div>
            <div className={styles.resourceCard}>
              <h3>Introduction to Game Studies</h3>
              <p>
                Foundational texts for students new to the field, including Jesper Juul&apos;s
                <em> Half-Real</em>, Ian Bogost&apos;s <em>Unit Operations</em>, and key articles
                from the <em>Game Studies</em> journal.
              </p>
              <a
                href="http://gamestudies.org"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.resourceLink}
              >
                Game Studies Journal →
              </a>
            </div>
            <div className={styles.resourceCard}>
              <h3>African Game Studies Reading List</h3>
              <p>
                A growing list of scholarship focused on games in African contexts — curated
                by DiGRA SA members. Includes postcolonial approaches, African game development
                studies, and indigenous play cultures.
              </p>
              <a href="/contact" className={styles.resourceLink}>
                Contribute a resource →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTABanner
        headline="Share your research with the community."
        subtext="DiGRA SA members can share publications, present at events, and contribute to our growing repository of South African game studies scholarship."
        buttonText="Join DiGRA SA"
        buttonLink="/membership"
      />
    </>
  );
}
