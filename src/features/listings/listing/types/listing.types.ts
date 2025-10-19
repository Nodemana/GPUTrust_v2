/**
 * Core GPU Listing entity
 * Represents a GPU available for sale on the marketplace
 */
export interface GPUListing {
    id: string;
    
    // GPU Details
    gpu: {
      model: string;           // e.g., "NVIDIA RTX 4090"
      aib_partner: string;
      uuid: string;
      gpuArch: string;
      manufacturer: string;   // e.g., "NVIDIA", "AMD"
      memory: number;         // in GB
      memoryType: string;
      num_sm: number;
      cudaCores: number;     // e.g., "GDDR6X"
      tensorCores: number;
      rtCores: number;
    };
    
    // Listing Details
    price: {
      amount: number; // In Solana
    };
    
    // Benchmark
    benchmarkScore: {
      cudaVersion: string;
      driverVersion: string;
      fp16_flops: number;
      fp32_flops: number;
      fp64_flops: number;
      tensor_flops_fp16: number;
      tensor_flops_bf16: number;
      tensor_flops_tf32: number;
      tensor_flops_int8: number;
      tensor_flops_fp8: number;
      d2d_mem_bandwidth: number;
      h2d_mem_bandwidth: number;
      d2h_mem_bandwidth: number;
      max_temp: number;
      avg_temp: number;
      max_pwr_draw: number;
      avg_pwr_draw: number;
      verifiedAt: Date;
    };
    
    // Seller Info (basic for now)
    seller: {
      id: string;
      username: string;
      avatarUrl?: string;
    };
    
    // Metadata
    listedAt: Date;
    location?: string;
    imageUrl?: string;
    status: 'active' | 'sold' | 'cancelled';
  }

  export interface GPUAverageMetrics {
    aib_partner: string;
    gpu_arch: string;
    gpu_model: string;
    vram_gb: number;
    avg_fp16_flops: number;
    avg_fp32_flops: number;
    avg_fp64_flops: number;
    avg_tensor_flops_fp16: number;
    avg_tensor_flops_bf16: number;
    avg_tensor_flops_tf32: number;
    avg_tensor_flops_fp8: number;
    avg_tensor_flops_int8: number;
    avg_d2d_mem_bandwidth: number;
    avg_d2h_mem_bandwidth: number;
    avg_h2d_mem_bandwidth: number;
    avg_max_pwr_draw: number;
    avg_max_temp: number;
    avg_avg_pwr_draw: number;
    avg_avg_temp: number;
  }