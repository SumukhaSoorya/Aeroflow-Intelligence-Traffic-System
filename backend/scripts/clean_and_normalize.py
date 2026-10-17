# clean_and_normalize.py - AeroFlow Data Cleaning & Harmonization Pipeline
import os
import math
import json
import pandas as pd
import numpy as np

RAW_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '../data/raw'))
PROCESSED_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '../data/processed'))
FRONTEND_DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../frontend/src/data'))

os.makedirs(PROCESSED_DIR, exist_ok=True)
os.makedirs(FRONTEND_DATA_DIR, exist_ok=True)

# Comprehensive Alias Dictionary mapping city/airport names to official IATA codes
ALIASES = {
    'delhi': 'DEL',
    'new delhi': 'DEL',
    'banglore': 'BLR',
    'bengaluru': 'BLR',
    'mumbai': 'BOM',
    'bombay': 'BOM',
    'kolkata': 'CCU',
    'calcutta': 'CCU',
    'chennai': 'MAA',
    'madras': 'MAA',
    'cochin': 'COK',
    'kochi': 'COK',
    'hyderabad': 'HYD',
    'goa': 'GOI',
    'aizwal': 'AJL',
    'aizawl': 'AJL',
    'bagdogra': 'IXB',
    'bathinda': 'BUP',
    'cooch-behar': 'COH',
    'cooch behar': 'COH',
    'hubli': 'HBX',
    'jaisalmer': 'JSA',
    'jharsuguda': 'JRG',
    'kalaburgi (gulbarga)': 'GBI',
    'kalaburgi': 'GBI',
    'gulbarga': 'GBI',
    'kishangarh': 'KQH',
    'kullu': 'KUU',
    'ludhiana': 'LUH',
    'mihan': 'NAG',
    'mangalore': 'IXE',
    'mangaluru': 'IXE',
    'nasik': 'ISK',
    'nashik': 'ISK',
    'passighat': 'IXT',
    'pasighat': 'IXT',
    'pondicherry': 'PNY',
    'puducherry': 'PNY',
    'rajahmundry': 'RJA',
    'shirdi': 'SAG',
    'shirdi airport': 'SAG',
    'tezpur': 'TEZ',
    'tuticorin': 'TCR',
    'thoothukudi': 'TCR',
    'vidyanagar': 'VDY',
    'kannur international airport': 'CNN',
    'kannur': 'CNN',
}

# Standardized Airline Color Palette
AIRLINE_COLORS = {
    'IndiGo': {'hex': '#0052CC', 'rgb': [0, 82, 204]},
    'Air India': {'hex': '#DC2626', 'rgb': [220, 38, 38]},
    'SpiceJet': {'hex': '#EA580C', 'rgb': [234, 88, 12]},
    'Vistara': {'hex': '#7C3AED', 'rgb': [124, 58, 237]},
    'GoAir': {'hex': '#16A34A', 'rgb': [22, 163, 74]},
    'Jet Airways': {'hex': '#EAB308', 'rgb': [234, 179, 8]},
    'Air Asia': {'hex': '#EF4444', 'rgb': [239, 68, 68]},
    'Akasa Air': {'hex': '#F97316', 'rgb': [249, 115, 22]},
    'Alliance Air (India)': {'hex': '#06B6D4', 'rgb': [6, 182, 212]},
    'Air India Express': {'hex': '#F43F5E', 'rgb': [244, 63, 94]},
    'Star Air': {'hex': '#3B82F6', 'rgb': [59, 130, 246]},
    'FlyBig': {'hex': '#10B981', 'rgb': [16, 185, 129]},
    'IndiaOne Air': {'hex': '#8B5CF6', 'rgb': [139, 92, 246]},
    'TruJet': {'hex': '#EC4899', 'rgb': [236, 72, 153]},
    'Trujet': {'hex': '#EC4899', 'rgb': [236, 72, 153]},
    'Jetlite': {'hex': '#CA8A04', 'rgb': [202, 138, 4]},
    'Multiple carriers': {'hex': '#64748B', 'rgb': [100, 116, 139]},
    'Multiple carriers Premium economy': {'hex': '#475569', 'rgb': [71, 85, 105]},
    'Jet Airways Business': {'hex': '#D97706', 'rgb': [217, 119, 6]},
    'Vistara Premium economy': {'hex': '#6D28D9', 'rgb': [109, 40, 217]},
}

DEFAULT_COLOR = {'hex': '#94A3B8', 'rgb': [148, 163, 184]}

def haversine(lat1, lon1, lat2, lon2):
    R = 6371.0 # Earth radius km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 1)

