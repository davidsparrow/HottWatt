import { useState } from 'react';
import { X } from 'lucide-react';
import styles from './ReviewFormModal.module.css';

interface ReviewFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (review: { rating: number; text: string; author: string }) => void;
}

export default function ReviewFormModal({ isOpen, onClose, onSubmit }: ReviewFormModalProps) {
  const [author, setAuthor] = useState('');
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !text.trim()) return;

    onSubmit({ author, rating, text });
    setAuthor('');
    setRating(5);
    setText('');
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          <X className="w-5 h-5" />
        </button>

        <h2 className={styles.title}>Share Your Experience</h2>
        <p className={styles.subtitle}>Help other EV drivers find the perfect charging spot</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Your Name *</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="e.g., Sarah M."
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Rating *</label>
            <div className={styles.ratingPicker}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`${styles.star} ${rating >= star ? styles.starActive : ''}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Your Review *</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Tell us about your experience..."
              className={styles.textarea}
              rows={5}
              required
            />
          </div>

          <button type="submit" className={styles.submitButton}>
            Post Review
          </button>
        </form>
      </div>
    </div>
  );
}
