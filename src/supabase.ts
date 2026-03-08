import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://afudaevglgiigytiuhsc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmdWRhZXZnbGdpaWd5dGl1aHNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3NTY4MjksImV4cCI6MjA4ODMzMjgyOX0.TNtYmri7NpZkxmwqZsAmPOfm2v2g4CgXpLlnA3EKfIQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
