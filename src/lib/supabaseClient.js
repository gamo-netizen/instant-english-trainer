import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    '環境変数 VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY が設定されていません。.env.example を参考に .env を作成してください。'
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);
