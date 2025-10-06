import { createClient } from '@supabase/supabase-js';
import { Database } from '@/app/shared/types/database.types';
import { config } from 'dotenv';
import path from 'path';

// Load .env from project root
config({ path: path.resolve(process.cwd(), '.env') });

/**
 * Service role client that bypasses RLS
 * This is the recommended approach for development data population
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.warn('⚠️  SUPABASE_SERVICE_ROLE_KEY not found. Service role operations will not work.');
}

// Create service role client that bypasses RLS
export const supabaseAdmin = supabaseServiceKey 
  ? createClient<Database>(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

/**
 * Generate realistic user data that works with your schema
 */
function generateUserData(index: number = 0) {
  const users = [
    { username: "crypto_miner_99", email: "miner99@example.com", phone: 5550001 },
    { username: "gpu_collector", email: "collector@example.com", phone: 5550002 },
    { username: "ai_researcher", email: "research@example.com", phone: 5550003 },
    { username: "gaming_enthusiast", email: "gamer@example.com", phone: 5550004 },
    { username: "blockchain_dev", email: "dev@example.com", phone: 5550005 }
  ];

  const user = users[index % users.length];
  
  // Generate a UUID for the user ID (simulating auth.users.id)
  const userId = crypto.randomUUID();
  
  return {
    id: userId,
    email: user.email,
    username: user.username,
    phone_number: user.phone
  };
}

/**
 * Insert users using service role (bypasses RLS)
 * This now creates auth users first, then public users
 */
export async function insertUsersWithServiceRole(count: number = 5): Promise<{
  success: boolean;
  data?: any[];
  error?: any;
}> {
  if (!supabaseAdmin) {
    return { 
      success: false, 
      error: 'Service role key not available. Please set SUPABASE_SERVICE_ROLE_KEY in your .env file.' 
    };
  }

  try {
    // Import auth user creation functions
    const { createAuthUsers } = await import('./auth-user-creation');
    
    // Create auth users first (this also creates public users)
    const authResult = await createAuthUsers(count);
    
    if (!authResult.success) {
      throw new Error(`Failed to create auth users: ${authResult.error}`);
    }

    // Extract public user data
    const publicUsers = authResult.users.map(u => u.publicUser).filter(Boolean);

    return { success: true, data: publicUsers };
  } catch (error) {
    console.error('Error inserting users with service role:', error);
    return { success: false, error };
  }
}

/**
 * Insert GPU benchmarks using service role
 */
export async function insertGPUBenchmarksWithServiceRole(
  count: number = 10, 
  userIds: string[] = []
): Promise<{
  success: boolean;
  data?: any[];
  error?: any;
}> {
  if (!supabaseAdmin) {
    return { 
      success: false, 
      error: 'Service role key not available. Please set SUPABASE_SERVICE_ROLE_KEY in your .env file.' 
    };
  }

  try {
    // Import benchmark generation
    const { generateGPUBenchmarks } = await import('./placeholder-data');
    const benchmarks = generateGPUBenchmarks(count, userIds);
    
    const { data, error } = await supabaseAdmin
      .from('gpu_benchmarks')
      .insert(benchmarks)
      .select();

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Error inserting GPU benchmarks with service role:', error);
    return { success: false, error };
  }
}

/**
 * Insert GPU listings using service role
 */
export async function insertGPUListingsWithServiceRole(
  count: number = 15,
  benchmarkIds: number[] = [],
  userIds: string[] = []
): Promise<{
  success: boolean;
  data?: any[];
  error?: any;
}> {
  if (!supabaseAdmin) {
    return { 
      success: false, 
      error: 'Service role key not available. Please set SUPABASE_SERVICE_ROLE_KEY in your .env file.' 
    };
  }

  try {
    // Import listing generation
    const { generateGPUListings } = await import('./placeholder-data');
    const listings = generateGPUListings(count, benchmarkIds, userIds);
    
    const { data, error } = await supabaseAdmin
      .from('gpu_listings')
      .insert(listings)
      .select();

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Error inserting GPU listings with service role:', error);
    return { success: false, error };
  }
}

