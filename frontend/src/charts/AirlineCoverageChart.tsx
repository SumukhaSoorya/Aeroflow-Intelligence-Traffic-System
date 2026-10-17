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

export const AirlineCoverageChart: React.FC = () => {
  const { airlines } = useAviation();

  const chartData = [...airlines]
    .sort((a, b) => b.routes_operated - a.routes_operated)
    .map(a => ({
      name: a.name,
      routesOperated: a.routes_operated,
      totalFlights: a.total_flights,
      airportsServed: a.airports_served_count,
      flightShare: a.flight_share_pct,
      color: a.color_hex
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
            label={{ value: 'Routes Operated', angle: -90, position: 'insideLeft', fill: '#64748B', fontSize: 11 }}
          />
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="aviation-card rounded-xl p-3 border border-slate-700 text-xs shadow-xl backdrop-blur-md">
                    <p className="font-bold text-white mb-1.5">{data.name}</p>
                    <p className="text-sky-400 font-semibold">Routes Operated: {data.routesOperated} unique corridors</p>
                    <p className="text-indigo-400">Total Weekly Schedules: {data.totalFlights.toLocaleString()}</p>
                    <p className="text-emerald-400">Airports Served: {data.airportsServed} cities</p>
                    <p className="text-amber-400">Schedule Market Share: {data.flightShare}%</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="routesOperated" radius={[6, 6, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
