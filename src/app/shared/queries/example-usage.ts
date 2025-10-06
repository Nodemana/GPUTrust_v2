/**
 * Example usage of the database population functions
 * This file shows how to use the placeholder data and insertion functions in your application
 */

import { 
  populateDatabase, 
  insertUser, 
  insertGPUBenchmark, 
  insertGPUListing,
  clearSampleData 
} from './insert-sample-data';
import { 
  generateUser, 
  generateGPUBenchmark, 
  generateGPUListing 
} from './placeholder-data';

/**
 * Example 1: Populate the entire database with sample data
 */
export async function exampleFullPopulation() {
  console.log('🎯 Example: Full Database Population');
  
  const result = await populateDatabase({
    userCount: 5,
    benchmarkCount: 10,
    listingCount: 15
  });
  
  if (result.success) {
    console.log('✅ Database populated successfully!');
    console.log(`Users: ${result.results.users.count}`);
    console.log(`Benchmarks: ${result.results.benchmarks.count}`);
    console.log(`Listings: ${result.results.listings.count}`);
  } else {
    console.error('❌ Failed to populate database:', result.error);
  }
  
  return result;
}

/**
 * Example 2: Insert a single user
 */
export async function exampleInsertSingleUser() {
  console.log('🎯 Example: Insert Single User');
  
  const result = await insertUser();
  
  if (result.success) {
    console.log('✅ User inserted successfully!');
    console.log('User data:', result.data);
  } else {
    console.error('❌ Failed to insert user:', result.error);
  }
  
  return result;
}

/**
 * Example 3: Insert a GPU benchmark with custom data
 */
export async function exampleInsertCustomBenchmark() {
  console.log('🎯 Example: Insert Custom GPU Benchmark');
  
  // First, get a user ID
  const userResult = await insertUser();
  if (!userResult.success) {
    console.error('❌ Need a user to create benchmark');
    return;
  }
  
  const userId = userResult.data.id;
  
  // Generate custom benchmark data
  const customBenchmark = generateGPUBenchmark(0, userId); // RTX 4090
  customBenchmark.gpu_name = "Custom RTX 4090";
  customBenchmark.gpu_arch = "Ada Lovelace Custom";
  
  const result = await insertGPUBenchmark(customBenchmark);
  
  if (result.success) {
    console.log('✅ Custom benchmark inserted successfully!');
    console.log('Benchmark data:', result.data);
  } else {
    console.error('❌ Failed to insert benchmark:', result.error);
  }
  
  return result;
}

/**
 * Example 4: Insert a GPU listing with custom data
 */
export async function exampleInsertCustomListing() {
  console.log('🎯 Example: Insert Custom GPU Listing');
  
  // First, get a user and benchmark
  const userResult = await insertUser();
  if (!userResult.success) {
    console.error('❌ Need a user to create listing');
    return;
  }
  
  const benchmarkResult = await insertGPUBenchmark(undefined, userResult.data.id);
  if (!benchmarkResult.success) {
    console.error('❌ Need a benchmark to create listing');
    return;
  }
  
  // Generate custom listing data
  const customListing = generateGPUListing(
    benchmarkResult.data.id, 
    userResult.data.id, 
    0 // RTX 4090
  );
  customListing.title = "Custom RTX 4090 - Perfect for AI/ML";
  customListing.description = "This is a custom listing with special features...";
  customListing.price_amount = 10; // 10 SOL
  customListing.price_currency = "SOL";
  
  const result = await insertGPUListing(customListing);
  
  if (result.success) {
    console.log('✅ Custom listing inserted successfully!');
    console.log('Listing data:', result.data);
  } else {
    console.error('❌ Failed to insert listing:', result.error);
  }
  
  return result;
}

/**
 * Example 5: Clear all sample data
 */
export async function exampleClearData() {
  console.log('🎯 Example: Clear Sample Data');
  
  const result = await clearSampleData();
  
  if (result.success) {
    console.log('✅ Sample data cleared successfully!');
  } else {
    console.error('❌ Failed to clear data:', result.error);
  }
  
  return result;
}

/**
 * Example 6: Generate data without inserting (useful for testing)
 */
export function exampleGenerateDataOnly() {
  console.log('🎯 Example: Generate Data Only (No Database Insert)');
  
  // Generate sample data without inserting
  const user = generateUser(0);
  const benchmark = generateGPUBenchmark(0, user.id);
  const listing = generateGPUListing(1, user.id, 0); // Using benchmark ID 1
  
  console.log('Generated User:', user);
  console.log('Generated Benchmark:', benchmark);
  console.log('Generated Listing:', listing);
  
  return { user, benchmark, listing };
}

/**
 * Run all examples
 */
export async function runAllExamples() {
  console.log('🚀 Running All Examples');
  console.log('======================\n');
  
  try {
    // Example 1: Full population
    await exampleFullPopulation();
    console.log('\n');
    
    // Example 2: Single user
    await exampleInsertSingleUser();
    console.log('\n');
    
    // Example 3: Custom benchmark
    await exampleInsertCustomBenchmark();
    console.log('\n');
    
    // Example 4: Custom listing
    await exampleInsertCustomListing();
    console.log('\n');
    
    // Example 5: Generate data only
    exampleGenerateDataOnly();
    console.log('\n');
    
    console.log('✅ All examples completed!');
    
  } catch (error) {
    console.error('❌ Error running examples:', error);
  }
}

// Export individual functions for use in your application
export {
  generateUser,
  generateGPUBenchmark, 
  generateGPUListing
} from './placeholder-data';
