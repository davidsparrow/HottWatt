import { useState } from 'react';
import styles from './ChargeCardGrid.module.css';

interface Badge {
  icon: string;
  label: string;
  color: string;
  details: string;
}

interface ChargeCardGridProps {
  hostName: string;
  avatarUrl?: string;
  price: number;
  level: string;
  model: string;
  available: boolean;
  bathroom: boolean;
  lastMile: boolean;
}

export default function ChargeCardGrid({
  hostName,
  avatarUrl,
  price,
  level,
  model,
  available,
  bathroom,
  lastMile,
}: ChargeCardGridProps) {
  const [hoveredBadge, setHoveredBadge] = useState<string | null>(null);

  const badges: Badge[] = [
    {
      icon: '⚡',
      label: level,
      color: '#66B60C',
      details: `${level} charging - 11.5kW output. Best for daily top-ups.`,
    },
    {
      icon: '🔌',
      label: model,
      color: '#3b82f6',
      details: `${model} connector. Universal compatibility with most EVs.`,
    },
    {
      icon: '✓',
      label: available ? 'Available' : 'Booked',
      color: available ? '#66B60C' : '#f59e0b',
      details: available ? 'Open for bookings right now.' : 'Check back soon for availability.',
    },
    {
      icon: '🚻',
      label: bathroom ? 'Restroom' : 'No Facilities',
      color: bathroom ? '#8b5cf6' : '#d1d5db',
      details: bathroom ? 'Guest restroom access during charging.' : 'No restroom available on-site.',
    },
    {
      icon: '🚗',
      label: lastMile ? 'Last-Mile' : 'Charging Only',
      color: lastMile ? '#ef7674' : '#9ca3af',
      details: lastMile ? 'Host offers rides to destination while you charge.' : 'Charging only, no ride service.',
    },
  ];

  return (
    <div className={styles.card}>
      {/* Avatar - positioned offset up and left */}
      <div className={styles.avatarContainer}>
        <div className={styles.avatar} style={{ backgroundColor: avatarUrl ? undefined : '#66B60C' }}>
          {avatarUrl ? (
            <img src={avatarUrl} alt={hostName} />
          ) : (
            <span>{hostName.charAt(0).toUpperCase()}</span>
          )}
        </div>
      </div>

      {/* Badges - top right */}
      <div className={styles.badgeContainer}>
        {badges.map((badge) => (
          <div
            key={badge.label}
            className={styles.badgeWrapper}
            onMouseEnter={() => setHoveredBadge(badge.label)}
            onMouseLeave={() => setHoveredBadge(null)}
          >
            <div className={styles.badge} style={{ borderColor: badge.color, color: badge.color }}>
              {badge.icon}
            </div>
            {hoveredBadge === badge.label && (
              <div className={styles.tooltip}>{badge.details}</div>
            )}
          </div>
        ))}
      </div>

      {/* Content */}
      <div className={styles.content}>
        <h3 className={styles.hostName}>{hostName}</h3>
        <p className={styles.rating}>★ 4.9 (42 reviews)</p>
      </div>

      {/* Footer - price */}
      <div className={styles.footer}>
        <span className={styles.price}>${price.toFixed(2)}</span>
        <span className={styles.unit}>/kWh</span>
      </div>
    </div>
  );
}
