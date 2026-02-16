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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-surface-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-electric text-white">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <span className="font-heading text-lg font-bold tracking-tight text-text-primary">
              Hott<span className="text-electric">Watt</span>
            </span>
          </Link>

          {/* Desktop Nav - Centered Links */}
          <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors ${location.pathname === link.to
                    ? 'text-electric'
                    : 'text-text-secondary hover:text-text-primary'
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/browse"
              className="text-sm font-medium text-text-secondary hover:text-text-primary hidden lg:block"
            >
              Search
            </Link>

            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-2 py-1 rounded-full border border-surface-border bg-surface-hover">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="" className="w-6 h-6 rounded-full" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="w-3.5 h-3.5 text-gray-500" />
                    </div>
                  )}
                  <span className="text-xs font-medium text-text-primary max-w-[100px] truncate pr-1">
                    {profile?.full_name || user.email?.split('@')[0]}
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="p-2 rounded-full hover:bg-gray-100 text-text-secondary transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/auth"
                  className="text-sm font-medium text-text-secondary hover:text-text-primary"
                >
                  Log in
                </Link>
                <Link
                  to="/auth?mode=signup"
                  className="px-4 py-2 bg-electric text-white font-semibold text-sm rounded-full hover:bg-electric-dim transition-colors shadow-sm"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg text-text-primary hover:bg-surface-hover transition-colors"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
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
            className="md:hidden bg-background border-b border-surface-border shadow-lg"
          >
            <div className="px-4 py-6 space-y-4">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className={`block text-lg font-medium transition-colors ${location.pathname === link.to
                      ? 'text-electric'
                      : 'text-text-secondary hover:text-text-primary'
                    }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/browse"
                onClick={() => setMenuOpen(false)}
                className="block w-full py-3 px-4 bg-electric text-white font-bold text-center rounded-xl hover:bg-electric-dim transition-colors shadow-sm"
              >
                Find a Charger
              </Link>

              {user ? (
                <button
                  onClick={handleSignOut}
                  className="w-full py-3 px-4 text-left rounded-xl font-medium text-red-500 hover:bg-red-50 flex items-center gap-2 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <Link
                    to="/auth"
                    onClick={() => setMenuOpen(false)}
                    className="block py-3 px-4 rounded-xl font-medium text-text-primary hover:bg-surface-hover text-center border border-surface-border transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/auth?mode=signup"
                    onClick={() => setMenuOpen(false)}
                    className="block py-3 px-4 rounded-xl font-medium bg-gray-900 text-white hover:bg-gray-800 text-center transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
