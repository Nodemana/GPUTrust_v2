export interface ListingCardData {
    id: string;
    gpuModel: string;
    memory: string;          // "24GB GDDR6X"
    price: string;           // "3 SOL"
    currency: string;
    fp32_flops: number;
    tensor_flops_fp16: number;
    imageUrl?: string;
  }