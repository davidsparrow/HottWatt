import { Link } from 'react-router-dom';
import {
  ArrowLeft, Users, Zap, Shield, PartyPopper, Megaphone, MapPin,
  ClipboardList, CheckCircle, Lightbulb, MessageSquare, ChevronRight,
  Heart, Battery, Home, Building2,
} from 'lucide-react';
import FadeInView from '../components/FadeInView';

const startSteps = [
  {
    num: '01',
    icon: ClipboardList,
    title: 'Search Your City',
    desc: 'Check if any Charge Clubs already exist in your area. If they do, reach out for approval before starting a new one — we love collaboration over competition.',
  },
  {
    num: '02',
    icon: MapPin,
    title: 'Name & Register',
    desc: 'Pick a fun name for your club, fill out a quick form, and we\'ll set you up in under 48 hours. It\'s that easy — no paperwork, no fees.',
  },
  {
    num: '03',
    icon: Users,
    title: 'Invite Neighbors',
    desc: 'Spread the word in your neighborhood. Share your unique club link, post on NextDoor, put up a flyer — whatever works. Even 3-4 members is a great start.',
  },
  {
    num: '04',
    icon: Zap,
    title: 'Start Charging Together',
    desc: 'Members list their chargers, set availability, and the community benefits. Pool resources, share power, and watch your neighborhood go green.',
  },
];

const benefits = [
  {
    icon: Battery,
    title: 'Consistent Rentals',
    desc: 'Club members get priority access to each other\'s chargers. More bookings, more earnings, less downtime for your equipment.',
  },
  {
    icon: Shield,
    title: 'Neighborhood Resilience',
    desc: 'When the grid is strained, clubs coordinate charging schedules to balance load. Your neighborhood becomes smarter about energy use.',
  },
  {
    icon: Zap,
    title: 'Sharing Power, Not Just Cars',
    desc: 'Charge Clubs aren\'t just about EVs. Share portable batteries, coordinate solar panel surplus, and create a local energy micro-community.',
  },
  {
    icon: PartyPopper,
    title: 'Community & Parties',
    desc: 'Monthly meetups, block parties, EV show-and-tells. The best clubs build real friendships — and we help with event planning and swag.',
  },
  {
    icon: Heart,
    title: 'Environmental Impact',
    desc: 'Track your club\'s collective carbon offset, kWh shared, and gas miles saved. Compete with other clubs on the leaderboard.',
  },
  {
    icon: Home,
    title: 'Home Value Boost',
    desc: 'Neighborhoods with active Charge Clubs see higher property interest from EV-driving homebuyers. Your driveway is an asset.',
  },
  {
    icon: Building2,
    title: 'Apartment Partnerships',
    desc: 'Apartment complexes can partner with nearby homeowners for dedicated charging slots. Residents get guaranteed access, homeowners get steady income — everyone wins.',
  },
];

