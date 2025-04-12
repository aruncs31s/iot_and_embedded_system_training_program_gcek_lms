import { createClient } from '@supabase/supabase-js';

// Use hardcoded values for now to ensure consistency
const supabaseUrl ='https://wwcsraxtwidjiqhhaqnz.supabase.co'
const supabaseAnonKey ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3Y3NyYXh0d2lkamlxaGhhcW56Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzOTA1NTgsImV4cCI6MjA1OTk2NjU1OH0.dIWpRCaUWUKceHAdo2yjGlTs33Z0AICeblk13O1bIQQ'

// console.log('Initializing Supabase client with:', { supabaseUrl, keyLength: supabaseAnonKey.length })

// Configure the Supabase client with session persistence options
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storageKey: 'lms-auth-token',
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

