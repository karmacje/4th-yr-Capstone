import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://buxqnoxjcvtmgtamtdjh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1eHFub3hqY3Z0bWd0YW10ZGpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwMDEyNzQsImV4cCI6MjA2NjU3NzI3NH0.z3wzG-AAXqoRULja576QLl2FWI6dcgYIN_g2g4FcCF4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});