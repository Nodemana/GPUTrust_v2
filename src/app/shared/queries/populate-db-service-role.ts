#!/usr/bin/env node

/**
 * Database population script using service role (bypasses RLS)
 * This is the recommended approach for development data population
 * 
 * Usage:
 *   npm run populate-db:service
 *   npx tsx src/app/lib/db/populate-db-service-role.ts
 */

import { populateDatabaseWithServiceRole, clearDataWithServiceRole } from './service-role-data';
import { clearExistingAuthUsers } from './auth-user-creation';
import { testConnection } from './dbclient';

async function main() {
  console.log('🎯 GPU Trust Database Population Script (Service Role)');
  console.log('==================================================\n');
  
  // Test database connection first
  console.log('🔌 Testing database connection...');
  const connectionTest = await testConnection();
  if (!connectionTest.success) {
    console.error('❌ Cannot connect to database. Please check your environment variables.');
    process.exit(1);
  }
  
  // Parse command line arguments
  const args = process.argv.slice(2);
  const shouldClear = args.includes('--clear') || args.includes('-c');
  const userCount = parseInt(args.find(arg => arg.startsWith('--users='))?.split('=')[1] || '5');
  const benchmarkCount = parseInt(args.find(arg => arg.startsWith('--benchmarks='))?.split('=')[1] || '10');
  const listingCount = parseInt(args.find(arg => arg.startsWith('--listings='))?.split('=')[1] || '15');
  
  try {
    // Clear existing data if requested
    if (shouldClear) {
      console.log('🧹 Clearing existing sample data...');
      
      // Clear auth users first
      const authClearResult = await clearExistingAuthUsers();
      if (!authClearResult.success) {
        console.error('❌ Failed to clear existing auth users:', authClearResult.error);
        process.exit(1);
      }
      
      // Clear public data
      const clearResult = await clearDataWithServiceRole();
      if (!clearResult.success) {
        console.error('❌ Failed to clear existing data:', clearResult.error);
        process.exit(1);
      }
    }
    
    // Populate database
    console.log(`\n📊 Populating database with:`);
    console.log(`   👥 ${userCount} users`);
    console.log(`   🔬 ${benchmarkCount} GPU benchmarks`);
    console.log(`   🛒 ${listingCount} GPU listings`);
    console.log('');
    
    const result = await populateDatabaseWithServiceRole({
      userCount,
      benchmarkCount,
      listingCount
    });
    
    if (result.success) {
      console.log('\n🎉 Database population completed successfully!');
      console.log('\n📈 Summary:');
      console.log(`   👥 Users: ${result.results.users.count || 0} inserted`);
      console.log(`   🔬 Benchmarks: ${result.results.benchmarks.count || 0} inserted`);
      console.log(`   🛒 Listings: ${result.results.listings.count || 0} inserted`);
      
      console.log('\n💡 You can now:');
      console.log('   • View your data in the Supabase dashboard');
      console.log('   • Test your API endpoints');
      console.log('   • Run your frontend application');
      
    } else {
      console.error('❌ Database population failed:', result.error);
      process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  }
}

// Handle script execution
if (require.main === module) {
  main().catch(console.error);
}

export { main as populateDatabaseScriptServiceRole };
