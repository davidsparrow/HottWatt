import { createClient } from '@supabase/supabase-js';

// Admin client with service_role key — bypasses RLS
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);
