import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FiMenu, FiX, FiChevronDown } from 'react-icons/fi';
import styles from './Navbar.module.css';

const navLinks = [
  { to: '/', label: 'Home' },
  {
    to: '/about',
    label: 'About',
    children: [
      { to: '/about#who-we-are', label: 'Who We Are' },
      { to: '/about#mission', label: 'Mission & Goals' },
      { to: '/about#our-team', label: 'Our Team' },
    ],
  },
  {
    to: '/events',
    label: 'Events',
    children: [
      { to: '/events#upcoming-events', label: 'Upcoming Events' },
      { to: '/events#past-events', label: 'Past Events' },
      { to: '/events#host-event', label: 'Host an Event' },
    ],
  },
  {
    to: '/research',
    label: 'Research',
    children: [
      { to: '/research#research-areas', label: 'Research Areas' },
      { to: '/research#digital-library', label: 'Digital Library' },
      { to: '/research#journals', label: 'Journals' },
    ],
  },
  {
    to: '/membership',
    label: 'Membership',
    children: [
      { to: '/membership#benefits', label: 'Benefits' },
      { to: '/membership#membership-tiers', label: 'Membership Tiers' },
      { to: '/membership#join-form', label: 'Apply Now' },
    ],
  },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeAll = () => {
    setMenuOpen(false);
    setOpenDropdown(null);
  };

  const toggleMobileDropdown = (to, e) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenDropdown(openDropdown === to ? null : to);
  };

  return (
    <header className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo} onClick={closeAll}>
          <span className={styles.logoDiamond}></span>
          <div className={styles.logoText}>
            <span className={styles.logoMain}>DiGRA SA</span>
            <span className={styles.logoSub}>South Africa Chapter</span>
          </div>
        </Link>

        <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`}>
          {navLinks.map(({ to, label, children }) =>
            children ? (
              /* Nav item with dropdown */
              <div key={to} className={styles.navItem}>
                {/* The page link itself */}
                <NavLink
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `${styles.navLink} ${isActive ? styles.active : ''}`
                  }
                  onClick={closeAll}
                >
                  {label}
                  {/* chevron — visible desktop only via CSS */}
                  <FiChevronDown size={13} className={styles.chevron} aria-hidden="true" />
                </NavLink>

                {/* Mobile accordion toggle button */}
                <button
                  className={styles.mobileToggle}
                  onClick={(e) => toggleMobileDropdown(to, e)}
                  aria-label={`Expand ${label} sub-menu`}
                  aria-expanded={openDropdown === to}
                >
                  <FiChevronDown
                    size={14}
                    className={`${styles.chevronMobile} ${openDropdown === to ? styles.chevronOpen : ''}`}
                  />
                </button>

                {/* Desktop dropdown panel (CSS hover) */}
                <div className={styles.dropdown} role="menu">
                  {children.map((child) => (
                    <Link
                      key={child.to}
                      to={child.to}
                      className={styles.dropdownLink}
                      onClick={closeAll}
                      role="menuitem"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>

                {/* Mobile accordion panel (JS toggled) */}
                {openDropdown === to && (
                  <div className={styles.mobileDropdown}>
                    {children.map((child) => (
                      <Link
                        key={child.to}
                        to={child.to}
                        className={styles.mobileDropdownLink}
                        onClick={closeAll}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* Plain nav link */
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.active : ''}`
                }
                onClick={closeAll}
              >
                {label}
              </NavLink>
            )
          )}

          <Link
            to="/membership"
            className={`${styles.navCta} btn-primary`}
            onClick={closeAll}
          >
            Join Us
          </Link>
        </nav>

        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile overlay */}
      {menuOpen && (
        <div
          className={styles.overlay}
          onClick={closeAll}
          aria-hidden="true"
        />
      )}
    </header>
  );
}
