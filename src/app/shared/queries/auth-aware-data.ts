import { supabase } from './dbclient';
import { TablesInsert } from '@/app/shared/types/database.types';

/**
 * Auth-aware data generation and insertion functions
 * These functions work with Supabase Auth and RLS policies
 */

// Sample user data for auth.users
const SAMPLE_AUTH_USERS = [
  { 
    email: "miner99@example.com", 
    password: "password123",
    username: "crypto_miner_99",
    phone: 5550001 
  },
  { 
    email: "collector@example.com", 
    password: "password123",
    username: "gpu_collector",
    phone: 5550002 
  },
  { 
    email: "research@example.com", 
    password: "password123",
    username: "ai_researcher",
    phone: 5550003 
  },
  { 
    email: "gamer@example.com", 
    password: "password123",
    username: "gaming_enthusiast",
    phone: 5550004 
  },
  { 
    email: "dev@example.com", 
    password: "password123",
    username: "blockchain_dev",
    phone: 5550005 
  }
];

/**
 * Create a user in auth.users and then in public.users
 */
export async function createAuthUser(userData: typeof SAMPLE_AUTH_USERS[0]): Promise<{
  success: boolean;
  authUser?: any;
  publicUser?: any;
  error?: any;
}> {
  try {
    // Step 1: Create user in auth.users
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      email_confirm: true // Auto-confirm email
    });

    if (authError) {
      console.error('Auth user creation failed:', authError);
      return { success: false, error: authError };
    }

    // Step 2: Create corresponding entry in public.users
    const publicUserData: TablesInsert<'users'> = {
      id: authData.user.id, // Use the auth user's ID
      email: userData.email,
      username: userData.username,
      phone_number: userData.phone
    };

    const { data: publicData, error: publicError } = await supabase
      .from('users')
      .insert(publicUserData)
      .select()
      .single();

    if (publicError) {
      console.error('Public user creation failed:', publicError);
      // Try to clean up the auth user if public user creation failed
      await supabase.auth.admin.deleteUser(authData.user.id);
      return { success: false, error: publicError };
    }

    return {
      success: true,
      authUser: authData.user,
      publicUser: publicData
    };

  } catch (error) {
    console.error('Error creating auth user:', error);
    return { success: false, error };
  }
}

/**
 * Create multiple auth users
 */
export async function createAuthUsers(count: number = 5): Promise<{
  success: boolean;
  users: any[];
  error?: any;
}> {
  try {
    const users = [];
    const userData = SAMPLE_AUTH_USERS.slice(0, count);

    for (const user of userData) {
      const result = await createAuthUser(user);
      if (result.success) {
        users.push(result);
      } else {
        console.error('Failed to create user:', user.email, result.error);
      }
    }

    return {
      success: users.length > 0,
      users,
      error: users.length === 0 ? 'No users created' : undefined
    };

  } catch (error) {
    console.error('Error creating auth users:', error);
    return { success: false, users: [], error };
  }
}

/**
 * Alternative approach: Use service role to bypass RLS
 * This requires the service role key
 */
export async function createUsersWithServiceRole(userData: typeof SAMPLE_AUTH_USERS[0]): Promise<{
  success: boolean;
  user?: any;
  error?: any;
}> {
  try {
    // This would require the service role key and admin client
    // For now, we'll use the auth approach above
    throw new Error('Service role approach not implemented yet');
  } catch (error) {
    return { success: false, error };
  }
}

/**
 * Create a GPU benchmark for an existing user
 */
export async function createGPUBenchmarkForUser(
  userId: string, 
  gpuIndex: number = 0
): Promise<{
  success: boolean;
  benchmark?: any;
  error?: any;
}> {
  try {
    // Import the benchmark generation function
    const { generateGPUBenchmark } = await import('./placeholder-data');
    const benchmarkData = generateGPUBenchmark(gpuIndex, userId);

    const { data, error } = await supabase
      .from('gpu_benchmarks')
      .insert(benchmarkData)
      .select()
      .single();

    if (error) throw error;

    return { success: true, benchmark: data };

  } catch (error) {
    console.error('Error creating GPU benchmark:', error);
    return { success: false, error };
  }
}

