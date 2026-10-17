import React from 'react';
import { useAviation } from '../context/AviationContext';
import { 
  BarChart3, 
  Map as MapIcon, 
  Radio, 
  IndianRupee, 
  PlaneTakeoff, 
  Network, 
  GraduationCap
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { theme } = useAviation();
  const isCream = theme === 'cream';

  const navItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'routes', label: 'Flight Routes', icon: MapIcon },
    { id: 'airports', label: 'Airports & Hubs', icon: Radio },
    { id: 'fares', label: 'Fare Analysis', icon: IndianRupee },
    { id: 'airlines', label: 'Airlines', icon: PlaneTakeoff },
    { id: 'competition', label: 'Route Competition', icon: Network },
    { id: 'about', label: 'About & Documentation', icon: GraduationCap },
  ];

  return (
    <aside className={`w-full md:w-56 shrink-0 border-r transition-colors md:sticky md:top-16 md:h-[calc(100vh-4rem)] md:overflow-y-auto ${
      isCream 
        ? 'bg-[#FAF7F2] border-[#E7E2D9] text-[#1C1917]' 
        : 'bg-[#080E1A] border-slate-800 text-slate-300'
    }`}>
      <div className="p-4 space-y-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 px-3 block mb-2">
            Dashboard
          </span>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? isCream
                        ? 'bg-amber-600 text-white font-bold shadow-sm'
                        : 'bg-sky-500 text-slate-950 font-bold'
                      : isCream
                      ? 'text-stone-700 hover:bg-[#EFE9DD] hover:text-stone-900'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Short Human Note */}
        <div className={`p-3 rounded-xl border text-xs space-y-1 ${
          isCream 
            ? 'bg-[#F2ECE1] border-[#E2D8C6] text-stone-700' 
            : 'bg-slate-900/60 border-slate-800/80 text-slate-400'
        }`}>
          <p className="font-semibold text-[11px] text-stone-900">Official Datasets</p>
          <p className="text-[11px] text-stone-500 leading-relaxed">
            Data sourced from official Indian domestic flight schedules, price records, and OurAirports coordinates.
          </p>
        </div>
      </div>
    </aside>
  );
};
