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
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="font-heading text-3xl sm:text-4xl font-bold mb-2">
            Browse <span className="text-electric">Chargers</span>
          </h1>
          <p className="text-gray-400">Find the perfect charger near you</p>
        </motion.div>

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-card p-4 sm:p-6 mb-8"
        >
          {/* Search bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search by location, host, or charger brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-electric/40 focus:ring-1 focus:ring-electric/20 transition-colors"
            />
          </div>

          {/* Filter chips */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <SlidersHorizontal className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Level</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {levels.map((level) => (
                  <button
                    key={level.value}
                    onClick={() => setSelectedLevel(level.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                      selectedLevel === level.value
                        ? 'bg-electric/15 text-electric border-electric/30'
                        : 'bg-white/3 text-gray-400 border-white/8 hover:bg-white/5 hover:text-gray-300'
                    }`}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Connector</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {connectors.map((conn) => (
                  <button
                    key={conn.value}
                    onClick={() => setSelectedConnector(conn.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                      selectedConnector === conn.value
                        ? 'bg-electric/15 text-electric border-electric/30'
                        : 'bg-white/3 text-gray-400 border-white/8 hover:bg-white/5 hover:text-gray-300'
                    }`}
                  >
                    {conn.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={availableOnly}
                    onChange={(e) => setAvailableOnly(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-white/10 rounded-full peer-checked:bg-electric/30 transition-colors" />
                  <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-gray-400 rounded-full peer-checked:translate-x-4 peer-checked:bg-electric transition-all" />
                </div>
                <span className="text-xs font-medium text-gray-400 group-hover:text-gray-300 transition-colors whitespace-nowrap">
                  Available Now
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer group ml-4">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={lastMileOnly}
                    onChange={(e) => setLastMileOnly(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-white/10 rounded-full peer-checked:bg-coral/30 transition-colors" />
                  <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-gray-400 rounded-full peer-checked:translate-x-4 peer-checked:bg-coral transition-all" />
                </div>
                <span className="text-xs font-medium text-gray-400 group-hover:text-gray-300 transition-colors whitespace-nowrap">
                  Last-Mile Ride
                </span>
              </label>
            </div>
          </div>

          {/* Time slot filters */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4 pt-4 border-t border-white/5">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Day</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {dayOptions.map((d) => (
                  <button
                    key={d.value}
                    onClick={() => setSelectedDay(d.value)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                      selectedDay === d.value
                        ? 'bg-electric/15 text-electric border-electric/30'
                        : 'bg-white/3 text-gray-400 border-white/8 hover:bg-white/5 hover:text-gray-300'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Time Slot</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {timeOptions.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setSelectedTime(t.value)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                      selectedTime === t.value
                        ? 'bg-electric/15 text-electric border-electric/30'
                        : 'bg-white/3 text-gray-400 border-white/8 hover:bg-white/5 hover:text-gray-300'
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
        <div className="mb-6 text-sm text-gray-500">
          {filtered.length} charger{filtered.length !== 1 ? 's' : ''} found
        </div>

        {/* Charger Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((charger, i) => (
              <ChargerCard key={charger.id} charger={charger} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
              <Search className="w-7 h-7 text-gray-600" />
            </div>
            <h3 className="font-heading text-lg font-semibold text-gray-400 mb-2">No chargers found</h3>
            <p className="text-sm text-gray-600">Try adjusting your filters or search term.</p>
          </div>
        )}
      </div>
    </div>
  );
}
