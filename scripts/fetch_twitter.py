#!/usr/bin/env python3
"""
Gulf Watch Twitter Ingestion
Fetches tweets from official defense/military accounts via Nitter
No API key needed - uses free Nitter instances
"""
import json
import re
import sys
from datetime import datetime, timezone
from typing import List, Dict
import urllib.request
import urllib.error

# Official defense and military accounts to monitor
TWITTER_ACCOUNTS = [
    # UAE
    {"handle": "moiuae", "name": "UAE Ministry of Interior", "country": "UAE", "credibility": 95},
    {"handle": "Gordonmmike", "name": "Mike Gordon (UAE analyst)", "country": "UAE", "credibility": 75},
    
    # Israel
    {"handle": "IDF", "name": "Israel Defense Forces", "country": "Israel", "credibility": 90},
    {"handle": "IsraelROM", "name": "Israel Radio/Defense news", "country": "Israel", "credibility": 80},
    {"handle": "manniefabian", "name": "Manu Fabian (Defense reporter)", "country": "Israel", "credibility": 70},
    
    # Saudi Arabia
    {"handle": "SaudiDCD", "name": "Saudi Civil Defense", "country": "Saudi Arabia", "credibility": 90},
    {"handle": "spa_medien", "name": "Saudi Press Agency", "country": "Saudi Arabia", "credibility": 85},
    
    # Qatar
    {"handle": "MOI_QatarEn", "name": "Qatar Ministry of Interior", "country": "Qatar", "credibility": 90},
    
    # Yemen
    {"handle": "Saberlinux", "name": "Yemen News", "country": "Yemen", "credibility": 60},
    
    # Iran
    {"handle": "aramnews", "name": "Aram News (Iran)", "country": "Iran", "credibility": 65},
    {"handle": "IranPro", "name": "Iran Updates", "country": "Iran", "credibility": 55},
    
    # Regional/Military
    {"handle": "PentagonBuzz", "name": "Pentagon Updates", "country": "US", "credibility": 85},
    {"handle": "Arab_Themi", "name": "Arab Threat Intel", "country": "Regional", "credibility": 70},
]

# Nitter instances (fallbacks if one is down)
NITTER_INSTANCES = [
    "nitter.privacydev.net",
    "nitter.poast.org",
    "nitter.s平行waves.net",
    "nitter.1d4.us",
]

def fetch_tweets_via_nitter(handle: str, instance: str = None) -> List[Dict]:
    """Fetch latest tweets from a Twitter account via Nitter"""
    if instance is None:
        instance = NITTER_INSTANCES[0]
    
    tweets = []
    url = f"https://{instance}/{handle}"
    
    headers = {
        'User-Agent': 'GulfWatch/2.0 (Educational/Research)',
        'Accept': 'application/json'
    }
    
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as response:
            html = response.read().decode('utf-8')
            
            # Parse tweets from HTML
            # Nitter returns HTML with tweet data
            tweet_pattern = r'<a href="/i/status/(\d+)"[^>]*>.*?<div class="tweet-content[^"]*"[^>]*>(.*?)</div>'
            time_pattern = r'<span class="tweet-date"[^>]*><a href[^>]*title="([^"]*)"'
            
            matches = re.findall(tweet_pattern, html, re.DOTALL)
            time_matches = re.findall(time_pattern, html)
            
            for i, (tweet_id, content) in enumerate(matches[:10]):  # Limit to 10 latest
                clean_content = re.sub(r'<[^>]+>', '', content).strip()
                clean_content = re.sub(r'\s+', ' ', clean_content)
                
                tweet_time = time_matches[i] if i < len(time_matches) else ""
                
                tweets.append({
                    'id': tweet_id,
                    'content': clean_content,
                    'time': tweet_time,
                    'account': handle
                })
                
    except Exception as e:
        print(f"⚠️  Error fetching @{handle}: {e}")
    
    return tweets

def parse_tweet_for_threats(tweet: Dict, account_info: Dict) -> Dict:
    """Analyze tweet content for threat indicators"""
    content = tweet['content'].lower()
    
    # Threat keywords
    threat_keywords = [
        'missile', 'attack', 'strike', 'drone', 'explosion', 'alert',
        'security', 'defense', 'military', 'forces', 'aircraft', 'jet',
        'launch', 'intercept', 'defense', 'threat', 'warning', ' sirens',
        'shelling', 'bombing', 'terrorism', 'incident', 'breach', 'infiltration'
    ]
    
    # Check for threat indicators
    found_keywords = [kw for kw in threat_keywords if kw in content]
    
    if found_keywords:
        return {
            'tweet_id': tweet['id'],
            'account': account_info['name'],
            'country': account_info['country'],
            'content': tweet['content'],
            'time': tweet['time'],
            'credibility': account_info['credibility'],
            'threat_indicators': found_keywords,
            'severity': 'high' if len(found_keywords) >= 2 else 'medium'
        }
    
    return None

def main():
    print("🐦 Gulf Watch Twitter Ingestion")
    print("=" * 50)
    
    all_threats = []
    
    for account in TWITTER_ACCOUNTS:
        print(f"\n📱 Checking @{account['handle']}...")
        
        # Try each Nitter instance
        tweets = []
        for instance in NITTER_INSTANCES:
            tweets = fetch_tweets_via_nitter(account['handle'], instance)
            if tweets:
                break
        
        if not tweets:
            print(f"   ⚠️  No tweets fetched from @{account['handle']}")
            continue
        
        # Check for threats
        for tweet in tweets:
            threat = parse_tweet_for_threats(tweet, account)
            if threat:
                all_threats.append(threat)
        
        print(f"   ✅ Checked {len(tweets)} tweets from @{account['handle']}")
    
    # Summary
    print("\n" + "=" * 50)
    print(f"📊 SUMMARY: Found {len(all_threats)} potential threat mentions")
    
    if all_threats:
        print("\n🚨 THREAT ALERTS:")
        for threat in all_threats[:5]:  # Top 5
            print(f"\n[{threat['country']}] {threat['account']}")
            print(f"   Keywords: {', '.join(threat['threat_indicators'])}")
            print(f"   Severity: {threat['severity'].upper()}")
            print(f"   Time: {threat['time']}")
            print(f"   Content: {threat['content'][:100]}...")
    
    # Save to JSON
    output = {
        'generated_at': datetime.now(timezone.utc).isoformat(),
        'accounts_monitored': len(TWITTER_ACCOUNTS),
        'threats_found': len(all_threats),
        'threats': all_threats
    }
    
    with open('public/data/twitter_threats.json', 'w') as f:
        json.dump(output, f, indent=2)
    
    print(f"\n💾 Saved to public/data/twitter_threats.json")
    
    return all_threats

if __name__ == "__main__":
    main()
