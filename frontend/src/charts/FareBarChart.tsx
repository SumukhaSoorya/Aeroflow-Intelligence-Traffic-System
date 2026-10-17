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

export const FareBarChart: React.FC = () => {
  const { faresSummary, airlines } = useAviation();

  const colorMap = new Map(airlines.map(a => [a.name, a.color_hex]));

  const chartData = faresSummary.airline_fares
    .filter(a => a.fare_count > 5)
    .sort((a, b) => b.avg_fare - a.avg_fare)
    .map(item => ({
      name: item.airline,
      avgFare: Math.round(item.avg_fare),
      minFare: Math.round(item.min_fare),
      maxFare: Math.round(item.max_fare),
      fareCount: item.fare_count,
      color: colorMap.get(item.airline) || '#38BDF8'
    }));

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 45 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
          <XAxis 
            dataKey="name" 
            angle={-30} 
            textAnchor="end" 
            tick={{ fill: '#94A3B8', fontSize: 11 }}
            interval={0}
          />
          <YAxis 
            tick={{ fill: '#94A3B8', fontSize: 11 }}
            tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
          />
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="aviation-card rounded-xl p-3 border border-slate-700 text-xs shadow-xl backdrop-blur-md">
                    <p className="font-bold text-white mb-1.5">{data.name}</p>
                    <p className="text-emerald-400 font-semibold">Average Fare: ₹{data.avgFare.toLocaleString()}</p>
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
          <Bar dataKey="avgFare" radius={[6, 6, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
