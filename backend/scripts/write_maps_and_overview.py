import os

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../frontend/src'))

# 1. AviationMap.tsx
map_tsx = '''import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import DeckGL from '@deck.gl/react';
import { ArcLayer, ScatterplotLayer } from '@deck.gl/layers';
import type { PickingInfo } from '@deck.gl/core';
import mapboxgl from 'mapbox-gl';
import { useAviation } from '../context/AviationContext';
import { MapTooltip } from '../components/MapTooltip';
import type { Airport, Route } from '../types/aviation';
import { 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Info, 
  Eye, 
  EyeOff
} from 'lucide-react';

const INITIAL_VIEW_STATE = {
  longitude: 78.9629,
  latitude: 21.0,
  zoom: 4.4,
  pitch: 35,
  bearing: 0,
  maxZoom: 14,
  minZoom: 3,
};

interface AviationMapProps {
  height?: string;
  showLayerControls?: boolean;
}

export const AviationMap: React.FC<AviationMapProps> = ({ 
  height = 'calc(100vh - 220px)',
  showLayerControls = true
}) => {
  const { 
    filteredRoutes, 
    filteredAirports, 
    setSelectedAirport, 
    setSelectedRoute,
    setOriginFilter,
    selectedAirport,
    selectedRoute
  } = useAviation();

  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const [hoverInfo, setHoverInfo] = useState<PickingInfo | null>(null);
  const [showArcs, setShowArcs] = useState(true);
  const [showAirports, setShowAirports] = useState(true);
  const [pitch3d, setPitch3d] = useState(true);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);

  const mapboxToken = (import.meta as any).env?.VITE_MAPBOX_TOKEN || '';
  const hasValidMapboxToken = Boolean(mapboxToken && mapboxToken.trim() !== '' && mapboxToken.startsWith('pk.'));

  // Initialize Mapbox basemap if token is available
  useEffect(() => {
    if (!hasValidMapboxToken || !mapContainerRef.current) return;

    mapboxgl.accessToken = mapboxToken;
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [viewState.longitude, viewState.latitude],
      zoom: viewState.zoom,
      pitch: viewState.pitch,
      bearing: viewState.bearing,
      interactive: false,
      attributionControl: false,
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [hasValidMapboxToken, mapboxToken]);

  // Sync Mapbox camera with DeckGL viewState
  const handleViewStateChange = useCallback(({ viewState: newViewState }: any) => {
    setViewState(newViewState);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.jumpTo({
        center: [newViewState.longitude, newViewState.latitude],
        zoom: newViewState.zoom,
        pitch: newViewState.pitch,
        bearing: newViewState.bearing,
      });
    }
  }, []);

  const resetView = () => {
    setViewState(INITIAL_VIEW_STATE);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo({
        center: [INITIAL_VIEW_STATE.longitude, INITIAL_VIEW_STATE.latitude],
        zoom: INITIAL_VIEW_STATE.zoom,
        pitch: INITIAL_VIEW_STATE.pitch,
        bearing: INITIAL_VIEW_STATE.bearing,
      });
    }
  };

  const togglePitch = () => {
    setPitch3d(!pitch3d);
    setViewState(prev => ({
      ...prev,
      pitch: pitch3d ? 0 : 45
    }));
  };

  const handleZoom = (delta: number) => {
    setViewState(prev => ({
      ...prev,
      zoom: Math.min(Math.max(prev.zoom + delta, prev.minZoom), prev.maxZoom)
    }));
  };

  // Build Deck.gl Layers
  const layers = useMemo(() => {
    const layerList = [];

    if (showArcs) {
      layerList.push(
        new ArcLayer<Route>({
          id: 'routes-arc-layer',
          data: filteredRoutes,
          pickable: true,
          getWidth: (d) => {
            if (selectedRoute && selectedRoute.route_id === d.route_id) return 5;
            if (selectedAirport && (d.origin_iata === selectedAirport.iata || d.destination_iata === selectedAirport.iata)) return 4;
            return Math.max(1.2, Math.min(5, d.frequency / 8));
          },
          getSourcePosition: (d) => d.origin_coords,
          getTargetPosition: (d) => d.destination_coords,
          getSourceColor: (d) => {
            if (selectedAirport && d.origin_iata !== selectedAirport.iata && d.destination_iata !== selectedAirport.iata) {
              return [40, 50, 70, 30];
            }
            return [...d.color_rgb, 180] as [number, number, number, number];
          },
          getTargetColor: (d) => {
            if (selectedAirport && d.origin_iata !== selectedAirport.iata && d.destination_iata !== selectedAirport.iata) {
              return [40, 50, 70, 30];
            }
            return [...d.color_rgb, 220] as [number, number, number, number];
          },
          getHeight: 0.35,
          autoHighlight: true,
          highlightColor: [56, 189, 248, 255],
          updateTriggers: {
            getWidth: [selectedAirport, selectedRoute],
            getSourceColor: [selectedAirport],
            getTargetColor: [selectedAirport],
          },
        })
      );
    }

    if (showAirports) {
      layerList.push(
        new ScatterplotLayer<Airport>({
          id: 'airports-layer',
          data: filteredAirports,
          pickable: true,
          opacity: 0.95,
          stroked: true,
          filled: true,
          radiusScale: 1,
          radiusMinPixels: 4,
          radiusMaxPixels: 18,
          lineWidthMinPixels: 1.5,
          getPosition: (d) => d.coordinates,
          getRadius: (d) => {
            if (selectedAirport && selectedAirport.iata === d.iata) return 50000;
            return Math.max(14000, Math.min(48000, d.connected_routes_count * 950));
          },
          getFillColor: (d) => {
            if (selectedAirport && selectedAirport.iata === d.iata) {
              return [245, 158, 11, 240];
            }
            if (d.category === 'Primary Hub') return [56, 189, 248, 230];
            if (d.category === 'Major Airport') return [52, 211, 153, 220];
            return [148, 163, 184, 180];
          },
          getLineColor: () => [255, 255, 255, 220],
          autoHighlight: true,
          highlightColor: [245, 158, 11, 255],
          updateTriggers: {
            getRadius: [selectedAirport],
            getFillColor: [selectedAirport],
          },
        })
      );
    }

    return layerList;
  }, [filteredRoutes, filteredAirports, showArcs, showAirports, selectedAirport, selectedRoute]);

  const handleClick = (info: PickingInfo) => {
    if (info.object) {
      if (info.layer?.id === 'airports-layer') {
        const ap = info.object as Airport;
        if (selectedAirport?.iata === ap.iata) {
          setSelectedAirport(null);
        } else {
          setSelectedAirport(ap);
          setOriginFilter(ap.iata);
        }
      } else if (info.layer?.id === 'routes-arc-layer') {
        const rt = info.object as Route;
        setSelectedRoute(selectedRoute?.route_id === rt.route_id ? null : rt);
      }
    } else {
      setSelectedAirport(null);
      setSelectedRoute(null);
    }
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-800 bg-[#070D18] shadow-2xl" style={{ height }}>
      {/* Mapbox Basemap Container */}
      {hasValidMapboxToken && (
        <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />
      )}

      {/* Grid Pattern Background when Mapbox token is not active */}
      {!hasValidMapboxToken && (
        <div className="absolute inset-0 w-full h-full bg-[#080E1A] overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.06)_0,transparent_70%)]" />
          <div 
            className="absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage: 'linear-gradient(to right, #38BDF8 1px, transparent 1px), linear-gradient(to bottom, #38BDF8 1px, transparent 1px)',
              backgroundSize: '48px 48px'
            }}
          />
        </div>
      )}

      {/* Deck.gl Canvas */}
      <DeckGL
        viewState={viewState}
        onViewStateChange={handleViewStateChange}
        controller={{ doubleClickZoom: false }}
        layers={layers}
        onClick={handleClick}
        onHover={(info) => setHoverInfo(info.object ? info : null)}
        getCursor={({ isHovering }) => (isHovering ? 'pointer' : 'grab')}
      />

      {/* Tooltip */}
      {hoverInfo && <MapTooltip info={hoverInfo} />}

      {/* Non-blocking Notice Banner */}
      {!hasValidMapboxToken && (
        <div className="absolute top-4 left-4 z-20 max-w-sm aviation-card rounded-xl p-3 border border-sky-500/30 shadow-lg text-xs backdrop-blur-md">
          <div className="flex items-start space-x-2">
            <Info className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-white">Deck.gl WebGL Vector Canvas</p>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                Visualizing {filteredRoutes.length.toLocaleString()} routes and {filteredAirports.length} aerodromes across India. Set <code className="text-sky-300 font-mono">VITE_MAPBOX_TOKEN</code> in <code className="text-sky-300 font-mono">.env</code> to load dark tile cartography.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Floating HUD Controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col space-y-2">
        <div className="aviation-card rounded-xl p-1.5 flex flex-col space-y-1 border border-slate-700/80 backdrop-blur-md shadow-lg">
          <button
            onClick={() => handleZoom(0.5)}
            title="Zoom In"
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleZoom(-0.5)}
            title="Zoom Out"
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={togglePitch}
            title="Toggle 2D / 3D Pitch"
            className={`p-2 rounded-lg transition-colors text-xs font-mono font-bold ${
              pitch3d ? 'text-sky-400 bg-sky-500/15' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            {pitch3d ? '3D' : '2D'}
          </button>
          <button
            onClick={resetView}
            title="Reset India View"
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {showLayerControls && (
          <div className="aviation-card rounded-xl p-2 border border-slate-700/80 backdrop-blur-md space-y-1.5 text-xs shadow-lg">
            <button
              onClick={() => setShowArcs(!showArcs)}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-all ${
                showArcs ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <span>Flight Arcs</span>
              {showArcs ? <Eye className="w-3.5 h-3.5 text-sky-400" /> : <EyeOff className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => setShowAirports(!showAirports)}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-all ${
                showAirports ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <span>Airports</span>
              {showAirports ? <Eye className="w-3.5 h-3.5 text-emerald-400" /> : <EyeOff className="w-3.5 h-3.5" />}
            </button>
          </div>
        )}
      </div>

      {/* Airline Visual Legend (Bottom Left) */}
      <div className="absolute bottom-4 left-4 z-20 aviation-card rounded-xl p-3 border border-slate-800/90 backdrop-blur-md max-w-sm hidden sm:block shadow-lg">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
          Major Carrier Visual Encoding
        </p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0052CC]" />
            <span className="text-slate-300">IndiGo</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626]" />
            <span className="text-slate-300">Air India</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EA580C]" />
            <span className="text-slate-300">SpiceJet</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#7C3AED]" />
            <span className="text-slate-300">Vistara</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A]" />
            <span className="text-slate-300">GoAir</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EAB308]" />
            <span className="text-slate-300">Jet Airways</span>
          </div>
        </div>
        <p className="text-[10px] text-slate-500 mt-2 pt-1.5 border-t border-slate-800/80">
          *Arc thickness scales with schedule frequency
        </p>
      </div>

      {/* Selected Airport Indicator Card (Bottom Right) */}
      {selectedAirport && (
        <div className="absolute bottom-4 right-4 z-20 aviation-card rounded-xl p-3 border border-amber-500/40 text-xs shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between space-x-3 mb-1">
            <span className="font-bold text-amber-400">Selected Hub:</span>
            <button 
              onClick={() => setSelectedAirport(null)}
              className="text-slate-400 hover:text-white text-[11px]"
            >
              Clear ✕
            </button>
          </div>
          <p className="font-semibold text-white">{selectedAirport.city} ({selectedAirport.iata})</p>
          <p className="text-slate-400 text-[11px]">{selectedAirport.connected_routes_count} direct destinations</p>
        </div>
      )}
    </div>
  );
};
'''

