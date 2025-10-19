import { supabase } from './dbclient';
import { 
  generateUsers, 
  generateGPUBenchmarks, 
  generateGPUListings,
  generateUser,
  generateGPUBenchmark,
  generateGPUListing
} from './placeholder-data';
import { TablesInsert } from '@/app/shared/types/database.types';

/**
 * Database insertion functions for sample data
 */

export interface InsertionResult {
  success: boolean;
  data?: any;
  error?: any;
  count?: number;
}

/**
 * Insert a single user
 */
export async function insertUser(userData?: TablesInsert<'users'>): Promise<InsertionResult> {
  try {
    const user = userData || generateUser();
    const { data, error } = await supabase
      .from('users')
      .insert(user)
      .select()
      .single();
    
    if (error) throw error;
    
    return { success: true, data, count: 1 };
  } catch (error) {
    console.error('Error inserting user:', error);
    return { success: false, error };
  }
}

/**
 * Insert multiple users
 */
export async function insertUsers(count: number = 5): Promise<InsertionResult> {
  try {
    const users = generateUsers(count);
    const { data, error } = await supabase
      .from('users')
      .insert(users)
      .select();
    
    if (error) throw error;
    
    return { success: true, data, count: data.length };
  } catch (error) {
    console.error('Error inserting users:', error);
    return { success: false, error };
  }
}

/**
 * Insert a single GPU benchmark
 */
export async function insertGPUBenchmark(
  benchmarkData?: TablesInsert<'gpu_benchmarks'>, 
  userId?: string
): Promise<InsertionResult> {
  try {
    const benchmark = benchmarkData || generateGPUBenchmark(0, userId);
    const { data, error } = await supabase
      .from('gpu_benchmarks')
      .insert(benchmark)
      .select()
      .single();
    
    if (error) throw error;
    
    return { success: true, data, count: 1 };
  } catch (error) {
    console.error('Error inserting GPU benchmark:', error);
    return { success: false, error };
  }
}

/**
 * Insert multiple GPU benchmarks
 */
export async function insertGPUBenchmarks(
  count: number = 10, 
  userIds: string[] = []
): Promise<InsertionResult> {
  try {
    // If no user IDs provided, get some from the database
    let userIdsToUse = userIds;
    if (userIdsToUse.length === 0) {
      const { data: users } = await supabase.from('users').select('id').limit(count);
      userIdsToUse = users?.map(u => u.id) || [];
    }
    
    const benchmarks = generateGPUBenchmarks(count, userIdsToUse);
    const { data, error } = await supabase
      .from('gpu_benchmarks')
      .insert(benchmarks)
      .select();
    
    if (error) throw error;
    
    return { success: true, data, count: data.length };
  } catch (error) {
    console.error('Error inserting GPU benchmarks:', error);
    return { success: false, error };
  }
}

/**
 * Insert a single GPU listing
 */
export async function insertGPUListing(
  listingData?: TablesInsert<'gpu_listings'>, 
  benchmarkId?: number, 
  userId?: string
): Promise<InsertionResult> {
  try {
    let listing = listingData;
    
    if (!listing) {
      // Get a random benchmark ID if not provided
      if (!benchmarkId) {
        const { data: benchmarks } = await supabase
          .from('gpu_benchmarks')
          .select('id')
          .limit(1)
          .order('id', { ascending: false });
        benchmarkId = benchmarks?.[0]?.id;
      }
      
      // Get a random user ID if not provided
      if (!userId) {
        const { data: users } = await supabase
          .from('users')
          .select('id')
          .limit(1)
          .order('id', { ascending: false });
        userId = users?.[0]?.id;
      }
      
      if (!benchmarkId || !userId) {
        throw new Error('No benchmark or user found to create listing');
      }
      
      listing = generateGPUListing(benchmarkId, userId);
    }
    
    const { data, error } = await supabase
      .from('gpu_listings')
      .insert(listing)
      .select()
      .single();
    
    if (error) throw error;
    
    return { success: true, data, count: 1 };
  } catch (error) {
    console.error('Error inserting GPU listing:', error);
    return { success: false, error };
  }
}

