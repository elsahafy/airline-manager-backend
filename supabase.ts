import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://klxiwfahaqwxwgmquipl.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtseGl3ZmFoYXF3eHdnbXF1aXBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4OTc0MDEsImV4cCI6MjA2MzQ3MzQwMX0.ye22o2HYX_8qtWTfUFU8RpUeb1S_vC8BoXZsJ-43wyI';

export const supabase = createClient(supabaseUrl, supabaseKey);
