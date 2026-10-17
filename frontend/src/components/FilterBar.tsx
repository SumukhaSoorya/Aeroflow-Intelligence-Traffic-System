import React from 'react';
import { useAviation } from '../context/AviationContext';
import { Search, RotateCcw, Filter } from 'lucide-react';

export const FilterBar: React.FC = () => {
  const { 
    airlines, 
    airports, 
    filters, 
    setAirlineFilter, 
    setOriginFilter, 
    setDestinationFilter, 
    setSearchTerm, 
    resetFilters,
    activeFilterCount,
    theme
  } = useAviation();

  const isCream = theme === 'cream';

  return (
    <div className={`aviation-card rounded-2xl p-4 border transition-colors ${
      isCream ? 'bg-white border-[#E7E2D9]' : 'bg-slate-900/60 border-slate-800'
    } shadow-sm`}>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Left Side: Filter Selectors */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center space-x-1.5 text-xs font-bold uppercase text-stone-500 mr-1">
            <Filter className="w-3.5 h-3.5 text-amber-600" />
            <span>Filters:</span>
          </div>

          {/* Airline Selector */}
          <select
            value={filters.airline}
            onChange={(e) => setAirlineFilter(e.target.value)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border focus:outline-none focus:ring-2 focus:ring-amber-500 ${
              isCream ? 'bg-[#F9F7F2] border-stone-300 text-stone-900' : 'bg-slate-900 border-slate-700 text-white'
            }`}
          >
            <option value="all">All Airlines (14)</option>
            {airlines.map(a => (
              <option key={a.name} value={a.name}>{a.name}</option>
            ))}
          </select>

          {/* Origin Airport */}
          <select
            value={filters.origin}
            onChange={(e) => setOriginFilter(e.target.value)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border focus:outline-none focus:ring-2 focus:ring-amber-500 max-w-[150px]` + (
              isCream ? ' bg-[#F9F7F2] border-stone-300 text-stone-900' : ' bg-slate-900 border-slate-700 text-white'
            )}
          >
            <option value="all">Origin: All Hubs</option>
            {airports.map(ap => (
              <option key={ap.iata} value={ap.iata}>{ap.iata} - {ap.city}</option>
            ))}
          </select>

          {/* Destination Airport */}
          <select
            value={filters.destination}
            onChange={(e) => setDestinationFilter(e.target.value)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border focus:outline-none focus:ring-2 focus:ring-amber-500 max-w-[150px]` + (
              isCream ? ' bg-[#F9F7F2] border-stone-300 text-stone-900' : ' bg-slate-900 border-slate-700 text-white'
            )}
          >
            <option value="all">Dest: All Hubs</option>
            {airports.map(ap => (
              <option key={ap.iata} value={ap.iata}>{ap.iata} - {ap.city}</option>
            ))}
          </select>

          {/* Reset Filters */}
          {activeFilterCount > 0 && (
            <button
              onClick={resetFilters}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-100 hover:bg-amber-200 text-amber-800 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset ({activeFilterCount})</span>
            </button>
          )}
        </div>

        {/* Right Side: Search Input */}
        <div className="relative min-w-[200px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-stone-400" />
          <input
            type="text"
            placeholder="Search city, IATA, or airline..."
            value={filters.searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-9 pr-3 py-1.5 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-amber-500 ${
              isCream ? 'bg-[#F9F7F2] border-stone-300 text-stone-900 placeholder-stone-400' : 'bg-slate-900 border-slate-700 text-white placeholder-slate-500'
            }`}
          />
        </div>
      </div>
    </div>
  );
};