/**
 * Insert multiple GPU listings
 */
export async function insertGPUListings(
  count: number = 15, 
  benchmarkIds: number[] = [], 
  userIds: string[] = []
): Promise<InsertionResult> {
  try {
    // Get benchmark IDs if not provided
    let benchmarkIdsToUse = benchmarkIds;
    if (benchmarkIdsToUse.length === 0) {
      const { data: benchmarks } = await supabase
        .from('gpu_benchmarks')
        .select('id')
        .limit(count);
      benchmarkIdsToUse = benchmarks?.map(b => b.id) || [];
    }
    
    // Get user IDs if not provided
    let userIdsToUse = userIds;
    if (userIdsToUse.length === 0) {
      const { data: users } = await supabase
        .from('users')
        .select('id')
        .limit(count);
      userIdsToUse = users?.map(u => u.id) || [];
    }
    
    const listings = generateGPUListings(count, benchmarkIdsToUse, userIdsToUse);
    const { data, error } = await supabase
      .from('gpu_listings')
      .insert(listings)
      .select();
    
    if (error) throw error;
    
    return { success: true, data, count: data.length };
  } catch (error) {
    console.error('Error inserting GPU listings:', error);
    return { success: false, error };
  }
}

/**
 * Populate the entire database with sample data
 */
export async function populateDatabase(options: {
  userCount?: number;
  benchmarkCount?: number;
  listingCount?: number;
} = {}): Promise<{
  success: boolean;
  results: {
    users: InsertionResult;
    benchmarks: InsertionResult;
    listings: InsertionResult;
  };
  error?: any;
}> {
  const { userCount = 5, benchmarkCount = 10, listingCount = 15 } = options;
  
  try {
    console.log('🚀 Starting database population...');
    
    // Step 1: Insert users
    console.log(`👥 Inserting ${userCount} users...`);
    const usersResult = await insertUsers(userCount);
    if (!usersResult.success) {
      throw new Error(`Failed to insert users: ${usersResult.error}`);
    }
    
    // Step 2: Insert GPU benchmarks
    console.log(`🔬 Inserting ${benchmarkCount} GPU benchmarks...`);
    const benchmarksResult = await insertGPUBenchmarks(benchmarkCount);
    if (!benchmarksResult.success) {
      throw new Error(`Failed to insert benchmarks: ${benchmarksResult.error}`);
    }
    
    // Step 3: Insert GPU listings
    console.log(`🛒 Inserting ${listingCount} GPU listings...`);
    const listingsResult = await insertGPUListings(listingCount);
    if (!listingsResult.success) {
      throw new Error(`Failed to insert listings: ${listingsResult.error}`);
    }
    
    console.log('✅ Database population completed successfully!');
    
    return {
      success: true,
      results: {
        users: usersResult,
        benchmarks: benchmarksResult,
        listings: listingsResult
      }
    };
    
  } catch (error) {
    console.error('❌ Database population failed:', error);
    return {
      success: false,
      results: {
        users: { success: false, error },
        benchmarks: { success: false, error },
        listings: { success: false, error }
      },
      error
    };
  }
}

/**
 * Clear all sample data from the database
 */
export async function clearSampleData(): Promise<InsertionResult> {
  try {
    console.log('🧹 Clearing sample data...');
    
    // Delete in reverse order of dependencies
    const { error: listingsError } = await supabase.from('gpu_listings').delete().neq('id', 0);
    if (listingsError) throw listingsError;
    
    const { error: benchmarksError } = await supabase.from('gpu_benchmarks').delete().neq('id', 0);
    if (benchmarksError) throw benchmarksError;
    
    const { error: usersError } = await supabase.from('users').delete().neq('id', '');
    if (usersError) throw usersError;
    
    console.log('✅ Sample data cleared successfully!');
    
    return { success: true, count: 0 };
  } catch (error) {
    console.error('❌ Error clearing sample data:', error);
    return { success: false, error };
  }
}
