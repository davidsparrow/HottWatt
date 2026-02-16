import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { chargers } from '../data/chargers';
import ChargerCard from '../components/ChargerCard';
import type { ChargingLevel, ConnectorType } from '../data/types';

const dayOptions = [
  { value: -1, label: 'Any Day' },
  { value: 1, label: 'Mon' },
  { value: 2, label: 'Tue' },
  { value: 3, label: 'Wed' },
  { value: 4, label: 'Thu' },
  { value: 5, label: 'Fri' },
  { value: 6, label: 'Sat' },
  { value: 0, label: 'Sun' },
];

const timeOptions = [
  { value: -1, label: 'Any Time' },
  { value: 6, label: '6 AM' },
  { value: 8, label: '8 AM' },
  { value: 10, label: '10 AM' },
  { value: 12, label: '12 PM' },
  { value: 14, label: '2 PM' },
  { value: 16, label: '4 PM' },
  { value: 18, label: '6 PM' },
  { value: 20, label: '8 PM' },
];

const levels: { value: ChargingLevel | 'All'; label: string }[] = [
  { value: 'All', label: 'All Levels' },
  { value: 'Level 1', label: 'Level 1 (120V)' },
  { value: 'Level 2', label: 'Level 2 (240V)' },
  { value: 'Level 3', label: 'Level 3 (DC Fast)' },
];

const connectors: { value: ConnectorType | 'All'; label: string }[] = [
  { value: 'All', label: 'All' },
  { value: 'J1772', label: 'J1772' },
  { value: 'Tesla NACS', label: 'Tesla NACS' },
  { value: 'CCS', label: 'CCS' },
];

export default function BrowsePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<ChargingLevel | 'All'>('All');
  const [selectedConnector, setSelectedConnector] = useState<ConnectorType | 'All'>('All');
  const [availableOnly, setAvailableOnly] = useState(false);
  const [selectedDay, setSelectedDay] = useState(-1);
  const [selectedTime, setSelectedTime] = useState(-1);
  const [lastMileOnly, setLastMileOnly] = useState(false);

  const filtered = useMemo(() => {
    return chargers.filter((c) => {
      const matchSearch =
        !searchQuery ||
        c.host.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.model.toLowerCase().includes(searchQuery.toLowerCase());

      const matchLevel = selectedLevel === 'All' || c.level === selectedLevel;
      const matchConnector = selectedConnector === 'All' || c.connectorType === selectedConnector;
      const matchAvailable = !availableOnly || c.available;

      // Time slot filter
      let matchTimeSlot = true;
      if (selectedDay >= 0 || selectedTime >= 0) {
        matchTimeSlot = c.availability.some((slot) => {
          const dayMatch = selectedDay < 0 || slot.day === selectedDay;
          const timeMatch = selectedTime < 0 || slot.hours.includes(selectedTime);
          return dayMatch && timeMatch;
        });
      }

      const matchLastMile = !lastMileOnly || c.lastMile?.enabled;

      return matchSearch && matchLevel && matchConnector && matchAvailable && matchTimeSlot && matchLastMile;
    });
  }, [searchQuery, selectedLevel, selectedConnector, availableOnly, selectedDay, selectedTime, lastMileOnly]);

  return (
    <div className="min-h-screen pt-36 pb-24">
      <div className="container-breath">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center sm:text-left"
        >
          <h1 className="font-heading text-4xl sm:text-6xl font-extrabold mb-4 text-slate-900 tracking-tight leading-tight">
            Find Your <br className="sm:hidden" /><span className="text-electric">Charge</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-500 max-w-2xl leading-relaxed">
            Discover reliable chargers hosted by the community, available instantly.
          </p>
        </motion.div>

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="soft-card p-6 sm:p-8 mb-12"
        >
          {/* Search bar */}
          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
            <input
              type="text"
              placeholder="Search by location, host, or charger brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-base text-slate-900 placeholder-slate-400 focus:outline-none focus:border-electric focus:ring-4 focus:ring-electric/10 transition-all shadow-inner"
            />
          </div>

          {/* Filter chips */}
          <div className="flex flex-col gap-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <SlidersHorizontal className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Power Level</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {levels.map((level) => (
                    <button
                      key={level.value}
                      onClick={() => setSelectedLevel(level.value)}
                      className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border-2 ${selectedLevel === level.value
                        ? 'bg-electric/10 text-electric-dim border-electric/20 shadow-sm'
                        : 'bg-white text-slate-600 border-slate-100 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                    >
                      {level.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Connector Type</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {connectors.map((conn) => (
                    <button
                      key={conn.value}
                      onClick={() => setSelectedConnector(conn.value)}
                      className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border-2 ${selectedConnector === conn.value
                        ? 'bg-electric/10 text-electric-dim border-electric/20 shadow-sm'
                        : 'bg-white text-slate-600 border-slate-100 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                    >
                      {conn.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-slate-100">
              {/* Toggles */}
              <label className="flex items-center gap-3 cursor-pointer group p-2 -ml-2 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={availableOnly}
                    onChange={(e) => setAvailableOnly(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 rounded-full peer-checked:bg-electric transition-colors" />
                  <div className="absolute top-1 left-1 w-4 h-4 bg-white shadow-sm rounded-full peer-checked:translate-x-5 transition-all" />
                </div>
                <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">
                  Available Now
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group p-2 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={lastMileOnly}
                    onChange={(e) => setLastMileOnly(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 rounded-full peer-checked:bg-coral transition-colors" />
                  <div className="absolute top-1 left-1 w-4 h-4 bg-white shadow-sm rounded-full peer-checked:translate-x-5 transition-all" />
                </div>
                <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">
                  Last-Mile Ride
                </span>
              </label>
            </div>
          </div>

          {/* Time slot filters - Restored */}
          <div className="flex flex-col sm:flex-row gap-8 mt-8 pt-8 border-t border-slate-100">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Day</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {dayOptions.map((d) => (
                  <button
                    key={d.value}
                    onClick={() => setSelectedDay(d.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${selectedDay === d.value
                      ? 'bg-electric/10 text-electric-dim border-electric/20'
                      : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300'
                      }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Time Slot</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {timeOptions.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setSelectedTime(t.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${selectedTime === t.value
                      ? 'bg-electric/10 text-electric-dim border-electric/20'
                      : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300'
                      }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Results count */}
        <div className="mb-8 flex items-center justify-between">
          <div className="text-sm font-medium text-slate-500">
            Scanning area... found <span className="text-slate-900 font-bold">{filtered.length}</span> chargers
          </div>
        </div>

        {/* Charger Grid with increased gap */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
            {filtered.map((charger, i) => (
              <ChargerCard key={charger.id} charger={charger} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
            <div className="w-20 h-20 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center mx-auto mb-6">
              <Search className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="font-heading text-xl font-bold text-slate-900 mb-2">No chargers found</h3>
            <p className="text-slate-500">Try adjusting your filters or search term.</p>
          </div>
        )}
      </div>
    </div>
  );
}
