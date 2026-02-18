import { useState, useEffect } from 'react';
import { FiArrowUp } from 'react-icons/fi';
import styles from './ScrollToTopButton.module.css';

const SHOW_AFTER_PX = 350;

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SHOW_AFTER_PX);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      className={`${styles.btn} ${visible ? styles.visible : ''}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Scroll to top"
      tabIndex={visible ? 0 : -1}
    >
      <FiArrowUp size={18} />
    </button>
  );
}
