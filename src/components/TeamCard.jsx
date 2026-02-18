import styles from './TeamCard.module.css';

function getInitials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('');
}

function getAvatarColor(name) {
  const colors = [
    '#E94560', '#F5A623', '#1A1A2E', '#2563EB',
    '#059669', '#7C3AED', '#DC2626', '#0891B2',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export default function TeamCard({ name, role, institution, bio }) {
  const initials = getInitials(name);
  const bgColor = getAvatarColor(name);

  return (
    <article className={styles.card}>
      <div className={styles.avatar} style={{ backgroundColor: bgColor }}>
        {initials}
      </div>
      <div className={styles.info}>
        <h3 className={styles.name}>{name}</h3>
        <p className={styles.role}>{role}</p>
        <p className={styles.institution}>{institution}</p>
        {bio && <p className={styles.bio}>{bio}</p>}
      </div>
    </article>
  );
}
