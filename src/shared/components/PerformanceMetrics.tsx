interface PerformanceMetricsProps {
    fp32Flops: number;
    fp16Flops: number;
    avg_pwr_draw: number;
    avg_temp: number;
    className?: string;
  }
  
  export function PerformanceMetrics({ 
    fp32Flops, 
    fp16Flops,
    avg_pwr_draw,
    avg_temp,
    className = '' 
  }: PerformanceMetricsProps) {
    const formatFlops = (flops: number) => {
      if (flops >= 1e12) {
        return `${(flops / 1e12).toFixed(1)} T`;
      } else if (flops >= 1e9) {
        return `${(flops / 1e9).toFixed(1)} B`;
      } else if (flops >= 1e6) {
        return `${(flops / 1e6).toFixed(1)} M`;
      }
      return flops.toLocaleString();
    };

    const formatPower = (power: number) => {
      return `${power} W`;
    };

    const formatTemp = (temp: number) => {
      return `${temp}°C`;
    };
  
    return (
      <div className={`grid grid-cols-2 gap-6 ${className}`}>
        {/* Left column - FP32 and FP16 */}
        <div className="space-y-0">
          <div className="relative">
            <div className="text-xs text-gray-500 mb-0">FP32</div>
            <div className="text-lg font-medium mb-0">{formatFlops(fp32Flops)}</div>
          </div>
          {fp16Flops && (
            <div className="relative">
              <div className="text-xs text-gray-500 mb-0">FP16</div>
              <div className="text-lg font-medium mb-0">{formatFlops(fp16Flops)}</div>
            </div>
          )}
        </div>
        
        {/* Right column - Power and Temperature */}
        <div className="space-y-0">
          <div className="relative">
            <div className="text-xs text-gray-500 mb-0">Avg Power</div>
            <div className="text-lg font-medium mb-0">{formatPower(avg_pwr_draw)}</div>
          </div>
          <div className="relative">
            <div className="text-xs text-gray-500 mb-0">Temperature</div>
            <div className="text-lg font-medium mb-0">{formatTemp(avg_temp)}</div>
          </div>
        </div>
      </div>
    );
  }