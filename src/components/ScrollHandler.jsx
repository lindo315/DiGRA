import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Scrolls to top on route change, or to the hash section if one is present.
// Accounts for the fixed navbar height (70px) so sections aren't hidden underneath.
const NAVBAR_HEIGHT = 70;
const HASH_SCROLL_OFFSET = 16; // extra breathing room above the section

export default function ScrollHandler() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.slice(1);
      // Retry a few times in case the page hasn't fully rendered yet
      const scrollToElement = (retriesLeft = 5) => {
        const el = document.getElementById(id);
        if (el) {
          const top =
            el.getBoundingClientRect().top +
            window.scrollY -
            NAVBAR_HEIGHT -
            HASH_SCROLL_OFFSET;
          window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
        } else if (retriesLeft > 0) {
          setTimeout(() => scrollToElement(retriesLeft - 1), 80);
        }
      };
      // Small initial delay to let React finish rendering the new page
      setTimeout(scrollToElement, 80);
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [pathname, hash]);

  return null;
}
