// ============================================================================
// INTELLIGENCE FEATURES - Argus, Chatter, Ignite, Chronos, Skyline
// Mock data for immediate functionality
// ============================================================================

// ============================================================================
// MOCK DATA
// ============================================================================

const MOCK_ARGUS_DATA = {
    summary: { totalEntities: 47, totalCountries: 12, criticalThreats: 3 },
    countryThreats: [
        { code: 'IR', name: 'Iran', threat: { overall: 85, level: 'critical', factors: ['Nuclear program', 'Ballistic missiles', 'Proxy forces'], trend: 'increasing' }},
        { code: 'YE', name: 'Yemen', threat: { overall: 78, level: 'high', factors: ['Houthi attacks', 'Civil war'], trend: 'stable' }},
        { code: 'IL', name: 'Israel', threat: { overall: 72, level: 'high', factors: ['Gaza conflict', 'Regional tensions'], trend: 'increasing' }},
        { code: 'SY', name: 'Syria', threat: { overall: 68, level: 'high', factors: ['Civil war', 'ISIS remnants'], trend: 'stable' }},
        { code: 'IQ', name: 'Iraq', threat: { overall: 65, level: 'high', factors: ['Political instability', 'Iranian influence'], trend: 'decreasing' }},
        { code: 'LB', name: 'Lebanon', threat: { overall: 58, level: 'medium', factors: ['Economic collapse', 'Hezbollah'], trend: 'increasing' }},
        { code: 'SA', name: 'Saudi Arabia', threat: { overall: 45, level: 'medium', factors: ['Yemen war', 'Regional rivalry'], trend: 'stable' }},
        { code: 'AE', name: 'UAE', threat: { overall: 35, level: 'low', factors: ['Regional diplomacy', 'Stable'], trend: 'stable' }}
    ],
    entities: [
        { canonicalName: 'IRGC', type: 'military', eventCount: 23 },
        { canonicalName: 'Houthis', type: 'organization', eventCount: 18 },
        { canonicalName: 'Hezbollah', type: 'organization', eventCount: 15 },
        { canonicalName: 'ISIS', type: 'organization', eventCount: 12 },
        { canonicalName: 'Quds Force', type: 'military', eventCount: 9 }
    ]
};

const MOCK_CHATTER_DATA = {
    totalAnalyzed: 156,
    sentimentDistribution: { positive: 23, negative: 89, neutral: 44 },
    topSources: { 'Al Jazeera': 34, 'Reuters': 28, 'Al Arabiya': 21, 'AP': 18, 'AFP': 15 },
    trends: [
        { keyword: 'missile', count: 45, velocity: 'accelerating' },
        { keyword: 'drone', count: 38, velocity: 'accelerating' },
        { keyword: 'sanctions', count: 29, velocity: 'stable' },
        { keyword: 'ceasefire', count: 24, velocity: 'stable' },
        { keyword: 'nuclear', count: 21, velocity: 'accelerating' },
        { keyword: 'troops', count: 18, velocity: 'decreasing' },
        { keyword: 'refinery', count: 15, velocity: 'stable' },
        { keyword: 'port', count: 12, velocity: 'stable' }
    ],
    trendingHashtags: [
        { tag: 'Gaza', count: 156 }, { tag: 'Ukraine', count: 134 }, { tag: 'Iran', count: 98 },
        { tag: 'Missiles', count: 87 }, { tag: 'Oil', count: 76 }
    ],
    alerts: [
        { title: 'Iran announces new missile test in Gulf of Oman', source: 'IRNA', sentiment: { criticalScore: 85 }},
        { title: 'Houthis claim attack on Saudi oil facility', source: 'Al Jazeera', sentiment: { criticalScore: 72 }},
        { title: 'US Navy intercepts Iranian drones in Red Sea', source: 'Reuters', sentiment: { criticalScore: 68 }}
    ]
};

