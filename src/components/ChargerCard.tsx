import { Link } from 'react-router-dom';
import { Star, MapPin, Zap, Clock, CheckCircle, Lock, Car } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Charger } from '../data/types';

/** Mask street number for pre-booking privacy */
function maskAddress(address: string): string {
  return address.replace(/^\d+\s*/, '*** ');
}

interface ChargerCardProps {
  charger: Charger;
  index: number;
}

const levelColors: Record<string, string> = {
  'Level 1': 'bg-gray-100 text-gray-600 border-gray-200',
  'Level 2': 'bg-electric/8 text-electric border-electric/25',
  'Level 3': 'bg-hotpink/8 text-hotpink border-hotpink/25',
};

const connectorColors: Record<string, string> = {
  'J1772': 'bg-blue-50 text-blue-600 border-blue-200',
  'Tesla NACS': 'bg-coral/8 text-coral border-coral/25',
  'CCS': 'bg-purple-50 text-purple-600 border-purple-200',
};

export default function ChargerCard({ charger, index }: ChargerCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <Link
        to={`/charger/${charger.id}`}
        className="block page-card page-card-hover p-6 transition-all duration-300 group"
      >
        {/* Host info */}
        <div className="flex items-center gap-3 mb-5">
          <img
            src={charger.host.avatar}
            alt={charger.host.name}
            className="w-11 h-11 rounded-full border border-gray-100 shadow-sm"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-sm text-gray-900 truncate">{charger.host.name}</span>
              {charger.host.verified && (
                <CheckCircle className="w-4 h-4 text-electric flex-shrink-0" />
              )}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
              <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              <span className="font-medium text-gray-700">{charger.host.rating}</span>
              <span className="text-gray-400">({charger.host.reviewCount} reviews)</span>
            </div>
          </div>
        </div>

        {/* Address — masked until booking */}
        <div className="flex items-start gap-2.5 mb-4">
          <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-gray-800">{maskAddress(charger.address)}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-xs text-gray-500">{charger.city} &middot; {charger.distance}</p>
              <span className="inline-flex items-center gap-1 text-[10px] text-gray-400">
                <Lock className="w-2.5 h-2.5" />exact address after booking
              </span>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-5">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${connectorColors[charger.connectorType] ?? 'bg-gray-100 text-gray-600 border-gray-200'}`}>
            {charger.connectorType}
          </span>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${levelColors[charger.level] ?? 'bg-gray-100 text-gray-600 border-gray-200'}`}>
            <Zap className="w-3 h-3" />
            {charger.level}
          </span>
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">
            {charger.powerKW} kW
          </span>
          {charger.lastMile?.enabled && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-coral/8 text-coral border border-coral/25">
              <Car className="w-3 h-3" />
              Last-Mile
            </span>
          )}
        </div>

        {/* Price & Availability */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <span className="text-xl font-heading font-bold text-gray-900">${charger.pricePerKwh.toFixed(2)}</span>
            <span className="text-xs text-gray-500 ml-1">/kWh</span>
          </div>
          {charger.available ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-electric/8 text-electric border border-electric/25">
              <span className="w-1.5 h-1.5 rounded-full bg-electric animate-pulse" />
              Available
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-200">
              <Clock className="w-3 h-3" />
              Next: {charger.nextSlot}
            </span>
          )}
        </div>

        {/* Amenity tags */}
        <div className="flex flex-wrap gap-2 mt-4">
          {charger.amenities.slice(0, 3).map((amenity) => (
            <span
              key={amenity}
              className="px-3 py-1 rounded-full text-[11px] font-medium bg-gray-50 text-gray-500 border border-gray-150"
            >
              {amenity}
            </span>
          ))}
        </div>
      </Link>
    </motion.div>
  );
}
