import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Zap, Search, Calendar, CreditCard, Shield, Users, Crown,
  ChevronRight, MapPin, Clock, Star, ArrowRight,
} from 'lucide-react';
import FadeInView from '../components/FadeInView';

const stats = [
  { value: '33,600+', label: 'Chargers Listed' },
  { value: '129,000+', label: 'Drivers Served' },
  { value: '$2.4M', label: 'Host Earnings' },
  { value: '4.9★', label: 'Average Rating' },
];

const features = [
  { icon: Zap, title: 'Fast Listing', desc: 'List your charger in under 2 minutes and start earning immediately.' },
  { icon: Search, title: 'Nearby Search', desc: 'Find available chargers near you with real-time availability status.' },
  { icon: Calendar, title: 'Smart Scheduling', desc: 'Set your availability and let drivers book around your schedule.' },
  { icon: CreditCard, title: 'Auto Payments', desc: 'Secure, automatic payments after every charging session.' },
  { icon: Shield, title: 'Built-in Trust', desc: 'Verified hosts, driver reviews, and $50K damage protection.' },
  { icon: Users, title: 'Neighbourhood Networks', desc: 'Join local charging communities and help your neighbours go electric.' },
  { icon: Crown, title: 'WattClub', desc: 'Premium membership with 15% savings, priority booking, and exclusive perks.' },
];

const steps = [
  { num: '01', title: 'Find a Charger', desc: 'Browse nearby home chargers, filter by connector type, speed, and price.', icon: MapPin },
  { num: '02', title: 'Book a Slot', desc: 'Pick a time that works, review the cost breakdown, and confirm your booking.', icon: Clock },
  { num: '03', title: 'Charge & Go', desc: 'Plug in at the host\'s location, charge up, and pay automatically.', icon: Zap },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0 dot-pattern opacity-40" />
        <div className="absolute top-1/4 -right-32 w-96 h-96 bg-electric/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -left-32 w-80 h-80 bg-hotpink/10 rounded-full blur-[100px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 sm:py-40">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-electric/30 bg-electric/5 mb-6">
                <Zap className="w-3.5 h-3.5 text-electric" />
                <span className="text-xs font-medium text-electric">Peer-to-peer EV charging</span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6"
            >
              Your driveway is the next{' '}
              <span className="text-electric relative">
                charging station
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                  <path d="M2 10C50 4 150 2 298 6" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
                </svg>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-gray-400 mb-10 max-w-2xl leading-relaxed"
            >
              Rent your home EV charger to drivers in your neighbourhood, or find one nearby when you need a charge. Affordable, convenient, community-powered.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                to="/browse"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-electric text-black font-semibold rounded-xl hover:bg-electric-dim transition-all glow-green text-base"
              >
                Rent a Charger
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                to="/browse"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-white/15 text-white font-semibold rounded-xl hover:bg-white/5 transition-all text-base"
              >
                List Your Charger
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="relative -mt-12 z-10">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card p-6 sm:p-8"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="font-heading text-2xl sm:text-3xl font-bold text-electric mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 sm:py-32 relative">
        <div className="absolute inset-0 dot-pattern opacity-20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInView className="text-center mb-16">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">
              Everything you need to{' '}
              <span className="text-electric">charge smarter</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              From listing to payment, we handle it all so you can focus on what matters.
            </p>
          </FadeInView>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {features.map((feat, i) => (
              <FadeInView key={feat.title} delay={i * 0.08}>
                <div className="glass-card glass-card-hover p-6 h-full transition-all duration-300 group">
                  <div className="w-10 h-10 rounded-lg bg-electric/10 flex items-center justify-center mb-4 group-hover:bg-electric/20 transition-colors">
                    <feat.icon className="w-5 h-5 text-electric" />
                  </div>
                  <h3 className="font-heading font-semibold text-white mb-2">{feat.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{feat.desc}</p>
                </div>
              </FadeInView>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 sm:py-32 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-electric/5 rounded-full blur-[150px]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInView className="text-center mb-16">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">
              How it <span className="text-electric">works</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Three simple steps to start charging — or earning.
            </p>
          </FadeInView>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <FadeInView key={step.num} delay={i * 0.15}>
                <div className="relative glass-card p-8 text-center group hover:border-electric/20 transition-all duration-300">
                  <div className="text-5xl font-heading font-bold text-electric/10 mb-4">{step.num}</div>
                  <div className="w-14 h-14 rounded-full bg-electric/10 flex items-center justify-center mx-auto mb-5 group-hover:bg-electric/20 transition-colors">
                    <step.icon className="w-6 h-6 text-electric" />
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-white mb-3">{step.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                  {i < steps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 text-electric/30">
                      <ChevronRight className="w-8 h-8" />
                    </div>
                  )}
                </div>
              </FadeInView>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 sm:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInView>
            <div className="glow-border rounded-2xl p-8 sm:p-12 text-center relative overflow-hidden">
              <div className="absolute inset-0 dot-pattern opacity-10" />
              <div className="relative">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-electric/10 flex items-center justify-center">
                    <Star className="w-8 h-8 text-electric" />
                  </div>
                </div>
                <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">
                  Ready to join the <span className="text-electric">revolution</span>?
                </h2>
                <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
                  Whether you drive an EV or own a charger, HottWatt connects you with your community.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/browse"
                    className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-electric text-black font-semibold rounded-xl hover:bg-electric-dim transition-all glow-green text-base"
                  >
                    Get Started
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </FadeInView>
        </div>
      </section>
    </div>
  );
}
