export interface Airport {
  id: string;
  iata: string;
  name: string;
  city: string;
  raw_city_name: string;
  latitude: number;
  longitude: number;
  coordinates: [number, number]; // [lon, lat]
  elevation_ft: number;
  type: string;
  total_departures: number;
  total_arrivals: number;
  total_flights: number;
  connected_routes_count: number;
  connected_airports: string[];
  airlines: string[];
  airline_count: number;
  category: 'Primary Hub' | 'Major Airport' | 'Regional Connector';
}

export interface RouteFareInfo {
  min_fare: number;
  avg_fare: number;
  max_fare: number;
  fare_count: number;
}

export interface Route {
  route_id: string;
  origin_iata: string;
  origin_city: string;
  origin_airport_name: string;
  origin_coords: [number, number]; // [lon, lat]
  destination_iata: string;
  destination_city: string;
  destination_airport_name: string;
  destination_coords: [number, number]; // [lon, lat]
  distance_km: number;
  frequency: number;
  airlines: string[];
  airline_count: number;
  primary_airline: string;
  color_rgb: [number, number, number];
  color_hex: string;
  fare_info?: RouteFareInfo | null;
}

export interface TopRoute {
  route: string;
  flights: number;
}

export interface Airline {
  name: string;
  total_flights: number;
  flight_share_pct: number;
  routes_operated: number;
  airports_served_count: number;
  color_hex: string;
  color_rgb: [number, number, number];
  fare_stats?: {
    min_fare: number;
    avg_fare: number;
    max_fare: number;
    fare_count: number;
  } | null;
  top_routes: TopRoute[];
}

export interface FareDistributionItem {
  range: string;
  count: number;
  pct: number;
}

export interface AirlineFareItem {
  airline: string;
  min_fare: number;
  avg_fare: number;
  max_fare: number;
  fare_count: number;
}

export interface RouteFareItem {
  source: string;
  destination: string;
  min_fare: number;
  avg_fare: number;
  max_fare: number;
  fare_count: number;
}

export interface FaresSummary {
  total_fare_records: number;
  min_fare: number;
  max_fare: number;
  mean_fare: number;
  median_fare: number;
  std_fare: number;
  distribution: FareDistributionItem[];
  airline_fares: AirlineFareItem[];
  route_fares: RouteFareItem[];
}

export interface CompetitionTier {
  tier: string;
  count: number;
  percentage: number;
}

export interface TopCompetitiveRoute {
  route: string;
  airline_count: number;
  frequency: number;
  airlines: string[];
  fare_info?: RouteFareInfo | null;
}

export interface CompetitionSummary {
  total_routes: number;
  tiers: CompetitionTier[];
  top_competitive_routes: TopCompetitiveRoute[];
  average_airlines_per_route: number;
}

export interface CheapestRoute {
  source: string;
  destination: string;
  airline: string;
  min_fare: number;
  avg_fare: number;
  max_fare: number;
  record_count: number;
}

export interface SystemKPIs {
  total_airports: number;
  total_routes: number;
  total_airlines_schedule: number;
  total_airlines_fare: number;
  total_flight_records: number;
  total_fare_records: number;
  avg_fare: number;
  cheapest_fare: number;
  cheapest_route: string;
  highest_fare: number;
  top_connected_airport: string;
  monopoly_routes_pct: number;
}

export interface FilterState {
  airline: string;
  origin: string;
  destination: string;
  maxFare: number;
  minFrequency: number;
  searchTerm: string;
}
