import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';

type AuthMode = 'signin' | 'signup' | 'magic';

export default function AuthPage() {
  const { user, signIn, signUp, signInWithMagicLink, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [magicSent, setMagicSent] = useState(false);

  // If already logged in, redirect
  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let result: { error: string | null };

    if (mode === 'magic') {
      result = await signInWithMagicLink(email);
      if (!result.error) {
        setMagicSent(true);
        toast.success('Magic link sent! Check your email.', {
          style: { background: '#1a1a24', color: '#e5e7eb', border: '1px solid rgba(34,197,94,0.3)' },
          iconTheme: { primary: '#22c55e', secondary: '#1a1a24' },
        });
      }
    } else if (mode === 'signup') {
      result = await signUp(email, password, fullName);
      if (!result.error) {
        toast.success('Account created! Check your email to confirm.', {
          style: { background: '#1a1a24', color: '#e5e7eb', border: '1px solid rgba(34,197,94,0.3)' },
          iconTheme: { primary: '#22c55e', secondary: '#1a1a24' },
        });
      }
    } else {
      result = await signIn(email, password);
      if (!result.error) {
        navigate('/');
      }
    }

    if (result.error) {
      toast.error(result.error, {
        style: { background: '#1a1a24', color: '#e5e7eb', border: '1px solid rgba(196,35,72,0.3)' },
      });
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    setLoading(true);
    const { error } = await signInWithGoogle();
    if (error) {
      toast.error(error, {
        style: { background: '#1a1a24', color: '#e5e7eb', border: '1px solid rgba(196,35,72,0.3)' },
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
      <div className="absolute inset-0 gradient-hero" />
      <div className="absolute inset-0 dot-pattern opacity-30" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md mx-4"
      >
        <div className="glass-card p-8">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="relative">
              <Zap className="w-8 h-8 text-electric" />
              <div className="absolute inset-0 blur-lg bg-electric/30" />
            </div>
            <span className="font-heading text-2xl font-bold">
              Hott<span className="text-electric">Watt</span>
            </span>
          </div>

          {/* Tab switcher */}
          <div className="flex gap-1 p-1 mb-6 bg-white/5 rounded-xl">
            {(['signin', 'signup', 'magic'] as AuthMode[]).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setMagicSent(false); }}
                className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                  mode === m
                    ? 'bg-electric/15 text-electric'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {m === 'signin' ? 'Sign In' : m === 'signup' ? 'Sign Up' : 'Magic Link'}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {magicSent && mode === 'magic' ? (
              <motion.div
                key="magic-sent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-8"
              >
                <div className="w-14 h-14 rounded-full bg-electric/10 flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-7 h-7 text-electric" />
                </div>
                <h3 className="font-heading text-lg font-bold text-white mb-2">Check Your Email</h3>
                <p className="text-sm text-gray-400 mb-4">
                  We sent a magic link to <span className="text-white">{email}</span>
                </p>
                <button
                  onClick={() => setMagicSent(false)}
                  className="text-sm text-electric hover:underline"
                >
                  Try a different email
                </button>
              </motion.div>
            ) : (
              <motion.form
                key={mode}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                {mode === 'signup' && (
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-1.5">
                      <User className="w-4 h-4 text-gray-500" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your name"
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-electric/40 focus:ring-1 focus:ring-electric/20 transition-colors"
                    />
                  </div>
                )}

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-1.5">
                    <Mail className="w-4 h-4 text-gray-500" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-electric/40 focus:ring-1 focus:ring-electric/20 transition-colors"
                  />
                </div>

                {mode !== 'magic' && (
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-1.5">
                      <Lock className="w-4 h-4 text-gray-500" />
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      minLength={6}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-electric/40 focus:ring-1 focus:ring-electric/20 transition-colors"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-electric text-black font-semibold rounded-xl hover:bg-electric-dim transition-all glow-green-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      {mode === 'signin' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Magic Link'}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-gray-600">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Google OAuth */}
          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full py-3 border border-white/10 rounded-xl text-sm font-medium text-gray-300 hover:bg-white/5 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          {/* Demo note */}
          <p className="text-[10px] text-gray-600 text-center mt-6">
            Free plan auto-applied on sign up. Upgrade to Pro anytime.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
