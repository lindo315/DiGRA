import { Link } from 'react-router-dom';
import styles from './HeroSection.module.css';

export default function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={styles.pattern} aria-hidden="true" />
      <div className={styles.inner}>
        <div className={styles.content}>
          <p className={styles.eyebrow}>Official Regional Chapter · DiGRA International</p>
          <h1 className={styles.headline}>
            Game Studies in Africa,{' '}
            <span className={styles.accentWord}>For Africa.</span>
          </h1>
          <p className={styles.subheadline}>
            DiGRA South Africa is the official regional chapter of the Digital Games Research
            Association — connecting South African researchers, educators, students, and
            industry professionals with the global game studies community.
          </p>
          <div className={styles.ctaGroup}>
            <Link to="/membership" className="btn-primary">
              Join the Chapter
            </Link>
            <Link to="/about" className="btn-outline-white">
              Learn More
            </Link>
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div className={styles.statsStrip}>
        <div className={styles.statsInner}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Part of DiGRA International</span>
            <span className={styles.statSub}>Est. 2003</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statLabel}>Pan-African Scope</span>
            <span className={styles.statSub}>Continent-wide reach</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statLabel}>Open to All</span>
            <span className={styles.statSub}>Researchers · Students · Industry</span>
          </div>
        </div>
      </div>
    </section>
  );
}
