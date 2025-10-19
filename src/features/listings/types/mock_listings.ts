import { ListingCardData } from './listing.types';

// Mock data for demonstration - replace with your actual API calls
export const mockListings: ListingCardData[] = [
  {
    id: '1',
    gpuModel: 'NVIDIA RTX 4090',
    memory: '24GB GDDR6X',
    price: '3.5',
    fp32_flops: 83e12,
    tensor_flops_fp16: 165e12,
    imageUrl: 'https://images.unsplash.com/photo-1591799264318-7e155efd0c50?w=400'
  },
  {
    id: '2',
    gpuModel: 'NVIDIA RTX 4080',
    memory: '16GB GDDR6X',
    price: '2.8',
    fp32_flops: 48e12,
    tensor_flops_fp16: 96e12,
    imageUrl: 'https://images.unsplash.com/photo-1591799264318-7e155efd0c50?w=400'
  },
  {
    id: '3',
    gpuModel: 'AMD RX 7900 XTX',
    memory: '24GB GDDR6',
    price: '2.2',
    fp32_flops: 61e12,
    tensor_flops_fp16: 122e12,
  }
];

// This would be your actual API function
export async function fetchListings(): Promise<ListingCardData[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In real app, you'd call your Supabase API here:
  // const { data, error } = await supabase
  //   .from('gpu_listings')
  //   .select('*')
  //   .limit(20);
  
  return mockListings;
}
