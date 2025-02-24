import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in environment variables');
  process.exit(1);
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  db: {
    schema: 'public'
  },
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Test the connection
supabase
  .from('book')
  .select('count', { count: 'exact', head: true })
  .then(({ error }) => {
    if (error) {
      console.error('Failed to connect to Supabase:', error);
      process.exit(1);
    }
    console.log('Successfully connected to Supabase');
  });

console.log('Supabase URL:', process.env.SUPABASE_URL); // Should show your URL
console.log('API Key:', process.env.API_KEY ? 'Set' : 'Missing'); // Should show "Set"