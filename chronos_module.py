# ============================================================================
# CHRONOS - Temporal Change Detection
# Time-series analysis for thermal and event data
# ============================================================================

import json
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
from collections import defaultdict

# ============================================================================
# TEMPORAL ANALYSIS
# ============================================================================

def aggregate_by_time(events: List[Dict], bucket: str = 'day') -> Dict:
    """Aggregate events by time bucket."""
    buckets = defaultdict(list)
    
    for event in events:
        date_str = event.get('created_at', event.get('date', ''))
        try:
            dt = datetime.fromisoformat(date_str.replace('Z', '+00:00'))
        except:
            dt = datetime.now()
        
        if bucket == 'hour':
            key = dt.strftime('%Y-%m-%d %H:00')
        elif bucket == 'day':
            key = dt.strftime('%Y-%m-%d')
        elif bucket == 'week':
            key = dt.strftime('%Y-W%U')
        else:
            key = dt.strftime('%Y-%m-%d')
        
        buckets[key].append(event)
    
    return dict(buckets)

def detect_anomalies(events: List[Dict], threshold: float = 2.0) -> List[Dict]:
    """Detect anomalous event clusters."""
    if len(events) < 3:
        return []
    
    # Get counts per day
    daily_counts = defaultdict(int)
    for event in events:
        date_str = event.get('created_at', event.get('date', ''))[:10]
        daily_counts[date_str] += 1
    
    values = list(daily_counts.values())
    if not values:
        return []
    
    # Calculate mean and std
    mean = sum(values) / len(values)
    variance = sum((v - mean) ** 2 for v in values) / len(values)
    std = math.sqrt(variance) if variance > 0 else 1
    
    # Find anomalies
    anomalies = []
    for date, count in daily_counts.items():
        z_score = (count - mean) / std if std > 0 else 0
        if abs(z_score) > threshold:
            anomalies.append({
                'date': date,
                'count': count,
                'zScore': round(z_score, 2),
                'severity': 'critical' if abs(z_score) > 3 else 'high'
            })
    
    return anomalies

# ============================================================================
# CHANGE DETECTION
# ============================================================================

def detect_change(current: List[Dict], previous: List[Dict], threshold: float = 0.2) -> Dict:
    """Detect changes between two time periods."""
    # Group by location
    def get_location(item):
        return (round(item.get('latitude', 0), 1), round(item.get('longitude', 0), 1))
    
    current_locs = set()
    previous_locs = set()
    
    for item in current:
        loc = get_location(item)
        if loc[0] != 0 and loc[1] != 0:
            current_locs.add(loc)
    
    for item in previous:
        loc = get_location(item)
        if loc[0] != 0 and loc[1] != 0:
            previous_locs.add(loc)
    
    # Calculate change
    new_locs = current_locs - previous_locs
    removed_locs = previous_locs - current_locs
    unchanged = current_locs & previous_locs
    
    # Change ratio
    total = len(current_locs | previous_locs)
    change_ratio = (len(new_locs) + len(removed_locs)) / max(1, total)
    
    return {
        'newDetections': len(new_locs),
        'removedDetections': len(removed_locs),
        'unchanged': len(unchanged),
        'changeRatio': round(change_ratio, 3),
        'changeMagnitude': 'significant' if change_ratio > threshold else 'minor',
        'newLocations': [{'lat': lat, 'lon': lon} for lat, lon in list(new_locs)[:10]],
        'removedLocations': [{'lat': lat, 'lon': lon} for lat, lon in list(removed_locs)[:10]]
    }

def calculate_trend(events: List[Dict], days: int = 7) -> Dict:
    """Calculate trend over specified days."""
    cutoff = datetime.now() - timedelta(days=days)
    
    recent = []
    older = []
    
    for event in events:
        date_str = event.get('created_at', event.get('date', ''))
        try:
            dt = datetime.fromisoformat(date_str.replace('Z', '+00:00'))
            if dt >= cutoff:
                recent.append(event)
            else:
                older.append(event)
        except:
            recent.append(event)
    
    # Calculate severity trend
    recent_severity = sum(1 for e in recent if e.get('severity') == 'critical')
    older_severity = sum(1 for e in older if e.get('severity') == 'critical')
    
    if older_severity > 0:
        severity_trend = (recent_severity - older_severity) / older_severity * 100
    else:
        severity_trend = 100 if recent_severity > 0 else 0
    
    return {
        'recentCount': len(recent),
        'olderCount': len(older),
        'severityTrend': round(severity_trend, 1),
        'trendDirection': 'increasing' if severity_trend > 10 else 'decreasing' if severity_trend < -10 else 'stable',
        'criticalEventsRecent': recent_severity
    }

