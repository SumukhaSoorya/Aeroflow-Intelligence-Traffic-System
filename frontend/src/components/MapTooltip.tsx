import React from 'react';
import { Airport, Route } from '../types/aviation';
import { useAviation } from '../context/AviationContext';
import { Plane, Radio } from 'lucide-react';

interface MapTooltipProps {
  info: any;
}

export const MapTooltip: React.FC<MapTooltipProps> = ({ info }) => {
  const { theme } = useAviation();
  const isCream = theme === 'cream';

  if (!info || !info.object) return null;

  const { object, x, y, layer } = info;
  const isAirport = layer?.id === 'airports-layer';
  const isRoute = layer?.id === 'routes-arc-layer';

  if (!isAirport && !isRoute) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: x + 12,
        top: y + 12,
        pointerEvents: 'none',
        zIndex: 50,
      }}
      className={`aviation-card rounded-xl p-3.5 shadow-2xl border text-xs min-w-[220px] max-w-[300px] backdrop-blur-md ${
        isCream ? 'bg-white/95 text-stone-900 border-amber-500/40 shadow-stone-300' : 'bg-slate-900/95 text-white border-sky-500/40'
      }`}
    >
      {isAirport && (
        <div>
          <div className="flex items-center space-x-2 border-b border-stone-200 pb-2 mb-2">
            <div className="p-1 rounded-lg bg-emerald-500/20 text-emerald-600">
              <Radio className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className={`font-bold text-sm ${isCream ? 'text-stone-900' : 'text-white'}`}>{(object as Airport).iata}</span>
              <span className="text-stone-500 ml-1.5 font-normal truncate">{(object as Airport).city}</span>
            </div>
          </div>
          <div className="space-y-1.5 text-slate-300 text-[11px]">
            <p className="text-slate-400 font-medium truncate">{(object as Airport).name}</p>
            <div className="flex justify-between pt-1">
              <span className="text-slate-400">Connected Corridors:</span>
              <span className="font-mono text-emerald-400 font-bold">{(object as Airport).connected_routes_count} destinations</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Airlines Operating:</span>
              <span className="font-mono text-violet-400 font-bold">{(object as Airport).airline_count}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Hub Category:</span>
              <span className="font-mono text-sky-400 font-semibold">{(object as Airport).category}</span>
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 pt-1.5 border-t border-slate-800">
              <span>{(object as Airport).latitude.toFixed(3)}° N, {(object as Airport).longitude.toFixed(3)}° E</span>
              <span>{(object as Airport).elevation_ft} ft MSL</span>
            </div>
          </div>
        </div>
      )}

      {isRoute && (
        <div>
          <div className="flex items-center space-x-2 border-b border-slate-700/60 pb-2 mb-2">
            <div className="p-1 rounded-lg bg-sky-500/20 text-sky-400">
              <Plane className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-white text-sm">
              {(object as Route).origin_city} → {(object as Route).destination_city}
            </span>
          </div>
          <div className="space-y-1.5 text-slate-300 text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-400">Primary Airline:</span>
              <span className="font-semibold text-sky-400">{(object as Route).primary_airline}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Schedule Frequency:</span>
              <span className="font-mono text-white font-bold">{(object as Route).frequency} weekly slots</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Competing Airlines:</span>
              <span className="font-mono text-rose-400 font-bold">{(object as Route).airline_count} carriers</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Great-Circle Distance:</span>
              <span className="font-mono text-slate-300">{(object as Route).distance_km} km</span>
            </div>

            {(object as Route).fare_info && (
              <div className="mt-2 pt-2 border-t border-slate-700/60 space-y-1">
                <div className="flex justify-between items-center text-amber-400 font-bold">
                  <span>Average Fare:</span>
                  <span className="font-mono">₹{(object as Route).fare_info!.avg_fare.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Min: ₹{(object as Route).fare_info!.min_fare.toLocaleString()}</span>
                  <span>Max: ₹{(object as Route).fare_info!.max_fare.toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
