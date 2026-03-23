# ============================================================================
# ARGUS - Entity Resolution & Threat Scoring Engine
# All-seeing intelligence layer for Gulf Watch
# ============================================================================

import re
import json
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
from collections import defaultdict

# ============================================================================
# ENTITY CANONICALIZATION
# ============================================================================

def normalize_name(name: str) -> str:
    """Normalize entity name for comparison."""
    return re.sub(r'[^a-z0-9\s]', '', name.lower()).replace('  ', ' ').strip()

def similarity(a: str, b: str) -> float:
    """Calculate similarity between two names."""
    na = normalize_name(a)
    nb = normalize_name(b)
    if na == nb:
        return 1.0
    if na.includes(nb) or nb.includes(na):
        return 0.8
    # Levenshtein approximation
    longer = na if len(na) > len(nb) else nb
    shorter = nb if len(na) > len(nb) else na
    if len(longer) == 0:
        return 1.0
    diff = len(longer) - len(shorter)
    return max(0, 1 - diff / len(longer) * 0.5)

# ============================================================================
# COUNTRY DATA
# ============================================================================

COUNTRY_NAMES = {
    'IR': 'Iran', 'IQ': 'Iraq', 'SA': 'Saudi Arabia', 'AE': 'UAE',
    'YE': 'Yemen', 'SY': 'Syria', 'IL': 'Israel', 'JO': 'Jordan',
    'LB': 'Lebanon', 'KW': 'Kuwait', 'QA': 'Qatar', 'BH': 'Bahrain',
    'OM': 'Oman', 'EG': 'Egypt', 'TR': 'Turkey', 'US': 'United States',
    'RU': 'Russia', 'CN': 'China', 'GB': 'United Kingdom', 'FR': 'France',
    'DE': 'Germany', 'PK': 'Pakistan', 'AF': 'Afghanistan'
}

REGIONAL_THREATS = {
    'IR': {'score': 85, 'level': 'critical', 'factors': ['Nuclear program', 'Ballistic missiles', 'Proxy forces']},
    'YE': {'score': 78, 'level': 'high', 'factors': ['Houthi attacks', 'Civil war', 'Humanitarian crisis']},
    'SY': {'score': 72, 'level': 'high', 'factors': ['Civil war', 'ISIS remnants', 'Foreign occupation']},
    'IQ': {'score': 65, 'level': 'high', 'factors': ['Political instability', 'ISIS cells', 'Iranian influence']},
    'LB': {'score': 58, 'level': 'medium', 'factors': ['Economic collapse', 'Hezbollah', 'Political deadlock']},
    'IL': {'score': 90, 'level': 'critical', 'factors': [' Gaza conflict', 'Iranian threats', 'Regional isolation']},
    'SA': {'score': 45, 'level': 'medium', 'factors': ['Yemen war', 'Regional rivalry', 'Economic reforms']},
    'AE': {'score': 35, 'level': 'low', 'factors': ['Regional diplomacy', 'Economic hub', 'Stable']},
}

# ============================================================================
# ORGANIZATION DATABASE
# ============================================================================

KNOWN_ORGANIZATIONS = {
    'IRGC': 'Islamic Revolutionary Guard Corps', 'Quds': 'Quds Force',
    'Houthis': 'Ansar Allah (Houthis)', 'Hezbollah': 'Hezbollah',
    'ISIS': 'Islamic State', 'Al-Qaeda': 'Al-Qaeda',
    'ISIS-K': 'ISIS-Khorasan', 'Taliban': 'Taliban',
    'PLO': 'Palestine Liberation Organization', 'PA': 'Palestinian Authority',
    'Mosad': 'Mossad', 'CIA': 'CIA', 'MI6': 'MI6',
    'GID': 'General Intelligence Directorate', 'Mukhabarat': 'Mukhabarat',
    'Coalition': 'Coalition Forces', 'US Navy': 'US Navy',
    'IRAF': 'Islamic Republic Air Force', 'SyAAF': 'Syrian Arab Air Force',
    'RSAF': 'Royal Saudi Air Force', 'UAE Air Force': 'UAE Air Force',
}

