import { Link } from 'react-router-dom';
import styles from './CTABanner.module.css';

export default function CTABanner({ headline, subtext, buttonText, buttonLink }) {
  return (
    <section className={styles.banner}>
      <div className={styles.inner}>
        <div className={styles.text}>
          <h2 className={styles.headline}>{headline}</h2>
          {subtext && <p className={styles.subtext}>{subtext}</p>}
        </div>
        <Link to={buttonLink} className={styles.btn}>
          {buttonText}
        </Link>
      </div>
    </section>
  );
}
