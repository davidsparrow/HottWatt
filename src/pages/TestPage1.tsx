/**
 * TestPage1 — fully standalone design test.
 * All styles are inline or in the <style> tag below.
 * Zero dependency on Tailwind or any other CSS framework.
 */

const s = {
  // ── Page shell ─────────────────────────────────────────────
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #fafff5 0%, #fffef7 45%, #fff9f0 100%)',
    backgroundAttachment: 'fixed' as const,
    fontFamily: '"Inter", system-ui, sans-serif',
    color: '#1f2937',
  } as React.CSSProperties,

  // ── Content area ───────────────────────────────────────────
  content: {
    maxWidth: 720,
    margin: '0 auto',
    paddingTop: 120,   // clear the fixed navbar
    paddingBottom: 80,
    paddingLeft: 20,
    paddingRight: 20,
    textAlign: 'center' as const,
  } as React.CSSProperties,

  // ── Typography ─────────────────────────────────────────────
  title: {
    fontFamily: '"Space Grotesk", system-ui, sans-serif',
    fontSize: 'clamp(2rem, 6vw, 3rem)',
    fontWeight: 700,
    lineHeight: 1.15,
    color: '#111827',
    marginBottom: 12,
  } as React.CSSProperties,

  subtitle: {
    fontFamily: '"Space Grotesk", system-ui, sans-serif',
    fontSize: 'clamp(1.1rem, 3vw, 1.35rem)',
    fontWeight: 500,
    color: '#4b5563',
    marginBottom: 32,
  } as React.CSSProperties,

  bodyText: {
    fontSize: '1rem',
    lineHeight: 1.75,
    color: '#6b7280',
    marginBottom: 20,
    maxWidth: 560,
    marginLeft: 'auto',
    marginRight: 'auto',
  } as React.CSSProperties,

  // ── Pill button ────────────────────────────────────────────
  btnWrap: {
    marginTop: 36,
    marginBottom: 56,
  } as React.CSSProperties,

  btn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingTop: 14,
    paddingBottom: 14,
    paddingLeft: 36,
    paddingRight: 36,
    background: '#66B60C',
    color: '#ffffff',
    fontFamily: '"Inter", system-ui, sans-serif',
    fontSize: '1rem',
    fontWeight: 600,
    borderRadius: 9999,
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 5px 20px rgba(102,182,12,0.30)',
    transition: 'background 0.2s, transform 0.15s',
    textDecoration: 'none',
  } as React.CSSProperties,

  // ── Card ───────────────────────────────────────────────────
  card: {
    background: '#ffffff',
    border: '1px solid rgba(0,0,0,0.08)',
    borderRadius: 20,
    boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
    padding: '28px 28px 24px',
    textAlign: 'left' as const,
    maxWidth: 420,
    margin: '0 auto',
  } as React.CSSProperties,

  cardHost: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  } as React.CSSProperties,

  avatar: {
    width: 44,
    height: 44,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #66B60C, #a3e635)',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontWeight: 700,
    fontSize: 18,
  } as React.CSSProperties,

  hostName: {
    fontWeight: 600,
    fontSize: '0.9rem',
    color: '#111827',
    fontFamily: '"Inter", system-ui, sans-serif',
  } as React.CSSProperties,

  hostMeta: {
    fontSize: '0.75rem',
    color: '#9ca3af',
    marginTop: 2,
    fontFamily: '"Inter", system-ui, sans-serif',
  } as React.CSSProperties,

  addressRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 18,
  } as React.CSSProperties,

  addressIcon: {
    width: 16,
    height: 16,
    color: '#9ca3af',
    flexShrink: 0,
    marginTop: 2,
  } as React.CSSProperties,

  addressText: {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: '#374151',
    fontFamily: '"Inter", system-ui, sans-serif',
  } as React.CSSProperties,

  addressSub: {
    fontSize: '0.72rem',
    color: '#9ca3af',
    marginTop: 2,
    fontFamily: '"Inter", system-ui, sans-serif',
  } as React.CSSProperties,

  badgeRow: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: 8,
    marginBottom: 20,
  } as React.CSSProperties,

  badge: (bg: string, text: string, border: string) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 12,
    paddingRight: 12,
    borderRadius: 9999,
    background: bg,
    color: text,
    border: `1px solid ${border}`,
    fontSize: '0.72rem',
    fontWeight: 600,
    fontFamily: '"Inter", system-ui, sans-serif',
    whiteSpace: 'nowrap' as const,
  }) as React.CSSProperties,

  divider: {
    borderTop: '1px solid #f3f4f6',
    marginTop: 4,
    paddingTop: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  } as React.CSSProperties,

  price: {
    fontFamily: '"Space Grotesk", system-ui, sans-serif',
    fontSize: '1.4rem',
    fontWeight: 700,
    color: '#111827',
  } as React.CSSProperties,

  priceUnit: {
    fontSize: '0.75rem',
    color: '#9ca3af',
    marginLeft: 4,
    fontFamily: '"Inter", system-ui, sans-serif',
  } as React.CSSProperties,

  availBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 12,
    paddingRight: 12,
    borderRadius: 9999,
    background: 'rgba(102,182,12,0.08)',
    color: '#66B60C',
    border: '1px solid rgba(102,182,12,0.25)',
    fontSize: '0.72rem',
    fontWeight: 600,
    fontFamily: '"Inter", system-ui, sans-serif',
  } as React.CSSProperties,

  dot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: '#66B60C',
    animation: 'pulse 2s infinite',
  } as React.CSSProperties,

  amenityRow: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: 8,
    marginTop: 16,
  } as React.CSSProperties,

  amenityTag: {
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 9999,
    background: '#f9fafb',
    color: '#6b7280',
    border: '1px solid #e5e7eb',
    fontSize: '0.7rem',
    fontWeight: 500,
    fontFamily: '"Inter", system-ui, sans-serif',
  } as React.CSSProperties,
};

