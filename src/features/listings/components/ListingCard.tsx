/*import { ListingCardData } from '../types/listing.types';
import { Badge } from '@/shared/components/Badge';

import { PriceDisplay } from '@/shared/components/PriceDisplay';
import { PerformanceMetrics } from '@/shared/components/PerformanceMetrics';

interface ListingCardProps {
  listing: ListingCardData;
  onViewDetails?: (id: string) => void; // Optional callback for view details
  className?: string; // Optional className for the card
}

export function GPUListingCard({ 
  listing, 
  onViewDetails, 
  className = '' 
}: ListingCardProps) {
  const handleViewDetails = () => {
    onViewDetails?.(listing.id);
  };

  return (
    <article 
      className={`
        group relative bg-white dark:bg-secondary rounded-xl shadow-sm hover:shadow-lg 
        border border-gray-200 dark:border-stroke transition-all duration-300 
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
            <div className="text-4xl text-text-light dark:text-text-light">
              🎮
            </div>
          </div>
        )}
        

      </div>

      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-lg text-text-light dark:text-text-light line-clamp-1">
            {listing.gpuModel}
          </h3>
          <p className="text-sm text-text-light dark:text-text-light">
            {listing.memory}
          </p>
        </div>

        <PerformanceMetrics 
          fp32Flops={listing.fp32_flops}
          tensorFlops={listing.tensor_flops_fp16}
        />

        <div className="flex items-center justify-between">
          <PriceDisplay price={listing.price} currency={listing.currency} />
        </div>

      </div>
    </article>
  );
}
*/

import { Card, CardContent, CardImage, CardHeader, CardTitle, CardSubtitle, CardFooter } from '@/shared/components/Card';
import { ListingCardData } from '../types/listing.types';
import Link from 'next/link';
import { PriceDisplay } from '@/shared/components/PriceDisplay';
import { PerformanceMetrics } from '@/shared/components/PerformanceMetrics';
import { SewingPinFilledIcon } from '@radix-ui/react-icons';
import { Label } from '@/shared/components/Label';

interface ListingCardProps {
  listing: ListingCardData;
  onViewDetails?: (id: string) => void; // Optional callback for view details
  className?: string; // Optional className for the card
}

export function ListingCard({ listing, onViewDetails, className = '' }: ListingCardProps) {
  return (
    <Link href={`/listings/${listing.id}`}>
    <Card className={className}>
      <CardImage className="border-b border-stroke">
        <img 
          src={"/gpu_example.jpg"} 
          alt={listing.gpuModel} 
          className="w-full h-full object-cover"
        />
      </CardImage>
      <CardHeader className="space-y-0 p-3">
        <CardTitle className="text-highlight dark:text-highlight">{listing.gpuModel}</CardTitle>
        <CardSubtitle className="text-text-muted dark:text-text-muted">{`${listing.memory} VRAM`}</CardSubtitle>
      </CardHeader>
      <CardContent className="text-text-light dark:text-text-light flex justify-center mb-0 pb-0"> 
        <PerformanceMetrics className="" fp16Flops={listing.fp16_flops} fp32Flops={listing.fp32_flops} avg_pwr_draw={listing.avg_pwr_draw} avg_temp={listing.avg_temp}/>
      </CardContent>
      <CardFooter className="flex justify-between items-center p-3 pb-1">
        <PriceDisplay price={listing.price} currency={listing.currency} />

        <Label variant="muted" size="sm"><SewingPinFilledIcon className="inline pb-0.5    "/>{'San Francisco, CA'}</Label>
      </CardFooter>
    </Card>
    </Link>
  );
}