def load_airports_catalog():
    fpath = os.path.join(RAW_DIR, 'airports.csv')
    df = pd.read_csv(fpath, low_memory=False)
    in_airports = df[df['iso_country'] == 'IN'].copy()
    
    iata_lookup = {}
    mun_lookup = {}
    
    for _, row in in_airports.iterrows():
        iata = str(row['iata_code']).strip().upper() if pd.notna(row['iata_code']) else ''
        mun = str(row['municipality']).strip().lower() if pd.notna(row['municipality']) else ''
        name = str(row['name']).strip().lower() if pd.notna(row['name']) else ''
        
        entry = {
            'iata': iata,
            'ident': str(row['ident']),
            'name': str(row['name']),
            'municipality': str(row['municipality']) if pd.notna(row['municipality']) else '',
            'latitude': float(row['latitude_deg']),
            'longitude': float(row['longitude_deg']),
            'elevation_ft': float(row['elevation_ft']) if pd.notna(row['elevation_ft']) else 0.0,
            'type': str(row['type'])
        }
        
        if iata and iata != 'NAN':
            iata_lookup[iata] = entry
        if mun and mun != 'nan':
            mun_lookup[mun] = entry
        if name and name != 'nan':
            mun_lookup[name] = entry
            
    return iata_lookup, mun_lookup

def resolve_airport(city_str, iata_lookup, mun_lookup):
    if not city_str or pd.isna(city_str):
        return None
    raw = str(city_str).strip()
    low = raw.lower()
    
    # 1. Direct alias match
    if low in ALIASES:
        iata = ALIASES[low]
        if iata in iata_lookup:
            return iata_lookup[iata]
            
    # 2. Direct IATA match
    up = raw.upper()
    if up in iata_lookup:
        return iata_lookup[up]
        
    # 3. Municipality / Name match
    if low in mun_lookup:
        return mun_lookup[low]
        
    return None