const tips = [
  {
    icon: Megaphone,
    title: 'Post on NextDoor',
    desc: 'The #1 proven way to find interested neighbors. Post in your neighborhood feed: "Anyone interested in a local EV charging co-op? We\'re starting a Charge Club!" Include a link to HottWatt. Expect 5-10 responses from a single post.',
    tag: 'Most Effective',
  },
  {
    icon: MessageSquare,
    title: 'Local Facebook Groups',
    desc: 'Search for "[Your City] EV Owners" or "[Your City] Neighbors" groups. Drop a friendly intro about what you\'re building — people love grassroots community projects.',
    tag: 'High Reach',
  },
  {
    icon: Lightbulb,
    title: 'Flyers at Charging Stations',
    desc: 'Print simple flyers and leave them at public charging stations, coffee shops, or community boards. Include a QR code linking to your club page. Low-tech but surprisingly effective.',
    tag: 'Offline Hack',
  },
  {
    icon: Users,
    title: 'HOA & Block Meetings',
    desc: 'Bring it up at your next HOA or block association meeting. Many HOAs are already discussing EV infrastructure — you\'re offering a solution that costs them nothing.',
    tag: 'Direct Access',
  },
  {
    icon: CheckCircle,
    title: 'Start Small, Grow Naturally',
    desc: 'You don\'t need 50 members on day one. Start with 3-4 neighbors, get a rhythm going, and word-of-mouth will do the rest. Quality over quantity.',
    tag: 'Pro Tip',
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-electric transition-colors mb-10"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Hero */}
        <FadeInView>
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-hotpink/30 bg-hotpink/5 mb-6">
              <Users className="w-3.5 h-3.5 text-hotpink" />
              <span className="text-xs font-medium text-hotpink">Charge Clubs</span>
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl font-bold leading-tight mb-5">
              Start a Charge Club in{' '}
              <span className="text-hotpink">Your Neighborhood</span>
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Charge Clubs turn neighbors into a powerful EV charging network. It's free to start, easy to run, and the benefits go way beyond electricity.
            </p>
          </div>
        </FadeInView>

        {/* Step-by-step: Starting a Club */}
        <section className="mb-24">
          <FadeInView>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-3 text-center">
              Starting a Club is <span className="text-electric">Super Easy</span>
            </h2>
            <p className="text-gray-400 text-center mb-12 max-w-xl mx-auto">
              Four steps. Five minutes. Zero cost.
            </p>
          </FadeInView>

          <div className="space-y-6">
            {startSteps.map((step, i) => (
              <FadeInView key={step.num} delay={i * 0.1}>
                <div className="glass-card p-6 sm:p-8 flex gap-5 sm:gap-8 items-start group hover:border-electric/20 transition-all duration-300">
                  <div className="flex-shrink-0">
                    <div className="text-3xl font-heading font-bold text-electric/20 mb-2">{step.num}</div>
                    <div className="w-12 h-12 rounded-xl bg-electric/10 flex items-center justify-center group-hover:bg-electric/20 transition-colors">
                      <step.icon className="w-6 h-6 text-electric" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-bold text-white mb-2">{step.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </FadeInView>
            ))}
          </div>
        </section>

        {/* Benefits */}
        <section className="mb-24">
          <FadeInView>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-3 text-center">
              Why Start a <span className="text-hotpink">Charge Club</span>?
            </h2>
            <p className="text-gray-400 text-center mb-12 max-w-xl mx-auto">
              It's more than charging — it's community, resilience, and fun.
            </p>
          </FadeInView>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {benefits.map((b, i) => (
              <FadeInView key={b.title} delay={i * 0.08}>
                <div className="glass-card glass-card-hover p-6 h-full transition-all duration-300 group">
                  <div className="w-10 h-10 rounded-lg bg-hotpink/10 flex items-center justify-center mb-4 group-hover:bg-hotpink/20 transition-colors">
                    <b.icon className="w-5 h-5 text-hotpink" />
                  </div>
                  <h3 className="font-heading font-semibold text-white mb-2">{b.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{b.desc}</p>
                </div>
              </FadeInView>
            ))}
          </div>
        </section>

        {/* Tips & Tricks */}
        <section className="mb-24">
          <FadeInView>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-3 text-center">
              Finding Your <span className="text-electric">Neighbors</span>
            </h2>
            <p className="text-gray-400 text-center mb-12 max-w-xl mx-auto">
              Proven tips and tricks from our most successful club founders.
            </p>
          </FadeInView>

          <div className="space-y-5">
            {tips.map((tip, i) => (
              <FadeInView key={tip.title} delay={i * 0.08}>
                <div className="glass-card p-6 flex gap-5 items-start group hover:border-electric/15 transition-all duration-300">
                  <div className="w-10 h-10 rounded-lg bg-electric/10 flex items-center justify-center flex-shrink-0 group-hover:bg-electric/20 transition-colors">
                    <tip.icon className="w-5 h-5 text-electric" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <h3 className="font-heading font-semibold text-white">{tip.title}</h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-electric/10 text-electric border border-electric/20">
                        {tip.tag}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed">{tip.desc}</p>
                  </div>
                </div>
              </FadeInView>
            ))}
          </div>
        </section>

        {/* CTA */}
        <FadeInView>
          <div className="glow-border rounded-2xl p-8 sm:p-12 text-center relative overflow-hidden" style={{ borderColor: 'rgba(196,35,72,0.3)', boxShadow: '0 0 20px rgba(196,35,72,0.15), inset 0 0 20px rgba(196,35,72,0.05)' }}>
            <div className="absolute inset-0 dot-pattern opacity-10" />
            <div className="relative">
              <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-4">
                Ready to <span className="text-hotpink">power up</span> your neighborhood?
              </h2>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                Starting a Charge Club takes 5 minutes and zero dollars. Your neighbors are waiting.
              </p>
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-hotpink text-white font-semibold rounded-xl hover:bg-hotpink-dim transition-all shadow-lg shadow-hotpink/25 text-base"
              >
                Get Started
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </FadeInView>
      </div>
    </div>
  );
}
