import { Link } from 'react-router-dom';
import styles from './NewsCard.module.css';

const categoryColors = {
  Announcement: { bg: '#FEF3C7', text: '#92400E' },
  Event: { bg: '#DBEAFE', text: '#1E40AF' },
  Community: { bg: '#D1FAE5', text: '#065F46' },
  Research: { bg: '#EDE9FE', text: '#5B21B6' },
  Default: { bg: '#F3F4F6', text: '#374151' },
};

export default function NewsCard({ category, date, title, excerpt }) {
  const colors = categoryColors[category] || categoryColors.Default;

  return (
    <article className={styles.card}>
      <div className={styles.top}>
        <span
          className={styles.category}
          style={{ backgroundColor: colors.bg, color: colors.text }}
        >
          {category}
        </span>
        <span className={styles.date}>{date}</span>
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.excerpt}>{excerpt}</p>
      <Link to={`/research`} className={styles.readMore}>
        Read more <span aria-hidden="true">→</span>
      </Link>
    </article>
  );
}
