import styles from './HeroSplash.module.css';

interface HeroSplashProps {
  onSignUpClick: () => void;
  onLearnMoreClick: () => void;
}

export default function HeroSplash({ onSignUpClick, onLearnMoreClick }: HeroSplashProps) {
  return (
    <section className={styles.hero}>
      {/* Background gradient with overlay */}
      <div className={styles.background} />
      <div className={styles.overlay} />

      {/* Content */}
      <div className={styles.content}>
        <h1 className={styles.title}>The Future of EV Charging</h1>
        <p className={styles.subtitle}>Peer-to-peer charging, powered by your community</p>

        {/* Buttons */}
        <div className={styles.buttonGroup}>
          <button className={styles.buttonPrimary} onClick={onSignUpClick}>
            Sign Up
          </button>
          <button className={styles.buttonSecondary} onClick={onLearnMoreClick}>
            Tell Me More
          </button>
        </div>
      </div>

      {/* Empty space for content later */}
      <div className={styles.spacer} />
    </section>
  );
}
