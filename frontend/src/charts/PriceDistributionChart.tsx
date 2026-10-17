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

export const PriceDistributionChart: React.FC = () => {
  const { faresSummary } = useAviation();

  const chartData = faresSummary.distribution.map((d) => ({
    range: d.range,
    count: d.count,
    pct: d.pct,
  }));

  const colors = ['#10B981', '#38BDF8', '#6366F1', '#A855F7', '#EC4899', '#EF4444'];

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 25 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
          <XAxis 
            dataKey="range" 
            tick={{ fill: '#94A3B8', fontSize: 11 }}
          />
          <YAxis 
            tick={{ fill: '#94A3B8', fontSize: 11 }}
            label={{ value: 'Observed Tickets', angle: -90, position: 'insideLeft', fill: '#64748B', fontSize: 11 }}
          />
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="aviation-card rounded-xl p-3 border border-slate-700 text-xs shadow-xl backdrop-blur-md">
                    <p className="font-bold text-white mb-1">{data.range}</p>
                    <p className="text-emerald-400 font-semibold">Tickets: {data.count.toLocaleString()}</p>
                    <p className="text-slate-400">Share of Dataset: {data.pct}%</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="count" radius={[6, 6, 0, 0]}>
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} fillOpacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
