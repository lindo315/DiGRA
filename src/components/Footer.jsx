import { Link } from 'react-router-dom';
import { FiTwitter, FiLinkedin, FiFacebook, FiMail, FiMapPin, FiExternalLink } from 'react-icons/fi';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.topBorder} />
      <div className={styles.inner}>
        <div className={styles.grid}>
          {/* Column 1 — Logo & About */}
          <div className={styles.col}>
            <div className={styles.logoBlock}>
              <span className={styles.logoDiamond}></span>
              <span className={styles.logoText}>DiGRA SA</span>
            </div>
            <p className={styles.tagline}>
              South Africa Chapter of the Digital Games Research Association
            </p>
            <p className={styles.blurb}>
              Connecting South African game researchers, educators, students, and industry professionals with the global game studies community.
            </p>
            <a
              href="https://digra.org"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.parentLink}
            >
              DiGRA International <FiExternalLink size={13} />
            </a>
          </div>

          {/* Column 2 — Quick Links */}
          <div className={styles.col}>
            <h4 className={styles.colHeading}>Quick Links</h4>
            <ul className={styles.linkList}>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About DiGRA SA</Link></li>
              <li><Link to="/events">Events & Conferences</Link></li>
              <li><Link to="/research">Research & Resources</Link></li>
              <li><Link to="/membership">Membership</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Column 3 — Resources */}
          <div className={styles.col}>
            <h4 className={styles.colHeading}>Resources</h4>
            <ul className={styles.linkList}>
              <li>
                <a href="https://digra.org/digital-library/" target="_blank" rel="noopener noreferrer">
                  DiGRA Digital Library
                </a>
              </li>
              <li>
                <a href="https://todigra.org" target="_blank" rel="noopener noreferrer">
                  ToDiGRA Journal
                </a>
              </li>
              <li>
                <a href="http://gamestudies.org" target="_blank" rel="noopener noreferrer">
                  Game Studies Journal
                </a>
              </li>
              <li>
                <a href="https://digra.org" target="_blank" rel="noopener noreferrer">
                  DiGRA International
                </a>
              </li>
              <li>
                <Link to="/membership">Join the Chapter</Link>
              </li>
            </ul>
          </div>

          {/* Column 4 — Contact */}
          <div className={styles.col}>
            <h4 className={styles.colHeading}>Get In Touch</h4>
            <ul className={styles.contactList}>
              <li>
                <FiMail size={15} />
                <a href="mailto:info@digrasa.org">info@digrasa.org</a>
              </li>
              <li>
                <FiMapPin size={15} />
                <span>South Africa</span>
              </li>
            </ul>
            <div className={styles.socials}>
              <a href="#" aria-label="Twitter/X" className={styles.socialIcon}>
                <FiTwitter size={18} />
              </a>
              <a href="#" aria-label="LinkedIn" className={styles.socialIcon}>
                <FiLinkedin size={18} />
              </a>
              <a href="#" aria-label="Facebook" className={styles.socialIcon}>
                <FiFacebook size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <div className={styles.bottomInner}>
          <p>© 2025 DiGRA South Africa. A regional chapter of DiGRA International.</p>
          <p>Built with purpose for the African game studies community.</p>
        </div>
      </div>
    </footer>
  );
}
