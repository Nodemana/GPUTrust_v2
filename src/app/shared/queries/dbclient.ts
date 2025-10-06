import { createClient } from '@supabase/supabase-js';
import { Database } from '@/app/shared/types/database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export async function testConnection() {
  try {
    const { data, error } = await supabase.from('gpu_benchmark_runtime').select('*').limit(1);
    if (error) throw error;
    console.log('✅ Supabase connection successful');
    return { success: true, data };
  } catch (error) {
    console.error('❌ Supabase connection failed:', error);
    return { success: false, error };
  }
}