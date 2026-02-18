import styles from './EventCard.module.css';

const typeBadgeColors = {
  Symposium: { bg: '#FEF3C7', text: '#92400E' },
  Workshop: { bg: '#D1FAE5', text: '#065F46' },
  Seminar: { bg: '#DBEAFE', text: '#1E40AF' },
  Conference: { bg: '#EDE9FE', text: '#5B21B6' },
  Talk: { bg: '#FCE7F3', text: '#9D174D' },
};

export default function EventCard({ title, type, day, month, location, description, status }) {
  const badge = typeBadgeColors[type] || { bg: '#F3F4F6', text: '#374151' };
  const isPast = status === 'past';

  return (
    <article className={`${styles.card} ${isPast ? styles.past : ''}`}>
      <div className={styles.dateBlock}>
        <span className={styles.day}>{day}</span>
        <span className={styles.month}>{month}</span>
      </div>
      <div className={styles.content}>
        <div className={styles.topRow}>
          <span
            className={styles.typeBadge}
            style={{ backgroundColor: badge.bg, color: badge.text }}
          >
            {type}
          </span>
          {isPast && <span className={styles.pastBadge}>Past</span>}
        </div>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.location}>
          <span className={styles.locationIcon}>📍</span> {location}
        </p>
        <p className={styles.description}>{description}</p>
      </div>
    </article>
  );
}