/**
 * Create a GPU listing for an existing user and benchmark
 */
export async function createGPUListingForUser(
  userId: string,
  benchmarkId: number,
  gpuIndex: number = 0
): Promise<{
  success: boolean;
  listing?: any;
  error?: any;
}> {
  try {
    // Import the listing generation function
    const { generateGPUListing } = await import('./placeholder-data');
    const listingData = generateGPUListing(benchmarkId, userId, gpuIndex);

    const { data, error } = await supabase
      .from('gpu_listings')
      .insert(listingData)
      .select()
      .single();

    if (error) throw error;

    return { success: true, listing: data };

  } catch (error) {
    console.error('Error creating GPU listing:', error);
    return { success: false, error };
  }
}

/**
 * Populate database with auth-aware approach
 */
export async function populateDatabaseWithAuth(options: {
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
  
  try {
    console.log('🚀 Starting auth-aware database population...');
    
    // Step 1: Create auth users
    console.log(`👥 Creating ${userCount} auth users...`);
    const usersResult = await createAuthUsers(userCount);
    
    if (!usersResult.success || usersResult.users.length === 0) {
      throw new Error(`Failed to create users: ${usersResult.error}`);
    }

    const userIds = usersResult.users.map(u => u.publicUser.id);
    console.log(`✅ Created ${userIds.length} users`);

    // Step 2: Create GPU benchmarks
    console.log(`🔬 Creating ${benchmarkCount} GPU benchmarks...`);
    const benchmarks = [];
    let benchmarkErrors = 0;

    for (let i = 0; i < benchmarkCount; i++) {
      const userId = userIds[i % userIds.length];
      const result = await createGPUBenchmarkForUser(userId, i);
      
      if (result.success) {
        benchmarks.push(result.benchmark);
      } else {
        benchmarkErrors++;
        console.error(`Failed to create benchmark ${i}:`, result.error);
      }
    }

    console.log(`✅ Created ${benchmarks.length} benchmarks (${benchmarkErrors} errors)`);

    // Step 3: Create GPU listings
    console.log(`🛒 Creating ${listingCount} GPU listings...`);
    const listings = [];
    let listingErrors = 0;

    for (let i = 0; i < listingCount; i++) {
      const userId = userIds[i % userIds.length];
      const benchmarkId = benchmarks[i % benchmarks.length].id;
      const result = await createGPUListingForUser(userId, benchmarkId, i);
      
      if (result.success) {
        listings.push(result.listing);
      } else {
        listingErrors++;
        console.error(`Failed to create listing ${i}:`, result.error);
      }
    }

    console.log(`✅ Created ${listings.length} listings (${listingErrors} errors)`);
    console.log('🎉 Auth-aware database population completed!');

    return {
      success: true,
      results: {
        users: { success: true, count: userIds.length },
        benchmarks: { success: true, count: benchmarks.length, error: benchmarkErrors > 0 ? `${benchmarkErrors} errors` : undefined },
        listings: { success: true, count: listings.length, error: listingErrors > 0 ? `${listingErrors} errors` : undefined }
      }
    };

  } catch (error) {
    console.error('❌ Auth-aware database population failed:', error);
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
 * Clear auth users and related data
 * WARNING: This will delete auth users and all related data
 */
export async function clearAuthData(): Promise<{
  success: boolean;
  error?: any;
}> {
  try {
    console.log('🧹 Clearing auth data...');
    console.log('⚠️  WARNING: This will delete all auth users and related data!');
    
    // This is a destructive operation - be careful!
    // You might want to implement a more selective clearing approach
    
    return { success: false, error: 'Auth data clearing not implemented for safety' };
    
  } catch (error) {
    console.error('❌ Error clearing auth data:', error);
    return { success: false, error };
  }
}
