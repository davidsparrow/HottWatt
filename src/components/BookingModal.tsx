import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Clock, Calendar, CheckCircle2, User, Mail, Phone } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Charger } from '../data/types';

interface BookingModalProps {
  charger: Charger;
  isOpen: boolean;
  onClose: () => void;
  wattClub: boolean;
  onBookingConfirmed?: () => void;
}

type Step = 'calendar' | 'form';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function formatHour(hour: number): string {
  if (hour === 0) return '12 AM';
  if (hour < 12) return `${hour} AM`;
  if (hour === 12) return '12 PM';
  return `${hour - 12} PM`;
}

// Simulate some hours being already booked
function getBookedHours(charger: Charger, date: Date): number[] {
  const dayOfWeek = date.getDay();
  const availability = charger.availability.find(a => a.day === dayOfWeek);
  if (!availability) return [];
  // Simulate some booked slots (deterministic based on charger id + date)
  const seed = parseInt(charger.id) + date.getDate();
  const booked: number[] = [];
  availability.hours.forEach((h) => {
    if ((h * seed) % 7 === 0) booked.push(h);
  });
  return booked;
}

export default function BookingModal({ charger, isOpen, onClose, wattClub, onBookingConfirmed }: BookingModalProps) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [startHour, setStartHour] = useState<number | null>(null);
  const [endHour, setEndHour] = useState<number | null>(null);
  const [step, setStep] = useState<Step>('calendar');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const availableHoursForDate = useMemo(() => {
    if (!selectedDate) return [];
    const dayOfWeek = selectedDate.getDay();
    const slot = charger.availability.find(a => a.day === dayOfWeek);
    return slot?.hours || [];
  }, [selectedDate, charger.availability]);

  const bookedHours = useMemo(() => {
    if (!selectedDate) return [];
    return getBookedHours(charger, selectedDate);
  }, [selectedDate, charger]);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleDateClick = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    if (date < new Date(today.getFullYear(), today.getMonth(), today.getDate())) return;
    setSelectedDate(date);
    setStartHour(null);
    setEndHour(null);
  };

  const handleHourClick = (hour: number) => {
    if (bookedHours.includes(hour)) return;
    if (!availableHoursForDate.includes(hour)) return;

    if (startHour === null) {
      setStartHour(hour);
      setEndHour(hour + 1);
    } else if (endHour !== null && hour === startHour) {
      // Deselect
      setStartHour(null);
      setEndHour(null);
    } else if (hour > startHour) {
      // Check all hours between start and this hour+1 are available and not booked
      let valid = true;
      for (let h = startHour; h <= hour; h++) {
        if (!availableHoursForDate.includes(h) || bookedHours.includes(h)) {
          valid = false;
          break;
        }
      }
      if (valid) {
        setEndHour(hour + 1);
      }
    } else {
      // Clicking before start resets
      setStartHour(hour);
      setEndHour(hour + 1);
    }
  };

  const duration = startHour !== null && endHour !== null ? endHour - startHour : 0;
  const energyCost = charger.pricePerKwh * charger.powerKW * duration;
  const discount = wattClub ? energyCost * 0.15 : 0;
  const totalCost = energyCost - discount + charger.accessFee;

  const handleNextStep = () => {
    if (startHour !== null && endHour !== null && selectedDate) {
      setStep('form');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error('Please fill in all fields');
      return;
    }
    toast.success(
      <div>
        <p className="font-semibold">Booking confirmed!</p>
        <p className="text-sm text-gray-400 mt-1">
          {selectedDate?.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}{' '}
          {startHour !== null ? formatHour(startHour) : ''} - {endHour !== null ? formatHour(endHour) : ''}
        </p>
      </div>,
      {
        duration: 5000,
        style: {
          background: '#1a1a24',
          color: '#e5e7eb',
          border: '1px solid rgba(34, 197, 94, 0.3)',
        },
        iconTheme: {
          primary: '#22c55e',
          secondary: '#1a1a24',
        },
      }
    );
    onBookingConfirmed?.();
    onClose();
    // Reset state
    setStep('calendar');
    setSelectedDate(null);
    setStartHour(null);
    setEndHour(null);
    setFormData({ name: '', email: '', phone: '' });
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep('calendar');
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={handleClose}
          />

          {/* Slide-in panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-dark-bg border-l border-white/10 z-50 overflow-y-auto"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  {step === 'form' && (
                    <button
                      onClick={() => setStep('calendar')}
                      className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-400" />
                    </button>
                  )}
                  <h2 className="font-heading text-xl font-bold">
                    {step === 'calendar' ? 'Select Date & Time' : 'Complete Booking'}
                  </h2>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <AnimatePresence mode="wait">
                {step === 'calendar' ? (
                  <motion.div
                    key="calendar"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    {/* Calendar */}
                    <div className="glass-card p-4 mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <button onClick={handlePrevMonth} className="p-1 rounded hover:bg-white/10 transition-colors">
                          <ChevronLeft className="w-5 h-5 text-gray-400" />
                        </button>
                        <h3 className="font-heading font-semibold text-sm">
                          {MONTH_NAMES[currentMonth]} {currentYear}
                        </h3>
                        <button onClick={handleNextMonth} className="p-1 rounded hover:bg-white/10 transition-colors">
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </button>
                      </div>

                      {/* Day headers */}
                      <div className="grid grid-cols-7 gap-1 mb-2">
                        {DAY_NAMES.map((d) => (
                          <div key={d} className="text-center text-xs text-gray-600 py-1">{d}</div>
                        ))}
                      </div>

                      {/* Days */}
                      <div className="grid grid-cols-7 gap-1">
                        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                          <div key={`empty-${i}`} />
                        ))}
                        {Array.from({ length: daysInMonth }).map((_, i) => {
                          const day = i + 1;
                          const date = new Date(currentYear, currentMonth, day);
                          const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
                          const dayOfWeek = date.getDay();
                          const hasAvailability = charger.availability.some(a => a.day === dayOfWeek);
                          const isSelected = selectedDate?.getDate() === day &&
                            selectedDate?.getMonth() === currentMonth &&
                            selectedDate?.getFullYear() === currentYear;

                          return (
                            <button
                              key={day}
                              onClick={() => !isPast && hasAvailability && handleDateClick(day)}
                              disabled={isPast || !hasAvailability}
                              className={`aspect-square flex items-center justify-center rounded-lg text-sm transition-all ${
                                isSelected
                                  ? 'bg-electric text-black font-bold'
                                  : isPast || !hasAvailability
                                  ? 'text-gray-700 cursor-not-allowed'
                                  : 'text-gray-300 hover:bg-white/10 cursor-pointer'
                              }`}
                            >
                              {day}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Time slots */}
                    {selectedDate && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <Calendar className="w-4 h-4 text-electric" />
                          <span className="text-sm font-medium text-gray-300">
                            {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                          </span>
                        </div>

                        {/* Legend */}
                        <div className="flex gap-4 mb-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <span className="w-3 h-3 rounded bg-white/5 border border-white/10" /> Available
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="w-3 h-3 rounded bg-electric/20 border border-electric/40" /> Selected
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="w-3 h-3 rounded bg-hotpink/20 border border-hotpink/30" /> Booked
                          </span>
                        </div>

                        <div className="grid grid-cols-4 gap-2">
                          {availableHoursForDate.map((hour) => {
                            const isBooked = bookedHours.includes(hour);
                            const isInRange = startHour !== null && endHour !== null && hour >= startHour && hour < endHour;
                            const isStart = hour === startHour;

                            return (
                              <button
                                key={hour}
                                onClick={() => handleHourClick(hour)}
                                disabled={isBooked}
                                className={`py-2.5 px-2 rounded-lg text-xs font-medium transition-all border ${
                                  isBooked
                                    ? 'bg-hotpink/10 text-hotpink/60 border-hotpink/20 cursor-not-allowed'
                                    : isInRange
                                    ? isStart
                                      ? 'bg-electric/20 text-electric border-electric/40 ring-1 ring-electric/30'
                                      : 'bg-electric/10 text-electric border-electric/30'
                                    : 'bg-white/3 text-gray-400 border-white/8 hover:bg-white/8 hover:text-gray-200'
                                }`}
                              >
                                {formatHour(hour)}
                              </button>
                            );
                          })}
                        </div>

                        {availableHoursForDate.length === 0 && (
                          <p className="text-sm text-gray-600 text-center py-6">No available slots on this day</p>
                        )}
                      </motion.div>
                    )}

                    {/* Selection summary & Next button */}
                    {startHour !== null && endHour !== null && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <div className="glass-card p-4 mb-4">
                          <div className="flex items-center gap-2 text-sm mb-2">
                            <Clock className="w-4 h-4 text-electric" />
                            <span className="text-gray-300">
                              {formatHour(startHour)} — {formatHour(endHour)} ({duration}h)
                            </span>
                          </div>
                          <div className="space-y-1 text-sm text-gray-400">
                            <div className="flex justify-between">
                              <span>${charger.pricePerKwh.toFixed(2)}/kWh × {charger.powerKW}kW × {duration}h</span>
                              <span className="text-gray-300">${energyCost.toFixed(2)}</span>
                            </div>
                            {wattClub && discount > 0 && (
                              <div className="flex justify-between text-electric">
                                <span>WattClub discount (15%)</span>
                                <span>-${discount.toFixed(2)}</span>
                              </div>
                            )}
                            <div className="flex justify-between">
                              <span>Access fee</span>
                              <span className="text-gray-300">${charger.accessFee.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between pt-2 border-t border-white/10 font-semibold text-white">
                              <span>Total</span>
                              <span className="text-electric">${totalCost.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={handleNextStep}
                          className="w-full py-3 bg-electric text-black font-semibold rounded-xl hover:bg-electric-dim transition-colors glow-green-sm"
                        >
                          Next
                        </button>
                      </motion.div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    {/* Booking summary */}
                    <div className="glass-card p-4 mb-6">
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-10 h-10 rounded-lg bg-electric/10 flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-electric" />
                        </div>
                        <div>
                          <p className="font-medium text-white">
                            {selectedDate?.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                          </p>
                          <p className="text-gray-400">
                            {startHour !== null ? formatHour(startHour) : ''} — {endHour !== null ? formatHour(endHour) : ''} ({duration}h) &middot; ${totalCost.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-1.5">
                          <User className="w-4 h-4 text-gray-500" />
                          Name
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Your full name"
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-electric/40 focus:ring-1 focus:ring-electric/20 transition-colors"
                          required
                        />
                      </div>

                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-1.5">
                          <Mail className="w-4 h-4 text-gray-500" />
                          Email
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="your@email.com"
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-electric/40 focus:ring-1 focus:ring-electric/20 transition-colors"
                          required
                        />
                      </div>

                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-1.5">
                          <Phone className="w-4 h-4 text-gray-500" />
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="(555) 123-4567"
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-electric/40 focus:ring-1 focus:ring-electric/20 transition-colors"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3.5 bg-electric text-black font-semibold rounded-xl hover:bg-electric-dim transition-colors glow-green flex items-center justify-center gap-2 mt-6"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                        Confirm Booking
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
