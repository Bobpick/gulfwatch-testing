# ============================================================================
# CHATTER - Social Media & News Intelligence
# Sentiment analysis and trend detection
# ============================================================================

import json
from datetime import datetime, timedelta
from typing import List, Dict, Any
from collections import Counter

# ============================================================================
# SENTIMENT ANALYSIS
# ============================================================================

POSITIVE_WORDS = {'victory', 'success', 'peace', 'deal', 'agreement', 'alliance', 'support', 'strong', 'win', 'advance', 'achievement', 'celebration', 'historic', 'cooperation', 'collaboration', 'partnership', 'stability', 'progress', 'development', 'growth', 'prosperity', 'security', 'defense', 'protection', 'victory', 'triumph', 'liberation'}
NEGATIVE_WORDS = {'attack', 'threat', 'war', 'crisis', 'conflict', 'death', 'killed', 'destroyed', 'terrorism', 'explosion', 'missile', 'drone', 'strike', 'violence', 'terror', 'warning', 'alert', 'emergency', 'disaster', 'tragedy', 'casualties', 'injured', 'detained', 'arrested', 'sanctions', 'condemn', 'rejected'}
CRITICAL_WORDS = {'nuclear', 'ballistic', 'missile', 'launch', 'weapon', 'military', 'army', 'navy', 'air force', 'corvette', 'frigate', 'destroyer', 'submarine', 'aircraft carrier', 'drone', 'uav', 'rocket', 'artillery', 'tank', 'soldier', 'troops', 'warfighter'}

def analyze_sentiment(text: str) -> Dict[str, Any]:
    """Analyze sentiment of text."""
    text_lower = text.lower()
    words = set(text_lower.split())
    
    positive = len(words & POSITIVE_WORDS)
    negative = len(words & NEGATIVE_WORDS)
    critical = len(words & CRITICAL_WORDS)
    
    # Calculate scores
    sentiment_score = (positive - negative) / max(1, len(words)) * 100
    critical_score = critical * 10
    
    # Sentiment
    if sentiment_score > 10:
        sentiment = 'positive'
    elif sentiment_score < -10:
        sentiment = 'negative'
    else:
        sentiment = 'neutral'
    
    return {
        'sentiment': sentiment,
        'sentimentScore': round(sentiment_score, 1),
        'criticalScore': min(100, critical_score),
        'positiveTerms': list(words & POSITIVE_WORDS),
        'negativeTerms': list(words & NEGATIVE_WORDS),
        'criticalTerms': list(words & CRITICAL_WORDS)
    }

# ============================================================================
# TREND DETECTION
# ============================================================================

def detect_trends(events: List[Dict], window_days: int = 7) -> List[Dict]:
    """Detect trending topics from events."""
    # Extract keywords
    all_keywords = []
    for event in events:
        title = event.get('title', '').lower()
        words = [w for w in title.split() if len(w) > 4]
        all_keywords.extend(words)
    
    # Count frequencies
    keyword_counts = Counter(all_keywords)
    
    # Get top trending
    trends = []
    for keyword, count in keyword_counts.most_common(20):
        if count >= 2:
            trends.append({
                'keyword': keyword,
                'count': count,
                'velocity': 'accelerating' if count > 5 else 'stable'
            })
    
    return trends

# ============================================================================
# SOURCE RELIABILITY
# ============================================================================

OFFICIAL_SOURCES = {
    'IRNA': {'country': 'IR', 'reliability': 0.6, 'bias': 'pro-government'},
    'PressTV': {'country': 'IR', 'reliability': 0.5, 'bias': 'pro-government'},
    'Al Jazeera': {'country': 'QA', 'reliability': 0.8, 'bias': 'neutral'},
    'Al Arabiya': {'country': 'SA', 'reliability': 0.8, 'bias': 'pro-government'},
    'Reuters': {'country': 'GB', 'reliability': 0.95, 'bias': 'neutral'},
    'AP': {'country': 'US', 'reliability': 0.95, 'bias': 'neutral'},
    'AFP': {'country': 'FR', 'reliability': 0.9, 'bias': 'neutral'},
    'MEE': {'country': 'UK', 'reliability': 0.75, 'bias': 'neutral'},
    'Twitter': {'country': 'US', 'reliability': 0.4, 'bias': 'mixed'},
    'Telegram': {'country': 'RU', 'reliability': 0.5, 'bias': 'mixed'},
    'ISNA': {'country': 'IR', 'reliability': 0.6, 'bias': 'pro-government'},
}

def assess_source_reliability(source: str) -> Dict:
    """Assess reliability of a news source."""
    source_info = OFFICIAL_SOURCES.get(source, {'country': 'unknown', 'reliability': 0.5, 'bias': 'unknown'})
    return {
        'source': source,
        'reliability': source_info['reliability'],
        'bias': source_info['bias'],
        'country': source_info['country']
    }

# ============================================================================
# HASHTAG EXTRACTION
# ============================================================================

def extract_hashtags(text: str) -> List[str]:
    """Extract hashtags from text."""
    import re
    return re.findall(r'#(\w+)', text)

# ============================================================================
# MAIN PROCESSING
# ============================================================================

def process_social_intelligence(events: List[Dict]) -> Dict:
    """Process events for social media intelligence."""
    sentiments = []
    sources = []
    all_hashtags = []
    
    for event in events:
        # Analyze sentiment
        title = event.get('title', '')
        sentiment = analyze_sentiment(title)
        sentiments.append({**event, 'sentiment': sentiment})
        
        # Assess source
        source = event.get('source', 'Unknown')
        source_info = assess_source_reliability(source)
        sources.append(source_info)
        
        # Extract hashtags
        hashtags = extract_hashtags(event.get('description', ''))
        all_hashtags.extend(hashtags)
    
    # Aggregate
    sentiment_dist = {
        'positive': sum(1 for s in sentiments if s['sentiment']['sentiment'] == 'positive'),
        'negative': sum(1 for s in sentiments if s['sentiment']['sentiment'] == 'negative'),
        'neutral': sum(1 for s in sentiments if s['sentiment']['sentiment'] == 'neutral')
    }
    
    # Source distribution
    source_dist = Counter(s['source'] for s in sources)
    
    # Trending hashtags
    hashtag_counts = Counter(all_hashtags)
    trending_hashtags = [{'tag': tag, 'count': count} for tag, count in hashtag_counts.most_common(10)]
    
    # Detect trends
    trends = detect_trends(events)
    
    return {
        'totalAnalyzed': len(events),
        'sentimentDistribution': sentiment_dist,
        'topSources': dict(source_dist.most_common(10)),
        'trendingHashtags': trending_hashtags,
        'trends': trends[:10],
        'criticalEvents': [e for e in events if e.get('severity') == 'critical'][:5],
        'alerts': [s for s in sentiments if s['sentiment']['criticalScore'] > 50][:10]
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
    sentiment = request.args.get('sentiment', None)
    
    # Filter
    filtered = incidents[:limit]
    
    # Process
    result = process_social_intelligence(filtered)
    
    # Filter by sentiment if requested
    if sentiment:
        filtered_events = [e for e in result.get('alerts', []) if e['sentiment']['sentiment'] == sentiment]
        result['filteredAlerts'] = filtered_events
    
    return jsonify(result)
