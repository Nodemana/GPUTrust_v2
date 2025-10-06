import { Tables, TablesInsert } from '@/app/shared/types/database.types';

// Sample GPU models and their specifications
const GPU_MODELS = [
  {
    model: "NVIDIA RTX 4090",
    aibPartner: "ASUS",
    arch: "Ada Lovelace",
    vram: 24,
    memoryType: "GDDR6X",
    manufacturer: "NVIDIA",
    num_sm: 128,
    cudaCores: 16384,
    tensorCores: 512
  },
  {
    model: "NVIDIA RTX 4090",
    aibPartner: "MSI",
    arch: "Ada Lovelace",
    vram: 24,
    memoryType: "GDDR6X",
    manufacturer: "NVIDIA",
    num_sm: 128,
    cudaCores: 16384,
    tensorCores: 512
  },
  {
    model: "NVIDIA RTX 4080",
    aibPartner: "EVGA",
    arch: "Ada Lovelace", 
    vram: 16,
    memoryType: "GDDR6X",
    manufacturer: "NVIDIA",
    num_sm: 76,
    cudaCores: 9728,
    tensorCores: 304
  },
  {
    model: "NVIDIA RTX 4070",
    aibPartner: "MSI",
    arch: "Ada Lovelace",
    vram: 12,
    memoryType: "GDDR6X", 
    manufacturer: "NVIDIA",
    num_sm: 46,
    cudaCores: 5888,
    tensorCores: 184,
    rtCores: 46
  },
  {
    model: "NVIDIA RTX 4070 Ti",
    aibPartner: "Zotac",
    arch: "Ada Lovelace",
    vram: 12,
    memoryType: "GDDR6X",
    manufacturer: "NVIDIA",
    num_sm: 46,
    cudaCores: 5888,
    tensorCores: 184,
    rtCores: 46
  },
  {
    model: "RTX 2080 Ti",
    aibPartner: "ASUS",
    arch: "Turing",
    vram: 11,
    memoryType: "GDDR6",
    manufacturer: "NVIDIA",
    num_sm: 14,
    cudaCores: 1536,
    tensorCores: 48,
    rtCores: 14
  },
  {
    model: "RTX 2080",
    aibPartner: "EVGA",
    arch: "Turing",
    vram: 8,
    memoryType: "GDDR6",
    manufacturer: "NVIDIA",
    num_sm: 14,
    cudaCores: 1536,
    tensorCores: 48,
    rtCores: 14
  },
  {
    model: "RTX 2070",
    aibPartner: "Gigabyte",
    arch: "Turing",
    vram: 8,
    memoryType: "GDDR6",
    manufacturer: "NVIDIA",
    num_sm: 14,
    cudaCores: 1536,
    tensorCores: 48,
    rtCores: 14
  },
  {
    model: "RTX 2070 Ti",
    aibPartner: "Zotac",
    arch: "Turing",
    vram: 8,
    memoryType: "GDDR6",
    manufacturer: "NVIDIA",
    num_sm: 14,
    cudaCores: 1536,
    tensorCores: 48,
    rtCores: 14
  },
  {
    model: "RTX 2060",
    aibPartner: "Gigabyte",
    arch: "Turing",
    vram: 6,
    memoryType: "GDDR6",
    manufacturer: "NVIDIA",
    num_sm: 14,
    cudaCores: 1536,
    tensorCores: 48,
    rtCores: 14
  }
];

// Sample user data
const SAMPLE_USERS = [
  { username: "crypto_miner_99", email: "miner99@example.com", phone: 5550001 },
  { username: "gpu_collector", email: "collector@example.com", phone: 5550002 },
  { username: "ai_researcher", email: "research@example.com", phone: 5550003 },
  { username: "gaming_enthusiast", email: "gamer@example.com", phone: 5550004 },
  { username: "blockchain_dev", email: "dev@example.com", phone: 5550005 }
];

