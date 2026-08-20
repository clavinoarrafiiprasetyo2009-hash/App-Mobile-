import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mleglrbuyewdamygwatw.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_bGqcn1mJyqNvDosFi_K5sg_jib9XqKv';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
