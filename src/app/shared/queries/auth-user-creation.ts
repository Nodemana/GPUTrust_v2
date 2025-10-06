import { createClient } from '@supabase/supabase-js';
import { Database } from '@/app/shared/types/database.types';
import { config } from 'dotenv';
import path from 'path';

// Load .env from project root
config({ path: path.resolve(process.cwd(), '.env') });

/**
 * Auth user creation functions using service role
 * This creates users in auth.users first, then in public.users
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.warn('⚠️  SUPABASE_SERVICE_ROLE_KEY not found. Auth user creation will not work.');
}

// Create service role client for auth operations
export const supabaseAuthAdmin = supabaseServiceKey 
  ? createClient<Database>(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

// Sample user data with unique emails
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
 * Generate unique user data to avoid conflicts
 */
function generateUniqueUserData(index: number): typeof SAMPLE_AUTH_USERS[0] {
  const timestamp = Date.now();
  const randomSuffix = Math.floor(Math.random() * 10000);
  
  return {
    email: `user${index}_${timestamp}_${randomSuffix}@example.com`,
    password: "password123",
    username: `user_${index}_${randomSuffix}`,
    phone: 5550000 + index + randomSuffix
  };
}

/**
 * Create a single auth user and corresponding public user
 */
export async function createAuthUser(userData: typeof SAMPLE_AUTH_USERS[0]): Promise<{
  success: boolean;
  authUser?: any;
  publicUser?: any;
  error?: any;
}> {
  if (!supabaseAuthAdmin) {
    return { 
      success: false, 
      error: 'Service role key not available. Please set SUPABASE_SERVICE_ROLE_KEY in your .env file.' 
    };
  }

  try {
    // Step 1: Create user in auth.users using admin API
    const { data: authData, error: authError } = await supabaseAuthAdmin.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        username: userData.username,
        phone: userData.phone
      }
    });

    if (authError) {
      console.error('Auth user creation failed:', authError);
      return { success: false, error: authError };
    }

    // Step 2: Create corresponding entry in public.users
    const publicUserData = {
      id: authData.user.id, // Use the auth user's ID
      email: userData.email,
      username: userData.username,
      phone_number: userData.phone
    };

    const { data: publicData, error: publicError } = await supabaseAuthAdmin
      .from('users')
      .insert(publicUserData)
      .select()
      .single();

    if (publicError) {
      console.error('Public user creation failed:', publicError);
      // Try to clean up the auth user if public user creation failed
      try {
        await supabaseAuthAdmin.auth.admin.deleteUser(authData.user.id);
      } catch (cleanupError) {
        console.error('Failed to cleanup auth user:', cleanupError);
      }
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
  if (!supabaseAuthAdmin) {
    return { 
      success: false, 
      users: [], 
      error: 'Service role key not available. Please set SUPABASE_SERVICE_ROLE_KEY in your .env file.' 
    };
  }

  try {
    const users = [];

    for (let i = 0; i < count; i++) {
      // Use unique user data to avoid conflicts
      const user = generateUniqueUserData(i);
      console.log(`Creating user ${i + 1}/${count}: ${user.email}`);
      
      const result = await createAuthUser(user);
      if (result.success) {
        users.push(result);
        console.log(`✅ Created user: ${user.email}`);
      } else {
        console.error(`❌ Failed to create user ${user.email}:`, result.error);
        // Try with a different unique email if this one failed
        if (result.error?.code === 'email_exists') {
          console.log(`🔄 Retrying with different email...`);
          const retryUser = generateUniqueUserData(i + 1000); // Different suffix
          const retryResult = await createAuthUser(retryUser);
          if (retryResult.success) {
            users.push(retryResult);
            console.log(`✅ Created user on retry: ${retryUser.email}`);
          }
        }
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
 * Delete auth users (cleanup function)
 */
export async function deleteAuthUsers(userIds: string[]): Promise<{
  success: boolean;
  deletedCount: number;
  error?: any;
}> {
  if (!supabaseAuthAdmin) {
    return { 
      success: false, 
      deletedCount: 0, 
      error: 'Service role key not available. Please set SUPABASE_SERVICE_ROLE_KEY in your .env file.' 
    };
  }

  try {
    let deletedCount = 0;
    
    for (const userId of userIds) {
      try {
        const { error } = await supabaseAuthAdmin.auth.admin.deleteUser(userId);
        if (!error) {
          deletedCount++;
          console.log(`✅ Deleted auth user: ${userId}`);
        } else {
          console.error(`❌ Failed to delete auth user ${userId}:`, error);
        }
      } catch (error) {
        console.error(`❌ Error deleting auth user ${userId}:`, error);
      }
    }

    return { success: true, deletedCount };

  } catch (error) {
    console.error('Error deleting auth users:', error);
    return { success: false, deletedCount: 0, error };
  }
}

/**
 * Clear existing auth users to avoid conflicts
 */
export async function clearExistingAuthUsers(): Promise<{
  success: boolean;
  deletedCount: number;
  error?: any;
}> {
  if (!supabaseAuthAdmin) {
    return { 
      success: false, 
      deletedCount: 0, 
      error: 'Service role key not available. Please set SUPABASE_SERVICE_ROLE_KEY in your .env file.' 
    };
  }

  try {
    console.log('🧹 Clearing existing auth users...');
    
    // Get all existing users
    const { data: existingUsers, error: listError } = await supabaseAuthAdmin.auth.admin.listUsers();
    
    if (listError) {
      console.error('Error listing users:', listError);
      return { success: false, deletedCount: 0, error: listError };
    }

    if (!existingUsers?.users || existingUsers.users.length === 0) {
      console.log('No existing users to clear');
      return { success: true, deletedCount: 0 };
    }

    const userIds = existingUsers.users.map(u => u.id);
    const deleteResult = await deleteAuthUsers(userIds);
    
    console.log(`✅ Cleared ${deleteResult.deletedCount} existing users`);
    return deleteResult;
    
  } catch (error) {
    console.error('❌ Error clearing existing auth users:', error);
    return { success: false, deletedCount: 0, error };
  }
}

/**
 * Test auth user creation
 */
export async function testAuthUserCreation(): Promise<{
  success: boolean;
  error?: any;
}> {
  try {
    console.log('🧪 Testing auth user creation...');
    
    const result = await createAuthUser(generateUniqueUserData(9999));
    
    if (result.success) {
      console.log('✅ Auth user creation test successful');
      console.log('Auth user ID:', result.authUser?.id);
      console.log('Public user ID:', result.publicUser?.id);
      
      // Clean up the test user
      if (result.authUser?.id) {
        await deleteAuthUsers([result.authUser.id]);
        console.log('🧹 Test user cleaned up');
      }
      
      return { success: true };
    } else {
      console.error('❌ Auth user creation test failed:', result.error);
      return { success: false, error: result.error };
    }
    
  } catch (error) {
    console.error('❌ Auth user creation test error:', error);
    return { success: false, error };
  }
}