# 2. OverviewPage.tsx
overview_tsx = '''import React from 'react';
import { KpiCards } from '../components/KpiCards';
import { FilterBar } from '../components/FilterBar';
import { AviationMap } from '../maps/AviationMap';
import { CompetitionDistributionChart } from '../charts/CompetitionDistributionChart';
import { useAviation } from '../context/AviationContext';
import { Plane, ArrowRight, Radio, IndianRupee, Network } from 'lucide-react';

interface OverviewPageProps {
  onNavigateToTab: (tabId: any) => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({ onNavigateToTab }) => {
  const { systemKPIs, filteredRoutes, filteredAirports } = useAviation();

  return (
    <div className="space-y-5 pb-8">
      {/* 1. Header & Project Description */}
      <div className="aviation-card rounded-2xl p-5 border border-sky-500/20 bg-gradient-to-r from-sky-950/40 via-slate-900/50 to-indigo-950/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                INDIAN DOMESTIC AVIATION NETWORK
              </span>
              <span className="text-xs text-slate-400">Data Visualization Lab Project</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white">
              AeroFlow Intelligence Traffic System
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl mt-1 leading-relaxed">
              Interactive visual analytics of 33,734 domestic flight schedules and 10,683 ticket fares across 110 Indian aerodromes, powered by WebGL-accelerated Deck.gl rendering and Pandas relational harmonization.
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab('map')}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-lg shadow-sky-500/25 transition-all self-start md:self-auto shrink-0"
          >
            <span>Fullscreen 3D Map</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Streamlined 4-Card KPI Banner */}
      <KpiCards />

      {/* 3. Simplified Global Route Filter Bar */}
      <FilterBar />

      {/* 4. Main Route Map Centerpiece & Supporting Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main Map (2 Columns) */}
        <div className="lg:col-span-2 space-y-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center space-x-2">
              <Plane className="w-4 h-4 text-sky-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Geospatial Flight Route Network
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              {filteredRoutes.length.toLocaleString()} active arcs | {filteredAirports.length} nodes
            </span>
          </div>
          <AviationMap height="480px" />
        </div>

        {/* Side Overview Cards (1 Column) */}
        <div className="space-y-4">
          {/* Market Contestability Card */}
          <div className="aviation-card rounded-2xl p-4 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Route Market Contestability
              </h3>
              <button
                onClick={() => onNavigateToTab('competition')}
                className="text-xs text-sky-400 hover:underline flex items-center gap-1 font-medium"
              >
                <span>Details</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <CompetitionDistributionChart />
            <p className="text-[11px] text-slate-400 text-center -mt-2">
              <span className="text-amber-400 font-bold">{systemKPIs.monopoly_routes_pct}%</span> of all domestic corridors are operated by a single airline monopoly.
            </p>
          </div>

          {/* Core Analytical Highlights Card */}
          <div className="aviation-card rounded-2xl p-4 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Core Analytical Highlights
            </h3>
            
            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
                <p className="font-semibold text-emerald-400">Top Indian Hub</p>
                <p className="text-slate-300 text-[11px] mt-0.5">
                  {systemKPIs.top_connected_airport} direct destinations.
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
                <p className="font-semibold text-amber-400">Lowest Observed Fare</p>
                <p className="text-slate-300 text-[11px] mt-0.5">
                  ₹{systemKPIs.cheapest_fare.toLocaleString()} on {systemKPIs.cheapest_route}.
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
                <p className="font-semibold text-sky-400">Commercial Fare Mean</p>
                <p className="text-slate-300 text-[11px] mt-0.5">
                  ₹{Math.round(systemKPIs.avg_fare).toLocaleString()} across 10,683 observed ticket records.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Navigation Links to Detailed Analytical Views */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <button
          onClick={() => onNavigateToTab('airports')}
          className="aviation-card aviation-card-hover rounded-2xl p-4 border card-accent-emerald text-left flex items-center justify-between group"
        >
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
              Aerodrome Directory
            </span>
            <p className="text-sm font-bold text-white">Airport Centrality Analysis</p>
            <p className="text-xs text-slate-400 mt-1">Explore 110 Indian hubs & connectivity</p>
          </div>
          <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
        </button>

        <button
          onClick={() => onNavigateToTab('fares')}
          className="aviation-card aviation-card-hover rounded-2xl p-4 border card-accent-amber text-left flex items-center justify-between group"
        >
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block mb-1">
              Commercial Pricing
            </span>
            <p className="text-sm font-bold text-white">Fare Variation & Cheapest Routes</p>
            <p className="text-xs text-slate-400 mt-1">Analyze price variation across carriers</p>
          </div>
          <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
        </button>

        <button
          onClick={() => onNavigateToTab('competition')}
          className="aviation-card aviation-card-hover rounded-2xl p-4 border card-accent-cyan text-left flex items-center justify-between group"
        >
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400 block mb-1">
              Market Contestability
            </span>
            <p className="text-sm font-bold text-white">Airline Route Overlap</p>
            <p className="text-xs text-slate-400 mt-1">Monopoly vs multi-carrier corridors</p>
          </div>
          <ArrowRight className="w-4 h-4 text-sky-400 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
'''

