interface PerformanceMetricsProps {
    fp32Flops: number;
    tensorFlops: number;
    className?: string;
  }
  
  export function PerformanceMetrics({ 
    fp32Flops, 
    tensorFlops, 
    className = '' 
  }: PerformanceMetricsProps) {
    const formatFlops = (flops: number) => {
      if (flops >= 1e12) {
        return `${(flops / 1e12).toFixed(1)}T`;
      } else if (flops >= 1e9) {
        return `${(flops / 1e9).toFixed(1)}B`;
      } else if (flops >= 1e6) {
        return `${(flops / 1e6).toFixed(1)}M`;
      }
      return flops.toLocaleString();
    };
  
    return (
      <div className={`space-y-2 ${className}`}>
      <span className="text-green-600 dark:text-green-400">Metrics</span>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">FP32:</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {formatFlops(fp32Flops)} FLOPS
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Tensor FP16:</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {formatFlops(tensorFlops)} FLOPS
          </span>
        </div>
      </div>
    );
  }