import React, { useState } from 'react';
import { AviationMap } from '../maps/AviationMap';
import { FilterBar } from '../components/FilterBar';
import { useAviation } from '../context/AviationContext';
import { 
  Plane, 
  Radio, 
  Search, 
  X,
  Compass
} from 'lucide-react';

export const MapPage: React.FC = () => {
  const { 
    filteredRoutes, 
    selectedAirport, 
    setSelectedAirport, 
    selectedRoute, 
    setSelectedRoute,
    theme
  } = useAviation();

  const isCream = theme === 'cream';
  const [routeSearch, setRouteSearch] = useState('');

  // Routes filtered for the inspector list
  const inspectedRoutes = filteredRoutes.filter(r => {
    if (!routeSearch.trim()) return true;
    const term = routeSearch.toLowerCase();
    return (
      r.origin_city.toLowerCase().includes(term) ||
      r.destination_city.toLowerCase().includes(term) ||
      r.origin_iata.toLowerCase().includes(term) ||
      r.destination_iata.toLowerCase().includes(term) ||
      r.primary_airline.toLowerCase().includes(term)
    );
  }).slice(0, 30);

  return (
    <div className="space-y-4 pb-4">
      {/* Top Filter Bar */}
      <FilterBar />

      {/* Main Container: Deck.gl Map + Route Inspector Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:h-[calc(100vh-220px)] lg:min-h-[580px]">
        {/* Map Centerpiece (3 Columns) */}
        <div className="lg:col-span-3 h-[520px] lg:h-full relative">
          <AviationMap height="100%" showLayerControls={true} />
        </div>

        {/* Route & Airport Inspector (1 Column) */}
        <div className={`aviation-card rounded-2xl p-4 border flex flex-col h-[520px] lg:h-full overflow-hidden shadow-sm ${
          isCream ? 'bg-white border-[#E7E2D9]' : 'bg-slate-900/60 border-slate-800'
        }`}>
          {/* Header */}
          <div className="flex items-center justify-between border-b pb-3 mb-3 shrink-0 border-stone-200">
            <div className="flex items-center space-x-2">
              <Plane className="w-4 h-4 text-amber-600" />
              <h3 className={`text-xs font-bold uppercase tracking-wider ${isCream ? 'text-stone-900' : 'text-white'}`}>
                Corridor Inspector
              </h3>
            </div>
            <span className="text-[11px] font-mono text-stone-500">
              {filteredRoutes.length.toLocaleString()} routes
            </span>
          </div>

          {/* Selected Airport Detail Banner */}
          {selectedAirport && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 mb-3 shrink-0 relative">
              <button
                onClick={() => setSelectedAirport(null)}
                className="absolute top-2 right-2 text-stone-400 hover:text-stone-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <div className="flex items-center space-x-1.5 text-amber-700 text-xs font-bold mb-1">
                <Radio className="w-3.5 h-3.5" />
                <span>Selected Airport</span>
              </div>
              <p className={`font-bold text-sm ${isCream ? 'text-stone-900' : 'text-white'}`}>{selectedAirport.city} ({selectedAirport.iata})</p>
              <p className="text-[11px] text-stone-500 truncate">{selectedAirport.name}</p>
              <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-amber-500/20 text-[11px]">
                <div>
                  <span className="text-stone-500">Destinations: </span>
                  <span className={`font-mono font-bold ${isCream ? 'text-stone-900' : 'text-white'}`}>{selectedAirport.connected_routes_count}</span>
                </div>
                <div>
                  <span className="text-stone-500">Hub Class: </span>
                  <span className="text-emerald-700 font-semibold">{selectedAirport.category}</span>
                </div>
              </div>
            </div>
          )}

          {/* Selected Route Detail Banner */}
          {selectedRoute && (
            <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/30 mb-3 shrink-0 relative">
              <button
                onClick={() => setSelectedRoute(null)}
                className="absolute top-2 right-2 text-stone-400 hover:text-stone-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <div className="flex items-center space-x-1.5 text-sky-700 text-xs font-bold mb-1">
                <Plane className="w-3.5 h-3.5" />
                <span>Selected Corridor</span>
              </div>
              <p className={`font-bold text-sm ${isCream ? 'text-stone-900' : 'text-white'}`}>
                {selectedRoute.origin_city} → {selectedRoute.destination_city}
              </p>
              <div className="space-y-1 mt-2 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-stone-500">Carrier:</span>
                  <span className="font-semibold text-sky-700">{selectedRoute.primary_airline}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Frequency:</span>
                  <span className={`font-mono font-bold ${isCream ? 'text-stone-900' : 'text-white'}`}>{selectedRoute.frequency} flights/wk</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Distance:</span>
                  <span className="font-mono text-stone-700">{selectedRoute.distance_km} km</span>
                </div>
                {selectedRoute.fare_info && (
                  <div className="flex justify-between font-bold text-emerald-700 pt-1 border-t border-sky-500/20">
                    <span>Avg Fare:</span>
                    <span>₹{selectedRoute.fare_info.avg_fare.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Route Filter Search */}
          <div className="relative mb-2 shrink-0">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-stone-400" />
            <input
              type="text"
              placeholder="Search corridor..."
              value={routeSearch}
              onChange={(e) => setRouteSearch(e.target.value)}
              className={`w-full border rounded-xl pl-9 pr-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                isCream ? 'bg-[#F9F7F2] border-stone-300 text-stone-900 placeholder:text-stone-400' : 'bg-[#0B111E] border-slate-700 text-white placeholder:text-slate-500'
              }`}
            />
          </div>

          {/* Corridors Scroll List */}
          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
            {inspectedRoutes.map((route) => {
              const isSelected = selectedRoute?.route_id === route.route_id;
              return (
                <div
                  key={route.route_id}
                  onClick={() => setSelectedRoute(isSelected ? null : route)}
                  className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-amber-100/70 border-amber-500 shadow-sm'
                      : isCream ? 'bg-[#FAF7F2] hover:bg-stone-100 border-stone-200' : 'bg-slate-900/60 hover:bg-slate-800 border-slate-800'
                  }`}
                >
                  <div className={`flex items-center justify-between font-semibold ${isCream ? 'text-stone-900' : 'text-white'}`}>
                    <span className="truncate">
                      {route.origin_city} ({route.origin_iata}) → {route.destination_city} ({route.destination_iata})
                    </span>
                    <span 
                      className="w-2.5 h-2.5 rounded-full shrink-0 ml-1.5 shadow-sm" 
                      style={{ backgroundColor: route.color_hex }}
                      title={route.primary_airline}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between text-[11px] text-stone-500 mt-1">
                    <span className="truncate max-w-[120px]">{route.primary_airline}</span>
                    <span className="font-mono text-amber-700 font-semibold">{route.frequency} slots</span>
                  </div>

                  {route.fare_info && (
                    <div className="mt-1 pt-1 border-t border-stone-200 flex justify-between text-[10px] text-emerald-700 font-mono font-medium">
                      <span>Avg: ₹{route.fare_info.avg_fare.toLocaleString()}</span>
                      <span className="text-stone-400">Min: ₹{route.fare_info.min_fare.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              );
            })}

            {inspectedRoutes.length === 0 && (
              <p className="text-xs text-stone-500 text-center py-6">
                No matching corridors found.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
