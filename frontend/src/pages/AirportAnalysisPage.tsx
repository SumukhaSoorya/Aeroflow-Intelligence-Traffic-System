import React, { useState, useMemo } from 'react';
import { useAviation } from '../context/AviationContext';
import { 
  Radio, 
  Search, 
  ArrowUpDown, 
  ShieldCheck 
} from 'lucide-react';
import type { Airport } from '../types/aviation';

export const AirportAnalysisPage: React.FC = () => {
  const { airports, routes, theme } = useAviation();
  const isCream = theme === 'cream';

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState<Airport>(airports[0]);
  const [sortField, setSortField] = useState<'connected_routes_count' | 'total_flights' | 'airline_count'>('connected_routes_count');
  const [sortAsc, setSortAsc] = useState(false);

  const filteredAirports = useMemo(() => {
    return airports
      .filter(a => {
        if (categoryFilter !== 'all' && a.category !== categoryFilter) return false;
        if (searchTerm.trim() !== '') {
          const term = searchTerm.toLowerCase();
          return (
            a.name.toLowerCase().includes(term) ||
            a.city.toLowerCase().includes(term) ||
            a.iata.toLowerCase().includes(term)
          );
        }
        return true;
      })
      .sort((a, b) => {
        const diff = a[sortField] - b[sortField];
        return sortAsc ? diff : -diff;
      });
  }, [airports, categoryFilter, searchTerm, sortField, sortAsc]);

  const outboundRoutes = useMemo(() => {
    return routes.filter(r => r.origin_iata === selectedItem.iata);
  }, [routes, selectedItem]);

  const handleSort = (field: 'connected_routes_count' | 'total_flights' | 'airline_count') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Top Banner Card with Emerald Theme */}
      <div className={`aviation-card card-accent-emerald rounded-2xl p-6 border relative overflow-hidden shadow-sm ${
        isCream ? 'bg-white border-emerald-500/25' : 'bg-slate-900/60 border-emerald-500/20'
      }`}>
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5">
                <Radio className="w-3.5 h-3.5" />
                <span>Geospatial Aerodrome Centrality</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-stone-100 border border-stone-200 text-stone-600 text-[11px] font-mono">
                110 Validated Aerodromes
              </span>
            </div>
            
            <h2 className={`text-2xl font-black tracking-tight ${isCream ? 'text-stone-900' : 'text-white'}`}>
              Indian Domestic Airport Centrality & Connectivity Network
            </h2>
            
            <p className="text-xs text-stone-600 max-w-3xl leading-relaxed">
              Geospatial graph analysis of 110 Indian airports mapped directly to OurAirports coordinates. Quantifies degree centrality (connected domestic routes), scheduled departure frequency, and multi-carrier contestability.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <span className="px-3 py-1.5 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold">
              Primary Hubs (≥30 routes)
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-sky-100 border border-sky-300 text-sky-800 text-xs font-bold">
              Major (10-29 routes)
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-stone-100 border border-stone-300 text-stone-700 text-xs font-bold">
              Regional (&lt;10 routes)
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Columns: Searchable Airports Table */}
        <div className={`lg:col-span-2 aviation-card rounded-2xl p-5 border space-y-4 shadow-sm ${
          isCream ? 'bg-white border-stone-200' : 'bg-slate-900/40 border-slate-800'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className={`text-sm font-bold uppercase tracking-wider ${isCream ? 'text-stone-900' : 'text-white'}`}>
              Aerodrome Directory ({filteredAirports.length} Airports)
            </h3>

            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-stone-400" />
                <input
                  type="text"
                  placeholder="Filter city or IATA..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`border rounded-xl pl-9 pr-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 w-44 ${
                    isCream ? 'bg-[#F9F7F2] border-stone-300 text-stone-900' : 'bg-[#0B111E] border-slate-700 text-white'
                  }`}
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className={`border rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  isCream ? 'bg-[#F9F7F2] border-stone-300 text-stone-900' : 'bg-[#0B111E] border-slate-700 text-white'
                }`}
              >
                <option value="all">All Tiers</option>
                <option value="Primary Hub">Primary Hubs</option>
                <option value="Major Airport">Major Airports</option>
                <option value="Regional Connector">Regional</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-stone-200 max-h-[520px]">
            <table className="w-full text-left text-xs">
              <thead className={`text-[11px] font-semibold sticky top-0 border-b z-10 ${
                isCream ? 'bg-[#F4EFE6] text-stone-600 border-stone-300' : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}>
                <tr>
                  <th className="py-2.5 px-3">IATA / City</th>
                  <th className="py-2.5 px-3">Airport Name</th>
                  <th 
                    onClick={() => handleSort('connected_routes_count')}
                    className="py-2.5 px-3 cursor-pointer text-emerald-700"
                  >
                    <div className="flex items-center space-x-1">
                      <span>Destinations</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('total_flights')}
                    className="py-2.5 px-3 cursor-pointer hover:text-emerald-700"
                  >
                    <div className="flex items-center space-x-1">
                      <span>Weekly Flights</span>
                      <ArrowUpDown className="w-3 h-3 text-stone-400" />
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('airline_count')}
                    className="py-2.5 px-3 cursor-pointer hover:text-emerald-700"
                  >
                    <div className="flex items-center space-x-1">
                      <span>Airlines</span>
                      <ArrowUpDown className="w-3 h-3 text-stone-400" />
                    </div>
                  </th>
                  <th className="py-2.5 px-3 text-right">Category</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isCream ? 'divide-stone-200 bg-white' : 'divide-slate-800/70 bg-slate-950/40'}`}>
                {filteredAirports.map((ap) => {
                  const isSelected = selectedItem.iata === ap.iata;
                  return (
                    <tr
                      key={ap.iata}
                      onClick={() => setSelectedItem(ap)}
                      className={`cursor-pointer transition-colors ${
                        isSelected 
                          ? 'bg-emerald-100/70 text-emerald-950 font-bold' 
                          : isCream ? 'hover:bg-stone-50 text-stone-800' : 'hover:bg-slate-800/40 text-slate-300'
                      }`}
                    >
                      <td className="py-2.5 px-3 font-bold font-mono">
                        <span className="text-emerald-700 mr-1.5">{ap.iata}</span>
                        <span className="font-sans font-medium">{ap.city}</span>
                      </td>
                      <td className="py-2.5 px-3 text-stone-500 truncate max-w-[170px]" title={ap.name}>
                        {ap.name}
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-stone-900">
                        {ap.connected_routes_count}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-stone-600">
                        {ap.total_flights.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-violet-700 font-semibold">
                        {ap.airline_count}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          ap.category === 'Primary Hub'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : ap.category === 'Major Airport'
                            ? 'bg-sky-100 text-sky-800 border border-sky-300'
                            : 'bg-stone-100 text-stone-600 border border-stone-200'
                        }`}>
                          {ap.category}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Column: Selected Aerodrome Inspector Card */}
        <div className={`aviation-card rounded-2xl p-5 border space-y-4 flex flex-col justify-between shadow-sm ${
          isCream ? 'bg-white border-stone-200' : 'bg-slate-900/40 border-slate-800'
        }`}>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <span className="text-2xl font-black font-mono text-emerald-700">{selectedItem.iata}</span>
                <h3 className={`text-base font-bold mt-0.5 ${isCream ? 'text-stone-900' : 'text-white'}`}>{selectedItem.city}</h3>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-stone-100 border border-stone-300 text-xs text-stone-700 font-bold">
                {selectedItem.category}
              </span>
            </div>

            <p className="text-xs text-stone-600 font-medium">
              {selectedItem.name}
            </p>

            {/* Geographical Coordinates Box */}
            <div className={`p-3.5 rounded-xl border space-y-1.5 text-xs ${isCream ? 'bg-[#FDFBF7] border-stone-200' : 'bg-slate-900/80 border-slate-800'}`}>
              <div className="flex justify-between">
                <span className="text-stone-500">Coordinates:</span>
                <span className="font-mono text-emerald-700 font-medium">
                  {selectedItem.latitude.toFixed(4)}° N, {selectedItem.longitude.toFixed(4)}° E
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Field Elevation:</span>
                <span className="font-mono text-stone-700">{selectedItem.elevation_ft} ft MSL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">ICAO / Type:</span>
                <span className="font-mono text-stone-700">{selectedItem.type}</span>
              </div>
            </div>

            {/* Hub Metrics */}
            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className={`p-3 rounded-xl border ${isCream ? 'bg-[#FDFBF7] border-stone-200' : 'bg-slate-900 border-slate-800'}`}>
                <span className="text-[10px] uppercase text-stone-500 block font-bold">Destinations</span>
                <span className="text-lg font-bold font-mono text-emerald-700">
                  {selectedItem.connected_routes_count}
                </span>
              </div>
              <div className={`p-3 rounded-xl border ${isCream ? 'bg-[#FDFBF7] border-stone-200' : 'bg-slate-900 border-slate-800'}`}>
                <span className="text-[10px] uppercase text-stone-500 block font-bold">Airlines</span>
                <span className="text-lg font-bold font-mono text-violet-700">
                  {selectedItem.airline_count}
                </span>
              </div>
            </div>

            {/* Outbound Corridors List */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600">
                  Outbound Domestic Corridors
                </h4>
                <span className="text-[11px] text-stone-400 font-mono">{outboundRoutes.length} Corridors</span>
              </div>
              
              <div className="max-h-[170px] overflow-y-auto space-y-1.5 pr-1">
                {outboundRoutes.length > 0 ? (
                  outboundRoutes.map((r) => (
                    <div key={r.route_id} className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                      isCream ? 'bg-[#FAF7F2] border-stone-200' : 'bg-slate-900/60 border-slate-800'
                    }`}>
                      <span className="font-medium text-stone-800">→ {r.destination_city} ({r.destination_iata})</span>
                      <span className="font-mono text-emerald-700 font-bold">{r.frequency} / wk</span>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-xs text-stone-400">
                    No outbound schedules recorded in domestic timetable.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-stone-200 text-center">
            <span className="text-[11px] text-emerald-700 font-mono flex items-center justify-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Validated OurAirports Coordinates</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
