import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Zap, DollarSign, Calendar, Clock, CheckCircle,
  ChevronRight, Plug, BatteryCharging, MapPin, Settings,
} from 'lucide-react';
import toast from 'react-hot-toast';
import FadeInView from '../components/FadeInView';
import type { ConnectorType, ChargingLevel } from '../data/types';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const connectorOptions: { value: ConnectorType; label: string }[] = [
  { value: 'J1772', label: 'J1772' },
  { value: 'Tesla NACS', label: 'Tesla NACS' },
  { value: 'CCS', label: 'CCS' },
];

const levelOptions: { value: ChargingLevel; label: string; desc: string }[] = [
  { value: 'Level 1', label: 'Level 1', desc: '120V — 1-2 kW — Slow' },
  { value: 'Level 2', label: 'Level 2', desc: '240V — 7-19 kW — Fast' },
  { value: 'Level 3', label: 'Level 3', desc: 'DC Fast — 50+ kW' },
];

type FormStep = 'specs' | 'pricing' | 'availability' | 'review';

const stepLabels: { key: FormStep; label: string; icon: React.ElementType }[] = [
  { key: 'specs', label: 'Charger Specs', icon: Plug },
  { key: 'pricing', label: 'Pricing', icon: DollarSign },
  { key: 'availability', label: 'Availability', icon: Calendar },
  { key: 'review', label: 'Review & Submit', icon: CheckCircle },
];

