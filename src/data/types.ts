export type ConnectorType = 'J1772' | 'Tesla NACS' | 'CCS';
export type ChargingLevel = 'Level 1' | 'Level 2' | 'Level 3';

export interface Host {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
}

export interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
}

export interface AvailabilitySlot {
  day: number; // 0=Sunday, 1=Monday, ... 6=Saturday
  hours: number[]; // available hours, e.g. [8,9,10,11,12,13,14,15,16]
}

export interface ChargerTypeBreakdown {
  label: string;
  percent: number;
  color: string;
}

export interface ChargeClub {
  id: string;
  name: string;
  neighborhood: string;
  city: string;
  x: number; // percentage position on map
  y: number; // percentage position on map
  totalMembers: number;
  totalChargeCapacityKW: number;
  totalWattsReceived: string;
  chargerTypes: ChargerTypeBreakdown[];
  foundedDate: string;
  acceptingMembers: boolean;
}

export type LastMilePricing = 'free' | 'flat' | 'per_mile' | 'per_minute';

export interface LastMileService {
  enabled: boolean;
  pricingType: LastMilePricing;
  price: number;        // flat $, $/mile, or $/min (0 when free)
  twoWay: boolean;      // round trip available
  notes?: string;
}

export interface Charger {
  id: string;
  host: Host;
  brand: string;
  model: string;
  address: string;
  city: string;
  distance: string;
  connectorType: ConnectorType;
  level: ChargingLevel;
  powerKW: number;
  pricePerKwh: number;
  accessFee: number;
  available: boolean;
  nextSlot?: string;
  amenities: string[];
  extras: string[];
  description: string;
  reviews: Review[];
  availability: AvailabilitySlot[];
  imageUrl: string;
  lastMile?: LastMileService;
}
