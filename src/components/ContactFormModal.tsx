import { useState } from 'react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';
import styles from './ContactFormModal.module.css';

// TODO: Wire up Resend API when user provides API key
// const resend = new Resend(process.env.REACT_APP_RESEND_API_KEY);

interface ContactFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactFormModal({ isOpen, onClose }: ContactFormModalProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#66B60C', '#fbbf24', '#ef7674'],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);

    try {
      // TODO: Uncomment and use this when Resend API key is provided
      /*
      await resend.emails.send({
        from: 'noreply@hottwatt.com',
        to: 'spasta+HW@gmail.com',
        subject: 'New Contact Form Submission',
        html: `<p>Email: ${email}</p>`,
      });
      */

      // For now, just show the success message (no actual email sent yet)
      console.log('Contact form submitted:', email);

      triggerConfetti();
      toast.success('Nicely done, now go have some fun. Give us 24-48 hrs during business days to reply. Cheers!', {
        duration: 5000,
        icon: '⚡',
      });

      setEmail('');
      setTimeout(() => onClose(), 1500);
    } catch (error) {
      console.error('Error sending contact form:', error);
      toast.error('Oops! Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          <X className="w-5 h-5" />
        </button>

        <h2 className={styles.title}>Get in Touch</h2>
        <p className={styles.subtitle}>We'd love to hear from you. Drop us your email and we'll be in touch!</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Email Address *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={styles.input}
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className={`${styles.submitButton} ${isLoading ? styles.loading : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
}
