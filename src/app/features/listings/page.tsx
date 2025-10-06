'use client';

import { useState, useEffect } from 'react';
import { GPUListingCard } from './components/GPUListingCard';
import { GPUListingCardSkeleton } from './components/GPUListingCardSkeleton';
import { ListingCardData } from './types/listing.types';
import { fetchListings } from './queries/listings';
import { useRouter } from 'next/navigation';

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
    router.push(`/features/listings/${id}`);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Error Loading Listings
          </h2>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            GPU Listings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Browse GPUs for sale
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <GPUListingCardSkeleton key={index} />
            ))}
          </div>
        ) : (
          /* Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings.map((listing) => (
              <GPUListingCard
                key={listing.id}
                listing={listing}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && listings.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No listings found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Check back later for new GPU listings.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}