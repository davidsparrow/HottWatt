import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Star, CheckCircle, MapPin, Zap, DollarSign,
  Shield, Wifi, Camera, Car, Dog, Trees, Sun, Coffee,
  Lock, Bath, Droplets, Wrench, Paintbrush, Crown,
} from 'lucide-react';
import { chargers } from '../data/chargers';
import BookingModal from '../components/BookingModal';
import FadeInView from '../components/FadeInView';

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
                      {charger.address}, {charger.city}
                    </div>
                  </div>
                </div>
              </div>
            </FadeInView>

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
      />
    </div>
  );
}
