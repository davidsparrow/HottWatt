import { Link } from 'react-router-dom';
import { Zap, Github, Twitter, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Zap className="w-6 h-6 text-electric" />
              <span className="font-heading text-lg font-bold">
                Hott<span className="text-electric">Watt</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm max-w-sm leading-relaxed">
              The peer-to-peer marketplace for renting home EV chargers.
              Turn your driveway into the next charging station.
            </p>
            <div className="flex gap-4 mt-4">
              <a href="#" className="text-gray-500 hover:text-electric transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-electric transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-electric transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-heading font-semibold text-sm mb-4 text-white">Platform</h4>
            <ul className="space-y-2">
              {['Browse Chargers', 'List Your Charger', 'WattClub', 'Pricing'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-400 text-sm hover:text-electric transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-sm mb-4 text-white">Company</h4>
            <ul className="space-y-2">
              {['About', 'Blog', 'Careers', 'Support'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-400 text-sm hover:text-electric transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs">
            &copy; {new Date().getFullYear()} HottWatt. Demo application — not a real service.
          </p>
          <div className="flex gap-6 text-xs text-gray-500">
            <a href="#" className="hover:text-gray-300 transition-colors">Privacy</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Terms</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