const MOCK_IGNITE_DATA = {
    totalDetections: 42,
    totalFirePower: 847.3,
    byRegion: { 'Gulf': 18, 'Levant': 12, 'Iraq': 8, 'Arabian Sea': 4 },
    byType: { 'industrial_medium': 15, 'wildfire': 12, 'controlled_burn': 10, 'gas_flare': 5 },
    hotspots: [
        { latitude: 29.4, longitude: 47.5, fire_radiative_power: 127.3, satellite: 'VIIRS-NPP', location: 'Kuwait Oil Fields', riskLevel: 'high' },
        { latitude: 30.3, longitude: 48.2, fire_radiative_power: 98.7, satellite: 'VIIRS-NPP', location: 'Iraq South', riskLevel: 'high' },
        { latitude: 26.9, longitude: 50.6, fire_radiative_power: 85.2, satellite: 'MODIS-Aqua', location: 'Saudi Arabia East', riskLevel: 'medium' },
        { latitude: 23.7, longitude: 58.5, fire_radiative_power: 72.1, satellite: 'VIIRS-NPP', location: 'Oman', riskLevel: 'medium' },
        { latitude: 15.2, longitude: 44.0, fire_radiative_power: 65.8, satellite: 'MODIS-Aqua', location: 'Yemen', riskLevel: 'medium' }
    ],
    classified: [
        { latitude: 29.4, longitude: 47.5, fireType: 'industrial_medium', fire_radiative_power: 127.3 },
        { latitude: 30.3, longitude: 48.2, fireType: 'industrial_medium', fire_radiative_power: 98.7 },
        { latitude: 26.9, longitude: 50.6, fireType: 'wildfire', fire_radiative_power: 85.2 },
        { latitude: 23.7, longitude: 58.5, fireType: 'gas_flare', fire_radiative_power: 72.1 },
        { latitude: 15.2, longitude: 44.0, fireType: 'wildfire', fire_radiative_power: 65.8 },
        { latitude: 32.0, longitude: 44.3, fireType: 'industrial_medium', fire_radiative_power: 58.4 },
        { latitude: 34.3, longitude: 36.3, fireType: 'controlled_burn', fire_radiative_power: 45.2 }
    ]
};

const MOCK_CHRONOS_DATA = {
    summary: { totalEvents: 234, anomalyDays: 3, peakDay: '2026-03-20' },
    trend: { recentCount: 67, olderCount: 54, severityTrend: 24.1, trendDirection: 'increasing', criticalEventsRecent: 8 },
    timeSeries: [
        { date: '2026-03-14', total: 12, critical: 2, high: 4, medium: 4, low: 2 },
        { date: '2026-03-15', total: 15, critical: 3, high: 5, medium: 5, low: 2 },
        { date: '2026-03-16', total: 8, critical: 1, high: 2, medium: 3, low: 2 },
        { date: '2026-03-17', total: 18, critical: 4, high: 6, medium: 5, low: 3 },
        { date: '2026-03-18', total: 22, critical: 5, high: 8, medium: 6, low: 3 },
        { date: '2026-03-19', total: 19, critical: 3, high: 7, medium: 6, low: 3 },
        { date: '2026-03-20', total: 28, critical: 6, high: 10, medium: 8, low: 4 },
        { date: '2026-03-21', total: 21, critical: 4, high: 7, medium: 6, low: 4 },
        { date: '2026-03-22', total: 17, critical: 2, high: 6, medium: 5, low: 4 },
        { date: '2026-03-23', total: 14, critical: 2, high: 5, medium: 4, low: 3 }
    ],
    anomalies: [
        { date: '2026-03-20', count: 28, zScore: 3.2, severity: 'critical' },
        { date: '2026-03-18', count: 22, zScore: 2.4, severity: 'high' },
        { date: '2026-03-17', count: 18, zScore: 1.9, severity: 'high' }
    ],
    aggregation: {
        '2026-03-23': 14, '2026-03-22': 17, '2026-03-21': 21, '2026-03-20': 28,
        '2026-03-19': 19, '2026-03-18': 22, '2026-03-17': 18
    }
};