# 3. App.tsx (Updated with 7-section routing)
app_tsx = '''import React, { useState } from 'react';
import { AviationProvider } from './context/AviationContext';
import { Header } from './components/Header';
import { Sidebar, TabId } from './components/Sidebar';
import { OverviewPage } from './pages/OverviewPage';
import { MapPage } from './pages/MapPage';
import { AirportAnalysisPage } from './pages/AirportAnalysisPage';
import { FareAnalysisPage } from './pages/FareAnalysisPage';
import { AirlineAnalysisPage } from './pages/AirlineAnalysisPage';
import { CompetitionPage } from './pages/CompetitionPage';
import { AboutPage } from './pages/AboutPage';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  return (
    <AviationProvider>
      <div className="flex flex-col h-screen w-screen bg-[#070B14] text-slate-100 overflow-hidden font-sans">
        {/* Top Header */}
        <Header />

        {/* Body with Sidebar & Scrollable Main Content */}
        <div className="flex flex-1 overflow-hidden">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

          <main className="flex-1 overflow-y-auto p-5 bg-[#070B14]/95">
            <div className="max-w-7xl mx-auto">
              {activeTab === 'overview' && <OverviewPage onNavigateToTab={setActiveTab} />}
              {activeTab === 'map' && <MapPage />}
              {activeTab === 'airports' && <AirportAnalysisPage />}
              {activeTab === 'fares' && <FareAnalysisPage />}
              {activeTab === 'airlines' && <AirlineAnalysisPage />}
              {activeTab === 'competition' && <CompetitionPage />}
              {activeTab === 'about' && <AboutPage />}
            </div>
          </main>
        </div>
      </div>
    </AviationProvider>
  );
};

export default App;
'''

files = [
    ('maps/AviationMap.tsx', map_tsx),
    ('pages/OverviewPage.tsx', overview_tsx),
    ('App.tsx', app_tsx),
]

for rel_path, content in files:
    full_path = os.path.join(BASE_DIR, rel_path)
    with open(full_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'Wrote {rel_path}')

print('Part 2 maps and overview successfully written!')
