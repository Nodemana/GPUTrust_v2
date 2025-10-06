import { GPUAverageMetrics, GPUListing } from '../types/listing.types';
import { supabase } from '@/app/shared/queries/dbclient';

export async function fetchGPUListing(id: string): Promise<GPUListing> {
  const { data, error } = await supabase
    .from('gpu_listings')
    .select(`
      id,
      title,
      price_amount,
      price_currency,
      image_urls,
      description,
      location,
      status,
      created_at,
      user_id,
      gpu_benchmarks!inner (
        inserted_at,
        gpu_model,
        gpu_arch,
        gpu_aib_partner,
        uuid,
        vram_gb,
        num_sm,
        cuda_version,
        driver_version,
        fp16_flops,
        fp32_flops,
        fp64_flops,
        tensor_flops_fp16,
        tensor_flops_bf16,
        tensor_flops_tf32,
        tensor_flops_int8,
        tensor_flops_fp8,
        d2d_mem_bandwidth,
        h2d_mem_bandwidth,
        d2h_mem_bandwidth,
        max_temp,
        avg_temp,
        max_pwr_draw,
        avg_pwr_draw,
        cuda_cores,
        tensor_cores,
        rt_cores
      ),
      users!inner (
        id,
        username
      )
    `)
    .eq('id', parseInt(id))
    .single(); // Use .single() to get one record instead of an array
  if (error) throw error;
  if (!data) throw new Error('GPU listing not found');

  // Transform the single record into GPUListing format
  const listing: GPUListing = {
    id: data.id.toString(),
    gpu: {
      model: data.gpu_benchmarks.gpu_model || 'Unknown GPU',
      aib_partner: data.gpu_benchmarks.gpu_aib_partner || 'Unknown AIB Partner',
      uuid: data.gpu_benchmarks.uuid || 'Unknown UUID',
      gpuArch: data.gpu_benchmarks.gpu_arch || 'Unknown GPU Arch',
      manufacturer: 'NVIDIA', // You might want to determine this from the model
      memory: data.gpu_benchmarks.vram_gb || 0,
      memoryType: 'GDDR6X', // You might want to determine this from the model
      num_sm: data.gpu_benchmarks.num_sm || 0,
      cudaCores: data.gpu_benchmarks.cuda_cores || 0, 
      tensorCores: data.gpu_benchmarks.tensor_cores || 0, 
      rtCores: data.gpu_benchmarks.rt_cores || 0, 
    },
    price: {
      amount: data.price_amount || 0,
    },
    benchmarkScore: {
      cudaVersion: data.gpu_benchmarks.cuda_version || 'Unknown',
      driverVersion: data.gpu_benchmarks.driver_version || 'Unknown',
      fp16_flops: data.gpu_benchmarks.fp16_flops || 0,
      fp32_flops: data.gpu_benchmarks.fp32_flops || 0,
      fp64_flops: data.gpu_benchmarks.fp64_flops || 0,
      tensor_flops_fp16: data.gpu_benchmarks.tensor_flops_fp16 || 0,
      tensor_flops_bf16: data.gpu_benchmarks.tensor_flops_bf16 || 0,
      tensor_flops_tf32: data.gpu_benchmarks.tensor_flops_tf32 || 0,
      tensor_flops_int8: data.gpu_benchmarks.tensor_flops_int8 || 0,
      tensor_flops_fp8: data.gpu_benchmarks.tensor_flops_fp8 || 0,
      d2d_mem_bandwidth: data.gpu_benchmarks.d2d_mem_bandwidth || 0,
      h2d_mem_bandwidth: data.gpu_benchmarks.h2d_mem_bandwidth || 0,
      d2h_mem_bandwidth: data.gpu_benchmarks.d2h_mem_bandwidth || 0,
      max_temp: data.gpu_benchmarks.max_temp || 0,
      avg_temp: data.gpu_benchmarks.avg_temp || 0,
      max_pwr_draw: data.gpu_benchmarks.max_pwr_draw || 0,
      avg_pwr_draw: data.gpu_benchmarks.avg_pwr_draw || 0,
      verifiedAt: new Date(data.gpu_benchmarks.inserted_at),
    },
    seller: {
      id: data.users.id,
      username: data.users.username || 'Unknown',
      avatarUrl: undefined,
    },
    listedAt: new Date(data.created_at || 'Unknown'),
    location: data.location || 'Unknown',
    imageUrl: data.image_urls?.[0],
    status: data.status as 'active' | 'sold' | 'cancelled',
  };

  return listing;
}

export async function fetchAverageMetrics(model: string, aib_partner: string, gpu_arch: string, vram_gb: number): Promise<any> {
  const { data, error } = await supabase
    .from('avg_gpu_benchmarks')
    .select('*')
    .eq('gpu_model', model)
    .eq('gpu_aib_partner', aib_partner)
    .eq('gpu_arch', gpu_arch)
    .eq('vram_gb', vram_gb)
    .single();
    console.log('Average metrics query result:', { data, error });
  if (error) throw error;
  if (!data) throw new Error('Average metrics not found');
  const averageMetrics: GPUAverageMetrics = {
    aib_partner: data.gpu_aib_partner,
    gpu_arch: data.gpu_arch,
    gpu_model: data.gpu_model,
    vram_gb: data.vram_gb,
    avg_fp16_flops: data.avg_fp16_flops || 0,
    avg_fp32_flops: data.avg_fp32_flops || 0  ,
    avg_fp64_flops: data.avg_fp64_flops || 0,
    avg_tensor_flops_fp16: data.avg_tensor_flops_fp16 || 0,
    avg_tensor_flops_bf16: data.avg_tensor_flops_bf16 || 0,
    avg_tensor_flops_tf32: data.avg_tensor_flops_tf32 || 0,
    avg_tensor_flops_fp8: data.avg_tensor_flops_fp8 || 0,
    avg_tensor_flops_int8: data.avg_tensor_flops_int8 || 0,
    avg_d2d_mem_bandwidth: data.avg_d2d_mem_bandwidth || 0,
    avg_d2h_mem_bandwidth: data.avg_d2h_mem_bandwidth || 0,
    avg_h2d_mem_bandwidth: data.avg_h2d_mem_bandwidth || 0,
    avg_max_pwr_draw: data.avg_max_pwr_draw || 0,
    avg_max_temp: data.avg_max_temp || 0,
    avg_avg_pwr_draw: data.avg_avg_pwr_draw || 0,
    avg_avg_temp: data.avg_avg_temp || 0,
  };
  return averageMetrics;
}