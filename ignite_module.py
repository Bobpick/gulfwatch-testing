# ============================================================================
# IGNITE - NASA FIRMS Heat Detection
# Real-time fire/thermal anomaly detection in the Gulf region
# ============================================================================

import json
import math
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional

# ============================================================================
# NASA FIRMS API CONFIG
# ============================================================================

NASA_FIRMS_BASE = "https://firms.modaps.eosdis.nasa.gov/api/area/csv"
GULF_BOUNDING_BOX = [34, 12, 60, 35]  # [min_lon, min_lat, max_lon, max_lat]

# ============================================================================
# VIIRS I-BAND ACTIVE FIRE DETECTION
# ============================================================================

def fetch_viirs_fires(api_key: str, days: int = 1) -> List[Dict]:
    """Fetch VIIRS I-band active fire data for Gulf region."""
    import urllib.request
    import csv
    import io
    
    url = f"{NASA_FIRMS_BASE}/{api_key}/VIIRS_I_BAND_NRT/{','.join(map(str, GULF_BOUNDING_BOX))}/{days}"
    
    try:
        with urllib.request.urlopen(url, timeout=30) as response:
            data = response.read().decode('utf-8')
        
        fires = []
        reader = csv.DictReader(io.StringIO(data))
        for row in reader:
            fires.append({
                'latitude': float(row['latitude']),
                'longitude': float(row['longitude']),
                'bright_ti4': float(row.get('bright_ti4', 0)),  # Brightness temperature I-4
                'fire_radiative_power': float(row.get('fire_radiative_power', 0)),  # FRP in MW
                'acq_date': row.get('acq_date', ''),
                'acq_time': row.get('acq_time', ''),
                'satellite': 'VIIRS-NPP',
                'confidence': row.get('confidence', 'nominal'),
                'type': row.get('type', 0)  # 0=presumed water, 1=low, 2=medium, 3=high confidence fire
            })
        return fires
    except Exception as e:
        print(f"Error fetching VIIRS data: {e}")
        return generate_mock_fires()

def fetch_modis_fires(api_key: str, days: int = 1) -> List[Dict]:
    """Fetch MODIS active fire data for Gulf region."""
    import urllib.request
    import csv
    import io
    
    url = f"{NASA_FIRMS_BASE}/{api_key}/MODIS_NRT/{','.join(map(str, GULF_BOUNDING_BOX))}/{days}"
    
    try:
        with urllib.request.urlopen(url, timeout=30) as response:
            data = response.read().decode('utf-8')
        
        fires = []
        reader = csv.DictReader(io.StringIO(data))
        for row in reader:
            fires.append({
                'latitude': float(row['latitude']),
                'longitude': float(row['longitude']),
                'brightness': float(row.get('brightness', 0)),
                'fire_radiative_power': float(row.get('frp', 0)),
                'acq_date': row.get('acq_date', ''),
                'acq_time': row.get('acq_time', ''),
                'satellite': 'MODIS-Aqua',
                'confidence': row.get('confidence', 'nominal'),
                'type': int(row.get('type', 0))
            })
        return fires
    except Exception as e:
        print(f"Error fetching MODIS data: {e}")
        return generate_mock_fires()

# ============================================================================
# MOCK DATA FOR TESTING
# ============================================================================

def generate_mock_fires() -> List[Dict]:
    """Generate realistic mock fire data for testing."""
    import random
    
    mock_fires = []
    locations = [
        {'lat': 29.4, 'lon': 47.5, 'name': 'Kuwait'},  # Oil fields
        {'lat': 23.7, 'lon': 58.5, 'name': 'Oman'},
        {'lat': 24.5, 'lon': 54.4, 'name': 'UAE'},
        {'lat': 26.9, 'lon': 50.6, 'name': 'Saudi Arabia East'},
        {'lat': 30.3, 'lon': 48.2, 'name': 'Iraq South'},
        {'lat': 15.2, 'lon': 44.0, 'name': 'Yemen'},
        {'lat': 32.0, 'lon': 44.3, 'name': 'Iraq Central'},
        {'lat': 34.3, 'lon': 36.3, 'name': 'Syria Coast'},
        {'lat': 31.5, 'lon': 35.0, 'name': 'Jordan'},
        {'lat': 33.3, 'lon': 44.4, 'name': 'Baghdad'},
        {'lat': 35.5, 'lon': 35.8, 'name': 'Latakia'},
        {'lat': 13.5, 'lon': 44.0, 'name': 'Yemen South'},
    ]
    
    for _ in range(random.randint(15, 40)):
        loc = random.choice(locations)
        # Add some randomness to location
        lat = loc['lat'] + random.uniform(-0.5, 0.5)
        lon = loc['lon'] + random.uniform(-0.5, 0.5)
        
        fire = {
            'latitude': round(lat, 4),
            'longitude': round(lon, 4),
            'bright_ti4': random.uniform(280, 400),
            'fire_radiative_power': random.uniform(5, 150),  # MW
            'acq_date': datetime.now().strftime('%Y-%m-%d'),
            'acq_time': f"{random.randint(0,23):02d}{random.randint(0,59):02d}",
            'satellite': random.choice(['VIIRS-NPP', 'MODIS-Aqua']),
            'confidence': random.choice(['low', 'medium', 'high', 'nominal']),
            'type': random.choice([0, 1, 2, 3]),
            'location': loc['name']
        }
        mock_fires.append(fire)
    
    return mock_fires