export default function TestPage1() {
  return (
    <>
      {/* Keyframe for the availability dot pulse */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .test-btn:hover {
          background: #549a09 !important;
          transform: translateY(-1px);
        }
        .test-btn:active {
          transform: translateY(0);
        }
      `}</style>

      <div style={s.page}>
        <div style={s.content}>

          {/* Title */}
          <h1 style={s.title}>Test Title Here</h1>

          {/* Subtitle */}
          <p style={s.subtitle}>Test Subtitle Here</p>

          {/* Body text */}
          <p style={s.bodyText}>
            This is the first body text paragraph with some test copy. It demonstrates how readable
            body text looks on the warm gradient background with proper line height and color. The
            text is centered and constrained to a comfortable reading width.
          </p>
          <p style={s.bodyText}>
            This is the second body text paragraph. Notice the generous spacing between elements,
            the soft grey color that is easy on the eyes, and the way everything breathes. No
            cramming, no smashing — just clean, comfortable layout.
          </p>

          {/* Pill button */}
          <div style={s.btnWrap}>
            <button className="test-btn" style={s.btn}>
              Test Pill
            </button>
          </div>

          {/* Charger card */}
          <div style={s.card}>
            {/* Host info */}
            <div style={s.cardHost}>
              <div style={s.avatar}>J</div>
              <div>
                <div style={s.hostName}>Jordan Mitchel ✓</div>
                <div style={s.hostMeta}>★ 4.9 &nbsp;(42 reviews)</div>
              </div>
            </div>

            {/* Address */}
            <div style={s.addressRow}>
              <svg style={s.addressIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <div>
                <div style={s.addressText}>*** Maple Drive</div>
                <div style={s.addressSub}>Austin, TX &middot; 0.4 mi &nbsp;·&nbsp; 🔒 exact address after booking</div>
              </div>
            </div>

            {/* Badges */}
            <div style={s.badgeRow}>
              <span style={s.badge('rgba(59,130,246,0.07)', '#2563eb', 'rgba(59,130,246,0.22)')}>
                J1772
              </span>
              <span style={s.badge('rgba(102,182,12,0.08)', '#66B60C', 'rgba(102,182,12,0.25)')}>
                ⚡ Level 2
              </span>
              <span style={s.badge('#f3f4f6', '#4b5563', '#e5e7eb')}>
                11.5 kW
              </span>
              <span style={s.badge('rgba(239,118,116,0.08)', '#d95a58', 'rgba(239,118,116,0.25)')}>
                🚗 Last-Mile
              </span>
            </div>

            {/* Price & availability */}
            <div style={s.divider}>
              <div>
                <span style={s.price}>$0.18</span>
                <span style={s.priceUnit}>/kWh</span>
              </div>
              <span style={s.availBadge}>
                <span style={s.dot} />
                Available
              </span>
            </div>

            {/* Amenities */}
            <div style={s.amenityRow}>
              {['Covered parking', 'Gated', 'WiFi'].map((a) => (
                <span key={a} style={s.amenityTag}>{a}</span>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
