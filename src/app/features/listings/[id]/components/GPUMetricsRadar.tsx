'use client';

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { GPUAverageMetrics, GPUListing } from '../types/listing.types';

interface GPUMetricsRadarProps {
  gpuMetrics: GPUListing['benchmarkScore'];
  averageMetrics: GPUAverageMetrics; 
  bestPossibleMetrics?: {
    fp32_flops: number;
    fp16_flops: number;
    tensor_flops_fp16: number;
    d2d_mem_bandwidth: number;
    max_pwr_draw: number;
    max_temp: number;
  };
}

export function GPUMetricsRadar({ gpuMetrics, averageMetrics, bestPossibleMetrics }: GPUMetricsRadarProps) {
  // Calculate best possible metrics with proper handling for "lower is better" metrics
  const bestMetrics = bestPossibleMetrics || {
    fp32_flops: Math.max(gpuMetrics.fp32_flops, averageMetrics.avg_fp32_flops) * 1.2,
    fp16_flops: Math.max(gpuMetrics.fp16_flops, averageMetrics.avg_fp16_flops) * 1.2,
    tensor_flops_fp16: Math.max(gpuMetrics.tensor_flops_fp16, averageMetrics.avg_tensor_flops_fp16) * 1.2,
    d2d_mem_bandwidth: Math.max(gpuMetrics.d2d_mem_bandwidth, averageMetrics.avg_d2d_mem_bandwidth) * 1.2,
    // For power and temp, best means lowest values
    max_pwr_draw: Math.min(gpuMetrics.max_pwr_draw, averageMetrics.avg_max_pwr_draw) * 0.8,
    max_temp: Math.min(gpuMetrics.max_temp, averageMetrics.avg_max_temp) * 0.8,
  };

  // Normalize function that handles both "higher is better" and "lower is better" metrics
  const normalizeValue = (value: number, bestValue: number, isLowerBetter: boolean = false) => {
    if (isLowerBetter) {
      // For lower-is-better metrics, we want to show how close to the best (lowest) value we are
      // If current value equals best value, score is 100%
      // If current value is much higher than best, score approaches 0%
      const range = bestValue * 2; // Assume worst case is 2x the best value
      const normalized = Math.max(0, Math.min(100, ((range - value) / (range - bestValue)) * 100));
      return normalized;
    } else {
      // For higher-is-better metrics, standard normalization
      return Math.min((value / bestValue) * 100, 100);
    }
  };
  
  const data = [
    {
      metric: 'FP32 FLOPS',
      current: normalizeValue(gpuMetrics.fp32_flops, bestMetrics.fp32_flops),
      average: normalizeValue(averageMetrics.avg_fp32_flops, bestMetrics.fp32_flops),
      best: 100, // Best possible is always 100%
    },
    {
      metric: 'FP16 FLOPS', 
      current: normalizeValue(gpuMetrics.fp16_flops, bestMetrics.fp16_flops),
      average: normalizeValue(averageMetrics.avg_fp16_flops, bestMetrics.fp16_flops),
      best: 100,
    },
    {
      metric: 'Tensor FLOPS',
      current: normalizeValue(gpuMetrics.tensor_flops_fp16, bestMetrics.tensor_flops_fp16),
      average: normalizeValue(averageMetrics.avg_tensor_flops_fp16, bestMetrics.tensor_flops_fp16),
      best: 100,
    },
    {
      metric: 'Memory BW',
      current: normalizeValue(gpuMetrics.d2d_mem_bandwidth, bestMetrics.d2d_mem_bandwidth),
      average: normalizeValue(averageMetrics.avg_d2d_mem_bandwidth, bestMetrics.d2d_mem_bandwidth),
      best: 100,
    },
    {
      metric: 'Power Efficiency',
      current: normalizeValue(gpuMetrics.max_pwr_draw, bestMetrics.max_pwr_draw, true),
      average: normalizeValue(averageMetrics.avg_max_pwr_draw, bestMetrics.max_pwr_draw, true),
      best: 100,
    },
    {
      metric: 'Thermal Efficiency',
      current: normalizeValue(gpuMetrics.max_temp, bestMetrics.max_temp, true),
      average: normalizeValue(averageMetrics.avg_max_temp, bestMetrics.max_temp, true),
      best: 100,
    },
  ];

  // Calculate auto-scaling domain
  const calculateDomain = () => {
    // Get all values from all datasets
    const allValues = data.flatMap(d => [d.current, d.average, d.best]);
    
    // Find min and max values
    const minValue = Math.floor(Math.min(...allValues));
    const maxValue = Math.floor(Math.max(...allValues));
    
    // Add some padding (10% on each side, but at least 5 points)
    const padding = Math.max(5, (maxValue - minValue) * 0.1);
    const domainMin = Math.floor(Math.max(0, minValue - padding) / 5) * 5;
    const domainMax = Math.ceil(Math.min(100, maxValue + padding) / 5) * 5;
    
    return [domainMin, domainMax];
  };

  const domain = calculateDomain();

  return (
    <div className="bg-primary dark:bg-primary rounded-lg p-6 shadow-sm border border-stroke dark:border-stroke">
      <h3 className="text-2xl font-sans font-bold text-text-light dark:text-text-light mb-4">
        Relative Performance
      </h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="metric" />
            <PolarRadiusAxis angle={90} domain={domain} />
            <Tooltip
              formatter={(value, name) => [`${Math.floor(value as number)}%`, name]}
              contentStyle={{
                backgroundColor: '#1f2937', 
                borderColor: '#374151',   
                color: '#e5e7eb',         
                borderRadius: '8px',      
                boxShadow: 'none',        
              }}
              labelStyle={{
                color: '#e5e7eb',         
                fontWeight: 'bold',
              }}
            />
            <Radar
              name="This GPU" 
              dataKey="current" 
              stroke="#3b82f6" 
              fill="#3b82f6" 
              fillOpacity={0.2} 
              strokeWidth={2}
            />
            <Radar
              name="Average"
              dataKey="average"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.1}
              strokeWidth={2}
            />
            <Radar
              name="Best"
              dataKey="best"
              stroke="#f59e0b"
              fill="#f59e0b"
              fillOpacity={0.05}
              strokeWidth={1}
              strokeDasharray="5 5"
            />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 text-sm text-text-light dark:text-text-light">
        <p className="mb-2">
          <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
          <strong>This GPU:</strong> Current performance metrics
        </p>
        <p className="mb-2">
          <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
          <strong>Average:</strong> Typical performance for this GPU model
        </p>
        <p className="mb-2">
          <span className="inline-block w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
          <strong>Best:</strong> Top known performance for this GPU model
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
          <em>Note: Power Efficiency and Thermal Efficiency show how close to optimal (lowest) values the GPU performs.</em>
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
          <em>Chart auto-scales to show data range: {domain[0].toFixed(0)}% - {domain[1].toFixed(0)}%</em>
        </p>
      </div>
    </div>
  );
}
