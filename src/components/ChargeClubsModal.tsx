import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, Zap, Calendar, CheckCircle, XCircle, Info, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { chargeClubs } from '../data/clubs';
import type { ChargeClub } from '../data/types';
import toast from 'react-hot-toast';

interface ChargeClubsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/* ─── Club Popup Card ─── */
function ClubPopupCard({
  club,
  onClose,
}: {
  club: ChargeClub;
  onClose: () => void;
}) {
  const handleRequest = () => {
    toast.success(
      <div>
        <p className="font-semibold">Membership requested!</p>
        <p className="text-sm text-gray-400 mt-1">
          {club.name} will review your request.
        </p>
      </div>,
      {
        duration: 4000,
        style: { background: '#1a1a24', color: '#e5e7eb', border: '1px solid rgba(34,197,94,0.3)' },
        iconTheme: { primary: '#22c55e', secondary: '#1a1a24' },
      },
    );
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 10 }}
      transition={{ type: 'spring', damping: 25, stiffness: 350 }}
      className="absolute z-30 w-72 sm:w-80"
      style={{ left: '50%', transform: 'translateX(-50%)' }}
    >
      <div className="glass-card p-5 border border-white/10 shadow-2xl shadow-black/40 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-3.5 h-3.5 text-gray-500" />
        </button>

        <h3 className="font-heading text-lg font-bold text-white mb-1 pr-6">{club.name}</h3>
        <p className="text-xs text-gray-500 mb-4">{club.neighborhood}, {club.city}</p>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white/3 rounded-lg p-2.5 border border-white/5">
            <div className="flex items-center gap-1.5 mb-1">
              <Users className="w-3 h-3 text-electric" />
              <span className="text-[10px] text-gray-500 uppercase tracking-wider">Members</span>
            </div>
            <span className="font-heading font-bold text-white text-sm">{club.totalMembers}</span>
          </div>
          <div className="bg-white/3 rounded-lg p-2.5 border border-white/5">
            <div className="flex items-center gap-1.5 mb-1">
              <Zap className="w-3 h-3 text-electric" />
              <span className="text-[10px] text-gray-500 uppercase tracking-wider">Capacity</span>
            </div>
            <span className="font-heading font-bold text-white text-sm">{club.totalChargeCapacityKW} kW</span>
          </div>
          <div className="bg-white/3 rounded-lg p-2.5 border border-white/5">
            <div className="flex items-center gap-1.5 mb-1">
              <Zap className="w-3 h-3 text-coral" />
              <span className="text-[10px] text-gray-500 uppercase tracking-wider">Watts Recv</span>
            </div>
            <span className="font-heading font-bold text-white text-sm">{club.totalWattsReceived}</span>
          </div>
          <div className="bg-white/3 rounded-lg p-2.5 border border-white/5">
            <div className="flex items-center gap-1.5 mb-1">
              <Calendar className="w-3 h-3 text-electric" />
              <span className="text-[10px] text-gray-500 uppercase tracking-wider">Founded</span>
            </div>
            <span className="font-heading font-bold text-white text-sm">{club.foundedDate}</span>
          </div>
        </div>

        {/* Charger type mini bar */}
        <div className="mb-4">
          <span className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1.5">Charger Mix</span>
          <div className="flex rounded-full overflow-hidden h-3 bg-white/5">
            {club.chargerTypes.map((ct) => (
              <div
                key={ct.label}
                style={{ width: `${ct.percent}%`, backgroundColor: ct.color }}
                className="h-full transition-all"
                title={`${ct.label}: ${ct.percent}%`}
              />
            ))}
          </div>
          <div className="flex gap-3 mt-1.5">
            {club.chargerTypes.map((ct) => (
              <span key={ct.label} className="flex items-center gap-1 text-[10px] text-gray-500">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: ct.color }} />
                {ct.label} {ct.percent}%
              </span>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center gap-1.5 mb-4">
          {club.acceptingMembers ? (
            <>
              <CheckCircle className="w-3.5 h-3.5 text-electric" />
              <span className="text-xs text-electric font-medium">Accepting New Members</span>
            </>
          ) : (
            <>
              <XCircle className="w-3.5 h-3.5 text-coral" />
              <span className="text-xs text-coral font-medium">Not Accepting Members</span>
            </>
          )}
        </div>

        {/* Request Button */}
        <button
          onClick={handleRequest}
          disabled={!club.acceptingMembers}
          className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all ${
            club.acceptingMembers
              ? 'bg-hotpink text-white hover:bg-hotpink-dim cursor-pointer shadow-lg shadow-hotpink/20'
              : 'bg-white/5 text-gray-600 cursor-not-allowed border border-white/5'
          }`}
        >
          Request Membership
        </button>
      </div>
    </motion.div>
  );
}

/* ─── Bay Area SVG Map ─── */
function BayAreaMap({
  selectedClub,
  onSelectClub,
}: {
  selectedClub: string | null;
  onSelectClub: (id: string | null) => void;
}) {
  return (
    <div className="relative w-full h-full">
      {/* SVG map of Bay Area outline */}
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Water fill */}
        <defs>
          <radialGradient id="waterGrad" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#0c1220" />
            <stop offset="100%" stopColor="#080d18" />
          </radialGradient>
          <radialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#C42348" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#C42348" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="100" height="100" fill="url(#waterGrad)" />

        {/* Bay water */}
        <path
          d="M 45 30 Q 55 35, 58 45 Q 60 55, 55 60 Q 50 65, 48 55 Q 46 45, 45 30 Z"
          fill="#0a1525"
          stroke="#1a2a40"
          strokeWidth="0.3"
          opacity="0.7"
        />

        {/* Golden Gate strait */}
        <path
          d="M 30 40 Q 35 38, 42 40"
          fill="none"
          stroke="#1a2a40"
          strokeWidth="0.5"
          opacity="0.5"
        />

        {/* Land masses — SF Peninsula */}
        <path
          d="M 15 42 L 42 40 L 55 55 L 55 62 L 52 72 L 42 80 L 30 85 L 15 82 L 10 70 L 12 55 Z"
          fill="#0e1420"
          stroke="#1e2e3e"
          strokeWidth="0.4"
          opacity="0.8"
        />

        {/* East Bay */}
        <path
          d="M 58 20 L 80 15 L 90 25 L 88 45 L 82 55 L 75 60 L 65 58 L 58 50 L 58 35 Z"
          fill="#0e1420"
          stroke="#1e2e3e"
          strokeWidth="0.4"
          opacity="0.8"
        />

        {/* Marin */}
        <path
          d="M 15 10 L 40 8 L 42 25 L 42 38 L 30 40 L 15 35 L 10 25 Z"
          fill="#0e1420"
          stroke="#1e2e3e"
          strokeWidth="0.4"
          opacity="0.8"
        />

        {/* Grid lines for depth */}
        {Array.from({ length: 10 }).map((_, i) => (
          <line
            key={`h${i}`}
            x1="0"
            y1={i * 10}
            x2="100"
            y2={i * 10}
            stroke="#1a2535"
            strokeWidth="0.15"
            opacity="0.3"
          />
        ))}
        {Array.from({ length: 10 }).map((_, i) => (
          <line
            key={`v${i}`}
            x1={i * 10}
            y1="0"
            x2={i * 10}
            y2="100"
            stroke="#1a2535"
            strokeWidth="0.15"
            opacity="0.3"
          />
        ))}

        {/* Area labels */}
        <text x="30" y="55" fill="#2a3a4a" fontSize="2.8" fontFamily="Inter" fontWeight="500" textAnchor="middle">
          SAN FRANCISCO
        </text>
        <text x="73" y="35" fill="#2a3a4a" fontSize="2.5" fontFamily="Inter" fontWeight="500" textAnchor="middle">
          OAKLAND
        </text>
        <text x="68" y="22" fill="#2a3a4a" fontSize="2.2" fontFamily="Inter" fontWeight="500" textAnchor="middle">
          BERKELEY
        </text>
        <text x="28" y="25" fill="#2a3a4a" fontSize="2.2" fontFamily="Inter" fontWeight="500" textAnchor="middle">
          MARIN
        </text>
        <text x="28" y="82" fill="#2a3a4a" fontSize="2.2" fontFamily="Inter" fontWeight="500" textAnchor="middle">
          DALY CITY
        </text>

        {/* Club dots */}
        {chargeClubs.map((club) => {
          const isSelected = selectedClub === club.id;
          return (
            <g key={club.id}>
              {/* Glow ring */}
              <circle
                cx={club.x}
                cy={club.y}
                r={isSelected ? 3.5 : 2.5}
                fill="url(#glowGrad)"
                opacity={isSelected ? 0.8 : 0.4}
                className="transition-all duration-300"
              />
              {/* Dot */}
              <circle
                cx={club.x}
                cy={club.y}
                r={isSelected ? 1.8 : 1.2}
                fill="#C42348"
                stroke={isSelected ? '#fff' : '#C42348'}
                strokeWidth={isSelected ? 0.4 : 0.2}
                className="cursor-pointer transition-all duration-200"
                onClick={() => onSelectClub(isSelected ? null : club.id)}
                style={{ filter: 'drop-shadow(0 0 3px rgba(196,35,72,0.6))' }}
              />
            </g>
          );
        })}
      </svg>

      {/* Club name pills (HTML overlay) */}
      {chargeClubs.map((club) => {
        const isSelected = selectedClub === club.id;
        return (
          <div
            key={`label-${club.id}`}
            className="absolute pointer-events-none"
            style={{
              left: `${club.x}%`,
              top: `${club.y}%`,
              transform: 'translate(-50%, -140%)',
            }}
          >
            <div
              className={`
                whitespace-nowrap px-2 py-0.5 rounded-full text-[10px] font-medium leading-tight
                pointer-events-auto cursor-pointer select-none transition-all duration-200
                ${isSelected
                  ? 'bg-white text-black shadow-lg shadow-white/20 scale-110'
                  : 'bg-white/90 text-black/80 hover:bg-white hover:text-black'
                }
              `}
              onClick={() => onSelectClub(isSelected ? null : club.id)}
            >
              {club.name}
            </div>
          </div>
        );
      })}

      {/* Popup card for selected club */}
      <AnimatePresence>
        {selectedClub && (() => {
          const club = chargeClubs.find((c) => c.id === selectedClub);
          if (!club) return null;

          // Position popup — avoid going off screen
          const popupLeft = Math.min(Math.max(club.x, 25), 75);
          const popupAbove = club.y > 50;

          return (
            <div
              className="absolute z-30"
              style={{
                left: `${popupLeft}%`,
                ...(popupAbove
                  ? { bottom: `${100 - club.y + 5}%` }
                  : { top: `${club.y + 5}%` }),
                transform: 'translateX(-50%)',
              }}
            >
              <ClubPopupCard
                club={club}
                onClose={() => onSelectClub(null)}
              />
            </div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}

/* ─── Start Charge Club Modal ─── */
function StartClubModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [searchCity, setSearchCity] = useState('');
  const [searched, setSearched] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', clubName: '' });
  const [submitted, setSubmitted] = useState(false);

  const existingClubs = searched
    ? chargeClubs.filter((c) => c.city.toLowerCase() === searchCity.trim().toLowerCase())
    : [];

  const handleSearch = () => {
    if (searchCity.trim()) {
      setSearched(true);
      setShowForm(false);
      setSubmitted(false);
    }
  };

  const handleStartClub = () => {
    setShowForm(true);
    setFormData({ ...formData, name: '', email: '', phone: '', clubName: '' });
    setSubmitted(false);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.clubName) {
      toast.error('Please fill in all fields including a Club Name');
      return;
    }
    setSubmitted(true);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setSearchCity('');
      setSearched(false);
      setShowForm(false);
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '', clubName: '' });
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-lg z-[60] overflow-y-auto"
          >
            <div className="glass-card p-6 sm:p-8 border border-white/10 min-h-full sm:min-h-0">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading text-xl font-bold text-white">Start a Charge Club</h2>
                <button onClick={handleClose} className="p-2 rounded-lg hover:bg-white/5 transition-colors">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {!submitted ? (
                <>
                  {!showForm ? (
                    <>
                      <p className="text-sm text-gray-400 mb-5">
                        Search by city to see if any Charge Clubs already exist in your area.
                      </p>

                      <div className="flex gap-2 mb-6">
                        <input
                          type="text"
                          value={searchCity}
                          onChange={(e) => { setSearchCity(e.target.value); setSearched(false); }}
                          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                          placeholder="Enter city name..."
                          className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-electric/40 focus:ring-1 focus:ring-electric/20 transition-colors"
                        />
                        <button
                          onClick={handleSearch}
                          className="px-5 py-3 bg-electric text-black font-semibold text-sm rounded-xl hover:bg-electric-dim transition-colors"
                        >
                          Search
                        </button>
                      </div>

                      <AnimatePresence mode="wait">
                        {searched && (
                          <motion.div
                            key="results"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                          >
                            {existingClubs.length > 0 ? (
                              <div>
                                <div className="flex items-start gap-2 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 mb-4">
                                  <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                                  <div className="text-sm text-amber-300">
                                    <p className="font-medium mb-1">
                                      {existingClubs.length} club{existingClubs.length > 1 ? 's' : ''} found in {searchCity}
                                    </p>
                                    <p className="text-amber-400/70 text-xs">
                                      Please get approval from existing clubs in your area before applying to start a new one.
                                    </p>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  {existingClubs.map((club) => (
                                    <div key={club.id} className="flex items-center justify-between p-3 rounded-lg bg-white/3 border border-white/5">
                                      <div>
                                        <span className="text-sm font-medium text-white">{club.name}</span>
                                        <span className="text-xs text-gray-500 ml-2">{club.neighborhood}</span>
                                      </div>
                                      <span className={`text-xs font-medium ${club.acceptingMembers ? 'text-electric' : 'text-coral'}`}>
                                        {club.acceptingMembers ? 'Open' : 'Closed'}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <div>
                                <div className="flex items-start gap-2 p-4 rounded-xl bg-electric/5 border border-electric/20 mb-4">
                                  <CheckCircle className="w-4 h-4 text-electric flex-shrink-0 mt-0.5" />
                                  <div className="text-sm text-electric">
                                    <p className="font-medium">No clubs found in {searchCity}!</p>
                                    <p className="text-electric/60 text-xs mt-0.5">Great news — you can be the first to start one.</p>
                                  </div>
                                </div>
                                <button
                                  onClick={handleStartClub}
                                  className="w-full py-3 bg-hotpink text-white font-semibold rounded-xl hover:bg-hotpink-dim transition-colors shadow-lg shadow-hotpink/20 flex items-center justify-center gap-2"
                                >
                                  Start Club in {searchCity.trim()}
                                  <ArrowRight className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <motion.form
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      onSubmit={handleSubmitForm}
                      className="space-y-4"
                    >
                      <div className="p-3 rounded-lg bg-hotpink/5 border border-hotpink/20 mb-2">
                        <span className="text-xs text-hotpink font-medium">Starting a club in</span>
                        <span className="text-sm text-white font-semibold ml-2">{searchCity.trim()}</span>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-300 mb-1.5 block">Club Name *</label>
                        <input
                          type="text"
                          value={formData.clubName}
                          onChange={(e) => setFormData({ ...formData, clubName: e.target.value })}
                          placeholder="Choose a fun club name"
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-hotpink/40 focus:ring-1 focus:ring-hotpink/20 transition-colors"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-300 mb-1.5 block">Your Name</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Full name"
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-electric/40 focus:ring-1 focus:ring-electric/20 transition-colors"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-300 mb-1.5 block">Email</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="you@email.com"
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-electric/40 focus:ring-1 focus:ring-electric/20 transition-colors"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-300 mb-1.5 block">Phone</label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="(555) 123-4567"
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-electric/40 focus:ring-1 focus:ring-electric/20 transition-colors"
                          required
                        />
                      </div>

                      <div className="bg-white/3 rounded-lg p-3 border border-white/5 text-xs text-gray-500">
                        <strong className="text-gray-400">Club City:</strong> {searchCity.trim()} (prefilled)
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3.5 bg-hotpink text-white font-bold rounded-xl hover:bg-hotpink-dim transition-colors shadow-lg shadow-hotpink/20 mt-2"
                      >
                        Submit Application
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="w-full py-2 text-sm text-gray-500 hover:text-gray-300 transition-colors"
                      >
                        Back to search
                      </button>
                    </motion.form>
                  )}
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 rounded-full bg-electric/10 flex items-center justify-center mx-auto mb-5">
                    <CheckCircle className="w-8 h-8 text-electric" />
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-white mb-2">Thank You!</h3>
                  <p className="text-gray-400 mb-2 text-sm">
                    Your application for <span className="text-hotpink font-semibold">{formData.clubName}</span> in {searchCity.trim()} has been submitted.
                  </p>
                  <p className="text-gray-500 text-xs mb-6">We'll review your application and get back to you within 48 hours.</p>
                  <button
                    onClick={handleClose}
                    className="px-8 py-3 bg-electric text-black font-semibold rounded-xl hover:bg-electric-dim transition-colors"
                  >
                    Done
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ─── Main Charge Clubs Modal ─── */
export default function ChargeClubsModal({ isOpen, onClose }: ChargeClubsModalProps) {
  const [selectedClub, setSelectedClub] = useState<string | null>(null);
  const [startClubOpen, setStartClubOpen] = useState(false);

  const handleClose = () => {
    setSelectedClub(null);
    onClose();
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 backdrop-blur-md z-50"
              onClick={handleClose}
            />

            {/* Full-screen modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-2 sm:inset-4 md:inset-6 lg:inset-10 z-50 flex flex-col overflow-hidden rounded-2xl border border-white/10"
              style={{ background: 'linear-gradient(180deg, #0a0a12 0%, #0d0d18 100%)' }}
              onClick={() => setSelectedClub(null)}
            >
              {/* Header bar */}
              <div className="flex items-center justify-between px-4 sm:px-8 py-4 border-b border-white/5 flex-shrink-0">
                <div>
                  <h2 className="font-heading text-xl sm:text-2xl font-bold text-white">
                    Charge <span className="text-hotpink">Clubs</span>
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">Bay Area EV Charging Communities</p>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Map area */}
              <div
                className="flex-1 relative overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <BayAreaMap
                  selectedClub={selectedClub}
                  onSelectClub={setSelectedClub}
                />

                {/* Legend overlay */}
                <div className="absolute bottom-4 left-4 glass-card p-3 text-xs space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-hotpink shadow-lg shadow-hotpink/40" />
                    <span className="text-gray-400">Active Club</span>
                  </div>
                  <div className="text-gray-600">{chargeClubs.length} clubs &middot; {chargeClubs.reduce((s, c) => s + c.totalMembers, 0)} total members</div>
                </div>

                {/* Apartment partnership callout */}
                <div className="absolute bottom-4 right-4 glass-card p-3 text-xs max-w-52 hidden sm:block">
                  <div className="flex items-center gap-1.5 mb-1 text-electric font-medium">
                    <Users className="w-3 h-3" />
                    Apartment Partnerships
                  </div>
                  <p className="text-gray-500 leading-relaxed">
                    Apartment complexes can partner with nearby homeowner clubs for dedicated charging slots.
                  </p>
                </div>
              </div>

              {/* Bottom buttons */}
              <div className="flex items-center justify-center gap-4 px-4 sm:px-8 py-4 border-t border-white/5 flex-shrink-0">
                <Link
                  to="/how-it-works"
                  onClick={handleClose}
                  className="px-6 py-2.5 border border-white/15 text-white font-semibold text-sm rounded-xl hover:bg-white/5 transition-all"
                >
                  How It Works
                </Link>
                <button
                  onClick={() => setStartClubOpen(true)}
                  className="px-6 py-2.5 bg-hotpink text-white font-semibold text-sm rounded-xl hover:bg-hotpink-dim transition-all shadow-lg shadow-hotpink/20"
                >
                  Start Charge Club
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Start Club sub-modal */}
      <StartClubModal isOpen={startClubOpen} onClose={() => setStartClubOpen(false)} />
    </>
  );
}
