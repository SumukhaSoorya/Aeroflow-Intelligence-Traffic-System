import React, { useState } from 'react';
import { AviationMap } from '../maps/AviationMap';
import { FilterBar } from '../components/FilterBar';
import { useAviation } from '../context/AviationContext';
import { 
  Plane, 
  Radio, 
  Search, 
  X,
  Compass,
  IndianRupee,
  ArrowRight,
  Sparkles,
  Tag
} from 'lucide-react';

interface MapPageProps {
  onNavigate?: (tab: string) => void;
}

export const MapPage: React.FC<MapPageProps> = ({ onNavigate }) => {
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
            <div className={`p-3.5 rounded-xl border mb-3 shrink-0 relative transition-all ${
              isCream 
                ? 'bg-gradient-to-br from-amber-500/10 via-amber-50/50 to-orange-500/10 border-amber-300' 
                : 'bg-gradient-to-br from-amber-950/20 via-slate-900 to-sky-950/20 border-amber-500/30'
            }`}>
              <button
                onClick={() => setSelectedRoute(null)}
                className="absolute top-2.5 right-2.5 text-stone-400 hover:text-stone-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center space-x-1.5 text-amber-700 text-xs font-bold mb-1">
                <Plane className="w-3.5 h-3.5" />
                <span>Selected Flight Corridor</span>
              </div>

              <p className={`font-bold text-sm ${isCream ? 'text-stone-900' : 'text-white'}`}>
                {selectedRoute.origin_city} ({selectedRoute.origin_iata}) → {selectedRoute.destination_city} ({selectedRoute.destination_iata})
              </p>

              {/* Corridor Fares Highlight Box */}
              {selectedRoute.fare_info && (
                <div className={`mt-2.5 p-2.5 rounded-lg border space-y-1.5 text-xs ${
                  isCream ? 'bg-white/90 border-amber-200 shadow-xs' : 'bg-slate-900/90 border-slate-700'
                }`}>
                  <div className="flex justify-between items-baseline">
                    <span className="text-stone-500 text-[11px] font-semibold">Average Fare:</span>
                    <span className="font-mono text-base font-black text-amber-700">
                      ₹{selectedRoute.fare_info.avg_fare.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between text-[11px]">
                    <span className="text-stone-500">Price Spread:</span>
                    <span className="font-mono font-bold text-emerald-700">
                      ₹{selectedRoute.fare_info.min_fare.toLocaleString()} - ₹{selectedRoute.fare_info.max_fare.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between text-[11px]">
                    <span className="text-stone-500">Yield per KM:</span>
                    <span className="font-mono font-semibold text-sky-700">
                      ₹{selectedRoute.fare_info.price_per_km || (selectedRoute.fare_info.avg_fare / selectedRoute.distance_km).toFixed(2)}/km
                    </span>
                  </div>
                </div>
              )}

              {/* Basic Route Specs */}
              <div className="space-y-1 mt-2 text-[11px] text-stone-600">
                <div className="flex justify-between">
                  <span className="text-stone-500">Distance:</span>
                  <span className="font-mono text-stone-800 font-medium">{selectedRoute.distance_km} km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Frequency:</span>
                  <span className={`font-mono font-bold ${isCream ? 'text-stone-900' : 'text-white'}`}>
                    {selectedRoute.frequency} flights/wk
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Airlines Operating:</span>
                  <span className="font-semibold text-stone-800">{selectedRoute.airline_count} Carrier{selectedRoute.airline_count > 1 ? 's' : ''}</span>
                </div>
              </div>

              {/* Competing Airlines & Fares Breakdown */}
              {selectedRoute.fare_info?.airline_fares && selectedRoute.fare_info.airline_fares.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-amber-200/60">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
                    Operating Airlines & Est. Fares
                  </span>
                  <div className="space-y-1 max-h-28 overflow-y-auto pr-1">
                    {selectedRoute.fare_info.airline_fares.map((af) => (
                      <div key={af.airline} className="flex items-center justify-between text-[11px] py-0.5">
                        <span className="text-stone-800 font-medium truncate max-w-[130px]">{af.airline}</span>
                        <div className="flex items-center space-x-1.5 font-mono">
                          <span className="text-amber-700 font-bold">₹{af.avg_fare.toLocaleString()}</span>
                          <span className="text-[9px] text-stone-400">({af.service_type})</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Jump to Fare Analysis Comparison Button */}
              {onNavigate && (
                <button
                  onClick={() => onNavigate('fares')}
                  className="w-full mt-3 flex items-center justify-center space-x-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-colors"
                >
                  <IndianRupee className="w-3.5 h-3.5" />
                  <span>Compare in Fare Analyzer</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
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