const MOCK_SKYLINE_DATA = {
    summary: { overallRiskScore: 42, severeRegions: 0, highRiskRegions: 2, operationalReadiness: 'normal' },
    regions: {
        gulf_central: { name: 'Central Gulf', temperature: 32.5, humidity: 65, windSpeed: 18, windDirection: 'NW', visibility: 15, condition: 'clear' },
        gulf_north: { name: 'Northern Gulf', temperature: 28.3, humidity: 72, windSpeed: 22, windDirection: 'N', visibility: 12, condition: 'partly_cloudy' },
        gulf_south: { name: 'Gulf of Oman', temperature: 30.1, humidity: 68, windSpeed: 15, windDirection: 'E', visibility: 18, condition: 'clear' },
        arabian_sea: { name: 'Arabian Sea', temperature: 29.8, humidity: 75, windSpeed: 25, windDirection: 'SW', visibility: 10, condition: 'dust' },
        levant: { name: 'Levant Coast', temperature: 24.2, humidity: 58, windSpeed: 12, windDirection: 'W', visibility: 20, condition: 'clear' },
        mesopotamia: { name: 'Mesopotamia', temperature: 31.5, humidity: 42, windSpeed: 28, windDirection: 'NW', visibility: 8, condition: 'dust' }
    },
    impacts: {
        gulf_central: { overallScore: 25, impactLevel: 'minimal', factors: ['All operations nominal'] },
        gulf_north: { overallScore: 35, impactLevel: 'moderate', factors: ['Moderate winds - drone operations affected'] },
        gulf_south: { overallScore: 20, impactLevel: 'minimal', factors: ['All operations nominal'] },
        arabian_sea: { overallScore: 55, impactLevel: 'moderate', factors: ['Dust - reduced visibility', 'Equipment wear'] },
        levant: { overallScore: 15, impactLevel: 'minimal', factors: ['All operations nominal'] },
        mesopotamia: { overallScore: 60, impactLevel: 'high', factors: ['High winds - aircraft instability risk', 'Dust - reduced visibility'] }
    },
    maritime: {
        persian_gulf: { name: 'Persian Gulf', seaState: 3, waveHeight: 1.5, windSpeed: 22, seaTemperature: 26.5 },
        gulf_of_oman: { name: 'Gulf of Oman', seaState: 2, waveHeight: 0.8, windSpeed: 15, seaTemperature: 27.2 },
        arabian_sea: { name: 'Arabian Sea', seaState: 4, waveHeight: 2.5, windSpeed: 28, seaTemperature: 28.1 }
    }
};

// ============================================================================
// ARGUS - Entity Resolution & Threat Intelligence
// ============================================================================

