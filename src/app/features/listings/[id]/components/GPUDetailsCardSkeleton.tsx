interface GPUDetailsCardSkeletonProps {
  className?: string;
}

export function GPUDetailsCardSkeleton({ 
  className = '' 
}: GPUDetailsCardSkeletonProps) {
  return (
    <article 
      className={`
        relative bg-white dark:bg-gray-800 rounded-xl shadow-sm 
        border border-gray-200 dark:border-gray-700 overflow-hidden
        ${className}
      `}
    >
      {/* Image Section Skeleton */}
      <div className="relative aspect-video bg-secondary dark:bg-secondary animate-pulse">
        {/* Status Badge Skeleton */}
        <div className="absolute top-3 right-3">
          <div className="h-6 w-16 bg-secondary dark:bg-secondary rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Content Section Skeleton */}
      <div className="p-4 space-y-3">
        {/* GPU Model Skeleton */}
        <div>
          <div className="h-6 w-3/4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse mb-2"></div>
          <div className="h-4 w-1/2 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
        </div>

        {/* Performance Metrics Skeleton */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <div className="h-4 w-20 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
            <div className="h-4 w-16 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
          </div>
          <div className="flex justify-between">
            <div className="h-4 w-24 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
            <div className="h-4 w-20 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Price Skeleton */}
        <div className="flex items-center justify-between">
          <div className="h-6 w-20 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
        </div>

        {/* Action Buttons Skeleton */}
        <div className="flex gap-2 pt-2">
          <div className="flex-1 h-10 bg-gray-300 dark:bg-gray-600 rounded-lg animate-pulse"></div>
          <div className="flex-1 h-10 bg-gray-300 dark:bg-gray-600 rounded-lg animate-pulse"></div>
        </div>
      </div>
    </article>
  );
}

