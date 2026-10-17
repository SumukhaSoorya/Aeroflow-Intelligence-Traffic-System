import os

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../frontend/src'))

# 1. index.css
index_css = '''@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    background-color: #070B14;
    color: #F8FAFC;
  }

  code, pre, .font-mono {
    font-family: 'JetBrains Mono', monospace;
  }
}

/* Custom aviation scrollbar */
::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}

::-webkit-scrollbar-track {
  background: #070B14;
}

::-webkit-scrollbar-thumb {
  background: #1E293B;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #334155;
}

/* Refined Aviation Card Styles with Visual Hierarchy */
.aviation-card {
  background: linear-gradient(135deg, rgba(17, 24, 39, 0.85) 0%, rgba(13, 20, 36, 0.85) 100%);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.07);
  box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.4);
}

.aviation-card-hover {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.aviation-card-hover:hover {
  border-color: rgba(56, 189, 248, 0.35);
  box-shadow: 0 8px 25px -4px rgba(2, 132, 199, 0.15);
  transform: translateY(-1px);
}

/* Distinct Accent Card Variants for Meaningful Visual Hierarchy */
.card-accent-cyan {
  background: linear-gradient(135deg, rgba(14, 165, 233, 0.08) 0%, rgba(15, 23, 42, 0.85) 100%);
  border-color: rgba(56, 189, 248, 0.25);
}

.card-accent-emerald {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(15, 23, 42, 0.85) 100%);
  border-color: rgba(52, 211, 153, 0.25);
}

.card-accent-amber {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(15, 23, 42, 0.85) 100%);
  border-color: rgba(251, 191, 36, 0.25);
}

.card-accent-violet {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(15, 23, 42, 0.85) 100%);
  border-color: rgba(167, 139, 250, 0.25);
}
'''

# 2. Header.tsx
header_tsx = '''import React from 'react';
import { Plane, Radio, Database, KeyRound } from 'lucide-react';
import { useAviation } from '../context/AviationContext';

export const Header: React.FC = () => {
  const { systemKPIs } = useAviation();
  const mapboxToken = (import.meta as any).env?.VITE_MAPBOX_TOKEN;
  const hasMapboxToken = Boolean(mapboxToken && mapboxToken.trim() !== '' && mapboxToken.startsWith('pk.'));

  return (
    <header className="h-16 bg-[#090E1A]/95 backdrop-blur-md border-b border-slate-800/80 px-6 flex items-center justify-between z-30 shrink-0 select-none">
      {/* Brand & Subtitle */}
      <div className="flex items-center space-x-3.5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 via-sky-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-sky-500/20 ring-1 ring-sky-400/40">
          <Plane className="w-5 h-5 text-slate-950 font-black transform -rotate-45" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
              <span>AeroFlow</span>
              <span className="text-sky-400 font-extrabold text-xs px-2 py-0.5 rounded-full bg-sky-950/80 border border-sky-500/30 uppercase tracking-wider">
                Traffic System
              </span>
            </h1>
            <span className="flex h-2 w-2 relative" title="System Active">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>
          <p className="text-xs text-slate-400 font-normal truncate max-w-md">
            Indian Domestic Aviation Analytics & Geospatial Route Network
          </p>
        </div>
      </div>

      {/* Dataset & Basemap Badges */}
      <div className="hidden md:flex items-center space-x-2.5 text-xs">
        <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300">
          <Database className="w-3.5 h-3.5 text-sky-400" />
          <span className="font-mono font-medium">{systemKPIs.total_flight_records.toLocaleString()}</span>
          <span className="text-slate-500">schedules</span>
          <span className="text-slate-600">|</span>
          <span className="font-mono font-medium text-amber-400">{systemKPIs.total_fare_records.toLocaleString()}</span>
          <span className="text-slate-500">fares</span>
        </div>

        <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300">
          <Radio className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-mono font-medium">{systemKPIs.total_airports}</span>
          <span className="text-slate-500">airports</span>
        </div>

        <div className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors ${
          hasMapboxToken
            ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
            : 'bg-slate-900/90 border-slate-800 text-slate-400'
        }`}>
          <KeyRound className="w-3.5 h-3.5 text-sky-400" />
          <span>{hasMapboxToken ? 'Mapbox Vector Active' : 'WebGL Vector Basemap'}</span>
        </div>
      </div>
    </header>
  );
};
'''

