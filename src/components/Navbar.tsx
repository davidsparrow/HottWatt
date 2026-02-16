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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 transition-all duration-300">
      <div className="container-breath">
        <div className="flex items-center justify-between h-20"> {/* Increased height for airiness */}
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group relative z-10">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-electric text-white shadow-lg shadow-electric/20 group-hover:scale-105 transition-transform">
              <Zap className="w-6 h-6 fill-current" />
            </div>
            <span className="font-heading text-xl font-bold tracking-tight text-slate-900">
              Hott<span className="text-electric">Watt</span>
            </span>
          </Link>

          {/* Desktop Nav - Centered Links */}
          <div className="hidden md:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
            {[
              { name: 'Browse', path: '/browse' },
              { name: 'Host', path: '/host' },
              { name: 'Community', path: '/community' },
            ].map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="relative text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors py-2"
              >
                {link.name}
                {location.pathname === link.path && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-electric rounded-full"
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center gap-4 relative z-10">
            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  to="/dashboard"
                  className="px-5 py-2.5 rounded-full bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition-colors"
                >
                  Dashboard
                </Link>
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-electric to-emerald-300 p-0.5 cursor-pointer">
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                    alt="Avatar"
                    className="w-full h-full rounded-full bg-white object-cover"
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsAuthOpen(true)}
                  className="text-sm font-semibold text-slate-600 hover:text-slate-900 px-2"
                >
                  Log in
                </button>
                <button
                  onClick={() => setIsAuthOpen(true)}
                  className="px-6 py-2.5 rounded-full bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 hover:shadow-xl"
                >
                  Sign up
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-100 overflow-hidden"
          >
            <div className="container-breath py-6 space-y-4">
              {[
                { name: 'Browse Chargers', path: '/browse' },
                { name: 'Become a Host', path: '/host' },
                { name: 'Community', path: '/community' },
              ].map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-3 rounded-xl bg-slate-50 text-slate-900 font-semibold hover:bg-slate-100"
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-slate-100">
                {user ? (
                  <Link
                    to="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50"
                  >
                    <div className="w-8 h-8 rounded-full bg-slate-200">
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                        alt="Avatar"
                        className="w-full h-full rounded-full"
                      />
                    </div>
                    <span className="font-medium">My Dashboard</span>
                  </Link>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        setIsAuthOpen(true);
                      }}
                      className="px-4 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold text-center"
                    >
                      Log in
                    </button>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        setIsAuthOpen(true);
                      }}
                      className="px-4 py-3 rounded-xl bg-electric text-white font-semibold shadow-lg shadow-electric/20 text-center"
                    >
                      Sign up
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
