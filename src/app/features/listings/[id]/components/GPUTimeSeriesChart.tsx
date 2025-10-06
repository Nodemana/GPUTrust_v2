'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface TimeSeriesData {
  timestamp: string;
  fp32_flops: number;
  fp16_flops: number;
  power_draw: number;
  temperature: number;
}

interface GPUTimeSeriesChartProps {
  data: TimeSeriesData[];
  className?: string;
}

export function GPUTimeSeriesChart({ data, className = '' }: GPUTimeSeriesChartProps) {
  const formatFlops = (value: number) => {
    if (value >= 1e12) return `${(value / 1e12).toFixed(1)}T FLOPS`;
    if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B FLOPS`;
    return `${(value / 1e6).toFixed(1)}M FLOPS`;
  };

  const formatTooltip = (value: number, name: string) => {
    switch (name) {
      case 'fp32_flops':
      case 'fp16_flops':
        return [formatFlops(value), name === 'fp32_flops' ? 'FP32 FLOPS' : 'FP16 FLOPS'];
      case 'power_draw':
        return [`${value.toFixed(1)}W`, 'Power Draw'];
      case 'temperature':
        return [`${value.toFixed(1)}°C`, 'Temperature'];
      default:
        return [value, name];
    }
  };

  return (
    <div className={`bg-primary dark:bg-primary rounded-lg p-6 shadow-sm border border-stroke dark:border-stroke ${className}`}>
      <h3 className="text-lg font-sans font-bold text-text-light dark:text-text-light mb-4">
        Last Recorded Benchmark
      </h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={(value) => new Date(value).toLocaleTimeString()}
            />
            <YAxis yAxisId="flops" orientation="left" />
            <YAxis yAxisId="other" orientation="right" />
            <Tooltip 
              formatter={formatTooltip}
              labelFormatter={(value) => new Date(value).toLocaleString()}
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
            <Legend />
            <Line
              yAxisId="flops"
              type="monotone"
              dataKey="fp32_flops"
              stroke="#3b82f6"
              strokeWidth={2}
              name="FP32 FLOPS"
            />
            <Line
              yAxisId="flops"
              type="monotone"
              dataKey="fp16_flops"
              stroke="#10b981"
              strokeWidth={2}
              name="FP16 FLOPS"
            />
            <Line
              yAxisId="other"
              type="monotone"
              dataKey="power_draw"
              stroke="#f59e0b"
              strokeWidth={2}
              name="Power Draw"
            />
            <Line
              yAxisId="other"
              type="monotone"
              dataKey="temperature"
              stroke="#ef4444"
              strokeWidth={2}
              name="Temperature"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
