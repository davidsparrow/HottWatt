import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Zap, Menu, X, LogOut, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();

  const links = [
    { to: '/', label: 'Home' },
    { to: '/browse', label: 'Browse Chargers' },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="glass-card !rounded-none border-x-0 border-t-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="relative">
                <Zap className="w-7 h-7 text-electric transition-transform group-hover:scale-110" />
                <div className="absolute inset-0 blur-lg bg-electric/30 group-hover:bg-electric/50 transition-colors" />
              </div>
              <span className="font-heading text-xl font-bold tracking-tight">
                Hott<span className="text-electric">Watt</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-6">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-sm font-medium transition-colors relative ${
                    location.pathname === link.to
                      ? 'text-electric'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {link.label}
                  {location.pathname === link.to && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-electric rounded-full"
                    />
                  )}
                </Link>
              ))}

              <Link
                to="/browse"
                className="px-4 py-2 bg-electric text-black font-semibold text-sm rounded-lg hover:bg-electric-dim transition-colors glow-green-sm"
              >
                Find a Charger
              </Link>

              {user ? (
                <div className="flex items-center gap-3 ml-2">
                  <div className="flex items-center gap-2">
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="" className="w-7 h-7 rounded-full bg-dark-lighter" />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-electric/10 flex items-center justify-center">
                        <User className="w-3.5 h-3.5 text-electric" />
                      </div>
                    )}
                    <span className="text-sm text-gray-300 max-w-24 truncate">
                      {profile?.full_name || user.email?.split('@')[0]}
                    </span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-gray-500 hover:text-gray-300"
                    title="Sign out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="px-4 py-2 border border-white/15 text-white font-medium text-sm rounded-lg hover:bg-white/5 transition-colors"
                >
                  Sign In
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden glass-card !rounded-t-none !border-t-0 mx-2"
          >
            <div className="px-4 py-4 space-y-3">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className={`block py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === link.to
                      ? 'bg-electric/10 text-electric'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/browse"
                onClick={() => setMenuOpen(false)}
                className="block py-2 px-3 bg-electric text-black font-semibold text-sm rounded-lg text-center glow-green-sm"
              >
                Find a Charger
              </Link>

              {user ? (
                <button
                  onClick={handleSignOut}
                  className="w-full py-2 px-3 text-left rounded-lg text-sm font-medium text-gray-300 hover:bg-white/5 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setMenuOpen(false)}
                  className="block py-2 px-3 rounded-lg text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white border border-white/10 text-center"
                >
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
