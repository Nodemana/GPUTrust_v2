'use client';

import { useState, useEffect } from 'react';
import { ListingCard } from '@/features/listings/components/ListingCard';
import { ListingCardSkeleton } from '@/features/listings/components/ListingCardSkeleton';
import { ListingCardData } from '@/features/listings/types/listing.types';
import { fetchListings } from '@/features/listings/queries/listings';
import { useRouter } from 'next/navigation';
import { ListingsToolbar } from '@/features/listings/components/Toolbar';

export default function ListingsPage() {
  const [listings, setListings] = useState<ListingCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    async function loadListings() {
      try {
        setLoading(true);
        const data = await fetchListings();
        setListings(data);
      } catch (err) {
        setError('Failed to load listings');
        console.error('Error loading listings:', err);
      } finally {
        setLoading(false);
      }
    }

    loadListings();
  }, []);

  const handleViewDetails = (id: string) => {
    console.log('View details for listing:', id);
    router.push(`/listings/${id}`);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold font-sans text-text-light dark:text-text-light mb-2">
            Error Loading Listings
          </h2>
          <p className="text-text-light dark:text-text-light">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary dark:bg-primary py-8">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ListingsToolbar />

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <ListingCardSkeleton key={index} />
            ))}
          </div>
        ) : (
          /* Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {listings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                onViewDetails={handleViewDetails}
                className="bg-secondary dark:bg-secondary border border-stroke dark:border-stroke"
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && listings.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold font-sans text-text-light dark:text-text-light mb-2">
              No listings found
            </h3>
            <p className="text-text-light dark:text-text-light">
              Check back later for new GPU listings.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}