# ============================================================================
# TIME SERIES ANALYSIS
# ============================================================================

def generate_time_series(events: List[Dict], days: int = 30) -> List[Dict]:
    """Generate time series data for visualization."""
    cutoff = datetime.now() - timedelta(days=days)
    
    # Initialize buckets
    buckets = defaultdict(lambda: {'total': 0, 'critical': 0, 'high': 0, 'medium': 0, 'low': 0})
    
    for event in events:
        date_str = event.get('created_at', event.get('date', ''))
        try:
            dt = datetime.fromisoformat(date_str.replace('Z', '+00:00'))
            if dt >= cutoff:
                bucket_key = dt.strftime('%Y-%m-%d')
            else:
                continue
        except:
            continue
        
        buckets[bucket_key]['total'] += 1
        severity = event.get('severity', 'medium')
        buckets[bucket_key][severity] += 1
    
    # Convert to sorted list
    time_series = []
    for date in sorted(buckets.keys()):
        time_series.append({
            'date': date,
            **buckets[date]
        })
    
    return time_series

# ============================================================================
# THERMAL CHANGE DETECTION
# ============================================================================

def detect_thermal_changes(current_fires: List[Dict], previous_fires: List[Dict]) -> Dict:
    """Detect changes in thermal/fire patterns."""
    change = detect_change(current_fires, previous_fires)
    
    # Calculate intensity change
    current_avg_frp = sum(f.get('fire_radiative_power', 0) for f in current_fires) / max(1, len(current_fires))
    previous_avg_frp = sum(f.get('fire_radiative_power', 0) for f in previous_fires) / max(1, len(previous_fires))
    
    frp_change = ((current_avg_frp - previous_avg_frp) / max(1, previous_avg_frp)) * 100 if previous_avg_frp > 0 else 100
    
    # New hotspots
    new_hotspots = [f for f in current_fires if f.get('fire_radiative_power', 0) > 50][:5]
    
    return {
        **change,
        'intensityChange': round(frp_change, 1),
        'newHotspots': new_hotspots,
        'currentCount': len(current_fires),
        'previousCount': len(previous_fires)
    }

# ============================================================================
# MAIN PROCESSING
# ============================================================================

def process_temporal_analysis(events: List[Dict], thermal_data: Optional[List[Dict]] = None) -> Dict:
    """Process all temporal analysis."""
    anomalies = detect_anomalies(events)
    trend = calculate_trend(events)
    time_series = generate_time_series(events)
    aggregated = aggregate_by_time(events, 'day')
    
    result = {
        'anomalies': anomalies,
        'trend': trend,
        'timeSeries': time_series[-30:],  # Last 30 days
        'aggregation': {k: len(v) for k, v in aggregated.items()},
        'summary': {
            'totalEvents': len(events),
            'dateRange': f"{min(aggregated.keys(), default='N/A')} to {max(aggregated.keys(), default='N/A')}",
            'peakDay': max(aggregated.items(), key=lambda x: len(x[1]))[0] if aggregated else None,
            'anomalyDays': len(anomalies)
        }
    }
    
    # Add thermal analysis if available
    if thermal_data:
        result['thermalChanges'] = detect_thermal_changes(thermal_data, [])
    
    return result

# ============================================================================
# FLASK API
# ============================================================================

def lambda_handler(event, context):
    """AWS Lambda / Vercel handler."""
    from flask import jsonify, request
    
    # Load incidents
    try:
        with open('incidents.json', 'r') as f:
            incidents = json.load(f)
    except:
        incidents = []
    
    days = int(request.args.get('days', 7))
    
    result = process_temporal_analysis(incidents)
    
    return jsonify(result)
