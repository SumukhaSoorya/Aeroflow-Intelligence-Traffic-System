import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  Cell 
} from 'recharts';
import { useAviation } from '../context/AviationContext';

export const RouteFareChart: React.FC = () => {
  const { faresSummary } = useAviation();

  const chartData = faresSummary.route_fares
    .sort((a, b) => b.avg_fare - a.avg_fare)
    .map((item) => ({
      route: `${item.source} → ${item.destination}`,
      avgFare: Math.round(item.avg_fare),
      minFare: Math.round(item.min_fare),
      maxFare: Math.round(item.max_fare),
      fareCount: item.fare_count,
    }));

  const colors = ['#38BDF8', '#818CF8', '#A78BFA', '#34D399', '#FBBF24', '#F472B6'];

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={chartData} 
          layout="vertical"
          margin={{ top: 10, right: 30, left: 40, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" horizontal={false} />
          <XAxis 
            type="number"
            tick={{ fill: '#94A3B8', fontSize: 11 }}
            tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
          />
          <YAxis 
            type="category" 
            dataKey="route" 
            tick={{ fill: '#E2E8F0', fontSize: 11, fontWeight: 500 }}
            width={140}
          />
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="aviation-card rounded-xl p-3 border border-slate-700 text-xs shadow-xl backdrop-blur-md">
                    <p className="font-bold text-white mb-1.5">{data.route}</p>
                    <p className="text-sky-400 font-semibold">Average Fare: ₹{data.avgFare.toLocaleString()}</p>
                    <p className="text-slate-400">Min Fare: ₹{data.minFare.toLocaleString()}</p>
                    <p className="text-slate-400">Max Fare: ₹{data.maxFare.toLocaleString()}</p>
                    <p className="text-slate-500 text-[10px] mt-1 pt-1 border-t border-slate-800">
                      Based on {data.fareCount.toLocaleString()} observations
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="avgFare" radius={[0, 6, 6, 0]}>
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} fillOpacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