def main():
    print('Starting AeroFlow Data Harmonization Pipeline...')
    iata_lookup, mun_lookup = load_airports_catalog()
    print(f'Loaded {len(iata_lookup)} IATA airports and {len(mun_lookup)} municipality entries for India.')
    
    # --- 1. Load & Clean Domestic Schedules (Air-Clean.csv) ---
    schedules_path = os.path.join(RAW_DIR, 'Air-Clean.csv')
    df_sched = pd.read_csv(schedules_path, low_memory=False)
    print(f'Loaded Air-Clean.csv: {len(df_sched)} records.')
    
    # Strip whitespaces
    for col in ['airline', 'origin', 'destination', 'flightNumber']:
        if col in df_sched.columns:
            df_sched[col] = df_sched[col].astype(str).str.strip()
            
    # Clean up airline names
    df_sched['airline_clean'] = df_sched['airline'].replace({'Trujet': 'TruJet'})
    
    # --- 2. Load & Clean Flight Fares (Data_Train.csv) ---
    fares_path = os.path.join(RAW_DIR, 'Data_Train.csv')
    df_fares = pd.read_csv(fares_path, low_memory=False)
    print(f'Loaded Data_Train.csv: {len(df_fares)} records.')
    
    for col in ['Airline', 'Source', 'Destination']:
        df_fares[col] = df_fares[col].astype(str).str.strip()
        
    # Standardize Delhi / New Delhi
    df_fares['Destination_Clean'] = df_fares['Destination'].replace({'New Delhi': 'Delhi'})
    df_fares['Source_Clean'] = df_fares['Source'].replace({'New Delhi': 'Delhi'})
    df_fares['Airline_Clean'] = df_fares['Airline'].replace({'Trujet': 'TruJet'})
    df_fares['Price'] = pd.to_numeric(df_fares['Price'], errors='coerce')
    
    # --- 3. Airport Resolution & Network Aggregation ---
    origins = df_sched['origin'].unique()
    destinations = df_sched['destination'].unique()
    all_cities = sorted(list(set(list(origins) + list(destinations))))
    
    resolved_airports = {}
    unresolved_cities = []
    
    for c in all_cities:
        match = resolve_airport(c, iata_lookup, mun_lookup)
        if match:
            code = match['iata'] if match['iata'] else c[:3].upper()
            resolved_airports[c] = {
                'id': code,
                'iata': code,
                'name': match['name'],
                'city': match['municipality'] if match['municipality'] else c,
                'latitude': match['latitude'],
                'longitude': match['longitude'],
                'elevation_ft': match['elevation_ft'],
                'type': match['type']
            }
        else:
            unresolved_cities.append(c)
            
    print(f'Resolved airports: {len(resolved_airports)} / {len(all_cities)}')
    if unresolved_cities:
        print(f'WARNING: Unresolved cities: {unresolved_cities}')
    else:
        print('SUCCESS: 100% of all origin and destination airports matched to exact coordinates!')

    # Map IATA to schedules
    df_sched['origin_resolved'] = df_sched['origin'].map(resolved_airports)
    df_sched['dest_resolved'] = df_sched['destination'].map(resolved_airports)
    
    # Filter valid routes
    df_valid_sched = df_sched[df_sched['origin_resolved'].notna() & df_sched['dest_resolved'].notna()].copy()
    
    # --- 4. Fare Cross-Tabulation & Aggregation ---
    fare_route_group = df_fares.groupby(['Source_Clean', 'Destination_Clean']).agg(
        min_fare=('Price', 'min'),
        avg_fare=('Price', 'mean'),
        max_fare=('Price', 'max'),
        fare_count=('Price', 'count')
    ).reset_index()
    
    fare_lookup = {}
    for _, row in fare_route_group.iterrows():
        s = row['Source_Clean'].lower()
        d = row['Destination_Clean'].lower()
        fare_lookup[(s, d)] = {
            'min_fare': float(row['min_fare']),
            'avg_fare': round(float(row['avg_fare']), 2),
            'max_fare': float(row['max_fare']),
            'fare_count': int(row['fare_count'])
        }
        
    # Also fare by airline + route
    fare_airline_route = df_fares.groupby(['Airline_Clean', 'Source_Clean', 'Destination_Clean']).agg(
        min_fare=('Price', 'min'),
        avg_fare=('Price', 'mean'),
        max_fare=('Price', 'max'),
        fare_count=('Price', 'count')
    ).reset_index()

    # --- 5. Routes Aggregation ---
    route_groups = df_valid_sched.groupby(['origin', 'destination'])
    routes_list = []
    airport_stats = {k: {'departures': 0, 'arrivals': 0, 'airlines': set(), 'connected_airports': set()} for k in resolved_airports.keys()}
    
    for (orig, dest), group in route_groups:
        orig_info = resolved_airports[orig]
        dest_info = resolved_airports[dest]
        
        freq = len(group)
        airlines = sorted(list(group['airline_clean'].unique()))
        
        # update stats
        airport_stats[orig]['departures'] += freq
        airport_stats[orig]['connected_airports'].add(dest_info['iata'])
        airport_stats[dest]['arrivals'] += freq
        airport_stats[dest]['connected_airports'].add(orig_info['iata'])
        for a in airlines:
            airport_stats[orig]['airlines'].add(a)
            airport_stats[dest]['airlines'].add(a)
            
        dist = haversine(orig_info['latitude'], orig_info['longitude'], dest_info['latitude'], dest_info['longitude'])
        
        # Check fare match (direct or reverse)
        orig_key = orig.lower()
        dest_key = dest.lower()
        route_fare = fare_lookup.get((orig_key, dest_key))
        if not route_fare:
            # check city name alias
            orig_city_low = orig_info['city'].lower()
            dest_city_low = dest_info['city'].lower()
            route_fare = fare_lookup.get((orig_city_low, dest_city_low))
            
        primary_airline = airlines[0] if len(airlines) == 1 else (group['airline_clean'].value_counts().index[0])
        color_info = AIRLINE_COLORS.get(primary_airline, DEFAULT_COLOR)
        
        route_obj = {
            'route_id': f"{orig_info['iata']}-{dest_info['iata']}",
            'origin_iata': orig_info['iata'],
            'origin_city': orig,
            'origin_airport_name': orig_info['name'],
            'origin_coords': [orig_info['longitude'], orig_info['latitude']],
            'destination_iata': dest_info['iata'],
            'destination_city': dest,
            'destination_airport_name': dest_info['name'],
            'destination_coords': [dest_info['longitude'], dest_info['latitude']],
            'distance_km': dist,
            'frequency': freq,
            'airlines': airlines,
            'airline_count': len(airlines),
            'primary_airline': primary_airline,
            'color_rgb': color_info['rgb'],
            'color_hex': color_info['hex'],
            'fare_info': route_fare
        }
        routes_list.append(route_obj)
        
    # --- 6. Airports Final List with Hub Classification ---
    airports_list = []
    for city_name, info in resolved_airports.items():
        st = airport_stats.get(city_name, {'departures': 0, 'arrivals': 0, 'airlines': set(), 'connected_airports': set()})
        conn_count = len(st['connected_airports'])
        tot_flights = st['departures'] + st['arrivals']
        
        if conn_count >= 30:
            category = 'Primary Hub'
        elif conn_count >= 10:
            category = 'Major Airport'
        else:
            category = 'Regional Connector'
            
        airports_list.append({
            'id': info['iata'],
            'iata': info['iata'],
            'name': info['name'],
            'city': info['city'],
            'raw_city_name': city_name,
            'latitude': info['latitude'],
            'longitude': info['longitude'],
            'coordinates': [info['longitude'], info['latitude']],
            'elevation_ft': info['elevation_ft'],
            'type': info['type'],
            'total_departures': st['departures'],
            'total_arrivals': st['arrivals'],
            'total_flights': tot_flights,
            'connected_routes_count': conn_count,
            'connected_airports': sorted(list(st['connected_airports'])),
            'airlines': sorted(list(st['airlines'])),
            'airline_count': len(st['airlines']),
            'category': category
        })
        
    airports_list.sort(key=lambda x: x['connected_routes_count'], reverse=True)
    
    # --- 7. Airlines Summary ---
    airline_sched_counts = df_valid_sched['airline_clean'].value_counts()
    airline_fare_group = df_fares.groupby('Airline_Clean').agg(
        min_fare=('Price', 'min'),
        avg_fare=('Price', 'mean'),
        max_fare=('Price', 'max'),
        fare_count=('Price', 'count')
    ).reset_index()
    
    fare_airline_map = {}
    for _, r in airline_fare_group.iterrows():
        fare_airline_map[r['Airline_Clean']] = {
            'min_fare': float(r['min_fare']),
            'avg_fare': round(float(r['avg_fare']), 2),
            'max_fare': float(r['max_fare']),
            'fare_count': int(r['fare_count'])
        }
        
    airlines_list = []
    total_all_flights = len(df_valid_sched)
    
    for airline_name, count in airline_sched_counts.items():
        sub = df_valid_sched[df_valid_sched['airline_clean'] == airline_name]
        routes_operated = sub.groupby(['origin', 'destination']).ngroups
        airports_served = set(sub['origin']).union(set(sub['destination']))
        color_entry = AIRLINE_COLORS.get(airline_name, DEFAULT_COLOR)
        
        # top 5 routes
        top_routes = sub.groupby(['origin', 'destination']).size().reset_index(name='flight_count')
        top_routes = top_routes.sort_values(by='flight_count', ascending=False).head(5)
        top_routes_data = [{'route': f"{r['origin']} → {r['destination']}", 'flights': int(r['flight_count'])} for _, r in top_routes.iterrows()]
        
        airlines_list.append({
            'name': airline_name,
            'total_flights': int(count),
            'flight_share_pct': round((count / total_all_flights) * 100, 2),
            'routes_operated': int(routes_operated),
            'airports_served_count': len(airports_served),
            'color_hex': color_entry['hex'],
            'color_rgb': color_entry['rgb'],
            'fare_stats': fare_airline_map.get(airline_name),
            'top_routes': top_routes_data
        })
        
    # --- 8. Competition Summary ---
    monopoly_routes = [r for r in routes_list if r['airline_count'] == 1]
    competitive_routes = [r for r in routes_list if 2 <= r['airline_count'] <= 3]
    high_comp_routes = [r for r in routes_list if r['airline_count'] >= 4]
    
    comp_tiers = [
        {'tier': 'Monopoly (1 Airline)', 'count': len(monopoly_routes), 'percentage': round((len(monopoly_routes)/len(routes_list))*100, 1)},
        {'tier': 'Moderate Competition (2-3 Airlines)', 'count': len(competitive_routes), 'percentage': round((len(competitive_routes)/len(routes_list))*100, 1)},
        {'tier': 'High Competition (4+ Airlines)', 'count': len(high_comp_routes), 'percentage': round((len(high_comp_routes)/len(routes_list))*100, 1)},
    ]
    
    top_comp_routes = sorted(routes_list, key=lambda x: (x['airline_count'], x['frequency']), reverse=True)[:15]
    top_comp_data = [{
        'route': f"{r['origin_city']} → {r['destination_city']}",
        'airline_count': r['airline_count'],
        'frequency': r['frequency'],
        'airlines': r['airlines'],
        'fare_info': r['fare_info']
    } for r in top_comp_routes]
    
    competition_summary = {
        'total_routes': len(routes_list),
        'tiers': comp_tiers,
        'top_competitive_routes': top_comp_data,
        'average_airlines_per_route': round(sum(r['airline_count'] for r in routes_list) / len(routes_list), 2)
    }
    
    # --- 9. Fares Dataset Summary ---
    fare_prices = df_fares['Price'].dropna().tolist()
    bins = [0, 4000, 7000, 10000, 15000, 25000, 100000]
    bin_labels = ['< ₹4,000', '₹4,000 - ₹7,000', '₹7,000 - ₹10,000', '₹10,000 - ₹15,000', '₹15,000 - ₹25,000', '₹25,000+']
    hist, _ = np.histogram(fare_prices, bins=bins)
    fare_distribution = [{'range': label, 'count': int(count), 'pct': round((count / len(fare_prices)) * 100, 1)} for label, count in zip(bin_labels, hist)]
    
    fares_summary = {
        'total_fare_records': len(fare_prices),
        'min_fare': float(min(fare_prices)),
        'max_fare': float(max(fare_prices)),
        'mean_fare': round(float(np.mean(fare_prices)), 2),
        'median_fare': float(np.median(fare_prices)),
        'std_fare': round(float(np.std(fare_prices)), 2),
        'distribution': fare_distribution,
        'airline_fares': [{'airline': k, **v} for k, v in fare_airline_map.items()],
        'route_fares': [{'source': k[0].title(), 'destination': k[1].title(), **v} for k, v in fare_lookup.items()]
    }
    
    # --- 10. Cheapest Routes Ranking ---
    cheapest_routes_data = []
    for _, row in fare_airline_route.iterrows():
        cheapest_routes_data.append({
            'source': row['Source_Clean'],
            'destination': row['Destination_Clean'],
            'airline': row['Airline_Clean'],
            'min_fare': float(row['min_fare']),
            'avg_fare': round(float(row['avg_fare']), 2),
            'max_fare': float(row['max_fare']),
            'record_count': int(row['fare_count'])
        })
    cheapest_routes_data.sort(key=lambda x: x['min_fare'])
    
    # --- 11. System KPIs ---
    kpis = {
        'total_airports': len(airports_list),
        'total_routes': len(routes_list),
        'total_airlines_schedule': len(airlines_list),
        'total_airlines_fare': len(fare_airline_map),
        'total_flight_records': len(df_valid_sched),
        'total_fare_records': len(fare_prices),
        'avg_fare': fares_summary['mean_fare'],
        'cheapest_fare': fares_summary['min_fare'],
        'cheapest_route': f"{cheapest_routes_data[0]['source']} → {cheapest_routes_data[0]['destination']} ({cheapest_routes_data[0]['airline']})",
        'highest_fare': fares_summary['max_fare'],
        'top_connected_airport': f"{airports_list[0]['city']} ({airports_list[0]['iata']}) - {airports_list[0]['connected_routes_count']} destinations",
        'monopoly_routes_pct': comp_tiers[0]['percentage']
    }

    # --- Write Outputs to both backend/data/processed and frontend/src/data ---
    def save_json(data, filename):
        p1 = os.path.join(PROCESSED_DIR, filename)
        p2 = os.path.join(FRONTEND_DATA_DIR, filename)
        with open(p1, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2)
        with open(p2, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2)
            
    save_json(airports_list, 'airports.json')
    save_json(routes_list, 'routes.json')
    save_json(airlines_list, 'airlines.json')
    save_json(fares_summary, 'fares.json')
    save_json(competition_summary, 'competition.json')
    save_json(cheapest_routes_data, 'cheapest_routes.json')
    save_json(kpis, 'kpis.json')
    
    # Also copy data_profile.json
    profile_src = os.path.join(PROCESSED_DIR, 'data_profile.json')
    if os.path.exists(profile_src):
        with open(profile_src, 'r', encoding='utf-8') as f:
            prof_data = json.load(f)
        with open(os.path.join(FRONTEND_DATA_DIR, 'data_profile.json'), 'w', encoding='utf-8') as f:
            json.dump(prof_data, f, indent=2)
            
    print(f'Successfully generated and exported:')
    print(f'  - airports.json ({len(airports_list)} airports)')
    print(f'  - routes.json ({len(routes_list)} routes)')
    print(f'  - airlines.json ({len(airlines_list)} airlines)')
    print(f'  - fares.json ({len(fare_prices)} fare observations)')
    print(f'  - competition.json (3 tiers, top 15 corridors)')
    print(f'  - cheapest_routes.json ({len(cheapest_routes_data)} route-airline pairs)')
    print(f'  - kpis.json')
    print('Harmonization complete!')

if __name__ == '__main__':
    main()
