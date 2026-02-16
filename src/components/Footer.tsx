import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.topRow}>
        <nav className={styles.nav}>
          <a href="#" className={styles.link}>Home</a>
          <a href="#" className={styles.link}>Browse</a>
          <a href="#" className={styles.link}>List Charger</a>
          <a href="#" className={styles.link}>How It Works</a>
          <a href="#" className={styles.link}>Contact</a>
        </nav>
      </div>
      <div className={styles.bottomRow}>
        <p className={styles.copyright}>© 2025 Hott Watt. Built in Mill Valley ⚡</p>
      </div>
    </footer>
  );
}
