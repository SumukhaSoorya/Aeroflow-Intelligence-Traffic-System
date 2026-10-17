import React, { useState } from 'react';
import { useAviation } from '../context/AviationContext';
import { AirlineCoverageChart } from '../charts/AirlineCoverageChart';
import { 
  PlaneTakeoff, 
  ShieldCheck, 
  Award, 
  Route, 
  TrendingUp
} from 'lucide-react';
import type { Airline } from '../types/aviation';

export const AirlineAnalysisPage: React.FC = () => {
  const { airlines, theme } = useAviation();
  const isCream = theme === 'cream';

  const [selectedAirline, setSelectedAirline] = useState<Airline>(airlines[0]);

  // Objective leadership metrics
  const highestRouteCarrier = [...airlines].sort((a, b) => b.routes_operated - a.routes_operated)[0];
  const highestFlightCarrier = [...airlines].sort((a, b) => b.total_flights - a.total_flights)[0];
  const lowestAvgFareCarrier = [...airlines]
    .filter(a => a.fare_stats)
    .sort((a, b) => a.fare_stats!.avg_fare - b.fare_stats!.avg_fare)[0];

  return (
    <div className="space-y-6 pb-8">
      {/* Top Banner Card with Violet Theme */}
      <div className={`aviation-card card-accent-violet rounded-2xl p-6 border relative overflow-hidden shadow-sm ${
        isCream ? 'bg-white border-violet-500/25' : 'bg-slate-900/60 border-violet-500/20'
      }`}>
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 rounded-md bg-violet-500/10 border border-violet-500/25 text-violet-700 text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5">
                <PlaneTakeoff className="w-3.5 h-3.5" />
                <span>Carrier Operations & Fleet Utilization</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-stone-100 border border-stone-200 text-stone-600 text-[11px] font-mono">
                14 Domestic Carriers
              </span>
            </div>
            
            <h2 className={`text-2xl font-black tracking-tight ${isCream ? 'text-stone-900' : 'text-white'}`}>
              Domestic Airline Operational Profiles & Market Share
            </h2>
            
            <p className="text-xs text-stone-600 max-w-3xl leading-relaxed">
              Rigorous comparative analytics evaluating 14 Indian scheduled carriers across published timetable databases and pricing records. Tracks weekly departures, corridor reach, airport footprint, and observed pricing.
            </p>
          </div>

          <div className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs shrink-0 ${
            isCream ? 'bg-[#F4EFE6] border-stone-300 text-stone-800' : 'bg-slate-900 border-slate-800 text-slate-300'
          }`}>
            <ShieldCheck className="w-4 h-4 text-sky-600" />
            <span>Strictly Verified Datasets</span>
          </div>
        </div>
      </div>

      {/* 3 Standout High-Impact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Highest Route Coverage */}
        <div className={`aviation-card card-accent-cyan rounded-2xl p-5 border relative overflow-hidden shadow-sm ${
          isCream ? 'bg-white border-sky-500/25' : 'bg-slate-900/40 border-sky-500/20'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700">
              Broadest Route Network
            </span>
            <Route className="w-4 h-4 text-sky-600" />
          </div>
          <p className={`text-xl font-black ${isCream ? 'text-stone-900' : 'text-white'}`}>{highestRouteCarrier.name}</p>
          <p className="text-sm font-mono font-bold text-sky-700 mt-1">
            {highestRouteCarrier.routes_operated} Unique Corridors
          </p>
          <p className="text-xs text-stone-500 mt-2">
            Connects {highestRouteCarrier.airports_served_count} airports across all Indian zones.
          </p>
        </div>

        {/* Highest Flight Frequency */}
        <div className={`aviation-card card-accent-violet rounded-2xl p-5 border relative overflow-hidden shadow-sm ${
          isCream ? 'bg-white border-violet-500/25' : 'bg-slate-900/40 border-violet-500/20'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-violet-700">
              Highest Departure Volume
            </span>
            <TrendingUp className="w-4 h-4 text-violet-600" />
          </div>
          <p className={`text-xl font-black ${isCream ? 'text-stone-900' : 'text-white'}`}>{highestFlightCarrier.name}</p>
          <p className="text-sm font-mono font-bold text-violet-700 mt-1">
            {highestFlightCarrier.total_flights.toLocaleString()} Weekly Flights
          </p>
          <p className="text-xs text-stone-500 mt-2">
            Commands {highestFlightCarrier.flight_share_pct}% of total domestic schedule capacity.
          </p>
        </div>

        {/* Lowest Average Fare */}
        <div className={`aviation-card card-accent-emerald rounded-2xl p-5 border relative overflow-hidden shadow-sm ${
          isCream ? 'bg-white border-emerald-500/25' : 'bg-slate-900/40 border-emerald-500/20'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
              Lowest Average Fare
            </span>
            <Award className="w-4 h-4 text-emerald-600" />
          </div>
          <p className={`text-xl font-black ${isCream ? 'text-stone-900' : 'text-white'}`}>{lowestAvgFareCarrier.name}</p>
          <p className="text-sm font-mono font-bold text-emerald-700 mt-1">
            ₹{Math.round(lowestAvgFareCarrier.fare_stats!.avg_fare).toLocaleString()} Average Fare
          </p>
          <p className="text-xs text-stone-500 mt-2">
            Derived from {lowestAvgFareCarrier.fare_stats!.fare_count.toLocaleString()} pricing records.
          </p>
        </div>
      </div>

      {/* Main Bar Chart: Routes Operated */}
      <div className={`aviation-card rounded-2xl p-5 border shadow-sm ${isCream ? 'bg-white border-stone-200' : 'bg-slate-900/40 border-slate-800'}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-violet-500" />
            <h3 className={`text-sm font-bold uppercase tracking-wider ${isCream ? 'text-stone-900' : 'text-white'}`}>
              Airline Route Network Coverage (Unique Corridors Operated)
            </h3>
          </div>
          <span className="text-[11px] text-stone-500 font-mono">14 Airlines</span>
        </div>
        <p className="text-xs text-stone-500 mb-4">
          Quantifies how extensively each carrier connects Indian origin-destination pairs. IndiGo and Air India lead nationwide, followed by regional operators.
        </p>
        <AirlineCoverageChart />
      </div>

      {/* Interactive Carrier Deep-Dive Selector & Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Carrier Selection List */}
        <div className={`aviation-card rounded-2xl p-4 border space-y-2 shadow-sm ${isCream ? 'bg-white border-stone-200' : 'bg-slate-900/40 border-slate-800'}`}>
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-stone-200">
            <h3 className={`text-xs font-bold uppercase tracking-wider ${isCream ? 'text-stone-800' : 'text-slate-300'}`}>
              Select Carrier for Deep-Dive
            </h3>
            <span className="text-[10px] text-stone-400 font-mono">14 Airlines</span>
          </div>

          <div className="space-y-1.5 max-h-[460px] overflow-y-auto pr-1">
            {airlines.map((a) => {
              const isSelected = selectedAirline.name === a.name;
              return (
                <button
                  key={a.name}
                  onClick={() => setSelectedAirline(a)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs transition-all ${
                    isSelected
                      ? 'bg-violet-100 border border-violet-400 text-violet-950 font-bold shadow-sm'
                      : isCream ? 'hover:bg-stone-100 border border-transparent text-stone-700' : 'hover:bg-slate-800 border border-transparent text-slate-300'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <span 
                      className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm" 
                      style={{ backgroundColor: a.color_hex }}
                    />
                    <span className="truncate">{a.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-violet-700 text-[11px] font-bold">
                      {a.flight_share_pct}%
                    </span>
                    <span className="font-mono text-stone-400 text-[11px]">
                      {a.routes_operated} rts
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Airline Detailed Operational Card */}
        <div className={`lg:col-span-2 aviation-card rounded-2xl p-5 border space-y-5 shadow-sm ${isCream ? 'bg-white border-stone-200' : 'bg-slate-900/40 border-slate-800'}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-200 gap-3">
            <div className="flex items-center space-x-3.5">
              <span 
                className="w-5 h-5 rounded-full shrink-0 shadow-md ring-2 ring-stone-300" 
                style={{ backgroundColor: selectedAirline.color_hex }}
              />
              <div>
                <h3 className={`text-lg font-black ${isCream ? 'text-stone-900' : 'text-white'}`}>{selectedAirline.name}</h3>
                <span className="text-xs text-stone-500">Scheduled Commercial Operator Profile</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs text-violet-800 bg-violet-100 px-3 py-1 rounded-xl border border-violet-300 font-bold">
                {selectedAirline.flight_share_pct}% Capacity Share
              </span>
            </div>
          </div>

          {/* Metric Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className={`p-3.5 rounded-xl border ${isCream ? 'bg-[#FDFBF7] border-stone-200' : 'bg-slate-900/80 border-slate-800'}`}>
              <span className="text-[10px] uppercase text-stone-500 block font-bold">Weekly Departures</span>
              <span className={`text-lg font-bold font-mono mt-0.5 block ${isCream ? 'text-stone-900' : 'text-white'}`}>
                {selectedAirline.total_flights.toLocaleString()}
              </span>
            </div>
            
            <div className={`p-3.5 rounded-xl border ${isCream ? 'bg-[#FDFBF7] border-stone-200' : 'bg-slate-900/80 border-slate-800'}`}>
              <span className="text-[10px] uppercase text-stone-500 block font-bold">Unique Corridors</span>
              <span className="text-lg font-bold font-mono text-violet-700 mt-0.5 block">
                {selectedAirline.routes_operated}
              </span>
            </div>

            <div className={`p-3.5 rounded-xl border ${isCream ? 'bg-[#FDFBF7] border-stone-200' : 'bg-slate-900/80 border-slate-800'}`}>
              <span className="text-[10px] uppercase text-stone-500 block font-bold">Airports Served</span>
              <span className="text-lg font-bold font-mono text-sky-700 mt-0.5 block">
                {selectedAirline.airports_served_count}
              </span>
            </div>

            <div className={`p-3.5 rounded-xl border ${isCream ? 'bg-[#FDFBF7] border-stone-200' : 'bg-slate-900/80 border-slate-800'}`}>
              <span className="text-[10px] uppercase text-stone-500 block font-bold">Observed Avg Fare</span>
              <span className="text-lg font-bold font-mono text-emerald-700 mt-0.5 block">
                {selectedAirline.fare_stats ? `₹${Math.round(selectedAirline.fare_stats.avg_fare).toLocaleString()}` : 'N/A*'}
              </span>
            </div>
          </div>

          {/* Top 5 Corridors Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600">
                Most Frequently Operated Flight Corridors
              </h4>
              <span className="text-[11px] text-stone-400 font-mono">Weekly Flights</span>
            </div>

            <div className="rounded-xl border border-stone-200 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className={`text-[11px] font-semibold border-b ${isCream ? 'bg-[#F4EFE6] text-stone-600 border-stone-300' : 'bg-slate-900 text-slate-400 border-slate-800'}`}>
                  <tr>
                    <th className="py-2.5 px-3.5">Corridor</th>
                    <th className="py-2.5 px-3.5 text-right">Weekly Departures</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isCream ? 'divide-stone-200 bg-white' : 'divide-slate-800/60 bg-slate-950/40'}`}>
                  {selectedAirline.top_routes.map((tr, i) => (
                    <tr key={i} className={`transition-colors ${isCream ? 'hover:bg-violet-50/50' : 'hover:bg-slate-800/30'}`}>
                      <td className={`py-2.5 px-3.5 font-medium ${isCream ? 'text-stone-800' : 'text-slate-200'}`}>{tr.route}</td>
                      <td className="py-2.5 px-3.5 text-right font-mono text-violet-700 font-bold">{tr.flights}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
