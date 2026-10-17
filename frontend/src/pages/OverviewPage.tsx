import React from 'react';
import { useAviation } from '../context/AviationContext';
import { KpiCards } from '../components/KpiCards';
import { FilterBar } from '../components/FilterBar';
import { AviationMap } from '../maps/AviationMap';
import { 
  ArrowRight,
  TrendingUp,
  Tag,
  MapPin,
  Plane
} from 'lucide-react';

interface OverviewPageProps {
  onNavigate: (tab: string) => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({ onNavigate }) => {
  const { theme } = useAviation();
  const isCream = theme === 'cream';

  return (
    <div className="space-y-6 pb-12">
      {/* Top Welcome Banner */}
      <div className={`aviation-card rounded-2xl p-6 border shadow-sm ${
        isCream ? 'bg-white border-[#E7E2D9]' : 'bg-slate-900/60 border-slate-800'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className={`text-xl font-bold tracking-tight ${isCream ? 'text-stone-900' : 'text-white'}`}>
              Indian Domestic Flight & Fare Visualization
            </h2>
            <p className="text-xs text-stone-500 mt-1 max-w-2xl leading-relaxed">
              An interactive dashboard exploring 1,423 flight routes, airfare distributions, and airline competition across 110 Indian airports using official domestic datasets.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onNavigate('routes')}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-600 text-white hover:bg-amber-700 transition-colors shadow-sm"
            >
              <span>Explore Routes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 4 Clean Human KPI Cards */}
      <KpiCards />

      {/* Simple Filter Bar */}
      <FilterBar />

      {/* Central Interactive Map */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className={`text-xs font-bold uppercase tracking-wider ${isCream ? 'text-stone-800' : 'text-slate-300'}`}>
            Domestic Flight Network Map
          </h3>
          <span className="text-xs text-stone-500 font-mono">
            Click any route arc or airport dot to inspect
          </span>
        </div>

        <AviationMap height="540px" showLayerControls={true} />
      </div>

      {/* Two Clean Highlight Cards Below Map */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Top Corridors Highlight */}
        <div className={`aviation-card rounded-2xl p-5 border shadow-sm ${
          isCream ? 'bg-white border-[#E7E2D9]' : 'bg-slate-900/60 border-slate-800'
        }`}>
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-stone-200">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-amber-600" />
              <h4 className={`text-xs font-bold uppercase tracking-wider ${isCream ? 'text-stone-900' : 'text-white'}`}>
                Busiest Domestic Corridors
              </h4>
            </div>
            <button
              onClick={() => onNavigate('routes')}
              className="text-xs text-amber-700 font-semibold hover:underline"
            >
              View all
            </button>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1.5 px-2 rounded-lg bg-stone-50">
              <span className="font-semibold text-stone-800">Delhi (DEL) ↔ Bengaluru (BLR)</span>
              <span className="font-mono text-stone-600 font-medium">96 flights / wk • 5 airlines</span>
            </div>
            <div className="flex justify-between py-1.5 px-2 rounded-lg bg-stone-50">
              <span className="font-semibold text-stone-800">Delhi (DEL) ↔ Mumbai (BOM)</span>
              <span className="font-mono text-stone-600 font-medium">92 flights / wk • 5 airlines</span>
            </div>
            <div className="flex justify-between py-1.5 px-2 rounded-lg bg-stone-50">
              <span className="font-semibold text-stone-800">Mumbai (BOM) ↔ Bengaluru (BLR)</span>
              <span className="font-mono text-stone-600 font-medium">84 flights / wk • 4 airlines</span>
            </div>
          </div>
        </div>

        {/* Pricing Highlights */}
        <div className={`aviation-card rounded-2xl p-5 border shadow-sm ${
          isCream ? 'bg-white border-[#E7E2D9]' : 'bg-slate-900/60 border-slate-800'
        }`}>
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-stone-200">
            <div className="flex items-center space-x-2">
              <Tag className="w-4 h-4 text-emerald-600" />
              <h4 className={`text-xs font-bold uppercase tracking-wider ${isCream ? 'text-stone-900' : 'text-white'}`}>
                Key Airfare Findings
              </h4>
            </div>
            <button
              onClick={() => onNavigate('fares')}
              className="text-xs text-emerald-700 font-semibold hover:underline"
            >
              Fare analysis
            </button>
          </div>

          <ul className="space-y-2 text-xs text-stone-600">
            <li className="flex items-start space-x-2">
              <span className="text-emerald-600 font-bold">•</span>
              <span><strong>Budget price floor:</strong> Lowest recorded fare is ₹1,759 (SpiceJet, Chennai → Kolkata).</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-emerald-600 font-bold">•</span>
              <span><strong>Most common ticket range:</strong> Over 60% of domestic bookings fall between ₹4,000 and ₹10,000.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-emerald-600 font-bold">•</span>
              <span><strong>Full-service difference:</strong> Air India and Vistara average ₹10,000–₹12,000 vs. budget carriers at ₹5,500–₹7,000.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
