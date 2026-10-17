# verify_pipeline.py - Integrity and schema verification
import os
import json

PROCESSED_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '../data/processed'))

def test_file(filename, validator):
    path = os.path.join(PROCESSED_DIR, filename)
    assert os.path.exists(path), f'Missing {filename}'
    with open(path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    validator(data)
    print(f'PASS: {filename}')

def val_airports(data):
    assert len(data) == 110, f'Expected 110 airports, got {len(data)}'
    for a in data:
        assert 'iata' in a and a['iata'], f'Missing IATA in {a}'
        assert len(a['coordinates']) == 2, f'Invalid coords in {a}'
        assert 6.0 <= a['coordinates'][1] <= 38.0, f'Latitude out of India bounds in {a}'
        assert 68.0 <= a['coordinates'][0] <= 98.0, f'Longitude out of India bounds in {a}'
        assert a['connected_routes_count'] >= 1, f'Zero connectivity for {a}'

def val_routes(data):
    assert len(data) == 1423, f'Expected 1423 routes, got {len(data)}'
    for r in data:
        assert len(r['origin_coords']) == 2 and len(r['destination_coords']) == 2
        assert r['frequency'] >= 1
        assert len(r['airlines']) >= 1
        assert len(r['color_rgb']) == 3

def val_fares(data):
    assert data['total_fare_records'] == 10683
    assert data['min_fare'] == 1759.0
    assert data['max_fare'] == 79512.0
    assert len(data['distribution']) == 6

def val_airlines(data):
    assert len(data) == 14
    for a in data:
        assert a['total_flights'] > 0
        assert a['routes_operated'] > 0

def val_kpis(data):
    assert data['total_airports'] == 110
    assert data['total_routes'] == 1423
    assert data['total_fare_records'] == 10683

if __name__ == '__main__':
    print('Verifying processed dataset integrity...')
    test_file('airports.json', val_airports)
    test_file('routes.json', val_routes)
    test_file('fares.json', val_fares)
    test_file('airlines.json', val_airlines)
    test_file('kpis.json', val_kpis)
    print('ALL DATA INTEGRITY CHECKS PASSED PERFECTLY!')
