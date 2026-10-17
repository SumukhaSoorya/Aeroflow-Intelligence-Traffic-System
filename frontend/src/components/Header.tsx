import React from 'react';
import { useAviation } from '../context/AviationContext';
import { Plane, Sun, Moon } from 'lucide-react';

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useAviation();
  const isCream = theme === 'cream';

  return (
    <header className={`w-full border-b transition-colors ${
      isCream 
        ? 'bg-[#FAF7F2] border-[#E7E2D9] text-[#1C1917]' 
        : 'bg-[#0B111E] border-slate-800 text-white'
    }`}>
      <div className="max-w-[1600px] mx-auto px-4 lg:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo & Title */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-amber-600 flex items-center justify-center text-white shadow-sm">
            <Plane className="w-5 h-5 transform -rotate-45" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-bold tracking-tight">
                <span className={isCream ? 'text-stone-900' : 'text-white'}>AeroFlow</span>
                <span className="text-amber-600 ml-1">Traffic</span>
              </h1>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                isCream ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-slate-800 border-slate-700 text-slate-300'
              }`}>
                Data Viz Lab
              </span>
            </div>
            <p className="text-[11px] text-stone-500 hidden sm:block">
              Indian domestic flight routes, airfares, and airline operations
            </p>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center space-x-3">
          {/* Simple Stats Pill */}
          <div className={`hidden sm:flex items-center space-x-2 text-xs px-3 py-1.5 rounded-xl border ${
            isCream ? 'bg-white border-stone-200 text-stone-700' : 'bg-slate-900 border-slate-800 text-slate-300'
          }`}>
            <span>110 Airports</span>
            <span className="text-stone-400">•</span>
            <span>1,423 Routes</span>
            <span className="text-stone-400">•</span>
            <span>14 Airlines</span>
          </div>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            title={isCream ? 'Switch to Dark Mode' : 'Switch to Warm Cream Mode'}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              isCream
                ? 'bg-white hover:bg-stone-100 text-stone-800 border-stone-300 shadow-sm'
                : 'bg-slate-800 hover:bg-slate-700 text-amber-400 border-slate-700'
            }`}
          >
            {isCream ? (
              <>
                <Sun className="w-4 h-4 text-amber-600" />
                <span>Cream</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-sky-400" />
                <span>Dark</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
