import React from 'react';
import { useAviation } from '../context/AviationContext';
import { Radio, Route as RouteIcon, PlaneTakeoff, IndianRupee } from 'lucide-react';

export const KpiCards: React.FC = () => {
  const { dynamicKPIs, systemKPIs, theme } = useAviation();
  const isCream = theme === 'cream';

  const cards = [
    {
      label: 'Airports Connected',
      value: dynamicKPIs.activeAirportsCount.toLocaleString(),
      subtext: 'Indian domestic aerodromes',
      icon: Radio,
      iconColor: isCream ? 'text-emerald-700' : 'text-emerald-400',
    },
    {
      label: 'Flight Routes',
      value: dynamicKPIs.activeRoutesCount.toLocaleString(),
      subtext: `${dynamicKPIs.totalFlightsObserved.toLocaleString()} weekly departures`,
      icon: RouteIcon,
      iconColor: isCream ? 'text-amber-700' : 'text-amber-400',
    },
    {
      label: 'Operating Airlines',
      value: dynamicKPIs.activeAirlinesCount.toLocaleString(),
      subtext: 'Domestic commercial carriers',
      icon: PlaneTakeoff,
      iconColor: isCream ? 'text-violet-700' : 'text-violet-400',
    },
    {
      label: 'Average Ticket Fare',
      value: dynamicKPIs.filteredAvgFare 
        ? `₹${Math.round(dynamicKPIs.filteredAvgFare).toLocaleString()}`
        : `₹${Math.round(systemKPIs.avg_fare).toLocaleString()}`,
      subtext: `Lowest observed: ₹${(dynamicKPIs.filteredCheapestFare || systemKPIs.cheapest_fare).toLocaleString()}`,
      icon: IndianRupee,
      iconColor: isCream ? 'text-sky-700' : 'text-sky-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div 
            key={i} 
            className={`aviation-card rounded-2xl p-5 border shadow-sm transition-transform hover:-translate-y-0.5 ${
              isCream ? 'bg-white border-[#E7E2D9]' : 'bg-slate-900/60 border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                {c.label}
              </span>
              <Icon className={`w-4 h-4 ${c.iconColor}`} />
            </div>

            <div className={`text-2xl font-bold font-mono tracking-tight ${isCream ? 'text-stone-900' : 'text-white'}`}>
              {c.value}
            </div>

            <p className="text-xs text-stone-500 mt-1">
              {c.subtext}
            </p>
          </div>
        );
      })}
    </div>
  );
};
