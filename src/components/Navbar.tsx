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
      <div className="navbar-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="relative">
                <Zap className="w-7 h-7 text-electric transition-transform group-hover:scale-110" />
                <div className="absolute inset-0 blur-md bg-electric/20 group-hover:bg-electric/35 transition-colors" />
              </div>
              <span className="font-heading text-xl font-bold tracking-tight text-gray-900">
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
                      : 'text-gray-600 hover:text-gray-900'
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
                className="px-5 py-2.5 bg-electric text-white font-semibold text-sm rounded-full hover:bg-electric-dim transition-colors glow-green-sm"
              >
                Find a Charger
              </Link>

              {user ? (
                <div className="flex items-center gap-3 ml-1">
                  <div className="flex items-center gap-2">
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="" className="w-8 h-8 rounded-full border border-gray-200" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-electric/10 border border-electric/20 flex items-center justify-center">
                        <User className="w-4 h-4 text-electric" />
                      </div>
                    )}
                    <span className="text-sm text-gray-700 max-w-24 truncate font-medium">
                      {profile?.full_name || user.email?.split('@')[0]}
                    </span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
                    title="Sign out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="px-5 py-2.5 border border-gray-300 text-gray-700 font-medium text-sm rounded-full hover:border-electric hover:text-electric transition-colors"
                >
                  Sign In
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600"
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
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white border-b border-gray-100 shadow-lg mx-2 rounded-b-2xl overflow-hidden"
          >
            <div className="px-4 py-5 space-y-2">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className={`block py-2.5 px-4 rounded-xl text-sm font-medium transition-colors ${
                    location.pathname === link.to
                      ? 'bg-electric/8 text-electric'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/browse"
                onClick={() => setMenuOpen(false)}
                className="block py-3 px-4 bg-electric text-white font-semibold text-sm rounded-full text-center glow-green-sm"
              >
                Find a Charger
              </Link>

              {user ? (
                <button
                  onClick={handleSignOut}
                  className="w-full py-2.5 px-4 text-left rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setMenuOpen(false)}
                  className="block py-2.5 px-4 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-gray-200 text-center"
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
