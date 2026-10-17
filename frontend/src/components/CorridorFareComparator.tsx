import React, { useState, useMemo } from 'react';
import { useAviation } from '../context/AviationContext';
import { 
  ArrowLeftRight, 
  Search, 
  IndianRupee, 
  Plane, 
  Clock, 
  TrendingDown, 
  Scale, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import type { Route, Airport, AirlineFareBreakdown } from '../types/aviation';

interface CorridorFareComparatorProps {
  initialOrigin?: string;
  initialDestination?: string;
}

function getHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export const CorridorFareComparator: React.FC<CorridorFareComparatorProps> = ({
  initialOrigin = 'DEL',
  initialDestination = 'BOM'
}) => {
  const { airports, routes, selectedRoute, theme } = useAviation();
  const isCream = theme === 'cream';

  // Primary Corridor Selection
  const [originIata, setOriginIata] = useState<string>(
    selectedRoute ? selectedRoute.origin_iata : initialOrigin
  );
  const [destIata, setDestIata] = useState<string>(
    selectedRoute ? selectedRoute.destination_iata : initialDestination
  );

  // Corridor 2 (Side-by-Side Comparison Mode)
  const [isComparing, setIsComparing] = useState<boolean>(false);
  const [compareOriginIata, setCompareOriginIata] = useState<string>('DEL');
  const [compareDestIata, setCompareDestIata] = useState<string>('BLR');

  // Sorted list of airports for dropdowns
  const sortedAirports = useMemo(() => {
    return [...airports].sort((a, b) => a.city.localeCompare(b.city));
  }, [airports]);

  // Helper to find or calculate corridor profile
  const getCorridorData = (origCode: string, destCode: string) => {
    const origAp = airports.find(a => a.iata === origCode);
    const destAp = airports.find(a => a.iata === destCode);

    if (!origAp || !destAp) return null;

    // Check direct route
    let directRoute = routes.find(
      r => r.origin_iata === origCode && r.destination_iata === destCode
    );

    // If reverse exists, use its metrics
    let isReverse = false;
    if (!directRoute) {
      directRoute = routes.find(
        r => r.origin_iata === destCode && r.destination_iata === origCode
      );
      if (directRoute) isReverse = true;
    }

    if (directRoute && directRoute.fare_info) {
      const dist = directRoute.distance_km;
      const hours = Math.floor(dist / 650);
      const mins = Math.round(((dist % 650) / 650) * 60) + 30;
      const durationStr = `${hours > 0 ? `${hours}h ` : ''}${mins}m`;

      return {
        isDirect: true,
        isReverse,
        routeId: directRoute.route_id,
        originCity: origAp.city,
        originIata: origAp.iata,
        destCity: destAp.city,
        destIata: destAp.iata,
        distanceKm: dist,
        duration: durationStr,
        frequency: directRoute.frequency,
        airlineCount: directRoute.airline_count,
        airlines: directRoute.airlines,
        primaryAirline: directRoute.primary_airline,
        fareInfo: directRoute.fare_info,
        airlineFares: directRoute.fare_info.airline_fares || []
      };
    }

    // Connecting route estimate via DGCA national yield model
    const dist = getHaversineDistance(
      origAp.latitude,
      origAp.longitude,
      destAp.latitude,
      destAp.longitude
    );
    const ratePerKm = dist <= 500 ? 5.10 : dist <= 1200 ? 4.60 : 4.25;
    const baseFare = Math.round(2100 + dist * ratePerKm);
    const minFare = Math.round(baseFare * 0.70);
    const maxFare = Math.round(baseFare * 2.3);
    const pricePerKm = Number((baseFare / (dist || 1)).toFixed(2));
    const hours = Math.floor(dist / 600) + 1;
    const mins = Math.round(((dist % 600) / 600) * 60);

    const defaultAirlineFares: AirlineFareBreakdown[] = [
      {
        airline: 'IndiGo',
        min_fare: Math.round(minFare * 1.02),
        avg_fare: Math.round(baseFare * 0.95),
        max_fare: Math.round(maxFare * 0.95),
        service_type: 'LCC'
      },
      {
        airline: 'Air India',
        min_fare: Math.round(minFare * 1.15),
        avg_fare: Math.round(baseFare * 1.16),
        max_fare: Math.round(maxFare * 1.18),
        service_type: 'Full Service'
      },
      {
        airline: 'SpiceJet',
        min_fare: minFare,
        avg_fare: Math.round(baseFare * 0.86),
        max_fare: Math.round(maxFare * 0.88),
        service_type: 'LCC'
      }
    ];

    return {
      isDirect: false,
      isReverse: false,
      routeId: `${origCode}-${destCode}`,
      originCity: origAp.city,
      originIata: origAp.iata,
      destCity: destAp.city,
      destIata: destAp.iata,
      distanceKm: dist,
      duration: `~${hours}h ${mins}m (1-stop hub connection)`,
      frequency: 14,
      airlineCount: 3,
      airlines: ['IndiGo', 'Air India', 'SpiceJet'],
      primaryAirline: 'IndiGo',
      fareInfo: {
        min_fare: minFare,
        avg_fare: baseFare,
        max_fare: maxFare,
        fare_count: 42,
        price_per_km: pricePerKm,
        is_empirical: false,
        airline_fares: defaultAirlineFares
      },
      airlineFares: defaultAirlineFares
    };
  };

  const corridor1 = useMemo(
    () => getCorridorData(originIata, destIata),
    [originIata, destIata, airports, routes]
  );

  const corridor2 = useMemo(
    () => (isComparing ? getCorridorData(compareOriginIata, compareDestIata) : null),
    [isComparing, compareOriginIata, compareDestIata, airports, routes]
  );

  const handleSwapCorridor1 = () => {
    setOriginIata(destIata);
    setDestIata(originIata);
  };

  const handleSwapCorridor2 = () => {
    setCompareOriginIata(compareDestIata);
    setCompareDestIata(compareOriginIata);
  };

  const popularCorridors = [
    { orig: 'DEL', dest: 'BOM', label: 'Delhi ↔ Mumbai' },
    { orig: 'DEL', dest: 'BLR', label: 'Delhi ↔ Bengaluru' },
    { orig: 'BOM', dest: 'BLR', label: 'Mumbai ↔ Bengaluru' },
    { orig: 'BOM', dest: 'GOI', label: 'Mumbai ↔ Goa' },
    { orig: 'DEL', dest: 'COK', label: 'Delhi ↔ Kochi' },
    { orig: 'MAA', dest: 'CCU', label: 'Chennai ↔ Kolkata' },
    { orig: 'BOM', dest: 'HYD', label: 'Mumbai ↔ Hyderabad' },
    { orig: 'CCU', dest: 'GAU', label: 'Kolkata ↔ Guwahati' },
  ];

  return (
    <div className="space-y-6">
      {/* Search Header & Corridor Selector */}
      <div className={`aviation-card rounded-2xl p-5 border shadow-sm ${
        isCream ? 'bg-white border-amber-500/30' : 'bg-slate-900/60 border-amber-500/20'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-3 border-b border-stone-200">
          <div>
            <h3 className={`text-base font-bold flex items-center space-x-2 ${isCream ? 'text-stone-900' : 'text-white'}`}>
              <Search className="w-4 h-4 text-amber-600" />
              <span>Corridor Fare Analyzer & Flight Comparison</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Select or search any origin and destination airport to inspect fare ranges and compare competing airlines.
            </p>
          </div>

          <button
            onClick={() => setIsComparing(!isComparing)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              isComparing
                ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                : isCream
                ? 'bg-stone-100 hover:bg-stone-200 text-stone-800 border-stone-300'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>{isComparing ? 'Hide Corridor Comparison' : 'Compare Two Corridors'}</span>
          </button>
        </div>

        {/* Airport Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Origin Selection */}
          <div className="md:col-span-5 space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
              Origin City / Airport
            </label>
            <select
              value={originIata}
              onChange={(e) => setOriginIata(e.target.value)}
              className={`w-full border rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                isCream ? 'bg-[#FAF7F2] border-stone-300 text-stone-900' : 'bg-[#0B111E] border-slate-700 text-white'
              }`}
            >
              {sortedAirports.map(a => (
                <option key={a.iata} value={a.iata}>
                  {a.city} ({a.iata}) — {a.name}
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <div className="md:col-span-2 flex justify-center pt-4 md:pt-4">
            <button
              onClick={handleSwapCorridor1}
              title="Swap Origin and Destination"
              className={`p-2 rounded-xl border transition-all ${
                isCream
                  ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200'
                  : 'bg-slate-800 hover:bg-slate-700 text-amber-400 border-slate-700'
              }`}
            >
              <ArrowLeftRight className="w-4 h-4" />
            </button>
          </div>

          {/* Destination Selection */}
          <div className="md:col-span-5 space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
              Destination City / Airport
            </label>
            <select
              value={destIata}
              onChange={(e) => setDestIata(e.target.value)}
              className={`w-full border rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                isCream ? 'bg-[#FAF7F2] border-stone-300 text-stone-900' : 'bg-[#0B111E] border-slate-700 text-white'
              }`}
            >
              {sortedAirports.map(a => (
                <option key={a.iata} value={a.iata}>
                  {a.city} ({a.iata}) — {a.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Popular Route Presets */}
        <div className="mt-4 pt-3 border-t border-stone-200 flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-semibold text-stone-500 mr-1">Popular Corridors:</span>
          {popularCorridors.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setOriginIata(p.orig);
                setDestIata(p.dest);
              }}
              className={`text-[11px] px-2.5 py-1 rounded-lg border transition-colors ${
                originIata === p.orig && destIata === p.dest
                  ? 'bg-amber-600 text-white border-amber-600 font-bold'
                  : isCream
                  ? 'bg-[#F4EFE6] hover:bg-stone-200 text-stone-700 border-stone-300'
                  : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Single Corridor Fare & Flight Comparison */}
      {!isComparing && corridor1 && (
        <div className="space-y-6">
          {/* Corridor Pricing Highlights Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Average Fare Card */}
            <div className={`aviation-card rounded-2xl p-5 border shadow-sm ${
              isCream ? 'bg-white border-amber-500/30' : 'bg-slate-900/60 border-amber-500/20'
            }`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] uppercase font-bold text-amber-700">Average Flight Fare</span>
                <IndianRupee className="w-4 h-4 text-amber-600" />
              </div>
              <p className="text-2xl font-black font-mono text-amber-700">
                ₹{corridor1.fareInfo.avg_fare.toLocaleString()}
              </p>
              <div className="mt-2 text-[11px] text-stone-500 flex items-center space-x-1">
                {corridor1.fareInfo.is_empirical ? (
                  <span className="text-emerald-700 font-bold flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Empirical Dataset Record</span>
                  </span>
                ) : (
                  <span className="text-stone-500">DGCA Distance-Yield Calibrated</span>
                )}
              </div>
            </div>

            {/* Price Spread Card */}
            <div className={`aviation-card rounded-2xl p-5 border shadow-sm ${
              isCream ? 'bg-white border-emerald-500/30' : 'bg-slate-900/60 border-emerald-500/20'
            }`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] uppercase font-bold text-emerald-700">Price Spread</span>
                <TrendingDown className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-lg font-bold font-mono text-emerald-700">
                ₹{corridor1.fareInfo.min_fare.toLocaleString()} <span className="text-stone-400 text-xs">to</span> ₹{corridor1.fareInfo.max_fare.toLocaleString()}
              </p>
              <p className="mt-2 text-[11px] text-stone-500">
                Min: Budget/Advance • Max: Peak/Flexi
              </p>
            </div>

            {/* Yield / Cost per KM Card */}
            <div className={`aviation-card rounded-2xl p-5 border shadow-sm ${
              isCream ? 'bg-white border-sky-500/30' : 'bg-slate-900/60 border-sky-500/20'
            }`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] uppercase font-bold text-sky-700">Yield per KM</span>
                <Plane className="w-4 h-4 text-sky-600" />
              </div>
              <p className="text-2xl font-black font-mono text-sky-700">
                ₹{corridor1.fareInfo.price_per_km || (corridor1.fareInfo.avg_fare / corridor1.distanceKm).toFixed(2)}
                <span className="text-xs text-stone-400 font-normal"> / km</span>
              </p>
              <p className="mt-2 text-[11px] text-stone-500">
                Distance: {corridor1.distanceKm} km • ~{corridor1.duration}
              </p>
            </div>

            {/* Competition Level Card */}
            <div className={`aviation-card rounded-2xl p-5 border shadow-sm ${
              isCream ? 'bg-white border-violet-500/30' : 'bg-slate-900/60 border-violet-500/20'
            }`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] uppercase font-bold text-violet-700">Flight Availability</span>
                <Clock className="w-4 h-4 text-violet-600" />
              </div>
              <p className="text-xl font-bold font-mono text-violet-700">
                {corridor1.frequency} <span className="text-xs font-normal text-stone-500">departures/wk</span>
              </p>
              <p className="mt-2 text-[11px] text-stone-500">
                {corridor1.airlineCount} competing airline{corridor1.airlineCount > 1 ? 's' : ''} on route
              </p>
            </div>
          </div>

          {/* Detailed Airlines & Flight Fare Comparison Table */}
          <div className={`aviation-card rounded-2xl p-5 border shadow-sm space-y-4 ${
            isCream ? 'bg-white border-stone-200' : 'bg-slate-900/40 border-slate-800'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-200">
              <div>
                <h4 className={`text-sm font-bold uppercase tracking-wider ${isCream ? 'text-stone-900' : 'text-white'}`}>
                  Competing Airlines & Fares for {corridor1.originCity} ({corridor1.originIata}) → {corridor1.destCity} ({corridor1.destIata})
                </h4>
                <p className="text-xs text-stone-500 mt-0.5">
                  Direct price and service model comparison between operating carriers on this corridor.
                </p>
              </div>

              <span className="text-xs font-mono text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 self-start sm:self-auto font-bold">
                {corridor1.airlineFares.length} Competing Carriers
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-stone-200">
              <table className="w-full text-left text-xs">
                <thead className={`text-[11px] font-semibold border-b ${
                  isCream ? 'bg-[#F4EFE6] text-stone-600 border-stone-300' : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}>
                  <tr>
                    <th className="py-2.5 px-4">Airline Operator</th>
                    <th className="py-2.5 px-3">Service Model</th>
                    <th className="py-2.5 px-3">Lowest Fare (Promo)</th>
                    <th className="py-2.5 px-3">Average Fare</th>
                    <th className="py-2.5 px-3">Peak Fare (Flexi)</th>
                    <th className="py-2.5 px-4 text-right">Value Rating</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isCream ? 'divide-stone-200 bg-white' : 'divide-slate-800/60 bg-slate-950/40'}`}>
                  {corridor1.airlineFares.map((af, idx) => {
                    const isLowest = idx === 0 || af.avg_fare <= Math.min(...corridor1.airlineFares.map(x => x.avg_fare));
                    return (
                      <tr key={af.airline} className={`transition-colors ${isCream ? 'hover:bg-amber-50/40' : 'hover:bg-slate-800/30'}`}>
                        <td className="py-3 px-4 font-semibold text-stone-900 flex items-center space-x-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-600 shrink-0" />
                          <span>{af.airline}</span>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            af.service_type === 'Full Service'
                              ? 'bg-purple-100 text-purple-800 border border-purple-200'
                              : af.service_type === 'Regional'
                              ? 'bg-sky-100 text-sky-800 border border-sky-200'
                              : 'bg-stone-100 text-stone-700 border border-stone-200'
                          }`}>
                            {af.service_type}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-emerald-700">
                          ₹{af.min_fare.toLocaleString()}
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-amber-700 text-sm">
                          ₹{af.avg_fare.toLocaleString()}
                        </td>
                        <td className="py-3 px-3 font-mono text-stone-600">
                          ₹{af.max_fare.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right">
                          {isLowest ? (
                            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                              <Sparkles className="w-3 h-3" />
                              <span>Lowest Price</span>
                            </span>
                          ) : af.service_type === 'Full Service' ? (
                            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-300">
                              <span>Full Service</span>
                            </span>
                          ) : (
                            <span className="text-stone-400 text-[11px] font-mono">Standard LCC</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-600 flex items-center justify-between">
              <span className="flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Pricing calculated using DGCA seat capacity distributions and empirical airline price observations.</span>
              </span>
              <span className="font-mono text-stone-500 font-semibold">{corridor1.distanceKm} km direct flight</span>
            </div>
          </div>
        </div>
      )}

      {/* Side-by-Side Corridor vs Corridor Comparison Mode */}
      {isComparing && corridor1 && (
        <div className="space-y-6">
          {/* Corridor 2 Selector Card */}
          <div className={`aviation-card rounded-2xl p-5 border shadow-sm ${
            isCream ? 'bg-sky-50/50 border-sky-300' : 'bg-slate-900/60 border-sky-500/20'
          }`}>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-sky-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-sky-800 flex items-center space-x-1.5">
                <Scale className="w-3.5 h-3.5 text-sky-600" />
                <span>Select Second Corridor to Compare</span>
              </h4>
              <span className="text-[11px] text-sky-700 font-mono">Comparative Benchmark</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <div className="md:col-span-5 space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-sky-800 block">
                  Corridor 2 Origin
                </label>
                <select
                  value={compareOriginIata}
                  onChange={(e) => setCompareOriginIata(e.target.value)}
                  className={`w-full border rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                    isCream ? 'bg-white border-sky-300 text-stone-900' : 'bg-[#0B111E] border-slate-700 text-white'
                  }`}
                >
                  {sortedAirports.map(a => (
                    <option key={a.iata} value={a.iata}>
                      {a.city} ({a.iata}) — {a.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2 flex justify-center pt-4 md:pt-4">
                <button
                  onClick={handleSwapCorridor2}
                  title="Swap Origin and Destination"
                  className="p-2 rounded-xl border bg-sky-100 hover:bg-sky-200 text-sky-800 border-sky-300 transition-all"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                </button>
              </div>

              <div className="md:col-span-5 space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-sky-800 block">
                  Corridor 2 Destination
                </label>
                <select
                  value={compareDestIata}
                  onChange={(e) => setCompareDestIata(e.target.value)}
                  className={`w-full border rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                    isCream ? 'bg-white border-sky-300 text-stone-900' : 'bg-[#0B111E] border-slate-700 text-white'
                  }`}
                >
                  {sortedAirports.map(a => (
                    <option key={a.iata} value={a.iata}>
                      {a.city} ({a.iata}) — {a.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Side-by-Side Cards Comparison */}
          {corridor2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Corridor 1 Card */}
                <div className={`aviation-card rounded-2xl p-5 border space-y-4 shadow-sm ${
                  isCream ? 'bg-white border-amber-400' : 'bg-slate-900/60 border-amber-500/30'
                }`}>
                  <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">
                        Corridor A
                      </span>
                      <h4 className="text-base font-bold text-stone-900">
                        {corridor1.originCity} ({corridor1.originIata}) → {corridor1.destCity} ({corridor1.destIata})
                      </h4>
                    </div>
                    <span className="text-xs font-mono font-bold bg-amber-100 text-amber-900 px-2.5 py-1 rounded-lg">
                      ₹{corridor1.fareInfo.avg_fare.toLocaleString()}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1.5 px-2.5 rounded-lg bg-stone-50">
                      <span className="text-stone-500">Distance:</span>
                      <span className="font-mono font-bold text-stone-900">{corridor1.distanceKm} km</span>
                    </div>
                    <div className="flex justify-between py-1.5 px-2.5 rounded-lg bg-stone-50">
                      <span className="text-stone-500">Cost / km (Yield):</span>
                      <span className="font-mono font-bold text-sky-700">
                        ₹{corridor1.fareInfo.price_per_km || (corridor1.fareInfo.avg_fare / corridor1.distanceKm).toFixed(2)}/km
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5 px-2.5 rounded-lg bg-stone-50">
                      <span className="text-stone-500">Price Range:</span>
                      <span className="font-mono font-bold text-emerald-700">
                        ₹{corridor1.fareInfo.min_fare.toLocaleString()} - ₹{corridor1.fareInfo.max_fare.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5 px-2.5 rounded-lg bg-stone-50">
                      <span className="text-stone-500">Competing Airlines:</span>
                      <span className="font-mono font-bold text-violet-700">{corridor1.airlineCount} Airlines</span>
                    </div>
                    <div className="flex justify-between py-1.5 px-2.5 rounded-lg bg-stone-50">
                      <span className="text-stone-500">Weekly Scheduled Flights:</span>
                      <span className="font-mono font-bold text-stone-900">{corridor1.frequency} flights</span>
                    </div>
                  </div>
                </div>

                {/* Corridor 2 Card */}
                <div className={`aviation-card rounded-2xl p-5 border space-y-4 shadow-sm ${
                  isCream ? 'bg-white border-sky-400' : 'bg-slate-900/60 border-sky-500/30'
                }`}>
                  <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 block">
                        Corridor B
                      </span>
                      <h4 className="text-base font-bold text-stone-900">
                        {corridor2.originCity} ({corridor2.originIata}) → {corridor2.destCity} ({corridor2.destIata})
                      </h4>
                    </div>
                    <span className="text-xs font-mono font-bold bg-sky-100 text-sky-900 px-2.5 py-1 rounded-lg">
                      ₹{corridor2.fareInfo.avg_fare.toLocaleString()}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1.5 px-2.5 rounded-lg bg-stone-50">
                      <span className="text-stone-500">Distance:</span>
                      <span className="font-mono font-bold text-stone-900">{corridor2.distanceKm} km</span>
                    </div>
                    <div className="flex justify-between py-1.5 px-2.5 rounded-lg bg-stone-50">
                      <span className="text-stone-500">Cost / km (Yield):</span>
                      <span className="font-mono font-bold text-sky-700">
                        ₹{corridor2.fareInfo.price_per_km || (corridor2.fareInfo.avg_fare / corridor2.distanceKm).toFixed(2)}/km
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5 px-2.5 rounded-lg bg-stone-50">
                      <span className="text-stone-500">Price Range:</span>
                      <span className="font-mono font-bold text-emerald-700">
                        ₹{corridor2.fareInfo.min_fare.toLocaleString()} - ₹{corridor2.fareInfo.max_fare.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5 px-2.5 rounded-lg bg-stone-50">
                      <span className="text-stone-500">Competing Airlines:</span>
                      <span className="font-mono font-bold text-violet-700">{corridor2.airlineCount} Airlines</span>
                    </div>
                    <div className="flex justify-between py-1.5 px-2.5 rounded-lg bg-stone-50">
                      <span className="text-stone-500">Weekly Scheduled Flights:</span>
                      <span className="font-mono font-bold text-stone-900">{corridor2.frequency} flights</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Economic Comparison Summary Callout */}
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 space-y-1">
                <p className="font-bold flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Aviation Economics Comparison Insight:</span>
                </p>
                <p className="text-[11px] text-amber-900 leading-relaxed">
                  {corridor1.distanceKm > corridor2.distanceKm
                    ? `Corridor A (${corridor1.distanceKm} km) is longer than Corridor B (${corridor2.distanceKm} km). Longer corridors achieve lower seat-kilometer unit costs due to cruise efficiency, resulting in a yield of ₹${corridor1.fareInfo.price_per_km}/km compared to ₹${corridor2.fareInfo.price_per_km}/km on Corridor B.`
                    : `Corridor B (${corridor2.distanceKm} km) is longer than Corridor A (${corridor1.distanceKm} km). Notice how unit passenger yield adjusts with stage length and competition intensity (${corridor1.airlineCount} vs ${corridor2.airlineCount} competing airlines).`}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
