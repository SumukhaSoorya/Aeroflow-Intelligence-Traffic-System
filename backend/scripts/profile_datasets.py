# profile_datasets.py - Data Profiler for AeroFlow Intelligence Traffic System
import os
import json
import pandas as pd

RAW_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '../data/raw'))
PROCESSED_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '../data/processed'))
os.makedirs(PROCESSED_DIR, exist_ok=True)

def profile_csv(filepath, name, filter_country=None):
    if not os.path.exists(filepath):
        return {'error': f'File not found: {filepath}'}
    
    file_size_bytes = os.path.getsize(filepath)
    df = pd.read_csv(filepath, low_memory=False)
    
    if filter_country and 'iso_country' in df.columns:
        total_global_rows = len(df)
        df = df[df['iso_country'] == filter_country].copy()
        subset_note = f'Filtered to {filter_country} ({len(df)} of {total_global_rows} global records)'
    else:
        subset_note = 'Full dataset'

    num_rows, num_cols = df.shape
    columns = list(df.columns)
    dtypes = {col: str(df[col].dtype) for col in columns}
    missing = {col: int(df[col].isna().sum()) for col in columns}
    total_duplicates = int(df.duplicated().sum())

    numeric_stats = {}
    for col in df.select_dtypes(include=['number']).columns:
        s = df[col].dropna()
        if len(s) > 0:
            numeric_stats[col] = {
                'count': int(s.count()),
                'min': float(s.min()),
                'max': float(s.max()),
                'mean': round(float(s.mean()), 2),
                'median': round(float(s.median()), 2),
                'std': round(float(s.std()), 2) if len(s) > 1 else 0.0
            }

    cat_stats = {}
    for col in df.select_dtypes(include=['object']).columns:
        s = df[col].dropna()
        cat_stats[col] = {
            'unique_count': int(s.nunique()),
            'top_sample': [str(x) for x in list(s.value_counts().head(5).index)]
        }

    return {
        'dataset_name': name,
        'filename': os.path.basename(filepath),
        'file_size_bytes': file_size_bytes,
        'file_size_mb': round(file_size_bytes / (1024 * 1024), 2),
        'total_rows': num_rows,
        'total_columns': num_cols,
        'columns': columns,
        'data_types': dtypes,
        'missing_values': missing,
        'duplicate_rows': total_duplicates,
        'numeric_stats': numeric_stats,
        'categorical_stats': cat_stats,
        'subset_note': subset_note
    }

def main():
    print('=== AEROFLOW DATASET PROFILER ===')
    profile_results = {
        'profiled_at': pd.Timestamp.now().isoformat(),
        'datasets': {}
    }

    targets = [
        ('Air-Clean.csv', 'Indian Domestic Airline Dataset (Cleaned Schedules)', None),
        ('Air_full-Raw.csv', 'Indian Domestic Airline Dataset (Raw Schedules)', None),
        ('Data_Train.csv', 'Indian Flight Price Dataset (Train Fares)', None),
        ('processed_data.csv', 'Indian Flight Price Dataset (Pre-encoded Fares)', None),
        ('airports.csv', 'OurAirports Coordinates Dataset (India Subset)', 'IN'),
    ]

    for fname, desc, country_filter in targets:
        fpath = os.path.join(RAW_DIR, fname)
        print(f'Profiling {fname}...')
        res = profile_csv(fpath, desc, filter_country=country_filter)
        profile_results['datasets'][fname] = res
        print(f"  Rows: {res.get('total_rows')}, Cols: {res.get('total_columns')}, Duplicates: {res.get('duplicate_rows')}")

    out_file = os.path.join(PROCESSED_DIR, 'data_profile.json')
    with open(out_file, 'w', encoding='utf-8') as f:
        json.dump(profile_results, f, indent=2)

    print(f'Profile written to: {out_file}')

if __name__ == '__main__':
    main()
