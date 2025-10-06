/**
 * Simple JavaScript version of the database population script
 * This can be run directly with Node.js without TypeScript compilation
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set');
  process.exit(1);
}

// Use service role client to bypass RLS
const supabase = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : createClient(supabaseUrl, supabaseAnonKey);

if (!supabaseServiceKey) {
  console.warn('⚠️  SUPABASE_SERVICE_ROLE_KEY not found. Using anon key (may fail with RLS).');
  console.warn('   For development, consider setting SUPABASE_SERVICE_ROLE_KEY in your .env file.');
}

// Sample data generators
const GPU_MODELS = [
  { name: "NVIDIA RTX 4090", arch: "Ada Lovelace", vram: 24, memoryType: "GDDR6X", manufacturer: "NVIDIA" },
  { name: "NVIDIA RTX 4080", arch: "Ada Lovelace", vram: 16, memoryType: "GDDR6X", manufacturer: "NVIDIA" },
  { name: "NVIDIA RTX 4070", arch: "Ada Lovelace", vram: 12, memoryType: "GDDR6X", manufacturer: "NVIDIA" },
  { name: "AMD RX 7900 XTX", arch: "RDNA 3", vram: 24, memoryType: "GDDR6", manufacturer: "AMD" },
  { name: "AMD RX 7900 XT", arch: "RDNA 3", vram: 20, memoryType: "GDDR6", manufacturer: "AMD" }
];

const SAMPLE_USERS = [
  { username: "crypto_miner_99", email: "miner99@example.com", phone: 5550001 },
  { username: "gpu_collector", email: "collector@example.com", phone: 5550002 },
  { username: "ai_researcher", email: "research@example.com", phone: 5550003 },
  { username: "gaming_enthusiast", email: "gamer@example.com", phone: 5550004 },
  { username: "blockchain_dev", email: "dev@example.com", phone: 5550005 }
];

const LOCATIONS = [
  "San Francisco, CA", "New York, NY", "Austin, TX", "Seattle, WA",
  "Los Angeles, CA", "Denver, CO", "Chicago, IL", "Boston, MA"
];

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function generateUser(index = 0) {
  const user = SAMPLE_USERS[index % SAMPLE_USERS.length];
  return {
    id: generateUUID(),
    email: user.email,
    username: user.username,
    phone_number: user.phone
  };
}

function generateBenchmarkData(gpuModel, userId = null) {
  const basePerformance = {
    "RTX 4090": { fp32: 83, fp16: 165, tensor: 1321, vram: 24 },
    "RTX 4080": { fp32: 48, fp16: 96, tensor: 780, vram: 16 },
    "RTX 4070": { fp32: 29, fp16: 58, tensor: 466, vram: 12 },
    "RX 7900 XTX": { fp32: 61, fp16: 122, tensor: 1220, vram: 24 },
    "RX 7900 XT": { fp32: 52, fp16: 104, tensor: 1040, vram: 20 }
  };

  const perf = basePerformance[gpuModel.name] || basePerformance["RTX 4070"];
  const variance = () => 0.9 + Math.random() * 0.2;
  
  return {
    uuid: generateUUID(),
    gpu_name: gpuModel.name,
    gpu_arch: gpuModel.arch,
    vram_gb: gpuModel.vram,
    cuda_version: "12.2",
    driver_version: `535.${Math.floor(Math.random() * 100)}.${Math.floor(Math.random() * 10)}`,
    num_sm: Math.floor(Math.random() * 20) + 80,
    fp32_flops: Math.floor(perf.fp32 * variance() * 1e12),
    fp16_flops: Math.floor(perf.fp16 * variance() * 1e12),
    fp64_flops: Math.floor(perf.fp32 * 0.1 * variance() * 1e12),
    tensor_flops_fp16: Math.floor(perf.tensor * variance() * 1e12),
    tensor_flops_bf16: Math.floor(perf.tensor * 0.8 * variance() * 1e12),
    tensor_flops_tf32: Math.floor(perf.tensor * 0.6 * variance() * 1e12),
    tensor_flops_int8: Math.floor(perf.tensor * 1.5 * variance() * 1e12),
    tensor_flops_fp8: Math.floor(perf.tensor * 2.0 * variance() * 1e12),
    d2d_mem_bandwidth: Math.floor(1000 + Math.random() * 500),
    h2d_mem_bandwidth: Math.floor(15 + Math.random() * 5),
    d2h_mem_bandwidth: Math.floor(15 + Math.random() * 5),
    max_temp: Math.floor(70 + Math.random() * 15),
    avg_temp: Math.floor(60 + Math.random() * 10),
    max_pwr_draw: Math.floor(300 + Math.random() * 100),
    avg_pwr_draw: Math.floor(250 + Math.random() * 50),
    user_id: userId
  };
}

function generateListing(benchmarkId, userId, gpuIndex = 0) {
  const gpuModel = GPU_MODELS[gpuIndex % GPU_MODELS.length];
  const conditions = ['excellent', 'good', 'fair', 'like_new'];
  const statuses = ['active', 'active', 'active', 'sold'];
  const currencies = ['SOL', 'USD', 'ETH'];
  
  const basePrices = {
    "RTX 4090": { SOL: 8, USD: 1200 },
    "RTX 4080": { SOL: 6, USD: 800 },
    "RTX 4070": { SOL: 4, USD: 500 },
    "RX 7900 XTX": { SOL: 7, USD: 900 },
    "RX 7900 XT": { SOL: 5, USD: 700 }
  };
  
  const basePrice = basePrices[gpuModel.name] || basePrices["RTX 4070"];
  const currency = currencies[Math.floor(Math.random() * currencies.length)];
  const priceMultiplier = 0.8 + Math.random() * 0.4;
  const priceAmount = Math.floor(basePrice[currency] * priceMultiplier);
  
  return {
    benchmark_id: benchmarkId,
    title: `${gpuModel.name} - ${gpuModel.vram}GB ${gpuModel.memoryType}`,
    description: `High-performance ${gpuModel.manufacturer} ${gpuModel.name} with ${gpuModel.vram}GB ${gpuModel.memoryType} memory. Perfect for AI/ML workloads, gaming, and crypto mining.`,
    condition: conditions[Math.floor(Math.random() * conditions.length)],
    price_amount: priceAmount,
    price_currency: currency,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    location: LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)],
    image_urls: [
      `https://example.com/images/${gpuModel.name.toLowerCase().replace(/\s+/g, '-')}-1.jpg`,
      `https://example.com/images/${gpuModel.name.toLowerCase().replace(/\s+/g, '-')}-2.jpg`
    ],
    user_id: userId
  };
}

async function testConnection() {
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

async function clearSampleData() {
  try {
    console.log('🧹 Clearing sample data...');
    
    const { error: listingsError } = await supabase.from('gpu_listings').delete().neq('id', 0);
    if (listingsError) throw listingsError;
    
    const { error: benchmarksError } = await supabase.from('gpu_benchmarks').delete().neq('id', 0);
    if (benchmarksError) throw benchmarksError;
    
    const { error: usersError } = await supabase.from('users').delete().neq('id', '');
    if (usersError) throw usersError;
    
    console.log('✅ Sample data cleared successfully!');
    return { success: true };
  } catch (error) {
    console.error('❌ Error clearing sample data:', error);
    return { success: false, error };
  }
}

async function populateDatabase(userCount = 5, benchmarkCount = 10, listingCount = 15) {
  try {
    console.log('🚀 Starting database population...');
    
    // Step 1: Insert users
    console.log(`👥 Inserting ${userCount} users...`);
    const users = Array.from({ length: userCount }, (_, i) => generateUser(i));
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .insert(users)
      .select();
    
    if (usersError) throw usersError;
    console.log(`✅ Inserted ${usersData.length} users`);
    
    // Step 2: Insert GPU benchmarks
    console.log(`🔬 Inserting ${benchmarkCount} GPU benchmarks...`);
    const userIds = usersData.map(u => u.id);
    const benchmarks = Array.from({ length: benchmarkCount }, (_, i) => 
      generateBenchmarkData(GPU_MODELS[i % GPU_MODELS.length], userIds[i % userIds.length])
    );
    
    const { data: benchmarksData, error: benchmarksError } = await supabase
      .from('gpu_benchmarks')
      .insert(benchmarks)
      .select();
    
    if (benchmarksError) throw benchmarksError;
    console.log(`✅ Inserted ${benchmarksData.length} GPU benchmarks`);
    
    // Step 3: Insert GPU listings
    console.log(`🛒 Inserting ${listingCount} GPU listings...`);
    const benchmarkIds = benchmarksData.map(b => b.id);
    const listings = Array.from({ length: listingCount }, (_, i) => 
      generateListing(benchmarkIds[i % benchmarkIds.length], userIds[i % userIds.length], i)
    );
    
    const { data: listingsData, error: listingsError } = await supabase
      .from('gpu_listings')
      .insert(listings)
      .select();
    
    if (listingsError) throw listingsError;
    console.log(`✅ Inserted ${listingsData.length} GPU listings`);
    
    console.log('\n🎉 Database population completed successfully!');
    console.log('\n📈 Summary:');
    console.log(`   👥 Users: ${usersData.length} inserted`);
    console.log(`   🔬 Benchmarks: ${benchmarksData.length} inserted`);
    console.log(`   🛒 Listings: ${listingsData.length} inserted`);
    
    return { success: true };
    
  } catch (error) {
    console.error('❌ Database population failed:', error);
    return { success: false, error };
  }
}

async function main() {
  console.log('🎯 GPU Trust Database Population Script');
  console.log('=====================================\n');
  
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
      const clearResult = await clearSampleData();
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
    
    const result = await populateDatabase(userCount, benchmarkCount, listingCount);
    
    if (result.success) {
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

// Run the script
if (require.main === module) {
  main().catch(console.error);
}
