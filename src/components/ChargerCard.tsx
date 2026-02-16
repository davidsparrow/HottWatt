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
  'Level 2': 'bg-electric/10 text-electric-dim border-electric/20',
  'Level 3': 'bg-hotpink/10 text-hotpink-dim border-hotpink/20',
};

const connectorColors: Record<string, string> = {
  'J1772': 'bg-blue-50 text-blue-600 border-blue-100',
  'Tesla NACS': 'bg-coral/10 text-coral-dim border-coral/20',
  'CCS': 'bg-purple-50 text-purple-600 border-purple-100',
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
        className="block bg-surface border border-surface-border rounded-xl shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-300 group"
      >
        {/* Host info */}
        <div className="flex items-center gap-3 mb-4">
          <img
            src={charger.host.avatar}
            alt={charger.host.name}
            className="w-10 h-10 rounded-full bg-gray-200 object-cover"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-medium text-sm text-text-primary truncate">{charger.host.name}</span>
              {charger.host.verified && (
                <CheckCircle className="w-3.5 h-3.5 text-electric flex-shrink-0" />
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-text-secondary">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              <span>{charger.host.rating}</span>
              <span className="text-gray-400">({charger.host.reviewCount})</span>
            </div>
          </div>
        </div>

        {/* Address — masked until booking */}
        <div className="flex items-start gap-2 mb-3">
          <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-text-primary font-medium">{maskAddress(charger.address)}</p>
            <div className="flex items-center gap-1.5">
              <p className="text-xs text-text-secondary">{charger.city} &middot; {charger.distance}</p>
              <span className="inline-flex items-center gap-0.5 text-[9px] text-gray-400">
                <Lock className="w-2.5 h-2.5" />book to see
              </span>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border ${connectorColors[charger.connectorType]}`}>
            {charger.connectorType}
          </span>
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border ${levelColors[charger.level]}`}>
            <Zap className="w-3 h-3" />
            {charger.level}
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-50 text-text-secondary border border-gray-100">
            {charger.powerKW} kW
          </span>
          {charger.lastMile?.enabled && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-coral/10 text-coral-dim border border-coral/20">
              <Car className="w-3 h-3" />
              Last-Mile
            </span>
          )}
        </div>

        {/* Price & Availability */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div>
            <span className="text-lg font-heading font-bold text-text-primary">${charger.pricePerKwh.toFixed(2)}</span>
            <span className="text-xs text-text-secondary ml-1">/kWh</span>
          </div>
          {charger.available ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-electric/10 text-electric-dim border border-electric/20">
              <span className="w-1.5 h-1.5 rounded-full bg-electric animate-pulse" />
              Available
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-600 border border-amber-200">
              <Clock className="w-3 h-3" />
              Next: {charger.nextSlot}
            </span>
          )}
        </div>

        {/* Amenity tags */}
        <div className="flex flex-wrap gap-1 mt-3">
          {charger.amenities.slice(0, 3).map((amenity) => (
            <span
              key={amenity}
              className="px-2 py-0.5 rounded text-[10px] font-medium bg-gray-50 text-gray-500 border border-gray-100"
            >
              {amenity}
            </span>
          ))}
        </div>
      </Link>
    </motion.div>
  );
}
