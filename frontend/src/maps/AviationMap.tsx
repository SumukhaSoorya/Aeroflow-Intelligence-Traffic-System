import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import DeckGL from '@deck.gl/react';
import { ArcLayer, ScatterplotLayer } from '@deck.gl/layers';
import type { PickingInfo } from '@deck.gl/core';
import mapboxgl from 'mapbox-gl';
import { useAviation } from '../context/AviationContext';
import { MapTooltip } from '../components/MapTooltip';
import type { Airport, Route } from '../types/aviation';
import { RotateCcw, ZoomIn, ZoomOut, Eye, EyeOff } from 'lucide-react';

const INITIAL_VIEW_STATE = {
  longitude: 78.9629,
  latitude: 21.0,
  zoom: 4.4,
  pitch: 30,
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
    selectedRoute,
    theme
  } = useAviation();

  const isCream = theme === 'cream';

  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const [hoverInfo, setHoverInfo] = useState<PickingInfo | null>(null);
  const [showArcs, setShowArcs] = useState(true);
  const [showAirports, setShowAirports] = useState(true);
  const [pitch3d, setPitch3d] = useState(true);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);

  const mapboxToken = (import.meta as any).env?.VITE_MAPBOX_TOKEN || '';
  const hasValidMapboxToken = Boolean(mapboxToken && mapboxToken.length > 20 && !mapboxToken.includes('YOUR_'));

  useEffect(() => {
    if (!hasValidMapboxToken || !mapContainerRef.current) return;

    mapboxgl.accessToken = mapboxToken;
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: isCream ? 'mapbox://styles/mapbox/light-v11' : 'mapbox://styles/mapbox/dark-v11',
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
  }, [hasValidMapboxToken, mapboxToken, isCream]);

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
      pitch: pitch3d ? 0 : 40
    }));
  };

  const handleZoom = (delta: number) => {
    setViewState(prev => ({
      ...prev,
      zoom: Math.min(Math.max(prev.zoom + delta, prev.minZoom), prev.maxZoom)
    }));
  };

  // Deck.gl WebGL Layers
  const layers = useMemo(() => {
    const layerList: any[] = [];

    if (showArcs) {
      layerList.push(
        new ArcLayer<Route>({
          id: 'routes-arc-layer',
          data: filteredRoutes,
          getSourcePosition: (d: Route) => [d.origin_coords[0], d.origin_coords[1]],
          getTargetPosition: (d: Route) => [d.destination_coords[0], d.destination_coords[1]],
          getSourceColor: (d: Route) => {
            if (selectedRoute?.route_id === d.route_id) return [245, 158, 11, 255];
            const rgb = d.color_rgb;
            return [rgb[0], rgb[1], rgb[2], 180];
          },
          getTargetColor: (d: Route) => {
            if (selectedRoute?.route_id === d.route_id) return [245, 158, 11, 255];
            const rgb = d.color_rgb;
            return [rgb[0], rgb[1], rgb[2], 230];
          },
          getWidth: (d: Route) => {
            if (selectedRoute?.route_id === d.route_id) return 4.0;
            return Math.min(Math.max(d.frequency / 8, 1.2), 3.5);
          },
          getHeight: 0.5,
          pickable: true,
          autoHighlight: true,
          highlightColor: [245, 158, 11, 220],
          updateTriggers: {
            getSourceColor: [selectedRoute],
            getTargetColor: [selectedRoute],
            getWidth: [selectedRoute]
          }
        })
      );
    }

    if (showAirports) {
      layerList.push(
        new ScatterplotLayer<Airport>({
          id: 'airports-layer',
          data: filteredAirports,
          getPosition: (d: Airport) => [d.longitude, d.latitude],
          getFillColor: (d: Airport) => {
            if (selectedAirport?.iata === d.iata) return [245, 158, 11, 255];
            if (d.category === 'Primary Hub') return [5, 150, 105, 230]; // Emerald
            if (d.category === 'Major Airport') return [2, 132, 199, 210]; // Sky
            return isCream ? [120, 113, 108, 190] : [148, 163, 184, 180]; // Warm stone
          },
          getLineColor: isCream ? [255, 255, 255, 255] : [15, 23, 42, 255],
          getLineWidth: 1.5,
          stroked: true,
          getRadius: (d: Airport) => {
            if (selectedAirport?.iata === d.iata) return 22000;
            if (d.category === 'Primary Hub') return 16000;
            if (d.category === 'Major Airport') return 11000;
            return 7000;
          },
          radiusMinPixels: 4,
          radiusMaxPixels: 16,
          pickable: true,
          autoHighlight: true,
          highlightColor: [245, 158, 11, 200],
          updateTriggers: {
            getFillColor: [selectedAirport, isCream]
          }
        })
      );
    }

    return layerList;
  }, [filteredRoutes, filteredAirports, showArcs, showAirports, selectedAirport, selectedRoute, isCream]);

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
    <div className={`relative w-full rounded-2xl overflow-hidden border shadow-sm ${
      isCream ? 'border-[#E7E2D9] bg-[#F5F1E8]' : 'border-slate-800 bg-[#070D18]'
    }`} style={{ height }}>
      {/* Mapbox Basemap */}
      {hasValidMapboxToken && (
        <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />
      )}

      {/* Clean Grid Background when Mapbox token is not set */}
      {!hasValidMapboxToken && (
        <div className={`absolute inset-0 w-full h-full overflow-hidden ${
          isCream ? 'bg-[#F4EFE6]' : 'bg-[#080E1A]'
        }`}>
          <div 
            className="absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage: isCream 
                ? 'linear-gradient(to right, #B45309 1px, transparent 1px), linear-gradient(to bottom, #B45309 1px, transparent 1px)'
                : 'linear-gradient(to right, #38BDF8 1px, transparent 1px), linear-gradient(to bottom, #38BDF8 1px, transparent 1px)',
              backgroundSize: '40px 40px'
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

      {/* Clean Floating Zoom & Camera Controls (Top Right) */}
      <div className="absolute top-4 right-4 z-20 flex flex-col space-y-1.5">
        <div className={`rounded-xl p-1 flex flex-col space-y-1 border shadow-sm ${
          isCream ? 'bg-white/95 border-stone-300' : 'bg-slate-900/90 border-slate-700'
        }`}>
          <button
            onClick={() => handleZoom(0.5)}
            title="Zoom In"
            className={`p-1.5 rounded-lg transition-colors ${
              isCream ? 'text-stone-700 hover:bg-stone-100' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => handleZoom(-0.5)}
            title="Zoom Out"
            className={`p-1.5 rounded-lg transition-colors ${
              isCream ? 'text-stone-700 hover:bg-stone-100' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <button
            onClick={togglePitch}
            title={pitch3d ? "Switch to 2D Planar" : "Switch to 3D Perspective"}
            className={`p-1.5 rounded-lg text-xs font-bold font-mono transition-colors ${
              pitch3d 
                ? 'bg-amber-600 text-white' 
                : isCream ? 'text-stone-700 hover:bg-stone-100' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            {pitch3d ? '3D' : '2D'}
          </button>

          <button
            onClick={resetView}
            title="Reset Map"
            className={`p-1.5 rounded-lg transition-colors ${
              isCream ? 'text-stone-700 hover:bg-stone-100' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Layer Toggles & Simple Legend (Bottom HUD) */}
      {showLayerControls && (
        <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
          {/* Layer Toggles */}
          <div className={`pointer-events-auto rounded-xl p-1 flex items-center space-x-1 border shadow-sm ${
            isCream ? 'bg-white/95 border-stone-300' : 'bg-slate-900/90 border-slate-700'
          }`}>
            <button
              onClick={() => setShowArcs(!showArcs)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                showArcs 
                  ? 'bg-amber-600 text-white font-semibold' 
                  : isCream ? 'text-stone-600 hover:bg-stone-100' : 'text-slate-400 hover:text-white'
              }`}
            >
              {showArcs ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>Flight Arcs ({filteredRoutes.length})</span>
            </button>

            <button
              onClick={() => setShowAirports(!showAirports)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                showAirports 
                  ? 'bg-emerald-600 text-white font-semibold' 
                  : isCream ? 'text-stone-600 hover:bg-stone-100' : 'text-slate-400 hover:text-white'
              }`}
            >
              {showAirports ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>Airports ({filteredAirports.length})</span>
            </button>
          </div>

          {/* Simple Legend */}
          <div className={`pointer-events-auto rounded-xl px-3 py-1.5 flex items-center space-x-3 border shadow-sm text-xs ${
            isCream ? 'bg-white/95 border-stone-300 text-stone-700' : 'bg-slate-900/90 border-slate-700 text-slate-300'
          }`}>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              <span>Primary Hub (≥30)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-600" />
              <span>Major Airport</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-stone-500" />
              <span>Regional</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
