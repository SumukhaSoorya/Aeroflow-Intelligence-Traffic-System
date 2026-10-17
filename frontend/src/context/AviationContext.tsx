import React, { createContext, useContext, useState, useMemo } from 'react';
import type { Airport, Route, Airline, FaresSummary, CompetitionSummary, CheapestRoute, SystemKPIs, FilterState } from '../types/aviation';

import airportsDataRaw from '../data/airports.json';
import routesDataRaw from '../data/routes.json';
import airlinesDataRaw from '../data/airlines.json';
import faresDataRaw from '../data/fares.json';
import competitionDataRaw from '../data/competition.json';
import cheapestRoutesRaw from '../data/cheapest_routes.json';
import kpisRaw from '../data/kpis.json';
import dataProfileRaw from '../data/data_profile.json';

const initialFilters: FilterState = {
  airline: 'all',
  origin: 'all',
  destination: 'all',
  maxFare: 80000,
  minFrequency: 1,
  searchTerm: '',
};

interface AviationContextType {
  // Theme state: default 'cream'
  theme: 'cream' | 'dark';
  setTheme: (theme: 'cream' | 'dark') => void;
  toggleTheme: () => void;

  // Master Data
  airports: Airport[];
  routes: Route[];
  airlines: Airline[];
  faresSummary: FaresSummary;
  competitionSummary: CompetitionSummary;
  cheapestRoutes: CheapestRoute[];
  systemKPIs: SystemKPIs;
  dataProfile: any;

  // Filter State
  filters: FilterState;
  setAirlineFilter: (airline: string) => void;
  setOriginFilter: (origin: string) => void;
  setDestinationFilter: (destination: string) => void;
  setMaxFareFilter: (fare: number) => void;
  setMinFrequencyFilter: (freq: number) => void;
  setSearchTerm: (term: string) => void;
  resetFilters: () => void;
  activeFilterCount: number;

  // Selected entities
  selectedAirport: Airport | null;
  setSelectedAirport: (airport: Airport | null) => void;
  selectedRoute: Route | null;
  setSelectedRoute: (route: Route | null) => void;

  // Filtered Data
  filteredRoutes: Route[];
  filteredAirports: Airport[];
  dynamicKPIs: {
    activeAirportsCount: number;
    activeRoutesCount: number;
    activeAirlinesCount: number;
    totalFlightsObserved: number;
    filteredAvgFare: number | null;
    filteredCheapestFare: number | null;
  };
}

const AviationContext = createContext<AviationContextType | undefined>(undefined);

export const AviationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'cream' | 'dark'>('cream');
  const toggleTheme = () => setTheme(prev => prev === 'cream' ? 'dark' : 'cream');

  const airports = airportsDataRaw as Airport[];
  const routes = routesDataRaw as Route[];
  const airlines = airlinesDataRaw as Airline[];
  const faresSummary = faresDataRaw as FaresSummary;
  const competitionSummary = competitionDataRaw as CompetitionSummary;
  const cheapestRoutes = cheapestRoutesRaw as CheapestRoute[];
  const systemKPIs = kpisRaw as SystemKPIs;
  const dataProfile = dataProfileRaw;

  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [selectedAirport, setSelectedAirport] = useState<Airport | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);

  const setAirlineFilter = (airline: string) => setFilters(prev => ({ ...prev, airline }));
  const setOriginFilter = (origin: string) => setFilters(prev => ({ ...prev, origin }));
  const setDestinationFilter = (destination: string) => setFilters(prev => ({ ...prev, destination }));
  const setMaxFareFilter = (maxFare: number) => setFilters(prev => ({ ...prev, maxFare }));
  const setMinFrequencyFilter = (minFrequency: number) => setFilters(prev => ({ ...prev, minFrequency }));
  const setSearchTerm = (searchTerm: string) => setFilters(prev => ({ ...prev, searchTerm }));
  const resetFilters = () => {
    setFilters(initialFilters);
    setSelectedAirport(null);
    setSelectedRoute(null);
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.airline !== 'all') count++;
    if (filters.origin !== 'all') count++;
    if (filters.destination !== 'all') count++;
    if (filters.searchTerm.trim() !== '') count++;
    return count;
  }, [filters]);

  const filteredRoutes = useMemo(() => {
    return routes.filter(r => {
      if (filters.airline !== 'all' && !r.airlines.includes(filters.airline)) return false;
      if (filters.origin !== 'all' && r.origin_iata !== filters.origin) return false;
      if (filters.destination !== 'all' && r.destination_iata !== filters.destination) return false;
      if (filters.searchTerm.trim() !== '') {
        const term = filters.searchTerm.toLowerCase();
        const matchesOrigin = r.origin_city.toLowerCase().includes(term) || r.origin_iata.toLowerCase().includes(term);
        const matchesDest = r.destination_city.toLowerCase().includes(term) || r.destination_iata.toLowerCase().includes(term);
        const matchesAirline = r.airlines.some(a => a.toLowerCase().includes(term));
        if (!matchesOrigin && !matchesDest && !matchesAirline) return false;
      }
      return true;
    });
  }, [routes, filters]);

  const filteredAirports = useMemo(() => {
    if (filters.origin === 'all' && filters.destination === 'all' && filters.airline === 'all' && !filters.searchTerm) {
      return airports;
    }
    const activeIatas = new Set<string>();
    filteredRoutes.forEach(r => {
      activeIatas.add(r.origin_iata);
      activeIatas.add(r.destination_iata);
    });
    return airports.filter(a => activeIatas.has(a.iata));
  }, [airports, filteredRoutes, filters]);

  const dynamicKPIs = useMemo(() => {
    const activeAirportsCount = filteredAirports.length;
    const activeRoutesCount = filteredRoutes.length;
    const uniqueAirlines = new Set<string>();
    let totalFlights = 0;
    let fareSum = 0;
    let fareCount = 0;
    let minFare: number | null = null;

    filteredRoutes.forEach(r => {
      r.airlines.forEach(a => uniqueAirlines.add(a));
      totalFlights += r.frequency;
      if (r.fare_info) {
        fareSum += r.fare_info.avg_fare;
        fareCount++;
        if (minFare === null || r.fare_info.min_fare < minFare) {
          minFare = r.fare_info.min_fare;
        }
      }
    });

    return {
      activeAirportsCount,
      activeRoutesCount,
      activeAirlinesCount: uniqueAirlines.size,
      totalFlightsObserved: totalFlights,
      filteredAvgFare: fareCount > 0 ? fareSum / fareCount : null,
      filteredCheapestFare: minFare,
    };
  }, [filteredRoutes, filteredAirports]);

  return (
    <AviationContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        airports,
        routes,
        airlines,
        faresSummary,
        competitionSummary,
        cheapestRoutes,
        systemKPIs,
        dataProfile,
        filters,
        setAirlineFilter,
        setOriginFilter,
        setDestinationFilter,
        setMaxFareFilter,
        setMinFrequencyFilter,
        setSearchTerm,
        resetFilters,
        activeFilterCount,
        selectedAirport,
        setSelectedAirport,
        selectedRoute,
        setSelectedRoute,
        filteredRoutes,
        filteredAirports,
        dynamicKPIs,
      }}
    >
      {children}
    </AviationContext.Provider>
  );
};

export const useAviation = () => {
  const context = useContext(AviationContext);
  if (!context) {
    throw new Error('useAviation must be used within an AviationProvider');
  }
  return context;
};
