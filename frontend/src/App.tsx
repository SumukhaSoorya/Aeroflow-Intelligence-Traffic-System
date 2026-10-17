import React, { useState } from 'react';
import { AviationProvider, useAviation } from './context/AviationContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { OverviewPage } from './pages/OverviewPage';
import { MapPage } from './pages/MapPage';
import { AirportAnalysisPage } from './pages/AirportAnalysisPage';
import { FareAnalysisPage } from './pages/FareAnalysisPage';
import { AirlineAnalysisPage } from './pages/AirlineAnalysisPage';
import { CompetitionPage } from './pages/CompetitionPage';
import { AboutPage } from './pages/AboutPage';

const AppContent: React.FC = () => {
  const { theme } = useAviation();
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className={`min-h-screen ${theme === 'cream' ? 'theme-cream bg-[#F8F6F0] text-[#1C1917]' : 'theme-dark bg-[#070B14] text-white'} flex flex-col transition-colors`}>
      <Header />
      <div className="flex-1 flex flex-col md:flex-row max-w-[1600px] w-full mx-auto">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 p-4 lg:p-6 min-w-0">
          {activeTab === 'overview' && <OverviewPage onNavigate={setActiveTab} />}
          {activeTab === 'routes' && <MapPage onNavigate={setActiveTab} />}
          {activeTab === 'airports' && <AirportAnalysisPage />}
          {activeTab === 'fares' && <FareAnalysisPage />}
          {activeTab === 'airlines' && <AirlineAnalysisPage />}
          {activeTab === 'competition' && <CompetitionPage />}
          {activeTab === 'about' && <AboutPage />}
        </main>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AviationProvider>
      <AppContent />
    </AviationProvider>
  );
};

export default App;
