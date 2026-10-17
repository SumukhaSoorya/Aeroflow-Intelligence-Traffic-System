import React, { useState, useMemo } from 'react';
import { useAviation } from '../context/AviationContext';
import { Tag, Search, ArrowUpDown, AlertCircle } from 'lucide-react';

export const CheapestRoutesPage: React.FC = () => {
  const { cheapestRoutes, airlines } = useAviation();

  const [searchTerm, setSearchTerm] = useState('');
  const [airlineFilter, setAirlineFilter] = useState('all');
  const [sortField, setSortField] = useState<'min_fare' | 'avg_fare' | 'max_fare'>('min_fare');
  const [sortAsc, setSortAsc] = useState(true);

  const filteredRoutes = useMemo(() => {
    return cheapestRoutes
      .filter(item => {
        if (airlineFilter !== 'all' && item.airline !== airlineFilter) return false;
        if (searchTerm.trim() !== '') {
          const term = searchTerm.toLowerCase();
          return (
            item.source.toLowerCase().includes(term) ||
            item.destination.toLowerCase().includes(term) ||
            item.airline.toLowerCase().includes(term)
          );
        }
        return true;
      })
      .sort((a, b) => {
        const diff = a[sortField] - b[sortField];
        return sortAsc ? diff : -diff;
      });
  }, [cheapestRoutes, airlineFilter, searchTerm, sortField, sortAsc]);

  const handleSort = (field: 'min_fare' | 'avg_fare' | 'max_fare') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Top Banner */}
      <div className="aviation-card rounded-2xl p-5 border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Tag className="w-4 h-4" />
              <span>Observed Minimum Fare Corridors</span>
            </div>
            <h2 className="text-xl font-extrabold text-white">
              Cheapest Domestic Flight Routes
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Empirical calculation of lowest recorded domestic flight fares sorted by minimum and mean ticket pricing.
            </p>
          </div>

          {/* Academic Transparency Disclaimer Notice */}
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs max-w-xs flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
            <p className="text-[11px] leading-snug">
              <strong>Data-derived result:</strong> These values reflect historical Kaggle dataset observations, not a commercial live pricing recommendation.
            </p>
          </div>
        </div>
      </div>

      {/* Top 3 Standout Cheapest Corridors Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cheapestRoutes.slice(0, 3).map((item, idx) => (
          <div key={idx} className="aviation-card rounded-2xl p-4 border border-emerald-500/30 bg-emerald-950/20">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="font-mono font-bold text-emerald-400">#0{idx + 1} Lowest Fare</span>
              <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded text-slate-300">{item.airline}</span>
            </div>
            <p className="text-lg font-bold text-white mt-1">
              {item.source} → {item.destination}
            </p>
            <div className="mt-3 flex items-baseline justify-between border-t border-emerald-500/20 pt-2">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Min Fare</span>
                <span className="text-xl font-mono font-black text-emerald-400">
                  ₹{item.min_fare.toLocaleString()}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block uppercase">Avg Fare</span>
                <span className="text-sm font-mono text-slate-300">
                  ₹{Math.round(item.avg_fare).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Filterable Table */}
      <div className="aviation-card rounded-2xl p-5 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            All Observed Pricing Corridors ({filteredRoutes.length} Results)
          </h3>

          <div className="flex items-center space-x-2 text-xs">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search city or airline..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-[#0B111E] border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
              />
            </div>

            <select
              value={airlineFilter}
              onChange={(e) => setAirlineFilter(e.target.value)}
              className="bg-[#0B111E] border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
            >
              <option value="all">All Airlines</option>
              {airlines.map(a => <option key={a.name} value={a.name}>{a.name}</option>)}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 text-[11px] font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Origin</th>
                <th className="py-3 px-4">Destination</th>
                <th className="py-3 px-4">Airline</th>
                <th 
                  onClick={() => handleSort('min_fare')}
                  className="py-3 px-4 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center space-x-1">
                    <span>Minimum Fare</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('avg_fare')}
                  className="py-3 px-4 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center space-x-1">
                    <span>Average Fare</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('max_fare')}
                  className="py-3 px-4 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center space-x-1">
                    <span>Max Fare</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th className="py-3 px-4 text-right">Observation Sample</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 bg-slate-950/40">
              {filteredRoutes.map((row, i) => (
                <tr key={i} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-4 font-bold text-white">{row.source}</td>
                  <td className="py-2.5 px-4 font-bold text-white">{row.destination}</td>
                  <td className="py-2.5 px-4 text-slate-300">{row.airline}</td>
                  <td className="py-2.5 px-4 font-mono font-bold text-emerald-400">
                    ₹{row.min_fare.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-4 font-mono font-bold text-sky-400">
                    ₹{Math.round(row.avg_fare).toLocaleString()}
                  </td>
                  <td className="py-2.5 px-4 font-mono text-slate-300">
                    ₹{row.max_fare.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-4 text-right font-mono text-slate-500">
                    {row.record_count.toLocaleString()} bookings
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
