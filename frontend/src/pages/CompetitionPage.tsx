import React, { useState } from 'react';
import { useAviation } from '../context/AviationContext';
import { CompetitionDistributionChart } from '../charts/CompetitionDistributionChart';
import { 
  Network, 
  Flame, 
  Users, 
  Lock
} from 'lucide-react';

export const CompetitionPage: React.FC = () => {
  const { competitionSummary, theme } = useAviation();
  const isCream = theme === 'cream';

  const [tierFilter, setTierFilter] = useState<'all' | 'monopoly' | 'moderate' | 'high'>('all');

  const displayedRoutes = competitionSummary.top_competitive_routes.filter(r => {
    if (tierFilter === 'monopoly') return r.airline_count === 1;
    if (tierFilter === 'moderate') return r.airline_count >= 2 && r.airline_count <= 3;
    if (tierFilter === 'high') return r.airline_count >= 4;
    return true;
  });

  return (
    <div className="space-y-6 pb-8">
      {/* Top Banner */}
      <div className={`aviation-card card-accent-violet rounded-2xl p-6 border relative overflow-hidden shadow-sm ${
        isCream ? 'bg-white border-violet-500/25' : 'bg-slate-900/60 border-violet-500/20'
      }`}>
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/25 text-amber-700 text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5">
                <Network className="w-3.5 h-3.5" />
                <span>Market Contestability & Carrier Density</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-stone-100 border border-stone-200 text-stone-600 text-[11px] font-mono">
                1,423 Analyzed Routes
              </span>
            </div>
            
            <h2 className={`text-2xl font-black tracking-tight ${isCream ? 'text-stone-900' : 'text-white'}`}>
              Domestic Airline Competition & Route Overlap Index
            </h2>
            
            <p className="text-xs text-stone-600 max-w-3xl leading-relaxed">
              Empirical market contestability assessment across Indian domestic aviation. Classifies corridors into single-carrier monopoly routes, duopoly/triopoly contestable pairs, and hyper-competitive metro trunk corridors.
            </p>
          </div>

          <div className={`p-3.5 rounded-xl border text-center shrink-0 ${isCream ? 'bg-[#FDFBF7] border-stone-200' : 'bg-slate-900/90 border-slate-800'}`}>
            <span className="text-stone-500 block text-[10px] uppercase font-bold">Mean Carriers / Route</span>
            <span className="text-xl font-mono font-black text-amber-700">
              {competitionSummary.average_airlines_per_route} Airlines
            </span>
          </div>
        </div>
      </div>

      {/* 3 Contestability Tier Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Monopoly */}
        <div className={`aviation-card card-accent-amber rounded-2xl p-5 border shadow-sm ${isCream ? 'bg-white border-amber-500/30' : 'bg-amber-950/15 border-amber-500/30'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase text-amber-700">
              Monopoly Corridors (1 Carrier)
            </span>
            <Lock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className={`text-3xl font-black font-mono ${isCream ? 'text-stone-900' : 'text-white'}`}>
              {competitionSummary.tiers[0]?.count.toLocaleString() ?? '926'}
            </span>
            <span className="text-xs text-stone-500">routes</span>
          </div>
          <div className="mt-2 text-xs text-stone-500 flex justify-between">
            <span>Domestic Network Share:</span>
            <span className="font-mono font-bold text-amber-700">
              {competitionSummary.tiers[0]?.percentage ?? '65.1'}%
            </span>
          </div>
        </div>

        {/* Moderate Competition */}
        <div className={`aviation-card card-accent-cyan rounded-2xl p-5 border shadow-sm ${isCream ? 'bg-white border-sky-500/30' : 'bg-sky-950/15 border-sky-500/30'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase text-sky-700">
              Contestable (2 - 3 Carriers)
            </span>
            <Users className="w-4 h-4 text-sky-600" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className={`text-3xl font-black font-mono ${isCream ? 'text-stone-900' : 'text-white'}`}>
              {competitionSummary.tiers[1]?.count.toLocaleString() ?? '388'}
            </span>
            <span className="text-xs text-stone-500">routes</span>
          </div>
          <div className="mt-2 text-xs text-stone-500 flex justify-between">
            <span>Domestic Network Share:</span>
            <span className="font-mono font-bold text-sky-700">
              {competitionSummary.tiers[1]?.percentage ?? '27.3'}%
            </span>
          </div>
        </div>

        {/* Hyper-Competitive */}
        <div className={`aviation-card card-accent-emerald rounded-2xl p-5 border shadow-sm ${isCream ? 'bg-white border-emerald-500/30' : 'bg-emerald-950/15 border-emerald-500/30'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase text-emerald-700">
              Hyper-Competitive (4+ Carriers)
            </span>
            <Flame className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className={`text-3xl font-black font-mono ${isCream ? 'text-stone-900' : 'text-white'}`}>
              {competitionSummary.tiers[2]?.count.toLocaleString() ?? '109'}
            </span>
            <span className="text-xs text-stone-500">routes</span>
          </div>
          <div className="mt-2 text-xs text-stone-500 flex justify-between">
            <span>Domestic Network Share:</span>
            <span className="font-mono font-bold text-emerald-700">
              {competitionSummary.tiers[2]?.percentage ?? '7.7'}%
            </span>
          </div>
        </div>
      </div>

      {/* Chart & Market Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className={`aviation-card rounded-2xl p-5 border shadow-sm ${isCream ? 'bg-white border-stone-200' : 'bg-slate-900/40 border-slate-800'}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <h3 className={`text-sm font-bold uppercase tracking-wider ${isCream ? 'text-stone-900' : 'text-white'}`}>
                Route Contestability Distribution
              </h3>
            </div>
            <span className="text-[11px] text-stone-500 font-mono">1,423 Routes</span>
          </div>
          <p className="text-xs text-stone-500 mb-3">
            Distribution of domestic corridors by competing carrier count. Demonstrates high concentration of single-carrier regional routes.
          </p>
          <CompetitionDistributionChart />
        </div>

        <div className={`aviation-card rounded-2xl p-5 border space-y-3 shadow-sm ${isCream ? 'bg-white border-stone-200' : 'bg-slate-900/40 border-slate-800'}`}>
          <h3 className={`text-sm font-bold uppercase tracking-wider ${isCream ? 'text-stone-900' : 'text-white'}`}>
            Aviation Market Structure Insights
          </h3>
          <div className="space-y-3 text-xs leading-relaxed">
            <div className={`p-3.5 rounded-xl border space-y-1 ${isCream ? 'bg-[#FDFBF7] border-stone-200 text-stone-800' : 'bg-slate-900/80 border-slate-800 text-slate-300'}`}>
              <p className="font-bold text-amber-700">High Regional Monopoly Under UDAN Schemes</p>
              <p className="text-stone-500 text-[11px]">
                Over 65% of domestic routes are operated by a single carrier. Regional carriers (Alliance Air, Star Air, FlyBig) provide vital connectivity to remote Tier-2/3 aerodromes under government-backed exclusivity.
              </p>
            </div>

            <div className={`p-3.5 rounded-xl border space-y-1 ${isCream ? 'bg-[#FDFBF7] border-stone-200 text-stone-800' : 'bg-slate-900/80 border-slate-800 text-slate-300'}`}>
              <p className="font-bold text-emerald-700">Intense Metro Trunk Route Rivalry</p>
              <p className="text-stone-500 text-[11px]">
                High-density metro corridors (Delhi–Bengaluru, Delhi–Mumbai, Mumbai–Bengaluru, Delhi–Kolkata) feature 4 to 6 competing airlines, delivering high departure frequencies and compressed price dispersion.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Competitive Corridors Table */}
      <div className={`aviation-card rounded-2xl p-5 border space-y-4 shadow-sm ${isCream ? 'bg-white border-stone-200' : 'bg-slate-900/40 border-slate-800'}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className={`text-sm font-bold uppercase tracking-wider ${isCream ? 'text-stone-900' : 'text-white'}`}>
              Top Multi-Carrier Corridors in India
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Ranked by simultaneous airline operators and weekly scheduled departure frequency.
            </p>
          </div>

          <div className="flex items-center space-x-1.5 text-xs bg-stone-100 p-1 rounded-xl border border-stone-300">
            <button
              onClick={() => setTierFilter('all')}
              className={`px-3 py-1 rounded-lg transition-colors font-bold ${tierFilter === 'all' ? 'bg-amber-600 text-white' : 'text-stone-600 hover:text-stone-900'}`}
            >
              All Tiers
            </button>
            <button
              onClick={() => setTierFilter('high')}
              className={`px-3 py-1 rounded-lg transition-colors font-bold ${tierFilter === 'high' ? 'bg-amber-600 text-white' : 'text-stone-600 hover:text-stone-900'}`}
            >
              High (4+)
            </button>
            <button
              onClick={() => setTierFilter('moderate')}
              className={`px-3 py-1 rounded-lg transition-colors font-bold ${tierFilter === 'moderate' ? 'bg-amber-600 text-white' : 'text-stone-600 hover:text-stone-900'}`}
            >
              2-3 Airlines
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-stone-200">
          <table className="w-full text-left text-xs">
            <thead className={`text-[11px] font-semibold border-b ${isCream ? 'bg-[#F4EFE6] text-stone-600 border-stone-300' : 'bg-slate-900 text-slate-400 border-slate-800'}`}>
              <tr>
                <th className="py-2.5 px-4">Flight Corridor</th>
                <th className="py-2.5 px-4 text-center">Competing Airlines</th>
                <th className="py-2.5 px-4">Operating Carriers</th>
                <th className="py-2.5 px-4 text-right">Weekly Flights</th>
                <th className="py-2.5 px-4 text-right">Avg Fare</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isCream ? 'divide-stone-200 bg-white' : 'divide-slate-800/70 bg-slate-950/40'}`}>
              {displayedRoutes.map((row, i) => (
                <tr key={i} className={`transition-colors ${isCream ? 'hover:bg-amber-50/50' : 'hover:bg-slate-800/40'}`}>
                  <td className={`py-3 px-4 font-bold ${isCream ? 'text-stone-900' : 'text-white'}`}>
                    {row.route}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2.5 py-1 rounded-full font-mono font-bold bg-amber-100 text-amber-800 border border-amber-300">
                      {row.airline_count} Airlines
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {row.airlines.map((a: string, j: number) => (
                        <span key={j} className="px-1.5 py-0.5 rounded bg-stone-100 text-[10px] text-stone-700 border border-stone-200">
                          {a}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-sky-700">
                    {row.frequency.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700">
                    {row.fare_info ? `₹${Math.round(row.fare_info.avg_fare).toLocaleString()}` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
