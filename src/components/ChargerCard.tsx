import { Link } from 'react-router-dom';
import { Star, MapPin, Zap, Clock, CheckCircle } from 'lucide-react';
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
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <Link
        to={`/charger/${charger.id}`}
        className="block soft-card soft-card-hover p-6 group relative overflow-hidden"
      >
        {/* Hover Highlight */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-electric to-emerald-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

        {/* Host info */}
        <div className="flex items-center gap-4 mb-5">
          <img
            src={charger.host.avatar}
            alt={charger.host.name}
            className="w-12 h-12 rounded-2xl bg-slate-100 object-cover shadow-sm"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-base text-slate-900 truncate">{charger.host.name}</span>
              {charger.host.verified && (
                <div className="text-electric bg-electric/10 p-0.5 rounded-full">
                  <CheckCircle className="w-3 h-3 flex-shrink-0 stroke-[3]" />
                </div>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-sm text-slate-500">
              <div className="flex items-center">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span className="font-semibold text-slate-700 ml-1">{charger.host.rating}</span>
              </div>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500">{charger.host.reviewCount} reviews</span>
            </div>
          </div>
        </div>

        {/* Address — masked until booking */}
        <div className="flex items-start gap-3 mb-5">
          <div className="p-2 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-electric/10 group-hover:text-electric transition-colors">
            <MapPin className="w-5 h-5 flex-shrink-0" />
          </div>
          <div>
            <p className="text-base font-semibold text-slate-900 mb-0.5">{maskAddress(charger.address)}</p>
            <div className="flex items-center gap-2">
              <p className="text-sm text-slate-500">{charger.city} <span className="text-slate-300 px-1">•</span> {charger.distance}</p>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-6">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border ${connectorColors[charger.connectorType]}`}>
            {charger.connectorType}
          </span>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border ${levelColors[charger.level]}`}>
            <Zap className="w-3.5 h-3.5" />
            {charger.level}
          </span>
          <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
            {charger.powerKW} kW
          </span>
        </div>

        {/* Price & Availability */}
        <div className="flex items-center justify-between pt-5 border-t border-slate-100">
          <div>
            <div className="flex items-baseline">
              <span className="text-2xl font-heading font-extrabold text-slate-900 tracking-tight">${charger.pricePerKwh.toFixed(2)}</span>
              <span className="text-sm font-semibold text-slate-500 ml-1">/kWh</span>
            </div>
          </div>

          {charger.available ? (
            <div className="flex flex-col items-end">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Available
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-end">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-100">
                <Clock className="w-3.5 h-3.5" />
                Next: {charger.nextSlot}
              </span>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
