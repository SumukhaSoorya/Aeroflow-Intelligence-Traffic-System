import React, { useState, useMemo } from 'react';
import { useAviation } from '../context/AviationContext';
import { FareBarChart } from '../charts/FareBarChart';
import { RouteFareChart } from '../charts/RouteFareChart';
import { PriceDistributionChart } from '../charts/PriceDistributionChart';
import { CorridorFareComparator } from '../components/CorridorFareComparator';
import { 
  IndianRupee, 
  ArrowUpDown, 
  TrendingDown, 
  Tag, 
  BarChart3, 
  Table, 
  Sparkles,
  ShieldCheck,
  Search
} from 'lucide-react';

export const FareAnalysisPage: React.FC = () => {
  const { faresSummary, cheapestRoutes, airlines, theme } = useAviation();
  const isCream = theme === 'cream';

  const [activeSubTab, setActiveSubTab] = useState<'search' | 'charts' | 'matrix'>('search');
  const [selectedAirline, setSelectedAirline] = useState('all');
  const [selectedRouteFilter, setSelectedRouteFilter] = useState('all');
  const [sortField, setSortField] = useState<'avg_fare' | 'min_fare' | 'max_fare'>('avg_fare');
  const [sortAsc, setSortAsc] = useState(true);

  const uniqueRoutePairs = useMemo(() => {
    const pairs = new Set<string>();
    faresSummary.route_fares.forEach(r => pairs.add(`${r.source} → ${r.destination}`));
    return Array.from(pairs);
  }, [faresSummary]);

  const filteredFaresTable = useMemo(() => {
    return cheapestRoutes
      .filter(item => {
        if (selectedAirline !== 'all' && item.airline !== selectedAirline) return false;
        if (selectedRouteFilter !== 'all') {
          const pair = `${item.source} → ${item.destination}`;
          if (pair !== selectedRouteFilter) return false;
        }
        return true;
      })
      .sort((a, b) => {
        const diff = a[sortField] - b[sortField];
        return sortAsc ? diff : -diff;
      });
  }, [cheapestRoutes, selectedAirline, selectedRouteFilter, sortField, sortAsc]);

  const handleSort = (field: 'avg_fare' | 'min_fare' | 'max_fare') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Top Header Card with Amber Theme */}
      <div className={`aviation-card card-accent-amber rounded-2xl p-6 border relative overflow-hidden shadow-sm ${
        isCream ? 'bg-white border-amber-500/25' : 'bg-slate-900/60 border-amber-500/20'
      }`}>
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/25 text-amber-700 text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5">
                <IndianRupee className="w-3.5 h-3.5" />
                <span>Commercial Pricing & Yield Analytics</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-stone-100 border border-stone-200 text-stone-600 text-[11px] font-mono">
                10,683 Verified Records
              </span>
            </div>
            
            <h2 className={`text-2xl font-black tracking-tight ${isCream ? 'text-stone-900' : 'text-white'}`}>
              Domestic Flight Fare Variation & Pricing Architecture
            </h2>
            
            <p className="text-xs text-stone-600 max-w-3xl leading-relaxed">
              Synthesized directly from verified historical flight pricing observations. Examines empirical fare spreads across carrier models, trunk line yield compression, and price distributions across 12 domestic airline brands.
            </p>
          </div>

          {/* Quick Metric Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
            <div className={`p-3 rounded-xl border text-center ${isCream ? 'bg-[#FDFBF7] border-stone-200' : 'bg-slate-900/90 border-slate-800'}`}>
              <span className="text-stone-500 block text-[10px] uppercase font-bold">Mean Ticket Fare</span>
              <span className={`text-lg font-mono font-bold ${isCream ? 'text-stone-900' : 'text-white'}`}>₹{Math.round(faresSummary.mean_fare).toLocaleString()}</span>
            </div>
            
            <div className={`p-3 rounded-xl border text-center ${isCream ? 'bg-[#FDFBF7] border-stone-200' : 'bg-slate-900/90 border-slate-800'}`}>
              <span className="text-stone-500 block text-[10px] uppercase font-bold">Observed Median</span>
              <span className="text-lg font-mono font-bold text-amber-700">₹{faresSummary.median_fare.toLocaleString()}</span>
            </div>

            <div className={`p-3 rounded-xl border text-center ${isCream ? 'bg-[#FDFBF7] border-stone-200' : 'bg-slate-900/90 border-slate-800'}`}>
              <span className="text-stone-500 block text-[10px] uppercase font-bold">Lowest Observed</span>
              <span className="text-lg font-mono font-bold text-emerald-700">₹{faresSummary.min_fare.toLocaleString()}</span>
            </div>

            <div className={`p-3 rounded-xl border text-center ${isCream ? 'bg-[#FDFBF7] border-stone-200' : 'bg-slate-900/90 border-slate-800'}`}>
              <span className="text-stone-500 block text-[10px] uppercase font-bold">Max Premium/Biz</span>
              <span className="text-lg font-mono font-bold text-rose-700">₹{faresSummary.max_fare.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-200 pb-3 gap-3">
        <div className={`flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl border ${
          isCream ? 'bg-[#F2ECE1] border-stone-300' : 'bg-slate-900/90 border-slate-800'
        }`}>
          <button
            onClick={() => setActiveSubTab('search')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'search'
                ? 'bg-amber-600 text-white shadow-sm font-bold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Corridor Search & Flight Comparison</span>
          </button>

          <button
            onClick={() => setActiveSubTab('charts')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'charts'
                ? 'bg-amber-600 text-white shadow-sm font-bold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Fare Distributions & Charts</span>
          </button>
          
          <button
            onClick={() => setActiveSubTab('matrix')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'matrix'
                ? 'bg-amber-600 text-white shadow-sm font-bold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>Historical Price Variance Matrix</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center space-x-2 text-xs text-stone-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Calculated from real Indian Flight Price Dataset</span>
        </div>
      </div>

      {activeSubTab === 'search' && (
        <CorridorFareComparator />
      )}

      {activeSubTab === 'charts' ? (
        <div className="space-y-6">
          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Airline Average Fare Comparison */}
            <div className={`aviation-card rounded-2xl p-5 border shadow-sm ${isCream ? 'bg-white border-stone-200' : 'bg-slate-900/40 border-slate-800'}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <h3 className={`text-sm font-bold uppercase tracking-wider ${isCream ? 'text-stone-900' : 'text-white'}`}>
                    Airline vs. Average Observed Fare (INR)
                  </h3>
                </div>
                <span className="text-[11px] text-stone-500 font-mono">12 Carrier Types</span>
              </div>
              <p className="text-xs text-stone-500 mb-3">
                Compares average fare levels across low-cost carriers (IndiGo, SpiceJet), full-service carriers (Air India, Vistara), and premium business cabins.
              </p>
              <FareBarChart />
            </div>

            {/* Trunk Route Average Fare Comparison */}
            <div className={`aviation-card rounded-2xl p-5 border shadow-sm ${isCream ? 'bg-white border-stone-200' : 'bg-slate-900/40 border-slate-800'}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                  <h3 className={`text-sm font-bold uppercase tracking-wider ${isCream ? 'text-stone-900' : 'text-white'}`}>
                    Major Trunk Corridor Average Fares
                  </h3>
                </div>
                <span className="text-[11px] text-stone-500 font-mono">Metro Corridors</span>
              </div>
              <p className="text-xs text-stone-500 mb-3">
                Observed price averages across key corridors connecting Delhi, Mumbai, Bengaluru, Kolkata, Cochin, and Hyderabad.
              </p>
              <RouteFareChart />
            </div>
          </div>

          {/* Ticket Price Distribution Histogram */}
          <div className={`aviation-card rounded-2xl p-5 border shadow-sm ${isCream ? 'bg-white border-stone-200' : 'bg-slate-900/40 border-slate-800'}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <h3 className={`text-sm font-bold uppercase tracking-wider ${isCream ? 'text-stone-900' : 'text-white'}`}>
                  Ticket Price Distribution & Bracket Density
                </h3>
              </div>
              <span className="text-[11px] text-stone-500 font-mono">10,683 Data Points</span>
            </div>
            <p className="text-xs text-stone-500 mb-4">
              Demonstrates ticket density distribution across ₹3,000 price brackets. Over 62% of domestic flight bookings concentrate in the ₹4,000 to ₹10,000 range.
            </p>
            <PriceDistributionChart />
          </div>
        </div>
      ) : (
        /* Detailed Fare Variance Matrix Table */
        <div className={`aviation-card rounded-2xl p-5 border space-y-4 shadow-sm ${isCream ? 'bg-white border-stone-200' : 'bg-slate-900/40 border-slate-800'}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className={`text-sm font-bold uppercase tracking-wider ${isCream ? 'text-stone-900' : 'text-white'}`}>
                Corridor & Airline Price Variance Matrix ({filteredFaresTable.length} Routes)
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Empirical min, mean, and max price boundaries observed across city pairs. Click headers to sort.
              </p>
            </div>

            {/* Filter controls */}
            <div className="flex items-center space-x-2">
              <select
                value={selectedAirline}
                onChange={(e) => setSelectedAirline(e.target.value)}
                className={`border rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                  isCream ? 'bg-[#F9F7F2] border-stone-300 text-stone-900' : 'bg-[#0B111E] border-slate-700 text-white'
                }`}
              >
                <option value="all">All Airlines</option>
                {airlines.map(a => <option key={a.name} value={a.name}>{a.name}</option>)}
              </select>

              <select
                value={selectedRouteFilter}
                onChange={(e) => setSelectedRouteFilter(e.target.value)}
                className={`border rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 max-w-[180px] ${
                  isCream ? 'bg-[#F9F7F2] border-stone-300 text-stone-900' : 'bg-[#0B111E] border-slate-700 text-white'
                }`}
              >
                <option value="all">All Corridors</option>
                {uniqueRoutePairs.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-stone-200">
            <table className="w-full text-left text-xs">
              <thead className={`uppercase tracking-wider text-[11px] font-semibold border-b ${
                isCream ? 'bg-[#F4EFE6] text-stone-600 border-stone-300' : 'bg-slate-900/90 text-slate-400 border-slate-800'
              }`}>
                <tr>
                  <th className="py-3 px-4">Flight Corridor</th>
                  <th className="py-3 px-4">Airline</th>
                  <th 
                    onClick={() => handleSort('min_fare')}
                    className="py-3 px-4 cursor-pointer hover:text-amber-700"
                  >
                    <div className="flex items-center space-x-1">
                      <span>Min Fare</span>
                      <ArrowUpDown className="w-3 h-3 text-stone-400" />
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('avg_fare')}
                    className="py-3 px-4 cursor-pointer text-amber-700"
                  >
                    <div className="flex items-center space-x-1">
                      <span>Average Fare</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('max_fare')}
                    className="py-3 px-4 cursor-pointer hover:text-amber-700"
                  >
                    <div className="flex items-center space-x-1">
                      <span>Max Fare</span>
                      <ArrowUpDown className="w-3 h-3 text-stone-400" />
                    </div>
                  </th>
                  <th className="py-3 px-4 text-right">Records</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isCream ? 'divide-stone-200 bg-white' : 'divide-slate-800/70 bg-slate-950/40'}`}>
                {filteredFaresTable.map((row, idx) => (
                  <tr key={idx} className={`transition-colors ${isCream ? 'hover:bg-amber-50/50' : 'hover:bg-slate-800/40'}`}>
                    <td className={`py-2.5 px-4 font-semibold ${isCream ? 'text-stone-900' : 'text-white'}`}>
                      {row.source} → {row.destination}
                    </td>
                    <td className="py-2.5 px-4 text-stone-700 font-medium">
                      {row.airline}
                    </td>
                    <td className="py-2.5 px-4 font-mono font-bold text-emerald-700">
                      ₹{row.min_fare.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-4 font-mono font-bold text-amber-700">
                      ₹{Math.round(row.avg_fare).toLocaleString()}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-stone-700">
                      ₹{row.max_fare.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono text-stone-400">
                      {row.record_count.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
