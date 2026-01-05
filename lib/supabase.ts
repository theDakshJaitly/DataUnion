// Supabase client configuration
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Export a function to create client instances
export const createClient = () => {
    return createSupabaseClient(supabaseUrl, supabaseAnonKey);
};

// Also export a default instance for convenience
export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey);
