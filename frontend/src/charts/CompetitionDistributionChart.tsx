import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { useAviation } from '../context/AviationContext';

export const CompetitionDistributionChart: React.FC = () => {
  const { competitionSummary } = useAviation();

  const COLORS = ['#F59E0B', '#38BDF8', '#10B981'];

  const chartData = competitionSummary.tiers.map((t, idx) => ({
    name: t.tier,
    value: t.count,
    percentage: t.percentage,
    color: COLORS[idx % COLORS.length]
  }));

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={95}
            paddingAngle={4}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="#0F172A" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="aviation-card rounded-xl p-3 border border-slate-700 text-xs shadow-xl backdrop-blur-md">
                    <p className="font-bold text-white mb-1" style={{ color: data.color }}>{data.name}</p>
                    <p className="text-slate-200">Routes: <span className="font-mono font-bold">{data.value.toLocaleString()}</span></p>
                    <p className="text-slate-400">Share: <span className="font-mono">{data.percentage}%</span></p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value) => <span className="text-slate-300 text-xs">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