# ============================================================================
# ENTITY EXTRACTION
# ============================================================================

def extract_entities_from_event(event: Dict) -> List[Dict]:
    """Extract entities from an event."""
    entities = []
    
    # Extract country
    countries = event.get('countries', [])
    for code in countries:
        name = COUNTRY_NAMES.get(code, code)
        entities.append({
            'id': f'country_{code}',
            'canonicalName': name,
            'type': 'nation',
            'country': code,
            'aliases': [name, code]
        })
    
    # Extract organizations from title
    title = event.get('title', '')
    for org_code, org_name in KNOWN_ORGANIZATIONS.items():
        if org_code.lower() in title.lower():
            entities.append({
                'id': f'org_{org_code.lower()}',
                'canonicalName': org_name,
                'type': 'organization',
                'aliases': [org_code, org_name]
            })
    
    return entities

def canonicalize_entities(entities: List[Dict]) -> List[Dict]:
    """Group similar entities into canonical forms."""
    canonical = {}
    
    for entity in entities:
        canonical_id = entity['id']
        if canonical_id not in canonical:
            canonical[canonical_id] = {
                **entity,
                'aliases': set(entity.get('aliases', [entity['canonicalName']])),
                'eventCount': 0,
                'linkedEntities': []
            }
        canonical[canonical_id]['eventCount'] += 1
        canonical[canonical_id]['aliases'].update(entity.get('aliases', []))
    
    # Convert sets to lists
    for eid in canonical:
        canonical[eid]['aliases'] = list(canonical[eid]['aliases'])
    
    return list(canonical.values())

# ============================================================================
# THREAT SCORING
# ============================================================================

def calculate_country_threat(country_code: str, events: List[Dict]) -> Dict:
    """Calculate threat score for a country."""
    base = REGIONAL_THREATS.get(country_code, {'score': 30, 'level': 'low', 'factors': []})
    
    # Adjust based on recent events
    recent_events = [e for e in events if country_code in e.get('countries', [])]
    
    # Count high-severity events
    critical_count = sum(1 for e in recent_events if e.get('severity') == 'critical')
    high_count = sum(1 for e in recent_events if e.get('severity') == 'high')
    
    score = base['score'] + (critical_count * 5) + (high_count * 2)
    score = min(100, score)
    
    if score >= 80:
        level = 'critical'
    elif score >= 60:
        level = 'high'
    elif score >= 40:
        level = 'medium'
    else:
        level = 'low'
    
    return {
        'code': country_code,
        'name': COUNTRY_NAMES.get(country_code, country_code),
        'threat': {
            'overall': score,
            'level': level,
            'factors': base['factors'],
            'trend': 'increasing' if critical_count > 2 else 'stable'
        }
    }

def get_country_threats(events: List[Dict], limit: int = 10) -> List[Dict]:
    """Get threat scores for all countries in events."""
    country_codes = set()
    for event in events:
        country_codes.update(event.get('countries', []))
    
    threats = []
    for code in country_codes:
        threat = calculate_country_threat(code, events)
        threats.append(threat)
    
    # Sort by threat score
    threats.sort(key=lambda x: x['threat']['overall'], reverse=True)
    return threats[:limit]

# ============================================================================
# MAIN PROCESSING
# ============================================================================

def process_events(events: List[Dict]) -> Dict:
    """Process events through Argus engine."""
    all_entities = []
    for event in events:
        all_entities.extend(extract_entities_from_event(event))
    
    canonical_entities = canonicalize_entities(all_entities)
    country_threats = get_country_threats(events)
    
    return {
        'entities': canonical_entities,
        'countryThreats': country_threats,
        'summary': {
            'totalEntities': len(canonical_entities),
            'totalCountries': len(country_threats),
            'criticalThreats': sum(1 for t in country_threats if t['threat']['level'] == 'critical')
        }
    }

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
    
    # Get query params
    limit = int(request.args.get('limit', 50))
    country = request.args.get('country', None)
    
    # Filter
    filtered = incidents[:limit]
    if country:
        filtered = [i for i in filtered if country in i.get('countries', [])]
    
    # Process
    result = process_events(filtered)
    
    return jsonify(result)