# 3. Sidebar.tsx
sidebar_tsx = '''import React from 'react';
import { 
  LayoutDashboard, 
  Map, 
  Radio, 
  IndianRupee, 
  PlaneTakeoff, 
  Network, 
  BookOpen 
} from 'lucide-react';

export type TabId = 
  | 'overview' 
  | 'map' 
  | 'airports' 
  | 'fares' 
  | 'airlines' 
  | 'competition' 
  | 'about';

interface SidebarProps {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
}

const navItems: { id: TabId; label: string; icon: React.ElementType; color: string; badge?: string }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, color: 'text-sky-400' },
  { id: 'map', label: 'Flight Routes', icon: Map, color: 'text-blue-400', badge: 'Deck.gl' },
  { id: 'airports', label: 'Airports', icon: Radio, color: 'text-emerald-400', badge: '110 Hubs' },
  { id: 'fares', label: 'Fares & Pricing', icon: IndianRupee, color: 'text-amber-400', badge: '10.6k Fares' },
  { id: 'airlines', label: 'Airlines', icon: PlaneTakeoff, color: 'text-violet-400', badge: '14 Carriers' },
  { id: 'competition', label: 'Competition', icon: Network, color: 'text-rose-400', badge: 'Market Share' },
  { id: 'about', label: 'About & Lab Report', icon: BookOpen, color: 'text-slate-300', badge: 'CO1–CO4' },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <aside className="w-64 bg-[#090E1A] border-r border-slate-800/80 flex flex-col justify-between shrink-0 select-none">
      <div className="py-4">
        <div className="px-5 mb-3">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Aviation Analytics
          </p>
        </div>
        <nav className="space-y-1.5 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-sky-500/15 text-white border border-sky-500/35 shadow-sm shadow-sky-950/50'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 transition-colors ${isActive ? item.color : 'text-slate-500'}`} />
                  <span className={isActive ? 'font-semibold' : ''}>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-semibold ${
                    isActive ? 'bg-sky-500/25 text-sky-200 border border-sky-500/30' : 'bg-slate-800 text-slate-500'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="p-3.5 m-3 rounded-xl bg-slate-900/70 border border-slate-800 text-xs text-slate-400 space-y-1.5">
        <div className="flex justify-between items-center text-[11px]">
          <span>COURSE LAB</span>
          <span className="font-mono text-sky-400 font-semibold">DVP Final</span>
        </div>
        <div className="flex justify-between items-center text-[11px]">
          <span>VISUALIZATION</span>
          <span className="font-mono text-emerald-400">Deck.gl 9.1 + React</span>
        </div>
        <div className="flex justify-between items-center text-[11px]">
          <span>DATA PIPELINE</span>
          <span className="font-mono text-amber-400">Pandas Normalized</span>
        </div>
      </div>
    </aside>
  );
};
'''

# 4. KpiCards.tsx (Streamlined 4-card structure)
kpi_tsx = '''import React from 'react';
import { Plane, Radio, IndianRupee, Layers } from 'lucide-react';
import { useAviation } from '../context/AviationContext';

export const KpiCards: React.FC = () => {
  const { systemKPIs, dynamicKPIs, activeFilterCount } = useAviation();
  const isFiltered = activeFilterCount > 0;

  const cards = [
    {
      title: 'Airports Connected',
      value: dynamicKPIs.activeAirportsCount,
      subValue: isFiltered ? `of ${systemKPIs.total_airports} across India` : '110 Active Aerodromes',
      icon: Radio,
      color: 'text-emerald-400',
      badge: '100% Coordinated',
      badgeClass: 'text-emerald-300 bg-emerald-950/60 border-emerald-800/60',
      cardClass: 'card-accent-emerald'
    },
    {
      title: 'Domestic Routes',
      value: dynamicKPIs.activeRoutesCount.toLocaleString(),
      subValue: `${dynamicKPIs.totalFlightsObserved.toLocaleString()} observed flights`,
      icon: Plane,
      color: 'text-sky-400',
      badge: isFiltered ? 'Filtered Corridors' : '1,423 Total Corridors',
      badgeClass: 'text-sky-300 bg-sky-950/60 border-sky-800/60',
      cardClass: 'card-accent-cyan'
    },
    {
      title: 'Airlines Operating',
      value: dynamicKPIs.activeAirlinesCount,
      subValue: isFiltered ? `of ${systemKPIs.total_airlines_schedule} total carriers` : 'Commercial Carriers',
      icon: Layers,
      color: 'text-violet-400',
      badge: 'Domestic Network',
      badgeClass: 'text-violet-300 bg-violet-950/60 border-violet-800/60',
      cardClass: 'card-accent-violet'
    },
    {
      title: 'Average Fare',
      value: dynamicKPIs.filteredAvgFare ? `₹${dynamicKPIs.filteredAvgFare.toLocaleString()}` : `₹${Math.round(systemKPIs.avg_fare).toLocaleString()}`,
      subValue: '10,683 pricing observations',
      icon: IndianRupee,
      color: 'text-amber-400',
      badge: isFiltered ? 'Active Selection' : 'Empirical Mean',
      badgeClass: 'text-amber-300 bg-amber-950/60 border-amber-800/60',
      cardClass: 'card-accent-amber'
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
      {cards.map((c, idx) => {
        const Icon = c.icon;
        return (
          <div 
            key={idx} 
            className={`aviation-card aviation-card-hover rounded-2xl p-4.5 border ${c.cardClass}`}
          >
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {c.title}
              </span>
              <div className={`p-2 rounded-xl bg-slate-900/90 border border-slate-800 ${c.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            
            <div className="text-2xl lg:text-3xl font-bold font-mono tracking-tight text-white mb-2">
              {c.value}
            </div>

            <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800/80">
              <span className="text-slate-400 truncate max-w-[130px]">
                {c.subValue}
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${c.badgeClass}`}>
                {c.badge}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
'''

