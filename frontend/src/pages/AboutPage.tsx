import React, { useState } from 'react';
import { useAviation } from '../context/AviationContext';
import { 
  GraduationCap, 
  Database, 
  HelpCircle, 
  Award
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { theme } = useAviation();
  const isCream = theme === 'cream';

  const [activeTab, setActiveTab] = useState<'co' | 'questions' | 'audit'>('co');

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Banner */}
      <div className={`aviation-card rounded-2xl p-6 border relative overflow-hidden shadow-sm ${
        isCream 
          ? 'bg-gradient-to-r from-amber-50/50 via-stone-50 to-orange-50/40 border-stone-200' 
          : 'bg-gradient-to-r from-slate-900 via-sky-950/30 to-indigo-950/30 border-slate-800'
      }`}>
        <div className="relative z-10 space-y-2">
          <div className="flex items-center space-x-2 text-amber-700 text-xs font-bold uppercase tracking-wider">
            <GraduationCap className="w-5 h-5" />
            <span>Academic Methodology & Project Documentation</span>
          </div>
          <h2 className={`text-2xl font-black ${isCream ? 'text-stone-900' : 'text-white'}`}>
            AeroFlow Intelligence Traffic System — Methodology & Findings
          </h2>
          <p className="text-xs text-stone-600 max-w-3xl leading-relaxed">
            Rigorous documentation for the Data Visualization Lab (DVP). Details the investigative data pipeline, visual encoding rationales, WebGL rendering architecture, and empirical answers to domestic aviation research questions.
          </p>
        </div>
      </div>

      {/* Sub-Tabs Navigation */}
      <div className={`flex items-center space-x-2 p-1.5 rounded-xl border w-fit ${
        isCream ? 'bg-[#F2ECE1] border-stone-300' : 'bg-slate-900/90 border-slate-800'
      }`}>
        <button
          onClick={() => setActiveTab('co')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'co'
              ? 'bg-amber-600 text-white shadow-sm font-bold'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Course Outcomes (CO1 - CO4)</span>
        </button>

        <button
          onClick={() => setActiveTab('questions')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'questions'
              ? 'bg-amber-600 text-white shadow-sm font-bold'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Analytical Answers (6 Questions)</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'audit'
              ? 'bg-amber-600 text-white shadow-sm font-bold'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Data Quality & Constraints</span>
        </button>
      </div>

      {activeTab === 'co' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* CO1 */}
          <div className={`aviation-card rounded-2xl p-5 border space-y-3 shadow-sm ${isCream ? 'bg-white border-sky-500/25' : 'bg-slate-900/50 border-sky-500/20'}`}>
            <div className="flex items-center space-x-2.5">
              <span className="w-8 h-8 rounded-lg bg-sky-100 text-sky-800 font-mono font-bold flex items-center justify-center text-sm">
                CO1
              </span>
              <div>
                <h3 className={`text-sm font-bold ${isCream ? 'text-stone-900' : 'text-white'}`}>Investigation & Selection of Tools & Data Preparation</h3>
                <span className="text-[11px] text-stone-500">Dataset Profiling & Toolchain Justification</span>
              </div>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Investigated three official data sources: the Indian Domestic Airline Dataset (33,734 schedule records), Indian Flight Price Dataset (10,683 pricing points), and OurAirports India coordinates (651 aerodromes). Selected <strong>Pandas</strong> for programmatic ETL, alias normalization, and join harmonization, guaranteeing 100% geospatial matching with zero fabricated records.
            </p>
            <div className="p-2.5 rounded-xl bg-stone-100 border border-stone-200 text-[11px] text-sky-800 font-mono">
              Stack: Python 3.13, Pandas, Deck.gl 9.1, Mapbox GL JS, React 18, TypeScript, Tailwind CSS
            </div>
          </div>

          {/* CO2 */}
          <div className={`aviation-card rounded-2xl p-5 border space-y-3 shadow-sm ${isCream ? 'bg-white border-violet-500/25' : 'bg-slate-900/50 border-indigo-500/20'}`}>
            <div className="flex items-center space-x-2.5">
              <span className="w-8 h-8 rounded-lg bg-violet-100 text-violet-800 font-mono font-bold flex items-center justify-center text-sm">
                CO2
              </span>
              <div>
                <h3 className={`text-sm font-bold ${isCream ? 'text-stone-900' : 'text-white'}`}>Planning & Visual Encoding Design</h3>
                <span className="text-[11px] text-stone-500">Visual Variables & Semiotics</span>
              </div>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Mapped data attributes to distinct visual channels according to perceptual effectiveness:
            </p>
            <ul className="text-xs text-stone-600 space-y-1 list-disc list-inside">
              <li><strong>Spatial Position:</strong> Exact latitude and longitude for airport nodes.</li>
              <li><strong>Color Hue:</strong> Categorical airline identity (IndiGo Blue, Air India Red, SpiceJet Orange).</li>
              <li><strong>Arc Stroke Width:</strong> Quantitative schedule frequency / weekly flight volume.</li>
              <li><strong>Node Radius:</strong> Aerodrome degree centrality (number of direct domestic connections).</li>
            </ul>
          </div>

          {/* CO3 */}
          <div className={`aviation-card rounded-2xl p-5 border space-y-3 shadow-sm ${isCream ? 'bg-white border-emerald-500/25' : 'bg-slate-900/50 border-emerald-500/20'}`}>
            <div className="flex items-center space-x-2.5">
              <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-mono font-bold flex items-center justify-center text-sm">
                CO3
              </span>
              <div>
                <h3 className={`text-sm font-bold ${isCream ? 'text-stone-900' : 'text-white'}`}>Interactive Visualizations & Exploration</h3>
                <span className="text-[11px] text-stone-500">Dynamic Brushing, Linking & Filtering</span>
              </div>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Implemented coordinated multi-view exploration. User filter interactions dynamically recalculate KPI cards, re-filter WebGL Deck.gl arcs and scatter nodes in real time, and update inspector tables with interactive tooltips and camera pitch/bearing controls.
            </p>
            <div className="p-2.5 rounded-xl bg-stone-100 border border-stone-200 text-[11px] text-emerald-800 font-mono">
              Features: Deck.gl WebGL Arc picking, 3D tilt, Pan/Zoom, Linked KPI state, Route Simulator
            </div>
          </div>

          {/* CO4 */}
          <div className={`aviation-card rounded-2xl p-5 border space-y-3 shadow-sm ${isCream ? 'bg-white border-amber-500/25' : 'bg-slate-900/50 border-amber-500/20'}`}>
            <div className="flex items-center space-x-2.5">
              <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 font-mono font-bold flex items-center justify-center text-sm">
                CO4
              </span>
              <div>
                <h3 className={`text-sm font-bold ${isCream ? 'text-stone-900' : 'text-white'}`}>Clear Communication & Project Findings</h3>
                <span className="text-[11px] text-stone-500">Empirical Synthesis of Research Questions</span>
              </div>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Systematically answered the core aviation analytics questions through structured dashboard sections: Route Density, Pricing Distribution, Carrier Dominance, Contestability Indexing, and Hub Centrality, accompanied by a dedicated Data Quality audit.
            </p>
          </div>
        </div>
      )}

      {activeTab === 'questions' && (
        <div className={`aviation-card rounded-2xl p-6 border space-y-4 shadow-sm ${isCream ? 'bg-white border-stone-200' : 'bg-slate-900/40 border-slate-800'}`}>
          <div className="flex items-center justify-between pb-3 border-b border-stone-200">
            <h3 className={`text-base font-bold uppercase tracking-wider ${isCream ? 'text-stone-900' : 'text-white'}`}>
              Answers to Core Aviation Analytical Questions
            </h3>
            <span className="text-xs text-stone-500 font-mono">Empirical Dataset Findings</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className={`p-4 rounded-xl border space-y-1.5 ${isCream ? 'bg-[#FDFBF7] border-stone-200' : 'bg-slate-900/80 border-slate-800'}`}>
              <p className="font-bold text-sky-700">1. Highest Activity Airports & Routes</p>
              <p className="text-stone-600 leading-relaxed">
                Delhi (DEL - 73 connected destinations) and Mumbai (BOM - 58 destinations) form the primary trunk axis. The Delhi–Bengaluru and Delhi–Mumbai corridors exhibit the highest weekly scheduled frequencies.
              </p>
            </div>

            <div className={`p-4 rounded-xl border space-y-1.5 ${isCream ? 'bg-[#FDFBF7] border-stone-200' : 'bg-slate-900/80 border-slate-800'}`}>
              <p className="font-bold text-violet-700">2. Fare Variation Between Airlines & Routes</p>
              <p className="text-stone-600 leading-relaxed">
                Low-cost carriers (SpiceJet, IndiGo, Air Asia) maintain average fares between ₹5,500 and ₹7,200. Full-service carriers (Jet Airways, Vistara, Air India) exhibit higher average fares (₹10,000–₹14,000), peaking on long-haul routes such as Delhi–Cochin.
              </p>
            </div>

            <div className={`p-4 rounded-xl border space-y-1.5 ${isCream ? 'bg-[#FDFBF7] border-stone-200' : 'bg-slate-900/80 border-slate-800'}`}>
              <p className="font-bold text-emerald-700">3. Lowest Observed Fares</p>
              <p className="text-stone-600 leading-relaxed">
                The lowest recorded commercial fare in the dataset is ₹1,759 on the Chennai (MAA) → Kolkata (CCU) corridor operated by SpiceJet, closely followed by Mumbai (BOM) → Hyderabad (HYD) at ₹1,965.
              </p>
            </div>

            <div className={`p-4 rounded-xl border space-y-1.5 ${isCream ? 'bg-[#FDFBF7] border-stone-200' : 'bg-slate-900/80 border-slate-800'}`}>
              <p className="font-bold text-amber-700">4. Multi-Airline Competition vs. Monopoly</p>
              <p className="text-stone-600 leading-relaxed">
                Over 65% of domestic routes operate under a single carrier monopoly (primarily regional connections). Conversely, major metro trunk routes feature 4 to 6 competing airlines with tight pricing bands.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'audit' && (
        <div className="space-y-5">
          <div className={`aviation-card rounded-2xl p-5 border space-y-3 shadow-sm ${isCream ? 'bg-white border-stone-200' : 'bg-slate-900/40 border-slate-800'}`}>
            <h3 className={`text-sm font-bold uppercase tracking-wider ${isCream ? 'text-stone-900' : 'text-white'}`}>
              Official Dataset Profile & Data Hygiene Audit
            </h3>
            
            <div className="overflow-x-auto rounded-xl border border-stone-200">
              <table className="w-full text-left text-xs">
                <thead className={`text-[11px] font-semibold border-b ${isCream ? 'bg-[#F4EFE6] text-stone-600 border-stone-300' : 'bg-slate-900 text-slate-400 border-slate-800'}`}>
                  <tr>
                    <th className="py-2.5 px-3">Dataset Source</th>
                    <th className="py-2.5 px-3">Raw Records</th>
                    <th className="py-2.5 px-3">Cleaned Records</th>
                    <th className="py-2.5 px-3">Coverage Scope</th>
                    <th className="py-2.5 px-3 text-right">Integrity Status</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isCream ? 'divide-stone-200 bg-white' : 'divide-slate-800/60 bg-slate-950/40'}`}>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-stone-900">Indian Domestic Airline Dataset</td>
                    <td className="py-2.5 px-3 font-mono text-stone-600">33,734</td>
                    <td className="py-2.5 px-3 font-mono text-emerald-700 font-bold">33,734</td>
                    <td className="py-2.5 px-3 text-stone-600">14 Domestic Airlines, 1,423 Routes</td>
                    <td className="py-2.5 px-3 text-right font-mono text-emerald-700 font-bold">100% Validated</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-stone-900">Indian Flight Price Dataset</td>
                    <td className="py-2.5 px-3 font-mono text-stone-600">10,683</td>
                    <td className="py-2.5 px-3 font-mono text-emerald-700 font-bold">10,683</td>
                    <td className="py-2.5 px-3 text-stone-600">12 Carrier Types, 10 Metro Hubs</td>
                    <td className="py-2.5 px-3 text-right font-mono text-emerald-700 font-bold">100% Validated</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-stone-900">OurAirports India Aerodromes</td>
                    <td className="py-2.5 px-3 font-mono text-stone-600">651</td>
                    <td className="py-2.5 px-3 font-mono text-emerald-700 font-bold">110 Active</td>
                    <td className="py-2.5 px-3 text-stone-600">Exact Lat/Lon, Elevation, ICAO Codes</td>
                    <td className="py-2.5 px-3 text-right font-mono text-emerald-700 font-bold">100% Matched</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
