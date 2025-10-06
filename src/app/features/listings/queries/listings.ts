import { ListingCardData } from '../types/listing.types';
import { supabase } from '@/app/shared/queries/dbclient';

export async function fetchListings(): Promise<ListingCardData[]> {
  const { data, error } = await supabase
    .from('gpu_listings')
    .select(`
      id,
      title,
      price_amount,
      price_currency,
      image_urls,
      gpu_benchmarks!inner (
        gpu_model,
        vram_gb,
        fp32_flops,
        tensor_flops_fp16
      )
    `)
    .limit(20);

  if (error) throw error;

  return data.map(listing => ({
    id: listing.id.toString(),
    gpuModel: listing.gpu_benchmarks.gpu_model || 'Unknown GPU',
    memory: `${listing.gpu_benchmarks.vram_gb || 0}GB`,
    price: listing.price_amount.toString(),
    currency: listing.price_currency,
    fp32_flops: listing.gpu_benchmarks.fp32_flops || 0,
    tensor_flops_fp16: listing.gpu_benchmarks.tensor_flops_fp16 || 0,
    imageUrl: listing.image_urls?.[0]
  })) as ListingCardData[];
}