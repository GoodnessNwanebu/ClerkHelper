import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create a single supabase client for interacting with your database
export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

// Server-side client with service role for admin operations
export const createServerSupabaseClient = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!serviceRoleKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');
  }

  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

// Helper functions for common operations
export const supabaseHelpers = {
  // Cache a generated template
  async cacheTemplate(template: Database['public']['Tables']['history_templates']['Insert']) {
    const { data, error } = await supabase
      .from('history_templates')
      .insert([template])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get cached template by diagnosis name
  async getCachedTemplate(diagnosisName: string) {
    const { data, error } = await supabase
      .from('history_templates')
      .select('*')
      .eq('diagnosis_name', diagnosisName)
      .eq('cached', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
    return data;
  },

  // Update template access statistics
  async updateTemplateStats(templateId: string) {
    const { error } = await supabase.rpc('increment_template_access', {
      template_id: templateId,
    });

    if (error) console.error('Failed to update template stats:', error);
  },

  // Get recent searches for suggestions
  async getRecentSearches(limit = 10) {
    const { data, error } = await supabase
      .from('history_templates')
      .select('diagnosis_name')
      .eq('cached', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data?.map((item) => item.diagnosis_name) || [];
  },

  // Search for similar diagnoses
  async searchDiagnoses(query: string, limit = 5) {
    const { data, error } = await supabase
      .from('diagnoses')
      .select('*')
      .or(`name.ilike.%${query}%,synonyms.cs.{${query}}`)
      .limit(limit);

    if (error) throw error;
    return data || [];
  },
}; 