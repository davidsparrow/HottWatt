import { useEffect, useRef, useState } from 'react';
import styles from './ReviewCarousel.module.css';

interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  text: string;
  date: string;
}

interface ReviewCarouselProps {
  onReviewButtonClick: () => void;
}

// Mock reviews - WILL CONNECT TO ACTUAL API WHEN WE GET REAL DATA
// TODO: Replace with API call to fetch reviews from backend
const MOCK_REVIEWS: Review[] = [
  {
    id: '1',
    author: 'Sarah M.',
    avatar: 'S',
    rating: 5,
    text: 'Perfect spot! Clean charger, responsive host. Will definitely be back!',
    date: '2 weeks ago',
  },
  {
    id: '2',
    author: 'James K.',
    avatar: 'J',
    rating: 5,
    text: 'Great experience. Fast charging, easy parking. Highly recommend!',
    date: '1 month ago',
  },
  {
    id: '3',
    author: 'Emma L.',
    avatar: 'E',
    rating: 4,
    text: 'Good charger, friendly host. Only minor: wished for WiFi in the area.',
    date: '1 month ago',
  },
  {
    id: '4',
    author: 'David H.',
    avatar: 'D',
    rating: 5,
    text: 'Excellent! Host even offered coffee while I waited. Above and beyond!',
    date: '6 weeks ago',
  },
  {
    id: '5',
    author: 'Priya S.',
    avatar: 'P',
    rating: 5,
    text: 'Super convenient. Just what I needed for my road trip. Thanks!',
    date: '2 months ago',
  },
  {
    id: '6',
    author: 'Michael T.',
    avatar: 'M',
    rating: 4,
    text: 'Smooth charging session. Location is a bit tight but manageable.',
    date: '2 months ago',
  },
];

export default function ReviewCarousel({ onReviewButtonClick }: ReviewCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isAutoScroll, setIsAutoScroll] = useState(true);

  useEffect(() => {
    if (!scrollContainerRef.current || !isAutoScroll) return;

    const container = scrollContainerRef.current;
    let scrollPosition = 0;
    const scrollSpeed = 1; // pixels per frame
    const scrollInterval = 30; // milliseconds

    const interval = setInterval(() => {
      scrollPosition += scrollSpeed;
      container.scrollLeft = scrollPosition;

      // Loop back to start when reaching end
      if (scrollPosition >= container.scrollWidth - container.clientWidth) {
        scrollPosition = 0;
      }
    }, scrollInterval);

    return () => clearInterval(interval);
  }, [isAutoScroll]);

  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Guest Reviews</h2>
          <p className={styles.subtitle}>What people are saying about charging here</p>
        </div>
        <button className={styles.reviewButton} onClick={onReviewButtonClick}>
          How We Doing?
        </button>
      </div>

      <div
        className={styles.carousel}
        ref={scrollContainerRef}
        onMouseEnter={() => setIsAutoScroll(false)}
        onMouseLeave={() => setIsAutoScroll(true)}
      >
        {MOCK_REVIEWS.map((review) => (
          <div key={review.id} className={styles.reviewCard}>
            <div className={styles.reviewHeader}>
              <div className={styles.avatar}>{review.avatar}</div>
              <div className={styles.authorInfo}>
                <p className={styles.author}>{review.author}</p>
                <p className={styles.date}>{review.date}</p>
              </div>
            </div>
            <div className={styles.rating}>
              {'★'.repeat(review.rating)}
              {'☆'.repeat(5 - review.rating)}
            </div>
            <p className={styles.text}>{review.text}</p>
          </div>
        ))}
      </div>

      <p className={styles.hint}>← Scroll or hover to view more reviews →</p>
    </div>
  );
}
