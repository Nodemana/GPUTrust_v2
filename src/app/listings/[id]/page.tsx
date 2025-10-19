'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { GPUDetailsCardSkeleton } from '@/features/listings/listing/components/GPUDetailsCardSkeleton';
import { RelativeRadar } from '@/features/listings/listing/components/RelativeRadar';
import { GPUMetricsCards } from '@/features/listings/listing/components/GPUMetricsCards';
import { GPUTimeSeriesChart } from '@/features/listings/listing/components/GPUTimeSeriesChart';
import { Map } from '@/features/listings/listing/components/Map';
import { GPUListing } from '@/features/listings/listing/types/listing.types';
import { fetchAverageMetrics, fetchGPUListing } from '@/features/listings/listing/queries/details';
import { Button } from '@/shared/components/Button';
import { ContactPopup } from '@/features/listings/listing/components/ContactPopup';
import { GraphCard } from '@/features/listings/listing/components/GraphCard';


export default function GPUListingDetailsPage() {
  const [gpuListing, setGpuListing] = useState<GPUListing | null>(null);
  const [averageMetrics, setAverageMetrics] = useState<any>(null);
  const [bestPossibleMetrics, setBestPossibleMetrics] = useState<any>(null);
  const [timeSeriesData, setTimeSeriesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const listingId = params.id as string;

  useEffect(() => {
    async function loadGPUListing() {
      try {
        setLoading(true);
        // TODO: Implement actual data fetching
        // const bestmetrics = await fetchBestMetrics(listing.gpu.model, listing.gpu.aib_partner, listing.gpu.gpuArch, listing.gpu.memory);
        // const timeData = await fetchTimeSeriesData(data.benchmark_id);
        const listing = await fetchGPUListing(listingId);
        
        const avgMetrics = await fetchAverageMetrics(listing.gpu.model, listing.gpu.aib_partner, listing.gpu.gpuArch, listing.gpu.memory);

        // Best possible metrics - these would ideally come from your database
        // representing the highest recorded values for this GPU model
        const mockBestPossibleMetrics = {
          fp32_flops: 90000000000000,  // 10% above average
          fp16_flops: 180000000000000, // 12% above average
          tensor_flops_fp16: 1500000000000000, // 15% above average
          tensor_flops_bf16: 1500000000000000, // 15% above average
          tensor_flops_tf32: 1500000000000000, // 15% above average
          tensor_flops_fp8: 3000000000000000, // 15% above average
          tensor_flops_int8: 3000000000000000, // 15% above average
          d2d_mem_bandwidth: 1100000000000,   // 10% above average
          avg_pwr_draw: 350,  // Lower is better for power
          avg_temp: 75,
          max_pwr_draw: 390,  // Lower is better for power
          max_temp: 75        // Lower is better for temperature
        };

        const mockTimeSeriesData = Array.from({ length: 24 }, (_, i) => ({
          timestamp: new Date(Date.now() - (23 - i) * 60 * 60 * 1000).toISOString(),
          fp32_flops: 83000000000000 + Math.random() * 1000000000000,
          fp16_flops: 165000000000000 + Math.random() * 2000000000000,
          fp64_flops: 1290000000000 + Math.random() * 100000000000,
          tensor_flops_fp16: 1320000000000000 + Math.random() * 200000000000000,
          tensor_flops_bf16: 1320000000000000 + Math.random() * 200000000000000,
          tensor_flops_tf32: 1320000000000000 + Math.random() * 200000000000000,
          tensor_flops_fp8: 2640000000000000 + Math.random() * 200000000000000,
          tensor_flops_int8: 2640000000000000 + Math.random() * 200000000000000,
          power_draw: 400 + Math.random() * 50,
          temperature: 75 + Math.random() * 8
        }));

        setGpuListing(listing);
        setAverageMetrics(avgMetrics);
        setBestPossibleMetrics(mockBestPossibleMetrics);
        setTimeSeriesData(mockTimeSeriesData);
      } catch (err) {
        setError('Failed to load GPU details');
        console.error('Error loading GPU details:', err);
      } finally {
        setLoading(false);
      }
    }

    if (listingId) {
      loadGPUListing();
    }
  }, [listingId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-primary dark:bg-primary py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <GPUDetailsCardSkeleton />
        </div>
      </div>
    );
  }

  if (error || !gpuListing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-text-light dark:text-text-dark mb-2">
            GPU Not Found
          </h2>
          <p className="text-text-light dark:text-text-dark">{error || 'This GPU listing could not be found.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary dark:bg-primary py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-highlight dark:text-highlight">
            {gpuListing.gpu.model}
          </h1>
          <p className="text-text-light dark:text-text-light mt-2">
            {gpuListing.gpu.manufacturer} • {gpuListing.gpu.memory}GB {gpuListing.gpu.memoryType}
          </p>
        </div>
        <div className="flex flex-col items-end">
            <div className="text-4xl font-sans font-bold text-highlight dark:text-highlight">
              {gpuListing.price.amount} SOL
            </div>
            <div className="text-sm text-text-light dark:text-text-light">
              ≈ ${(gpuListing.price.amount * 100).toLocaleString()} USD
            </div>
          </div>
        </div>
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column - Key Metrics */}
          <div className="lg:col-span-2 space-y-8">
            {/* Performance Comparison Radar Chart */}
            <GraphCard 
              title="Relative Performance" 
              graph={<RelativeRadar gpuMetrics={gpuListing.benchmarkScore} averageMetrics={averageMetrics} bestPossibleMetrics={bestPossibleMetrics}  
              />} className="border-none stroke-none" />
          </div>

          {/* Right Column - Details and Metrics Cards */}
          <div className="space-y-4">
            {/* GPU Details Card */}
            <div className="bg-primary dark:bg-primary rounded-lg p-6 shadow-sm border border-stroke dark:border-stroke">
              <h3 className="text-2xl font-sans font-bold text-text-light dark:text-text-light mb-4">
                GPU Specifications
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-text-light dark:text-text-light">Architecture:</span>
                  <span className="font-medium font-mono">{gpuListing.gpu.gpuArch}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-light dark:text-text-light">AIB Partner:</span>
                  <span className="font-medium font-mono">{gpuListing.gpu.aib_partner}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-light dark:text-text-light">Memory:</span>
                  <span className="font-medium font-mono">{gpuListing.gpu.memory}GB {gpuListing.gpu.memoryType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-light dark:text-text-light">Streaming Multiprocessors:</span>
                  <span className="font-medium font-mono">{gpuListing.gpu.num_sm}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-light dark:text-text-light">CUDA Cores:</span>
                  <span className="font-medium font-mono">{gpuListing.gpu.cudaCores}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-light dark:text-text-light">Tensor Cores:</span>
                  <span className="font-medium font-mono">{gpuListing.gpu.tensorCores}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-light dark:text-text-light">RT Cores:</span>
                  <span className="font-medium font-mono">{gpuListing.gpu.rtCores}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-light dark:text-text-light">CUDA Version:</span>
                  <span className="font-medium font-mono">{gpuListing.benchmarkScore.cudaVersion}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-light dark:text-text-light">Driver:</span>
                  <span className="font-medium font-mono">{gpuListing.benchmarkScore.driverVersion}</span>
                </div>
              </div>
            </div>

            {/* Price Card */}
            <div className="bg-primary dark:bg-primary rounded-lg p-6 shadow-sm border border-stroke dark:border-stroke">
              <h3 className="text-lg font-sans font-semibold text-text-light dark:text-text-light mb-1">
                    Seller Information
              </h3>
                {/* Location Map */}
                  <div className="mb-4">
                    <Map 
                      location={gpuListing.location} 
                      className="w-full"
                    />
                  </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Seller */}
                <div>
                  
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        {gpuListing.seller.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium font-semibold font-sans text-text-light dark:text-text-light">
                        {gpuListing.seller.username}
                      </div>
                      <div className="text-sm font-sans text-gray-500 dark:text-gray-400">
                        Listed {gpuListing.listedAt.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  
                </div>
              <div className="flex align-center justify-end mt-2 mb-4 mr-4">
                {/*<Button onClick={() => {ContactPopup(gpuListing.seller.id, "five", (seller_id, user_id) => {console.log(seller_id, user_id);});}} variant="primary" size="sm">
                        Contact Seller
                </Button>*/}
              </div>
              </div>
            </div>
          </div>
        </div>

        {/* Time Series Chart */}
        <div className="mt-8">
            <GPUTimeSeriesChart data={timeSeriesData} />
        </div>
        {/* Detailed Metrics Cards */}
        {averageMetrics && (
          <div className="mt-8">
            <h2 className="text-3xl font-sans font-bold text-text-light dark:text-text-light mb-6">
              Performance Metrics
            </h2>
            <GPUMetricsCards 
              gpuMetrics={gpuListing.benchmarkScore}
              averageMetrics={averageMetrics}
            />
          </div>
        )}
      </div>
    </div>
  );
}