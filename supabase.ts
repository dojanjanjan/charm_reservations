import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://vvywdpymtswmsadpqvzw.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2eXdkcHltdHN3bXNhZHBxdnp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4NjU2ODUsImV4cCI6MjA4MTQ0MTY4NX0.qoV8xTFqJ3P-eyqxTCpgxaDVUQ7TEgxg8w1lx-IwnTk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