window.loadArgus = function() {
    const container = document.getElementById('argus-content');
    if (!container) return;

    const data = MOCK_ARGUS_DATA;
    
    container.innerHTML = `
        <div class="argus-grid">
            <div class="argus-summary">
                <div class="summary-card">
                    <div class="summary-value">${data.summary.totalEntities}</div>
                    <div class="summary-label">Total Entities</div>
                </div>
                <div class="summary-card">
                    <div class="summary-value">${data.summary.totalCountries}</div>
                    <div class="summary-label">Countries</div>
                </div>
                <div class="summary-card critical">
                    <div class="summary-value">${data.summary.criticalThreats}</div>
                    <div class="summary-label">Critical Threats</div>
                </div>
            </div>

            <div class="argus-section">
                <h3>⊙ Country Threat Analysis</h3>
                <div class="threat-list">
                    ${data.countryThreats.map(country => `
                        <div class="threat-item ${country.threat.level}">
                            <div class="threat-country">${country.name}</div>
                            <div class="threat-score">
                                <div class="threat-bar">
                                    <div class="threat-fill" style="width: ${country.threat.overall}%"></div>
                                </div>
                                <span class="threat-value">${country.threat.overall}</span>
                            </div>
                            <div class="threat-level ${country.threat.level}">${country.threat.level.toUpperCase()}</div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="argus-section">
                <h3>◎ Key Entities</h3>
                <div class="entity-list">
                    ${data.entities.map(entity => `
                        <div class="entity-item">
                            <div class="entity-name">${entity.canonicalName}</div>
                            <div class="entity-type">${entity.type}</div>
                            <div class="entity-count">${entity.eventCount} events</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

// ============================================================================
// CHATTER - Social Media & News Intelligence
// ============================================================================

window.loadChatter = function() {
    const container = document.getElementById('chatter-content');
    if (!container) return;

    const data = MOCK_CHATTER_DATA;
    
    container.innerHTML = `
        <div class="chatter-grid">
            <div class="chatter-section">
                <h3>⇌ Sentiment Analysis</h3>
                <div class="sentiment-overview">
                    <div class="sentiment-stats">
                        <div class="sentiment-stat positive">
                            <div class="sentiment-icon">↑</div>
                            <div class="sentiment-value">${data.sentimentDistribution.positive}</div>
                            <div class="sentiment-label">Positive</div>
                        </div>
                        <div class="sentiment-stat neutral">
                            <div class="sentiment-icon">→</div>
                            <div class="sentiment-value">${data.sentimentDistribution.neutral}</div>
                            <div class="sentiment-label">Neutral</div>
                        </div>
                        <div class="sentiment-stat negative">
                            <div class="sentiment-icon">↓</div>
                            <div class="sentiment-value">${data.sentimentDistribution.negative}</div>
                            <div class="sentiment-label">Negative</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="chatter-section">
                <h3>◉ Trending Topics</h3>
                <div class="trending-list">
                    ${data.trends.map((trend, i) => `
                        <div class="trending-item">
                            <div class="trending-rank">${i + 1}</div>
                            <div class="trending-content">
                                <div class="trending-keyword">${trend.keyword}</div>
                                <div class="trending-count">${trend.count} mentions</div>
                            </div>
                            <div class="trending-velocity ${trend.velocity}">${trend.velocity}</div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="chatter-section">
                <h3>◎ Source Distribution</h3>
                <div class="source-distribution">
                    ${Object.entries(data.topSources).map(([source, count]) => `
                        <div class="source-item">
                            <div class="source-name">${source}</div>
                            <div class="source-bar">
                                <div class="source-fill" style="width: ${(count / data.totalAnalyzed * 100)}%"></div>
                            </div>
                            <div class="source-count">${count}</div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="chatter-section">
                <h3># Trending Hashtags</h3>
                <div class="hashtags-cloud">
                    ${data.trendingHashtags.map(h => `
                        <span class="hashtag">#${h.tag} <span class="hashtag-count">${h.count}</span></span>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

// ============================================================================
// IGNITE - NASA FIRMS Thermal Detection
// ============================================================================

window.loadIgnite = function() {
    const container = document.getElementById('ignite-content');
    if (!container) return;

    const data = MOCK_IGNITE_DATA;
    
    container.innerHTML = `
        <div class="ignite-grid">
            <div class="ignite-summary">
                <div class="ignite-stat">
                    <div class="ignite-value">${data.totalDetections}</div>
                    <div class="ignite-label">Thermal Detections</div>
                </div>
                <div class="ignite-stat">
                    <div class="ignite-value">${data.totalFirePower} MW</div>
                    <div class="ignite-label">Total Fire Power</div>
                </div>
                <div class="ignite-stat">
                    <div class="ignite-value">${Object.keys(data.byRegion).length}</div>
                    <div class="ignite-label">Active Regions</div>
                </div>
            </div>

            <div class="ignite-section">
                <h3>◈ Fire Type Analysis</h3>
                <div class="fire-types">
                    ${Object.entries(data.byType).map(([type, count]) => `
                        <div class="fire-type-item">
                            <div class="fire-type-name">${type.replace(/_/g, ' ')}</div>
                            <div class="fire-type-count">${count}</div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="ignite-section">
                <h3>⌖ Regional Distribution</h3>
                <div class="region-grid">
                    ${Object.entries(data.byRegion).map(([region, count]) => `
                        <div class="region-item">
                            <div class="region-name">${region}</div>
                            <div class="region-count">${count}</div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="ignite-section">
                <h3>⊙ Top Hotspots</h3>
                <div class="hotspots-list">
                    ${data.hotspots.map((hotspot, i) => `
                        <div class="hotspot-item">
                            <div class="hotspot-rank">${i + 1}</div>
                            <div class="hotspot-info">
                                <div class="hotspot-location">${hotspot.location}</div>
                                <div class="hotspot-meta">
                                    <span>FRP: ${hotspot.fire_radiative_power.toFixed(1)} MW</span>
                                    <span>${hotspot.satellite}</span>
                                </div>
                            </div>
                            <div class="hotspot-risk ${hotspot.riskLevel}">${hotspot.riskLevel.toUpperCase()}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

// ============================================================================
// CHRONOS - Temporal Change Detection
// ============================================================================

window.loadChronos = function() {
    const container = document.getElementById('chronos-content');
    if (!container) return;

    const data = MOCK_CHRONOS_DATA;
    
    container.innerHTML = `
        <div class="chronos-grid">
            <div class="chronos-summary">
                <div class="chronos-stat">
                    <div class="chronos-value">${data.summary.totalEvents}</div>
                    <div class="chronos-label">Total Events</div>
                </div>
                <div class="chronos-stat">
                    <div class="chronos-value">${data.summary.anomalyDays}</div>
                    <div class="chronos-label">Anomaly Days</div>
                </div>
                <div class="chronos-stat">
                    <div class="chronos-value">${data.summary.peakDay}</div>
                    <div class="chronos-label">Peak Day</div>
                </div>
            </div>

            <div class="chronos-section">
                <h3>◷ Event Trend</h3>
                <div class="trend-display">
                    <div class="trend-direction ${data.trend.trendDirection}">
                        ${data.trend.trendDirection === 'increasing' ? '↑' : data.trend.trendDirection === 'decreasing' ? '↓' : '→'}
                    </div>
                    <div class="trend-stats">
                        <div class="trend-item">
                            <span class="trend-label">Recent:</span>
                            <span class="trend-value">${data.trend.recentCount}</span>
                        </div>
                        <div class="trend-item">
                            <span class="trend-label">Severity Trend:</span>
                            <span class="trend-value">${data.trend.severityTrend}%</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="chronos-section">
                <h3>⏱ Time Series</h3>
                <div class="timeseries-chart">
                    ${data.timeSeries.map(ts => `
                        <div class="timeseries-bar-container">
                            <div class="timeseries-bar" style="height: ${Math.min(100, (ts.total / 5))}%"></div>
                            <div class="timeseries-date">${ts.date.slice(5)}</div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="chronos-section">
                <h3>⚠ Detected Anomalies</h3>
                <div class="anomalies-list">
                    ${data.anomalies.map(a => `
                        <div class="anomaly-item ${a.severity}">
                            <div class="anomaly-date">${a.date}</div>
                            <div class="anomaly-count">${a.count} events</div>
                            <div class="anomaly-zscore">Z: ${a.zScore}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

// ============================================================================
// SKYLINE - Weather Intelligence
// ============================================================================

window.loadSkyline = function() {
    const container = document.getElementById('skyline-content');
    if (!container) return;

    const data = MOCK_SKYLINE_DATA;
    
    container.innerHTML = `
        <div class="skyline-grid">
            <div class="skyline-summary">
                <div class="skyline-stat">
                    <div class="skyline-value ${data.summary.operationalReadiness === 'degraded' ? 'warning' : ''}">${data.summary.operationalReadiness.toUpperCase()}</div>
                    <div class="skyline-label">Operational Readiness</div>
                </div>
                <div class="skyline-stat">
                    <div class="skyline-value">${data.summary.overallRiskScore}</div>
                    <div class="skyline-label">Risk Score</div>
                </div>
                <div class="skyline-stat">
                    <div class="skyline-value critical">${data.summary.highRiskRegions}</div>
                    <div class="skyline-label">High Risk Regions</div>
                </div>
            </div>

            <div class="skyline-section">
                <h3>⛅ Regional Weather</h3>
                <div class="weather-grid">
                    ${Object.entries(data.regions).map(([regionId, weather]) => `
                        <div class="weather-card ${data.impacts[regionId]?.impactLevel || ''}">
                            <div class="weather-header">
                                <div class="weather-region">${weather.name}</div>
                                <div class="weather-condition">${weather.condition.replace(/_/g, ' ')}</div>
                            </div>
                            <div class="weather-stats">
                                <div class="weather-stat">
                                    <span class="weather-label">Temp</span>
                                    <span class="weather-value">${weather.temperature}°C</span>
                                </div>
                                <div class="weather-stat">
                                    <span class="weather-label">Wind</span>
                                    <span class="weather-value">${weather.windSpeed} km/h ${weather.windDirection}</span>
                                </div>
                                <div class="weather-stat">
                                    <span class="weather-label">Humidity</span>
                                    <span class="weather-value">${weather.humidity}%</span>
                                </div>
                                <div class="weather-stat">
                                    <span class="weather-label">Visibility</span>
                                    <span class="weather-value">${weather.visibility} km</span>
                                </div>
                            </div>
                            ${data.impacts[regionId] ? `
                                <div class="weather-impact ${data.impacts[regionId].impactLevel}">
                                    Impact: ${data.impacts[regionId].impactLevel.toUpperCase()}
                                </div>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="skyline-section">
                <h3>⚓ Maritime Conditions</h3>
                <div class="maritime-grid">
                    ${Object.entries(data.maritime).map(([areaId, mw]) => `
                        <div class="maritime-card">
                            <div class="maritime-header">${mw.name}</div>
                            <div class="maritime-stats">
                                <div>Sea State: ${mw.seaState}</div>
                                <div>Waves: ${mw.waveHeight}m</div>
                                <div>Wind: ${mw.windSpeed} km/h</div>
                                <div>Sea Temp: ${mw.seaTemperature}°C</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

// ============================================================================
// INITIALIZATION
// ============================================================================

// Intelligence loaders mapping
const intelligenceLoaders = {
    'argus': window.loadArgus,
    'chatter': window.loadChatter,
    'ignite': window.loadIgnite,
    'chronos': window.loadChronos,
    'skyline': window.loadSkyline
};

