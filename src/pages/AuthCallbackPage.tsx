import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader2 } from 'lucide-react';

/**
 * Handles OAuth and Magic Link redirects.
 * Supabase sets the session from the URL hash automatically.
 */
export default function AuthCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/', { replace: true });
      } else {
        // Wait for auth state change (magic link may take a moment)
        const timeout = setTimeout(() => navigate('/auth', { replace: true }), 5000);
        return () => clearTimeout(timeout);
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 text-electric animate-spin mx-auto mb-4" />
        <p className="text-gray-400 text-sm">Completing sign-in...</p>
      </div>
    </div>
  );
}
