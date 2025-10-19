export interface ListingCardData {
    id: string;
    gpuModel: string;
    memory: string;          // "24GB GDDR6X"
    price: string;           // "3 SOL"
    currency: string;
    fp16_flops: number;
    fp32_flops: number;
    avg_pwr_draw: number;
    avg_temp: number;
    imageUrl?: string;
  }