/**
 * Populate database using service role (bypasses RLS)
 */
export async function populateDatabaseWithServiceRole(options: {
  userCount?: number;
  benchmarkCount?: number;
  listingCount?: number;
} = {}): Promise<{
  success: boolean;
  results: {
    users: { success: boolean; count: number; error?: any };
    benchmarks: { success: boolean; count: number; error?: any };
    listings: { success: boolean; count: number; error?: any };
  };
  error?: any;
}> {
  const { userCount = 5, benchmarkCount = 10, listingCount = 15 } = options;
  
  if (!supabaseAdmin) {
    return {
      success: false,
      results: {
        users: { success: false, count: 0, error: 'Service role key not available' },
        benchmarks: { success: false, count: 0, error: 'Service role key not available' },
        listings: { success: false, count: 0, error: 'Service role key not available' }
      },
      error: 'Service role key not available. Please set SUPABASE_SERVICE_ROLE_KEY in your .env file.'
    };
  }

  try {
    console.log('🚀 Starting service role database population...');
    
    // Step 1: Insert users
    console.log(`👥 Inserting ${userCount} users...`);
    const usersResult = await insertUsersWithServiceRole(userCount);
    
    if (!usersResult.success) {
      throw new Error(`Failed to insert users: ${usersResult.error}`);
    }

    const userIds = usersResult.data?.map(u => u.id) || [];
    console.log(`✅ Inserted ${userIds.length} users`);

    // Step 2: Insert GPU benchmarks
    console.log(`🔬 Inserting ${benchmarkCount} GPU benchmarks...`);
    const benchmarksResult = await insertGPUBenchmarksWithServiceRole(benchmarkCount, userIds);
    
    if (!benchmarksResult.success) {
      throw new Error(`Failed to insert benchmarks: ${benchmarksResult.error}`);
    }

    const benchmarkIds = benchmarksResult.data?.map(b => b.id) || [];
    console.log(`✅ Inserted ${benchmarkIds.length} GPU benchmarks`);

    // Step 3: Insert GPU listings
    console.log(`🛒 Inserting ${listingCount} GPU listings...`);
    const listingsResult = await insertGPUListingsWithServiceRole(listingCount, benchmarkIds, userIds);
    
    if (!listingsResult.success) {
      throw new Error(`Failed to insert listings: ${listingsResult.error}`);
    }

    console.log(`✅ Inserted ${listingsResult.data?.length || 0} GPU listings`);
    console.log('🎉 Service role database population completed!');

    return {
      success: true,
      results: {
        users: { success: true, count: userIds.length },
        benchmarks: { success: true, count: benchmarkIds.length },
        listings: { success: true, count: listingsResult.data?.length || 0 }
      }
    };

  } catch (error) {
    console.error('❌ Service role database population failed:', error);
    return {
      success: false,
      results: {
        users: { success: false, count: 0, error },
        benchmarks: { success: false, count: 0, error },
        listings: { success: false, count: 0, error }
      },
      error
    };
  }
}

/**
 * Clear all data using service role
 */
export async function clearDataWithServiceRole(): Promise<{
  success: boolean;
  error?: any;
}> {
  if (!supabaseAdmin) {
    return { 
      success: false, 
      error: 'Service role key not available. Please set SUPABASE_SERVICE_ROLE_KEY in your .env file.' 
    };
  }

  try {
    console.log('🧹 Clearing data with service role...');
    
    // Delete in reverse order of dependencies
    const { error: listingsError } = await supabaseAdmin.from('gpu_listings').delete().neq('id', 0);
    if (listingsError) throw listingsError;
    
    const { error: benchmarksError } = await supabaseAdmin.from('gpu_benchmarks').delete().neq('id', 0);
    if (benchmarksError) throw benchmarksError;
    
    const { error: usersError } = await supabaseAdmin.from('users').delete().neq('id', '');
    if (usersError) throw usersError;
    
    console.log('✅ Data cleared successfully!');
    
    return { success: true };
  } catch (error) {
    console.error('❌ Error clearing data:', error);
    return { success: false, error };
  }
}