# 5. FilterBar.tsx (Simplified toolbar layout)
filter_tsx = '''import React from 'react';
import { Filter, RotateCcw, Search } from 'lucide-react';
import { useAviation } from '../context/AviationContext';

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
    dynamicKPIs
  } = useAviation();

  const sortedAirports = [...airports].sort((a, b) => a.city.localeCompare(b.city));

  return (
    <div className="aviation-card rounded-2xl p-4 border border-slate-800/90 mb-5 text-sm space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 rounded-lg bg-sky-500/15 border border-sky-500/30 text-sky-400">
            <Filter className="w-4 h-4" />
          </div>
          <div>
            <span className="font-semibold text-white text-sm">Interactive Route Filters</span>
            <span className="ml-2 text-xs text-slate-400">
              ({dynamicKPIs.activeRoutesCount.toLocaleString()} routes matching)
            </span>
          </div>
          {activeFilterCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/40">
              {activeFilterCount} Active
            </span>
          )}
        </div>

        {activeFilterCount > 0 && (
          <button
            onClick={resetFilters}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-all border border-slate-700/80"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset All</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
        {/* 1. Airline Filter */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Airline Carrier
          </label>
          <select
            value={filters.airline}
            onChange={(e) => setAirlineFilter(e.target.value)}
            className="w-full bg-[#0B111E] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
          >
            <option value="all">All Airlines (14)</option>
            {airlines.map((a) => (
              <option key={a.name} value={a.name}>
                {a.name} ({a.routes_operated} routes)
              </option>
            ))}
          </select>
        </div>

        {/* 2. Origin Airport */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Origin Hub / City
          </label>
          <select
            value={filters.origin}
            onChange={(e) => setOriginFilter(e.target.value)}
            className="w-full bg-[#0B111E] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
          >
            <option value="all">All Origin Airports (110)</option>
            {sortedAirports.map((ap) => (
              <option key={ap.iata} value={ap.iata}>
                {ap.city} ({ap.iata})
              </option>
            ))}
          </select>
        </div>

        {/* 3. Destination Airport */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Destination Hub / City
          </label>
          <select
            value={filters.destination}
            onChange={(e) => setDestinationFilter(e.target.value)}
            className="w-full bg-[#0B111E] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
          >
            <option value="all">All Destinations (110)</option>
            {sortedAirports.map((ap) => (
              <option key={ap.iata} value={ap.iata}>
                {ap.city} ({ap.iata})
              </option>
            ))}
          </select>
        </div>

        {/* 4. Search Bar */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Search City / IATA
          </label>
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="e.g. Goa, DEL, Mumbai..."
              value={filters.searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0B111E] border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500 placeholder:text-slate-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
'''

# 6. MapTooltip.tsx
tooltip_tsx = '''import React from 'react';
import { Airport, Route } from '../types/aviation';
import { Plane, Radio } from 'lucide-react';

interface MapTooltipProps {
  info: any;
}

export const MapTooltip: React.FC<MapTooltipProps> = ({ info }) => {
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
      className="aviation-card rounded-xl p-3.5 shadow-2xl border border-sky-500/40 text-xs min-w-[220px] max-w-[300px] backdrop-blur-md"
    >
      {isAirport && (
        <div>
          <div className="flex items-center space-x-2 border-b border-slate-700/60 pb-2 mb-2">
            <div className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Radio className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="font-bold text-white text-sm">{(object as Airport).iata}</span>
              <span className="text-slate-400 ml-1.5 font-normal truncate">{(object as Airport).city}</span>
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
'''

files = [
    ('index.css', index_css),
    ('components/Header.tsx', header_tsx),
    ('components/Sidebar.tsx', sidebar_tsx),
    ('components/KpiCards.tsx', kpi_tsx),
    ('components/FilterBar.tsx', filter_tsx),
    ('components/MapTooltip.tsx', tooltip_tsx),
]

for rel_path, content in files:
    full_path = os.path.join(BASE_DIR, rel_path)
    with open(full_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'Wrote {rel_path}')

print('Part 1 components successfully written!')
