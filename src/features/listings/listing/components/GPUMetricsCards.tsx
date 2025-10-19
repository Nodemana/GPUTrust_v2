'use client';

import { GPUAverageMetrics, GPUListing } from "../types/listing.types";

interface MetricCardProps {
  title: string;
  value: number;
  average: number;
  unit: string;
  formatValue?: (value: number) => string;
  isHigherBetter?: boolean;
}

function MetricCard({ title, value, average, unit, formatValue, isHigherBetter = true }: MetricCardProps) {
  const format = formatValue || ((val: number) => val.toLocaleString());
  const percentage = ((value - average) / average) * 100;
  const isAboveAverage = isHigherBetter ? percentage > 0 : percentage < 0;
  
  return (
    <div className="bg-primary dark:bg-primary rounded-lg p-4 shadow-sm border border-stroke dark:border-stroke">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium text-text-light dark:text-text-light">{title}</h4>
        <span className={`text-xs px-2 py-1 rounded-full ${
          isAboveAverage 
            ? 'bg-highlight-dark text-text-dark dark:bg-highlight-dark dark:text-text-dark' 
            : 'bg-danger text-text-light dark:bg-danger dark:text-text-light'
        }`}>
          {percentage > 0 ? '+' : ''}{percentage.toFixed(1)}%
        </span>
      </div>
      <div className="space-y-1">
        <div className="text-2xl font-bold font-mono text-gray-900 dark:text-white">
          {format(value)}{unit}
        </div>
        <div className="text-sm font-mono text-gray-500 dark:text-gray-400">
          Avg: {format(average)}{unit}
        </div>
      </div>
    </div>
  );
}

interface GPUMetricsCardsProps {
  gpuMetrics: GPUListing['benchmarkScore'];
  averageMetrics: GPUAverageMetrics;
}

export function GPUMetricsCards({ gpuMetrics, averageMetrics }: GPUMetricsCardsProps) {
  const formatFlops = (flops: number) => {
    if (flops >= 1e12) return `${(flops / 1e12).toFixed(1)} T`;
    if (flops >= 1e9) return `${(flops / 1e9).toFixed(1)} B`;
    if (flops >= 1e6) return `${(flops / 1e6).toFixed(1)} M`;
    return `${flops.toLocaleString()} `;
  };

  const formatBandwidth = (bw: number) => {
    if (bw >= 1e9) return `${(bw / 1e9).toFixed(1)}GB/s`;
    return `${bw.toLocaleString()} MB/s`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <MetricCard
        title="FP16 Performance"
        value={gpuMetrics.fp16_flops}
        average={averageMetrics.avg_fp16_flops}
        unit="FLOPS"
        formatValue={formatFlops}
      />
     <MetricCard
        title="FP32 Performance"
        value={gpuMetrics.fp32_flops}
        average={averageMetrics.avg_fp32_flops}
        unit="FLOPS"
        formatValue={formatFlops}
      />
      <MetricCard
        title="FP64 Performance"
        value={gpuMetrics.fp64_flops}
        average={averageMetrics.avg_fp64_flops}
        unit="FLOPS"
        formatValue={formatFlops}
      />
      <MetricCard
        title="Tensor Performance"
        value={gpuMetrics.tensor_flops_fp16}
        average={averageMetrics.avg_tensor_flops_fp16}
        unit="FLOPS"
        formatValue={formatFlops}
      />
      <MetricCard
        title="Tensor BF16 Performance"
        value={gpuMetrics.tensor_flops_bf16}
        average={averageMetrics.avg_tensor_flops_bf16}
        unit="FLOPS"
        formatValue={formatFlops}
      />
      <MetricCard
        title="Tensor TF32 Performance"
        value={gpuMetrics.tensor_flops_tf32}
        average={averageMetrics.avg_tensor_flops_tf32}
        unit="FLOPS"
        formatValue={formatFlops}
      />
      <MetricCard
        title="Tensor FP8 Performance"
        value={gpuMetrics.tensor_flops_fp8}
        average={averageMetrics.avg_tensor_flops_fp8}
        unit="FLOPS"
        formatValue={formatFlops}
      />
      <MetricCard
        title="Tensor INT8 Performance"
        value={gpuMetrics.tensor_flops_int8}
        average={averageMetrics.avg_tensor_flops_int8}
        unit="FLOPS"
        formatValue={formatFlops}
      />
      <MetricCard
        title="Memory Bandwidth"
        value={gpuMetrics.d2d_mem_bandwidth}
        average={averageMetrics.avg_d2d_mem_bandwidth}
        unit=""
        formatValue={formatBandwidth}
      />
      <MetricCard
        title="Average Power Draw"
        value={gpuMetrics.avg_pwr_draw}
        average={averageMetrics.avg_avg_pwr_draw}
        unit="W"
        isHigherBetter={false}
      />
      <MetricCard
        title="Max Power Draw"
        value={gpuMetrics.max_pwr_draw}
        average={averageMetrics.avg_max_pwr_draw}
        unit="W"
        isHigherBetter={false}
      />
      <MetricCard
        title="Average Temperature"
        value={gpuMetrics.avg_temp}
        average={averageMetrics.avg_avg_temp}
        unit="°C"
        isHigherBetter={false}
      />
    </div>
  );
}5