export default function ListChargerPage() {
  const [currentStep, setCurrentStep] = useState<FormStep>('specs');
  const [submitted, setSubmitted] = useState(false);

  // Specs
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [connector, setConnector] = useState<ConnectorType>('J1772');
  const [level, setLevel] = useState<ChargingLevel>('Level 2');
  const [powerKW, setPowerKW] = useState('9.6');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');

  // Pricing
  const [pricePerKwh, setPricePerKwh] = useState('0.20');
  const [accessFee, setAccessFee] = useState('2.00');

  // Availability — which days and hour ranges
  const [availDays, setAvailDays] = useState<Record<number, boolean>>({
    0: false, 1: true, 2: true, 3: true, 4: true, 5: true, 6: false,
  });
  const [startHour, setStartHour] = useState('8');
  const [endHour, setEndHour] = useState('18');

  const stepIndex = stepLabels.findIndex((s) => s.key === currentStep);

  const canAdvance = () => {
    if (currentStep === 'specs') return brand && model && address && city;
    if (currentStep === 'pricing') return parseFloat(pricePerKwh) > 0 && parseFloat(accessFee) >= 0;
    if (currentStep === 'availability') return Object.values(availDays).some(Boolean);
    return true;
  };

  const nextStep = () => {
    const idx = stepIndex;
    if (idx < stepLabels.length - 1) setCurrentStep(stepLabels[idx + 1].key);
  };
  const prevStep = () => {
    const idx = stepIndex;
    if (idx > 0) setCurrentStep(stepLabels[idx - 1].key);
  };

  const handleSubmit = () => {
    toast.success(
      <div>
        <p className="font-semibold">Charger listed!</p>
        <p className="text-sm text-gray-400 mt-1">
          Your {brand} {model} in {city} is now live.
        </p>
      </div>,
      {
        duration: 5000,
        style: { background: '#1a1a24', color: '#e5e7eb', border: '1px solid rgba(34,197,94,0.3)' },
        iconTheme: { primary: '#22c55e', secondary: '#1a1a24' },
      },
    );
    setSubmitted(true);
  };

  const selectedDayNames = Object.entries(availDays)
    .filter(([, v]) => v)
    .map(([k]) => DAY_LABELS[parseInt(k)])
    .join(', ');

  if (submitted) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto px-4"
        >
          <div className="w-20 h-20 rounded-full bg-electric/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-electric" />
          </div>
          <h1 className="font-heading text-3xl font-bold text-white mb-3">You're Live!</h1>
          <p className="text-gray-400 mb-2">
            Your <span className="text-white font-medium">{brand} {model}</span> at{' '}
            <span className="text-white font-medium">{address}, {city}</span> is now listed on HottWatt.
          </p>
          <p className="text-gray-500 text-sm mb-8">
            Nearby EV drivers can find and book your charger immediately. We'll notify you when someone books.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/browse"
              className="px-6 py-3 bg-electric text-black font-semibold rounded-xl hover:bg-electric-dim transition-colors glow-green-sm"
            >
              View All Chargers
            </Link>
            <Link
              to="/"
              className="px-6 py-3 border border-white/15 text-white font-semibold rounded-xl hover:bg-white/5 transition-colors"
            >
              Back Home
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-electric transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Header */}
        <FadeInView>
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-electric/30 bg-electric/5 mb-4">
              <BatteryCharging className="w-3.5 h-3.5 text-electric" />
              <span className="text-xs font-medium text-electric">List in under 2 minutes</span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold mb-3">
              List Your <span className="text-electric">Charger</span>
            </h1>
            <p className="text-gray-400 max-w-md mx-auto">
              Set your price, define your availability, and start earning from your home EV charger.
            </p>
          </div>
        </FadeInView>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-1 sm:gap-2 mb-10">
          {stepLabels.map((s, i) => {
            const isActive = i === stepIndex;
            const isDone = i < stepIndex;
            return (
              <div key={s.key} className="flex items-center gap-1 sm:gap-2">
                <button
                  onClick={() => i <= stepIndex && setCurrentStep(s.key)}
                  className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                    isActive
                      ? 'bg-electric/15 text-electric border-electric/30'
                      : isDone
                      ? 'bg-electric/5 text-electric/60 border-electric/15 cursor-pointer'
                      : 'bg-white/3 text-gray-600 border-white/5 cursor-default'
                  }`}
                >
                  <s.icon className="w-3.5 h-3.5 hidden sm:block" />
                  <span className="hidden sm:inline">{s.label}</span>
                  <span className="sm:hidden">{i + 1}</span>
                </button>
                {i < stepLabels.length - 1 && (
                  <ChevronRight className="w-3 h-3 text-gray-700 flex-shrink-0" />
                )}
              </div>
            );
          })}
        </div>

        {/* Form steps */}
        <AnimatePresence mode="wait">
          {currentStep === 'specs' && (
            <motion.div
              key="specs"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="glass-card p-6 sm:p-8"
            >
              <div className="flex items-center gap-2 mb-6">
                <Settings className="w-5 h-5 text-electric" />
                <h2 className="font-heading text-lg font-bold text-white">Charger Specs</h2>
              </div>

              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-1.5 block">Brand *</label>
                    <input
                      type="text"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      placeholder="e.g. Tesla, ChargePoint"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-electric/40 focus:ring-1 focus:ring-electric/20 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-1.5 block">Model *</label>
                    <input
                      type="text"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      placeholder="e.g. Wall Connector, Home Flex"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-electric/40 focus:ring-1 focus:ring-electric/20 transition-colors"
                    />
                  </div>
                </div>

                {/* Connector type */}
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Connector Type</label>
                  <div className="flex flex-wrap gap-2">
                    {connectorOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setConnector(opt.value)}
                        className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                          connector === opt.value
                            ? 'bg-electric/15 text-electric border-electric/30'
                            : 'bg-white/3 text-gray-400 border-white/8 hover:bg-white/5'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Level */}
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Charging Level</label>
                  <div className="space-y-2">
                    {levelOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setLevel(opt.value)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all border ${
                          level === opt.value
                            ? 'bg-electric/15 text-electric border-electric/30'
                            : 'bg-white/3 text-gray-400 border-white/8 hover:bg-white/5'
                        }`}
                      >
                        <span className="font-medium">{opt.label}</span>
                        <span className="text-xs text-gray-500">{opt.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Power */}
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-1.5 block">Power Output (kW)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    value={powerKW}
                    onChange={(e) => setPowerKW(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-electric/40 focus:ring-1 focus:ring-electric/20 transition-colors"
                  />
                </div>

                {/* Address */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-1.5 block">Street Address *</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="742 Hayes St"
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-electric/40 focus:ring-1 focus:ring-electric/20 transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-1.5 block">City *</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="San Francisco"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-electric/40 focus:ring-1 focus:ring-electric/20 transition-colors"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 'pricing' && (
            <motion.div
              key="pricing"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="glass-card p-6 sm:p-8"
            >
              <div className="flex items-center gap-2 mb-6">
                <DollarSign className="w-5 h-5 text-electric" />
                <h2 className="font-heading text-lg font-bold text-white">Set Your Price</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-1.5 block">Price per kWh ($)</label>
                  <p className="text-xs text-gray-500 mb-2">Drivers pay this rate times the charger power times hours. Typical range: $0.15 – $0.25.</p>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={pricePerKwh}
                    onChange={(e) => setPricePerKwh(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-electric/40 focus:ring-1 focus:ring-electric/20 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-300 mb-1.5 block">Access Fee ($)</label>
                  <p className="text-xs text-gray-500 mb-2">A flat fee per session to cover wear-and-tear. Typical range: $1.50 – $3.50.</p>
                  <input
                    type="number"
                    step="0.25"
                    min="0"
                    value={accessFee}
                    onChange={(e) => setAccessFee(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-electric/40 focus:ring-1 focus:ring-electric/20 transition-colors"
                  />
                </div>

                {/* Earnings preview */}
                <div className="bg-electric/5 border border-electric/20 rounded-xl p-4">
                  <span className="text-xs text-electric font-medium uppercase tracking-wider">Earnings Preview</span>
                  <p className="text-sm text-gray-300 mt-2">
                    A 2-hour booking at {powerKW} kW would earn you{' '}
                    <span className="text-electric font-semibold">
                      ${(parseFloat(pricePerKwh || '0') * parseFloat(powerKW || '0') * 2 + parseFloat(accessFee || '0')).toFixed(2)}
                    </span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Formula: (${ pricePerKwh }/kWh x { powerKW } kW x 2h) + ${ accessFee } access fee
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 'availability' && (
            <motion.div
              key="availability"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="glass-card p-6 sm:p-8"
            >
              <div className="flex items-center gap-2 mb-6">
                <Calendar className="w-5 h-5 text-electric" />
                <h2 className="font-heading text-lg font-bold text-white">Availability Windows</h2>
              </div>

              <p className="text-sm text-gray-400 mb-6">
                Choose which days your charger is available and set the time window. You can adjust this anytime.
              </p>

              {/* Day toggles */}
              <div className="mb-6">
                <label className="text-sm font-medium text-gray-300 mb-3 block">Available Days</label>
                <div className="flex flex-wrap gap-2">
                  {DAY_LABELS.map((day, i) => (
                    <button
                      key={i}
                      onClick={() => setAvailDays({ ...availDays, [i]: !availDays[i] })}
                      className={`w-12 h-12 rounded-xl text-sm font-medium transition-all border ${
                        availDays[i]
                          ? 'bg-electric/15 text-electric border-electric/30'
                          : 'bg-white/3 text-gray-600 border-white/8 hover:bg-white/5'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time window */}
              <div>
                <label className="text-sm font-medium text-gray-300 mb-3 block">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Available Hours
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 mb-1 block">Start</label>
                    <select
                      value={startHour}
                      onChange={(e) => setStartHour(e.target.value)}
                      className="w-full px-3 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-electric/40 transition-colors appearance-none cursor-pointer"
                    >
                      {Array.from({ length: 24 }).map((_, h) => (
                        <option key={h} value={h} className="bg-dark-bg text-white">
                          {h === 0 ? '12 AM' : h < 12 ? `${h} AM` : h === 12 ? '12 PM' : `${h - 12} PM`}
                        </option>
                      ))}
                    </select>
                  </div>
                  <span className="text-gray-600 mt-5">to</span>
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 mb-1 block">End</label>
                    <select
                      value={endHour}
                      onChange={(e) => setEndHour(e.target.value)}
                      className="w-full px-3 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-electric/40 transition-colors appearance-none cursor-pointer"
                    >
                      {Array.from({ length: 24 }).map((_, h) => (
                        <option key={h} value={h} className="bg-dark-bg text-white">
                          {h === 0 ? '12 AM' : h < 12 ? `${h} AM` : h === 12 ? '12 PM' : `${h - 12} PM`}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-4 bg-white/3 rounded-lg p-3 border border-white/5 text-xs text-gray-500">
                Your charger will be shown as available on <span className="text-gray-300">{selectedDayNames || 'no days selected'}</span> from{' '}
                <span className="text-gray-300">
                  {parseInt(startHour) === 0 ? '12 AM' : parseInt(startHour) < 12 ? `${startHour} AM` : parseInt(startHour) === 12 ? '12 PM' : `${parseInt(startHour) - 12} PM`}
                </span> to{' '}
                <span className="text-gray-300">
                  {parseInt(endHour) === 0 ? '12 AM' : parseInt(endHour) < 12 ? `${endHour} AM` : parseInt(endHour) === 12 ? '12 PM' : `${parseInt(endHour) - 12} PM`}
                </span>.
              </div>
            </motion.div>
          )}

          {currentStep === 'review' && (
            <motion.div
              key="review"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="glass-card p-6 sm:p-8"
            >
              <div className="flex items-center gap-2 mb-6">
                <CheckCircle className="w-5 h-5 text-electric" />
                <h2 className="font-heading text-lg font-bold text-white">Review & Submit</h2>
              </div>

              <div className="space-y-4">
                <div className="bg-white/3 rounded-xl p-4 border border-white/5">
                  <span className="text-xs text-gray-500 uppercase tracking-wider">Charger</span>
                  <p className="text-white font-medium mt-1">{brand} {model}</p>
                  <p className="text-sm text-gray-400">{connector} &middot; {level} &middot; {powerKW} kW</p>
                </div>

                <div className="bg-white/3 rounded-xl p-4 border border-white/5">
                  <span className="text-xs text-gray-500 uppercase tracking-wider">Location</span>
                  <p className="text-white font-medium mt-1">{address}</p>
                  <p className="text-sm text-gray-400">{city}</p>
                </div>

                <div className="bg-white/3 rounded-xl p-4 border border-white/5">
                  <span className="text-xs text-gray-500 uppercase tracking-wider">Pricing</span>
                  <p className="text-white font-medium mt-1">${pricePerKwh}/kWh + ${accessFee} access fee</p>
                </div>

                <div className="bg-white/3 rounded-xl p-4 border border-white/5">
                  <span className="text-xs text-gray-500 uppercase tracking-wider">Availability</span>
                  <p className="text-white font-medium mt-1">{selectedDayNames || 'None'}</p>
                  <p className="text-sm text-gray-400">
                    {parseInt(startHour) === 0 ? '12 AM' : parseInt(startHour) < 12 ? `${startHour} AM` : parseInt(startHour) === 12 ? '12 PM' : `${parseInt(startHour) - 12} PM`}
                    {' — '}
                    {parseInt(endHour) === 0 ? '12 AM' : parseInt(endHour) < 12 ? `${endHour} AM` : parseInt(endHour) === 12 ? '12 PM' : `${parseInt(endHour) - 12} PM`}
                  </p>
                </div>

                <div className="bg-electric/5 border border-electric/20 rounded-xl p-4 text-sm text-gray-300">
                  <p className="flex items-center gap-2 mb-1">
                    <Zap className="w-4 h-4 text-electric" />
                    <span className="font-medium text-electric">What happens next?</span>
                  </p>
                  <ul className="text-xs text-gray-400 space-y-1 ml-6">
                    <li>Your charger goes live immediately on HottWatt</li>
                    <li>Nearby drivers can find, book, and pay through the app</li>
                    <li>Payments auto-process after each session</li>
                    <li>You're covered by $50K host insurance</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={prevStep}
            className={`px-5 py-2.5 border border-white/15 text-white text-sm font-medium rounded-xl transition-colors ${
              stepIndex === 0 ? 'opacity-0 pointer-events-none' : 'hover:bg-white/5'
            }`}
          >
            Back
          </button>

          {currentStep === 'review' ? (
            <button
              onClick={handleSubmit}
              className="px-8 py-2.5 bg-electric text-black font-semibold text-sm rounded-xl hover:bg-electric-dim transition-colors glow-green-sm flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              List My Charger
            </button>
          ) : (
            <button
              onClick={nextStep}
              disabled={!canAdvance()}
              className={`px-6 py-2.5 text-sm font-semibold rounded-xl flex items-center gap-2 transition-all ${
                canAdvance()
                  ? 'bg-electric text-black hover:bg-electric-dim glow-green-sm'
                  : 'bg-white/5 text-gray-600 cursor-not-allowed border border-white/5'
              }`}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
