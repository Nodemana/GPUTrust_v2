import { ListingCardData } from '../types/listing.types';
import { Badge } from '@/app/shared/components/Badge';
import { PriceDisplay } from '@/app/shared/components/PriceDisplay';
import { PerformanceMetrics } from '@/app/shared/components/PerformanceMetrics';

interface GPUListingCardProps {
  listing: ListingCardData;
  onViewDetails?: (id: string) => void; // Optional callback for view details
  className?: string; // Optional className for the card
}

export function GPUListingCard({ 
  listing, 
  onViewDetails, 
  className = '' 
}: GPUListingCardProps) {
  const handleViewDetails = () => {
    onViewDetails?.(listing.id);
  };

  return (
    <article 
      className={`
        group relative bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg 
        border border-gray-200 dark:border-gray-700 transition-all duration-300 
        hover:scale-[1.02] cursor-pointer overflow-hidden
        ${className}
      `}
      onClick={handleViewDetails}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleViewDetails();
        }
      }}
      aria-label={`View details for ${listing.gpuModel}`}
    >
      {/* Image Section */}
      <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
        {listing.imageUrl ? (
          <img
            src={listing.imageUrl}
            alt={`${listing.gpuModel} GPU`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-4xl text-gray-400 dark:text-gray-500">
              🎮
            </div>
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <Badge variant="success" size="sm">
            Available
          </Badge>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-3">
        {/* GPU Model */}
        <div>
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white line-clamp-1">
            {listing.gpuModel}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {listing.memory}
          </p>
        </div>

        {/* Performance Metrics */}
        <PerformanceMetrics 
          fp32Flops={listing.fp32_flops}
          tensorFlops={listing.tensor_flops_fp16}
        />

        {/* Price */}
        <div className="flex items-center justify-between">
          <PriceDisplay price={listing.price} currency={listing.currency} />
        </div>

      </div>
    </article>
  );
}
