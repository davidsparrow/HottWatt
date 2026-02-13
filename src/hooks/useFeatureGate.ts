/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

/**
 * Hook to check if the current user has access to a gated feature.
 * Calls the Supabase `user_has_feature()` DB function.
 */

export function useFeatureGate(featureKey: string): {
  hasFeature: boolean;
  loading: boolean;
} {
  const { user } = useAuth();
  const [hasFeature, setHasFeature] = useState(false);
  const [loading, setLoading] = useState(true);

  const check = useCallback(async (userId: string, key: string) => {
    setLoading(true);
    const { data, error } = await supabase.rpc('user_has_feature', {
      p_user_id: userId,
      p_feature_key: key,
    });
    setHasFeature(!error && data === true);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!user) {
      setHasFeature(false);
      setLoading(false);
      return;
    }
    check(user.id, featureKey);
  }, [user, featureKey, check]);

  return { hasFeature, loading };
}

/** Imperative (non-hook) check */
export async function checkFeature(userId: string, featureKey: string): Promise<boolean> {
  const { data, error } = await supabase.rpc('user_has_feature', {
    p_user_id: userId,
    p_feature_key: featureKey,
  });
  return !error && data === true;
}
