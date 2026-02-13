import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Star, CheckCircle, MapPin, Zap, DollarSign,
  Shield, Wifi, Camera, Car, Dog, Trees, Sun, Coffee,
  Lock, Bath, Droplets, Wrench, Paintbrush, Crown,
  Power, ShieldCheck, BadgeCheck, FileText, Heart,
  MessageSquare,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { chargers } from '../data/chargers';
import BookingModal from '../components/BookingModal';
import FadeInView from '../components/FadeInView';

/** Mask street number for pre-booking privacy */
function maskAddress(address: string): string {
  return address.replace(/^\d+\s*/, '*** ');
}

/** Dummy "host reviews of drivers" data — two-way reviews */
const hostReviews = [
  { id: 'hr1', driver: 'Alex M.', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Alex', rating: 5, date: '2026-02-01', comment: 'Left the spot clean and was right on time. Great driver, would host again.' },
  { id: 'hr2', driver: 'Priya S.', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Priya2', rating: 4, date: '2026-01-20', comment: 'Friendly and communicated well. Slight delay on arrival but no issues.' },
  { id: 'hr3', driver: 'Jordan K.', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=JordanK', rating: 5, date: '2026-01-10', comment: 'Perfect session. Unplugged on time and left everything in order.' },
];

const amenityIcons: Record<string, React.ElementType> = {
  'WiFi': Wifi,
  'Covered Parking': Car,
  'Security Camera': Camera,
  'Ocean View': Sun,
  'Street Parking': Car,
  'Pet Friendly': Dog,
  'Garden Access': Trees,
  'Quiet Neighborhood': Trees,
  'Driveway Parking': Car,
  'Well Lit': Sun,
  'Near Downtown': MapPin,
  'Garage Parking': Car,
  'Near BART': MapPin,
  'Quiet Street': Trees,
  'Near Park': Trees,
  'Fenced Yard': Shield,
  'EV Lounge': Coffee,
  'Snacks': Coffee,
};

const extraIcons: Record<string, { icon: React.ElementType; label: string; extra: boolean }> = {
  'indoor': { icon: Car, label: 'Indoor', extra: false },
  'locked': { icon: Lock, label: 'Locked', extra: false },
  'bathroom': { icon: Bath, label: 'Bathroom', extra: false },
  'washing*': { icon: Droplets, label: 'Car Wash', extra: true },
  'detailing*': { icon: Paintbrush, label: 'Detailing', extra: true },
  'repairs*': { icon: Wrench, label: 'Repairs', extra: true },
};

const levelLabels: Record<string, string> = {
  'Level 1': '120V — Slow Charging',
  'Level 2': '240V — Fast Charging',
  'Level 3': 'DC Fast Charging',
};

export default function ChargerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const charger = chargers.find((c) => c.id === id);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [wattClub, setWattClub] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(2);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [chargerActivated, setChargerActivated] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  if (!charger) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-heading text-2xl font-bold mb-4">Charger not found</h2>
          <Link to="/browse" className="text-electric hover:underline">
            Back to browse
          </Link>
        </div>
      </div>
    );
  }

  const durations = [1, 2, 4, 8];
  const energyCost = charger.pricePerKwh * charger.powerKW * selectedDuration;
  const discount = wattClub ? energyCost * 0.15 : 0;
  const totalCost = energyCost - discount + charger.accessFee;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            to="/browse"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-electric transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Browse
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Host header */}
            <FadeInView>
              <div className="glass-card p-6 sm:p-8">
                <div className="flex items-start gap-4 sm:gap-6">
                  <img
                    src={charger.host.avatar}
                    alt={charger.host.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-dark-lighter"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h1 className="font-heading text-xl sm:text-2xl font-bold text-white">
                        {charger.host.name}
                      </h1>
                      {charger.host.verified && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-electric/10 text-electric text-xs font-medium border border-electric/20">
                          <CheckCircle className="w-3 h-3" />
                          Verified
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="font-medium text-white">{charger.host.rating}</span>
                      </div>
                      <span className="text-gray-600">({charger.host.reviewCount} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-gray-400">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      {bookingConfirmed ? (
                        <span>{charger.address}, {charger.city}</span>
                      ) : (
                        <span>
                          {maskAddress(charger.address)}, {charger.city}
                          <span className="inline-flex items-center gap-0.5 ml-2 text-[10px] text-gray-600">
                            <Lock className="w-2.5 h-2.5" />
                            Exact address revealed after booking
                          </span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </FadeInView>

            {/* Booking Confirmation Banner */}
            <AnimatePresence>
              {bookingConfirmed && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <div className="glass-card p-5 border-electric/30 glow-border mb-0">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle className="w-5 h-5 text-electric" />
                      <h3 className="font-heading font-bold text-white">Booking Confirmed</h3>
                    </div>

                    {/* Address revealed */}
                    <div className="bg-electric/5 border border-electric/20 rounded-xl p-3 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-electric" />
                        <span className="text-electric font-medium">Address Revealed:</span>
                        <span className="text-white">{charger.address}, {charger.city}</span>
                      </div>
                    </div>

                    {/* Activate Charger button */}
                    {!chargerActivated ? (
                      <button
                        onClick={() => {
                          setChargerActivated(true);
                          toast.success('Charger activated! Plug in and start charging.', {
                            duration: 4000,
                            style: { background: '#1a1a24', color: '#e5e7eb', border: '1px solid rgba(34,197,94,0.3)' },
                            iconTheme: { primary: '#22c55e', secondary: '#1a1a24' },
                          });
                        }}
                        className="w-full py-3 bg-electric text-black font-bold rounded-xl hover:bg-electric-dim transition-all glow-green flex items-center justify-center gap-2"
                      >
                        <Power className="w-5 h-5" />
                        Activate Charger
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 p-3 rounded-xl bg-electric/10 border border-electric/20">
                        <div className="w-3 h-3 rounded-full bg-electric animate-pulse" />
                        <span className="text-sm font-medium text-electric">Charger Active — Plug in and start charging!</span>
                      </div>
                    )}

                    <p className="text-[11px] text-gray-600 mt-3">
                      Payment will auto-process based on electricity used plus the ${charger.accessFee.toFixed(2)} access fee when your session ends.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Charger Specs */}
            <FadeInView delay={0.1}>
              <div className="glass-card p-6 sm:p-8">
                <h2 className="font-heading text-lg font-bold mb-4 text-white">Charger Specs</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="bg-white/3 rounded-xl p-4 border border-white/5">
                    <div className="text-xs text-gray-500 mb-1 uppercase tracking-wider">Brand & Model</div>
                    <div className="font-medium text-white">{charger.brand}</div>
                    <div className="text-sm text-gray-400">{charger.model}</div>
                  </div>
                  <div className="bg-white/3 rounded-xl p-4 border border-white/5">
                    <div className="text-xs text-gray-500 mb-1 uppercase tracking-wider">Connector</div>
                    <div className="font-medium text-white">{charger.connectorType}</div>
                    <div className="text-sm text-gray-400">{levelLabels[charger.level]}</div>
                  </div>
                  <div className="bg-white/3 rounded-xl p-4 border border-white/5">
                    <div className="text-xs text-gray-500 mb-1 uppercase tracking-wider">Power & Price</div>
                    <div className="font-medium text-white">{charger.powerKW} kW</div>
                    <div className="text-sm text-gray-400">${charger.pricePerKwh.toFixed(2)}/kWh + ${charger.accessFee.toFixed(2)} fee</div>
                  </div>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed">{charger.description}</p>
              </div>
            </FadeInView>

            {/* Amenities */}
            <FadeInView delay={0.15}>
              <div className="glass-card p-6 sm:p-8">
                <h2 className="font-heading text-lg font-bold mb-4 text-white">Amenities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {charger.amenities.map((amenity) => {
                    const Icon = amenityIcons[amenity] || Zap;
                    return (
                      <div
                        key={amenity}
                        className="flex items-center gap-2.5 p-3 rounded-lg bg-white/3 border border-white/5"
                      >
                        <Icon className="w-4 h-4 text-electric flex-shrink-0" />
                        <span className="text-sm text-gray-300">{amenity}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </FadeInView>

            {/* Extras / Tags */}
            <FadeInView delay={0.2}>
              <div className="glass-card p-6 sm:p-8">
                <h2 className="font-heading text-lg font-bold mb-4 text-white">Extras & Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {charger.extras.map((extra) => {
                    const info = extraIcons[extra];
                    if (!info) return null;
                    const Icon = info.icon;
                    return (
                      <span
                        key={extra}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border ${
                          info.extra
                            ? 'bg-coral/10 text-coral border-coral/20'
                            : 'bg-electric/10 text-electric border-electric/20'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {info.label}
                        {info.extra && <span className="text-[10px] opacity-70 ml-0.5">(extra cost)</span>}
                      </span>
                    );
                  })}
                </div>
              </div>
            </FadeInView>

            {/* Last-Mile Ride Service */}
            {charger.lastMile?.enabled && (
              <FadeInView delay={0.22}>
                <div className="glass-card p-6 sm:p-8 border-coral/20" style={{ boxShadow: '0 0 15px rgba(239,118,116,0.08)' }}>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-coral/10 flex items-center justify-center">
                      <Car className="w-4 h-4 text-coral" />
                    </div>
                    <div>
                      <h2 className="font-heading text-lg font-bold text-white">Last-Mile Ride</h2>
                      <p className="text-xs text-coral font-medium">Only on HottWatt</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mb-4 leading-relaxed">
                    This host offers a ride to get you from their home to your destination so you can let your car charge while you go about your day.
                  </p>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-white/3 rounded-xl p-3 border border-white/5">
                      <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Pricing</div>
                      <div className="text-sm font-medium text-white">
                        {charger.lastMile.pricingType === 'free' && 'Free'}
                        {charger.lastMile.pricingType === 'flat' && `$${charger.lastMile.price.toFixed(2)} flat`}
                        {charger.lastMile.pricingType === 'per_mile' && `$${charger.lastMile.price.toFixed(2)}/mile`}
                        {charger.lastMile.pricingType === 'per_minute' && `$${charger.lastMile.price.toFixed(2)}/min`}
                      </div>
                    </div>
                    <div className="bg-white/3 rounded-xl p-3 border border-white/5">
                      <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Round Trip</div>
                      <div className="text-sm font-medium text-white">
                        {charger.lastMile.twoWay ? (
                          <span className="text-electric">2-Way Available</span>
                        ) : (
                          <span>Drop-off Only</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {charger.lastMile.notes && (
                    <div className="bg-coral/5 border border-coral/15 rounded-lg p-3">
                      <p className="text-xs text-gray-400 italic">"{charger.lastMile.notes}"</p>
                    </div>
                  )}
                </div>
              </FadeInView>
            )}

            {/* Reviews */}
            <FadeInView delay={0.25}>
              <div className="glass-card p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-heading text-lg font-bold text-white">Reviews</h2>
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="font-medium text-white">{charger.host.rating}</span>
                    <span className="text-sm text-gray-500">({charger.reviews.length})</span>
                  </div>
                </div>
                <div className="space-y-5">
                  {charger.reviews.map((review) => (
                    <div key={review.id} className="pb-5 border-b border-white/5 last:border-0 last:pb-0">
                      <div className="flex items-center gap-3 mb-2">
                        <img
                          src={review.avatar}
                          alt={review.author}
                          className="w-8 h-8 rounded-full bg-dark-lighter"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-white">{review.author}</span>
                            <span className="text-xs text-gray-600">{review.date}</span>
                          </div>
                          <div className="flex gap-0.5 mt-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < review.rating
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-gray-700'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-400 leading-relaxed pl-11">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeInView>
            {/* Trust & Safety */}
            <FadeInView delay={0.3}>
              <div className="glass-card p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-5">
                  <ShieldCheck className="w-5 h-5 text-electric" />
                  <h2 className="font-heading text-lg font-bold text-white">Trust & Safety</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-white/3 border border-white/5">
                    <BadgeCheck className="w-5 h-5 text-electric flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-sm font-medium text-white block">Verified Profiles</span>
                      <span className="text-xs text-gray-500">ID-verified hosts and drivers with background checks</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-white/3 border border-white/5">
                    <Shield className="w-5 h-5 text-electric flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-sm font-medium text-white block">$50K Host Insurance</span>
                      <span className="text-xs text-gray-500">Equipment damage & liability coverage for every session</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-white/3 border border-white/5">
                    <FileText className="w-5 h-5 text-electric flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-sm font-medium text-white block">Two-Way Reviews</span>
                      <span className="text-xs text-gray-500">Both hosts and drivers rate each other after every session</span>
                    </div>
                  </div>
                </div>
              </div>
            </FadeInView>

            {/* Host Reviews of Drivers (two-way) */}
            <FadeInView delay={0.35}>
              <div className="glass-card p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-hotpink" />
                    <h2 className="font-heading text-lg font-bold text-white">Host's Reviews of Drivers</h2>
                  </div>
                  <span className="text-xs text-gray-500">Two-way trust</span>
                </div>
                <div className="space-y-5">
                  {hostReviews.map((review) => (
                    <div key={review.id} className="pb-5 border-b border-white/5 last:border-0 last:pb-0">
                      <div className="flex items-center gap-3 mb-2">
                        <img
                          src={review.avatar}
                          alt={review.driver}
                          className="w-8 h-8 rounded-full bg-dark-lighter"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-white">{review.driver}</span>
                            <span className="text-xs text-gray-600">{review.date}</span>
                          </div>
                          <div className="flex gap-0.5 mt-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < review.rating
                                    ? 'text-hotpink fill-hotpink'
                                    : 'text-gray-700'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-400 leading-relaxed pl-11">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeInView>

            {/* Leave a Review */}
            <FadeInView delay={0.4}>
              <div className="glass-card p-6 sm:p-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-electric" />
                    <h2 className="font-heading text-lg font-bold text-white">Leave a Review</h2>
                  </div>
                </div>

                {!showReviewForm ? (
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="w-full py-3 border border-white/10 rounded-xl text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white transition-all"
                  >
                    Rate your charging experience
                  </button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    {/* Star rating */}
                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 block">Your Rating</label>
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setReviewRating(i + 1)}
                            className="p-0.5 transition-transform hover:scale-110"
                          >
                            <Star
                              className={`w-6 h-6 ${
                                i < reviewRating
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-700'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-1.5 block">Comment</label>
                      <textarea
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Share your experience..."
                        rows={3}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-electric/40 focus:ring-1 focus:ring-electric/20 transition-colors resize-none"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          if (!reviewComment.trim()) {
                            toast.error('Please write a comment');
                            return;
                          }
                          toast.success('Review submitted! Thanks for your feedback.', {
                            style: { background: '#1a1a24', color: '#e5e7eb', border: '1px solid rgba(34,197,94,0.3)' },
                            iconTheme: { primary: '#22c55e', secondary: '#1a1a24' },
                          });
                          setShowReviewForm(false);
                          setReviewComment('');
                          setReviewRating(5);
                        }}
                        className="flex-1 py-2.5 bg-electric text-black font-semibold text-sm rounded-xl hover:bg-electric-dim transition-colors"
                      >
                        Submit Review
                      </button>
                      <button
                        onClick={() => { setShowReviewForm(false); setReviewComment(''); }}
                        className="px-4 py-2.5 border border-white/10 text-gray-400 text-sm rounded-xl hover:bg-white/5 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </FadeInView>
          </div>

          {/* Booking panel (sticky sidebar) */}
          <div className="lg:col-span-1">
            <FadeInView delay={0.1}>
              <div className="lg:sticky lg:top-24">
                <div className="glass-card p-6 glow-border">
                  <h3 className="font-heading text-lg font-bold mb-5 text-white">Book This Charger</h3>

                  {/* Duration selector */}
                  <div className="mb-5">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block">
                      Estimated Duration
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {durations.map((d) => (
                        <button
                          key={d}
                          onClick={() => setSelectedDuration(d)}
                          className={`py-2.5 rounded-lg text-sm font-medium transition-all border ${
                            selectedDuration === d
                              ? 'bg-electric/15 text-electric border-electric/30'
                              : 'bg-white/3 text-gray-400 border-white/8 hover:bg-white/5'
                          }`}
                        >
                          {d}h
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* WattClub toggle */}
                  <div className="mb-5">
                    <label className="flex items-center justify-between gap-3 cursor-pointer group p-3 rounded-lg bg-white/3 border border-white/5 hover:border-electric/20 transition-colors">
                      <div className="flex items-center gap-2">
                        <Crown className="w-4 h-4 text-electric" />
                        <div>
                          <span className="text-sm font-medium text-white block">WattClub Eligible</span>
                          <span className="text-xs text-gray-500">Save 15% on energy costs</span>
                        </div>
                      </div>
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={wattClub}
                          onChange={(e) => setWattClub(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-white/10 rounded-full peer-checked:bg-electric/30 transition-colors" />
                        <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-gray-400 rounded-full peer-checked:translate-x-4 peer-checked:bg-electric transition-all" />
                      </div>
                    </label>
                  </div>

                  {/* Cost breakdown */}
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">
                        <DollarSign className="w-3.5 h-3.5 inline mr-1" />
                        {charger.pricePerKwh.toFixed(2)}/kWh × {charger.powerKW}kW × {selectedDuration}h
                      </span>
                      <span className="text-gray-300">${energyCost.toFixed(2)}</span>
                    </div>
                    {wattClub && discount > 0 && (
                      <div className="flex justify-between text-sm text-electric">
                        <span>WattClub discount (15%)</span>
                        <span>-${discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Access fee</span>
                      <span className="text-gray-300">${charger.accessFee.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-white/10 pt-2 mt-2">
                      <div className="flex justify-between font-semibold">
                        <span className="text-white">Total</span>
                        <span className="text-electric text-lg">${totalCost.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Book Now */}
                  <button
                    onClick={() => setBookingOpen(true)}
                    className="w-full py-3.5 bg-electric text-black font-bold rounded-xl hover:bg-electric-dim transition-all glow-green text-base"
                  >
                    Book Now
                  </button>

                  {/* Availability status */}
                  <div className="mt-4 text-center">
                    {charger.available ? (
                      <span className="inline-flex items-center gap-1.5 text-xs text-electric">
                        <span className="w-2 h-2 rounded-full bg-electric animate-pulse" />
                        Available now
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs text-amber-400">
                        Next slot: {charger.nextSlot}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </FadeInView>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        charger={charger}
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
        wattClub={wattClub}
        onBookingConfirmed={() => setBookingConfirmed(true)}
      />
    </div>
  );
}
