import styles from './SectionHeader.module.css';

export default function SectionHeader({ title, subtitle, align = 'left' }) {
  return (
    <div className={`${styles.wrapper} ${styles[align]}`}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.bar} />
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </div>
  );
}