# ============================================================================
# FIRE CLASSIFICATION
# ============================================================================

def classify_fire(fire: Dict) -> Dict:
    """Classify fire type and risk level."""
    frp = fire.get('fire_radiative_power', 0)
    confidence = fire.get('confidence', 'nominal')
    brightness = fire.get('bright_ti4', fire.get('brightness', 300))
    
    # Determine fire type
    if frp > 100:
        fire_type = 'industrial_large'
        risk = 'high'
    elif frp > 50:
        fire_type = 'industrial_medium'
        risk = 'medium'
    elif brightness > 350:
        fire_type = 'gas_flare'
        risk = 'medium'
    elif frp > 20:
        fire_type = 'wildfire'
        risk = 'medium'
    else:
        fire_type = 'controlled_burn'
        risk = 'low'
    
    # Adjust for confidence
    if confidence == 'high':
        risk = 'high' if risk != 'low' else 'medium'
    elif confidence == 'low':
        risk = 'low' if risk != 'high' else 'medium'
    
    return {
        **fire,
        'fireType': fire_type,
        'riskLevel': risk,
        'isThermalAnomaly': brightness > 320
    }

# ============================================================================
# ANALYSIS
# ============================================================================

def analyze_fires(fires: List[Dict]) -> Dict:
    """Analyze fire/thermal data for patterns."""
    if not fires:
        return {
            'totalDetections': 0,
            'classified': [],
            'hotspots': [],
            'summary': {'industrial': 0, 'wildfire': 0, 'controlled': 0}
        }
    
    # Classify all fires
    classified = [classify_fire(f) for f in fires]
    
    # Count by type
    fire_types = {}
    for f in classified:
        ft = f.get('fireType', 'unknown')
        fire_types[ft] = fire_types.get(ft, 0) + 1
    
    # Find hotspots (high FRP)
    hotspots = sorted(classified, key=lambda x: x.get('fire_radiative_power', 0), reverse=True)[:10]
    
    # Group by region
    regions = {}
    for f in classified:
        lat, lon = f['latitude'], f['longitude']
        # Approximate regional grouping
        if 34 <= lon <= 40 and 32 <= lat <= 36:
            region = 'Levant'
        elif 40 <= lon <= 50 and 28 <= lat <= 35:
            region = 'Iraq'
        elif 50 <= lon <= 56 and 24 <= lat <= 30:
            region = 'Gulf'
        elif 56 <= lon <= 60 and 20 <= lat <= 28:
            region = 'Gulf of Oman'
        elif 42 <= lon <= 54 and 12 <= lat <= 24:
            region = 'Arabian Sea'
        else:
            region = 'Other'
        
        if region not in regions:
            regions[region] = []
        regions[region].append(f)
    
    # Calculate total FRP
    total_frp = sum(f.get('fire_radiative_power', 0) for f in classified)
    
    return {
        'totalDetections': len(classified),
        'classified': classified,
        'hotspots': hotspots,
        'byRegion': {k: len(v) for k, v in regions.items()},
        'byType': fire_types,
        'totalFirePower': round(total_frp, 1),
        'timestamp': datetime.now().isoformat()
    }

# ============================================================================
# MAIN PROCESSING
# ============================================================================

def get_thermal_data(api_key: Optional[str] = None) -> Dict:
    """Get thermal/fire data from NASA FIRMS or mock."""
    if api_key and api_key != 'DEMO_KEY':
        viirs_fires = fetch_viirs_fires(api_key)
        modis_fires = fetch_modis_fires(api_key)
        all_fires = viirs_fires + modis_fires
    else:
        all_fires = generate_mock_fires()
    
    return analyze_fires(all_fires)

# ============================================================================
# FLASK API
# ============================================================================

def lambda_handler(event, context):
    """AWS Lambda / Vercel handler."""
    from flask import jsonify, request
    
    api_key = request.args.get('api_key', 'DEMO_KEY')
    source = request.args.get('source', 'all')  # viirs, modis, or all
    
    if source == 'viirs':
        fires = fetch_viirs_fires(api_key)
    elif source == 'modis':
        fires = fetch_modis_fires(api_key)
    else:
        fires = generate_mock_fires()  # Mixed for demo
    
    result = analyze_fires(fires)
    
    return jsonify(result)
