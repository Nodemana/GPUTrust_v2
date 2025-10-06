#!/usr/bin/env node

/**
 * Test script for auth user creation
 * This tests if we can create auth users and public users successfully
 */

import { testAuthUserCreation, createAuthUsers } from './auth-user-creation';

async function main() {
  console.log('🧪 Testing Auth User Creation');
  console.log('============================\n');
  
  try {
    // Test single user creation
    console.log('1. Testing single user creation...');
    const testResult = await testAuthUserCreation();
    
    if (!testResult.success) {
      console.error('❌ Single user creation test failed:', testResult.error);
      process.exit(1);
    }
    
    console.log('✅ Single user creation test passed!\n');
    
    // Test multiple user creation
    console.log('2. Testing multiple user creation...');
    const multiResult = await createAuthUsers(3);
    
    if (!multiResult.success) {
      console.error('❌ Multiple user creation test failed:', multiResult.error);
      process.exit(1);
    }
    
    console.log(`✅ Multiple user creation test passed! Created ${multiResult.users.length} users`);
    
    // Show created users
    console.log('\n📋 Created users:');
    multiResult.users.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.publicUser.email} (ID: ${user.publicUser.id})`);
    });
    
    console.log('\n🎉 All tests passed! Auth user creation is working correctly.');
    console.log('\n💡 You can now run: npm run populate-db:service');
    
  } catch (error) {
    console.error('❌ Test failed with error:', error);
    process.exit(1);
  }
}

// Handle script execution
if (require.main === module) {
  main().catch(console.error);
}

export { main as testAuthCreation };
