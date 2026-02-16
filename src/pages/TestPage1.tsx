import { useState } from 'react';
import HeroSplash from '../components/HeroSplash';
import ReviewCarousel from '../components/ReviewCarousel';
import ReviewFormModal from '../components/ReviewFormModal';
import ContactFormModal from '../components/ContactFormModal';
import ChargeCardGrid from '../components/ChargeCardGrid';
import ChargeCardList from '../components/ChargeCardList';
import Footer from '../components/Footer';
import styles from './TestPage1.module.css';

const mockChargers = [
  {
    hostName: 'Jordan M.',
    price: 0.18,
    level: 'Level 2',
    model: 'J1772',
    available: true,
    bathroom: true,
    lastMile: true,
  },
  {
    hostName: 'Sarah L.',
    price: 0.22,
    level: 'Level 3',
    model: 'Tesla NACS',
    available: false,
    bathroom: false,
    lastMile: false,
  },
  {
    hostName: 'David K.',
    price: 0.16,
    level: 'Level 2',
    model: 'CCS',
    available: true,
    bathroom: true,
    lastMile: true,
  },
  {
    hostName: 'Emma T.',
    price: 0.20,
    level: 'Level 2',
    model: 'J1772',
    available: true,
    bathroom: false,
    lastMile: false,
  },
];

export default function TestPage1() {
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [reviews, setReviews] = useState<{ rating: number; text: string; author: string }[]>([]);

  const handleReviewSubmit = (review: { rating: number; text: string; author: string }) => {
    setReviews([...reviews, review]);
    setReviewModalOpen(false);
  };

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <HeroSplash
        onSignUpClick={() => setContactModalOpen(true)}
        onLearnMoreClick={() => setContactModalOpen(true)}
      />

      {/* Reviews Section */}
      <ReviewCarousel onReviewButtonClick={() => setReviewModalOpen(true)} />

      {/* Grid Cards Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Browse Chargers - Grid View</h2>
        <div className={styles.gridCards}>
          {mockChargers.map((charger, i) => (
            <ChargeCardGrid key={i} {...charger} />
          ))}
        </div>
      </section>

      {/* List Cards Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Browse Chargers - List View</h2>
        <div className={styles.listCards}>
          {mockChargers.map((charger, i) => (
            <ChargeCardList key={i} {...charger} distance="0.4 mi away" />
          ))}
        </div>
      </section>

      {/* Modals */}
      <ReviewFormModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        onSubmit={handleReviewSubmit}
      />
      <ContactFormModal isOpen={contactModalOpen} onClose={() => setContactModalOpen(false)} />

      {/* Footer */}
      <Footer />
    </div>
  );
}