// Sample locations
const LOCATIONS = [
  "San Francisco, CA",
  "New York, NY", 
  "Austin, TX",
  "Seattle, WA",
  "Los Angeles, CA",
  "Denver, CO",
  "Chicago, IL",
  "Boston, MA"
];

/**
 * Generate realistic benchmark data for a GPU
 */
function generateBenchmarkData(gpuModel: typeof GPU_MODELS[0]): TablesInsert<'gpu_benchmarks'> {
  const basePerformance = {
    "RTX 4090": { fp32: 83, fp16: 165, tensor: 1321, vram: 24 },
    "RTX 4080": { fp32: 48, fp16: 96, tensor: 780, vram: 16 },
    "RTX 4070": { fp32: 29, fp16: 58, tensor: 466, vram: 12 },
    "RTX 4070 Ti": { fp32: 29, fp16: 58, tensor: 466, vram: 12 },
    "RTX 2080 Ti": { fp32: 83, fp16: 165, tensor: 1321, vram: 24 },
    "RTX 2080": { fp32: 48, fp16: 96, tensor: 780, vram: 16 },
    "RTX 2070": { fp32: 29, fp16: 58, tensor: 466, vram: 12 },
    "RTX 2070 Ti": { fp32: 29, fp16: 58, tensor: 466, vram: 12 },
    "RTX 2060": { fp32: 29, fp16: 58, tensor: 466, vram: 12 },
  };

  const perf = basePerformance[gpuModel.model as keyof typeof basePerformance] || basePerformance["RTX 4070"];
  
  // Add some realistic variance (±10%)
  const variance = () => 0.9 + Math.random() * 0.2;
  
  return {
    uuid: crypto.randomUUID(),
    gpu_model: gpuModel.model,
    gpu_aib_partner: gpuModel.aibPartner,
    gpu_arch: gpuModel.arch,
    vram_gb: gpuModel.vram,
    cuda_cores: gpuModel.cudaCores,
    tensor_cores: gpuModel.tensorCores,
    rt_cores: gpuModel.rtCores,
    cuda_version: "12.2",
    driver_version: `535.${Math.floor(Math.random() * 100)}.${Math.floor(Math.random() * 10)}`,
    num_sm: Math.floor(Math.random() * 20) + 80, // 80-100 SMs
    fp32_flops: Math.floor(perf.fp32 * variance() * 1e12), // Convert to actual FLOPS
    fp16_flops: Math.floor(perf.fp16 * variance() * 1e12),
    fp64_flops: Math.floor(perf.fp32 * 0.1 * variance() * 1e12), // ~10% of fp32
    tensor_flops_fp16: Math.floor(perf.tensor * variance() * 1e12),
    tensor_flops_bf16: Math.floor(perf.tensor * 0.8 * variance() * 1e12),
    tensor_flops_tf32: Math.floor(perf.tensor * 0.6 * variance() * 1e12),
    tensor_flops_int8: Math.floor(perf.tensor * 1.5 * variance() * 1e12),
    tensor_flops_fp8: Math.floor(perf.tensor * 2.0 * variance() * 1e12),
    d2d_mem_bandwidth: Math.floor(1000 + Math.random() * 500), // GB/s
    h2d_mem_bandwidth: Math.floor(15 + Math.random() * 5), // GB/s
    d2h_mem_bandwidth: Math.floor(15 + Math.random() * 5), // GB/s
    max_temp: Math.floor(70 + Math.random() * 15), // 70-85°C
    avg_temp: Math.floor(60 + Math.random() * 10), // 60-70°C
    max_pwr_draw: Math.floor(300 + Math.random() * 100), // 300-400W
    avg_pwr_draw: Math.floor(250 + Math.random() * 50), // 250-300W
    user_id: null // Will be set when inserting
  };
}

/**
 * Generate a sample user
 */
export function generateUser(index: number = 0): TablesInsert<'users'> {
  const user = SAMPLE_USERS[index % SAMPLE_USERS.length];
  return {
    id: crypto.randomUUID(),
    email: user.email,
    username: user.username,
    phone_number: user.phone
  };
}

/**
 * Generate a sample GPU benchmark
 */
export function generateGPUBenchmark(gpuIndex: number = 0, userId?: string): TablesInsert<'gpu_benchmarks'> {
  const gpuModel = GPU_MODELS[gpuIndex % GPU_MODELS.length];
  const benchmark = generateBenchmarkData(gpuModel);
  
  if (userId) {
    benchmark.user_id = userId;
  }
  
  return benchmark;
}

/**
 * Generate a sample GPU listing
 */
export function generateGPUListing(benchmarkId: number, userId: string, gpuIndex: number = 0): TablesInsert<'gpu_listings'> {
  const gpuModel = GPU_MODELS[gpuIndex % GPU_MODELS.length];
  const conditions = ['new', 'like-new', 'used', 'refurbished'];
  const statuses = ['active', 'active', 'active', 'sold']; // Valid: 'active', 'sold', 'removed'
  const currencies = ['SOL', 'USD', 'ETH'];
  
  // Generate realistic pricing (in SOL for crypto, USD for fiat)
  const basePrices = {
    "RTX 4090": { SOL: 8, USD: 1200 },
    "RTX 4080": { SOL: 6, USD: 800 },
    "RTX 4070": { SOL: 4, USD: 500 },
    "RTX 4070 Ti": { SOL: 4, USD: 500 },
    "RTX 2080 Ti": { SOL: 8, USD: 1200 },
    "RTX 2080": { SOL: 6, USD: 800 },
    "RTX 2070": { SOL: 4, USD: 500 },
    "RTX 2070 Ti": { SOL: 4, USD: 500 },
    "RTX 2060": { SOL: 4, USD: 500 }
  };
  
  const basePrice = basePrices[gpuModel.model as keyof typeof basePrices] || basePrices["RTX 4070"];
  const currency = currencies[Math.floor(Math.random() * currencies.length)];
  const priceMultiplier = 0.8 + Math.random() * 0.4; // 80-120% of base price
  
  // Get the price for the selected currency, with fallback
  const currencyPrice = basePrice[currency as keyof typeof basePrice] || basePrice.SOL;
  const priceAmount = Math.floor(currencyPrice * priceMultiplier);
  
  return {
    benchmark_id: benchmarkId,
    title: `${gpuModel.model} - ${gpuModel.vram}GB ${gpuModel.memoryType}`,
    description: `High-performance ${gpuModel.manufacturer} ${gpuModel.model} with ${gpuModel.vram}GB ${gpuModel.memoryType} memory. Perfect for AI/ML workloads, gaming, and crypto mining.`,
    condition: conditions[Math.floor(Math.random() * conditions.length)],
    price_amount: priceAmount,
    price_currency: currency,
    status: statuses[Math.floor(Math.random() * statuses.length)] as 'active' | 'sold' | 'cancelled',
    location: LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)],
    image_urls: [
      `https://example.com/images/${gpuModel.model.toLowerCase().replace(/\s+/g, '-')}-1.jpg`,
      `https://example.com/images/${gpuModel.model.toLowerCase().replace(/\s+/g, '-')}-2.jpg`
    ],
    user_id: userId
  };
}

/**
 * Generate multiple users
 */
export function generateUsers(count: number): TablesInsert<'users'>[] {
  return Array.from({ length: count }, (_, i) => generateUser(i));
}

/**
 * Generate multiple GPU benchmarks
 */
export function generateGPUBenchmarks(count: number, userIds: string[]): TablesInsert<'gpu_benchmarks'>[] {
  return Array.from({ length: count }, (_, i) => 
    generateGPUBenchmark(i, userIds[i % userIds.length])
  );
}

/**
 * Generate multiple GPU listings
 */
export function generateGPUListings(count: number, benchmarkIds: number[], userIds: string[]): TablesInsert<'gpu_listings'>[] {
  return Array.from({ length: count }, (_, i) => 
    generateGPUListing(benchmarkIds[i % benchmarkIds.length], userIds[i % userIds.length], i)
  );
}
