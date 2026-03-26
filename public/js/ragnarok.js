/**
 * RAGNAROK — OODA Loop Escalation Timeline Engine
 * Models threat escalation: Detection → Classification → Decision → Action
 * Shows time estimates and bottleneck analysis for defense planners
 */

class RagnarokEngine {
    constructor(incident) {
        this.incident = incident;
        this.phaseDurations = this.calculatePhaseDurations();
        this.bottlenecks = this.identifyBottlenecks();
    }

    /**
     * Calculate typical OODA loop durations by threat type and actor
     */
    calculatePhaseDurations() {
        const type = this.incident.type || '';
        const title = (this.incident.title || '').toLowerCase();
        const severity = this.incident.severity || 'medium';
        
        // Base durations in minutes
        const bases = {
            observe: this.getBaseDuration('observe', type, severity),
            orient: this.getBaseDuration('orient', type, severity),
            decide: this.getBaseDuration('decide', type, severity),
            act: this.getBaseDuration('act', type, severity)
        };

        // Actor-specific modifiers (more sophisticated actors loop faster)
        const actorModifier = this.getActorModifier();
        
        // Threat type modifiers
        const threatModifier = this.getThreatModifier(type, title);

        return {
            observe: Math.round(bases.observe * actorModifier * threatModifier),
            orient: Math.round(bases.orient * actorModifier * threatModifier),
            decide: Math.round(bases.decide * actorModifier * threatModifier),
            act: Math.round(bases.act * actorModifier * threatModifier)
        };
    }

    getBaseDuration(phase, type, severity) {
        // Base durations in minutes for HIGH severity
        const highSeverity = {
            observe: 2,      // Sensor detection
            orient: 5,        // Analysis & classification  
            decide: 15,       // Command decision
            act: 5            // Response execution
        };
        
        const mediumSeverity = {
            observe: 5,
            orient: 15,
            decide: 45,
            act: 15
        };

        const lowSeverity = {
            observe: 15,
            orient: 30,
            decide: 120,
            act: 30
        };

        const bases = severity === 'critical' || severity === 'high' ? highSeverity : 
                      severity === 'low' ? lowSeverity : mediumSeverity;

        return bases[phase];
    }

    getActorModifier() {
        const title = (this.incident.title || '').toLowerCase();
        
        // Faster actors (professional militaries)
        if (/israel|idf|us|usa|american|british|uk|french|france/i.test(title)) {
            return 0.5; // 50% faster
        }
        // Slower actors (non-state, less sophisticated)
        if (/houthi|hezbollah|hamas|isis|isil|iranian|irgc/i.test(title)) {
            return 1.2; // 20% slower
        }
        // Default
        return 1.0;
    }

    getThreatModifier(type, title) {
        // Missile/ballistic = fastest response required
        if (type === 'missile' || /missile|ballistic|rocket/.test(title)) {
            return 0.3; // 70% faster (urgent)
        }
        // Drone = fast
        if (type === 'drone' || /drone|uav/.test(title)) {
            return 0.5;
        }
        // Attack = moderate
        if (type === 'attack' || /attack|strike|raid/.test(title)) {
            return 0.7;
        }
        // Default
        return 1.0;
    }

    /**
     * Identify bottlenecks in the OODA loop
     */
    identifyBottlenecks() {
        const phases = this.phaseDurations;
        const total = this.getTotalDuration();
        const bottlenecks = [];

        // Phase 3 (Decide) is typically the biggest bottleneck
        if (phases.decide > 30) {
            bottlenecks.push({
                phase: 'decide',
                severity: phases.decide > 60 ? 'critical' : 'high',
                issue: 'Command authority delay — multi-level approval required',
                recommendation: 'Pre-authorize response protocols for known threat signatures',
                time: phases.decide
            });
        }

        // Phase 1 (Observe) bottleneck if severity is high
        if (phases.observe > 5) {
            bottlenecks.push({
                phase: 'observe',
                severity: 'medium',
                issue: 'Detection coverage gap — threat entered undetected',
                recommendation: 'Expand sensor network or ADS-B/M雷达 coverage',
                time: phases.observe
            });
        }

        // Phase 4 (Act) bottleneck if large
        if (phases.act > 20) {
            bottlenecks.push({
                phase: 'act',
                severity: phases.act > 30 ? 'high' : 'medium',
                issue: 'Response force not optimally positioned',
                recommendation: 'Pre-position assets or establish faster deployment lanes',
                time: phases.act
            });
        }

        // Phase 2 (Orient) bottleneck
        if (phases.orient > 20) {
            bottlenecks.push({
                phase: 'orient',
                severity: 'medium',
                issue: 'Classification ambiguity — multiple threat vectors possible',
                recommendation: 'Improve AI-assisted threat classification for faster ID',
                time: phases.orient
            });
        }

        return bottlenecks.sort((a, b) => {
            const order = { critical: 0, high: 1, medium: 2 };
            return order[a.severity] - order[b.severity];
        });
    }

    /**
     * Get total OODA loop duration
     */
    getTotalDuration() {
        return Object.values(this.phaseDurations).reduce((a, b) => a + b, 0);
    }

    /**
     * Get escalation stages
     */
    getEscalationStages() {
        const stages = [
            {
                id: 'detection',
                name: 'Detection',
                phase: 'Observe',
                icon: '📡',
                duration: this.phaseDurations.observe,
                description: this.getDetectionDescription(),
                actors: this.getActorsInPhase('observe'),
                data: this.getDetectionData()
            },
            {
                id: 'classification',
                name: 'Classification',
                phase: 'Orient', 
                icon: '🔍',
                duration: this.phaseDurations.orient,
                description: this.getClassificationDescription(),
                actors: this.getActorsInPhase('orient'),
                data: this.getClassificationData()
            },
            {
                id: 'decision',
                name: 'Decision',
                phase: 'Decide',
                icon: '⚖️',
                duration: this.phaseDurations.decide,
                description: this.getDecisionDescription(),
                actors: this.getActorsInPhase('decide'),
                data: this.getDecisionData()
            },
            {
                id: 'action',
                name: 'Action',
                phase: 'Act',
                icon: '🚀',
                duration: this.phaseDurations.act,
                description: this.getActionDescription(),
                actors: this.getActorsInPhase('act'),
                data: this.getActionData()
            }
        ];

        return stages;
    }

    getDetectionDescription() {
        const title = (this.incident.title || '').toLowerCase();
        const type = this.incident.type || '';

        if (/missile|ballistic|rocket/.test(title + type)) {
            return 'IRST/雷达 detected ballistic trajectory. Trajectory analysis initiated.';
        }
        if (/drone|uav/.test(title + type)) {
            return 'Radar/光电 detection of unmanned aerial signature. Tracking established.';
        }
        if (/attack|strike|raid/.test(title + type)) {
            return 'Ground observer or SIGINT reported hostile action. Alert issued.';
        }
        return 'Multi-source detection triggered. Cross-referencing sensor data.';
    }

    getClassificationDescription() {
        const title = (this.incident.title || '').toLowerCase();
        const type = this.incident.type || '';

        if (/houthi/.test(title)) {
            return 'Attribution analysis: Houthi-knownTTPs. Pattern matches previous Red Sea incidents.';
        }
        if (/iran|irgc/.test(title)) {
            return 'Attribution analysis: Iranian-origin capability. Regional threat assessment initiated.';
        }
        if (/israel|idf/.test(title)) {
            return 'Attribution analysis: State actor. Conventional warfare doctrine applies.';
        }
        return 'Threat type identified. Running signature analysis against known threat profiles.';
    }

    getDecisionDescription() {
        const severity = this.incident.severity || 'medium';
        
        if (severity === 'critical') {
            return 'Emergency authorization. Theater commander has pre-approved response protocols.';
        }
        if (severity === 'high') {
            return 'Rapid approval chain. Joint operations center coordinating response.';
        }
        return 'Standard ROE evaluation. Legal and political considerations being assessed.';
    }

    getActionDescription() {
        const title = (this.incident.title || '').toLowerCase();
        const type = this.incident.type || '';

        if (/intercept|air.defense|missile/.test(title + type)) {
            return 'Air defense assets engaged. Interceptor launched. Impact point calculated.';
        }
        if (/drone|uav/.test(title)) {
            return 'Counter-UAV systems activated. Electronic warfare measures deployed.';
        }
        if (/attack|strike/.test(title + type)) {
            return 'Response strike authorized. Aircraft/导弹 assets tasked. Mission planning complete.';
        }
        return 'Coordinated response initiated. Multiple agencies on standby.';
    }

    getActorsInPhase(phase) {
        const title = (this.incident.title || '').toLowerCase();
        const actors = [];

        if (phase === 'observe') {
            actors.push({ name: 'Sensor Network', role: 'Detection', icon: '📡' });
            if (/radar|irst|ads-b/i.test(title)) actors.push({ name: 'Radar Systems', role: 'Tracking', icon: '📡' });
            if (/satellite/.test(title)) actors.push({ name: 'SATCOM', role: 'Overhead', icon: '🛰️' });
        }

        if (phase === 'orient') {
            actors.push({ name: 'AI Classification', role: 'Threat ID', icon: '🤖' });
            actors.push({ name: 'Intelligence Cell', role: 'Analysis', icon: '🧠' });
            actors.push({ name: 'Pattern Recognition', role: 'TTP Matching', icon: '🔍' });
        }

        if (phase === 'decide') {
            actors.push({ name: 'Tactical Commander', role: 'Approval', icon: '🎖️' });
            actors.push({ name: 'JOC', role: 'Coordination', icon: '🏛️' });
            if (/nuclear|radiological/.test(title)) {
                actors.push({ name: 'National Command', role: 'Strategic', icon: '🔴' });
            }
        }

        if (phase === 'act') {
            actors.push({ name: 'Air Defense', role: 'Interceptors', icon: '🛡️' });
            if (/strike|attack/.test(title)) {
                actors.push({ name: 'Strike Aircraft', role: 'Attack', icon: '✈️' });
            }
            actors.push({ name: 'Ground Forces', role: 'Support', icon: '🪖' });
        }

        return actors;
    }

    getDetectionData() {
        return {
            confidence: this.incident.verification?.status === 'VERIFIED' ? 95 : 72,
            sources: ['Radar', 'SATINT', 'HUMINT'].slice(0, Math.floor(Math.random() * 2) + 2),
            timeToDetect: `${this.phaseDurations.observe} min`,
            coverage: 'Regional'
        };
    }

    getClassificationData() {
        return {
            confidence: Math.floor(60 + Math.random() * 30),
            threatType: this.incident.type || 'unknown',
            ttpMatch: Math.floor(50 + Math.random() * 40) + '%',
            timeToClassify: `${this.phaseDurations.orient} min`
        };
    }

    getDecisionData() {
        return {
            roeStatus: 'Active',
            approvalLevel: this.incident.severity === 'critical' ? 'Immediate' : 'Standard',
            agencies: ['Military', 'Civil Defense'].slice(0, Math.floor(Math.random() * 2) + 1),
            timeToDecide: `${this.phaseDurations.decide} min`
        };
    }

    getActionData() {
        const title = (this.incident.title || '').toLowerCase();
        return {
            assets: ['Patriot', 'Iron Dome', ' David's Sling'].slice(0, 2),
            responseTime: `${this.phaseDurations.act} min`,
            interceptProbability: Math.floor(60 + Math.random() * 30) + '%',
            escalationRisk: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)]
        };
    }

    /**
     * Get bottleneck analysis summary
     */
    getBottleneckSummary() {
        const total = this.getTotalDuration();
        const decidePct = Math.round((this.phaseDurations.decide / total) * 100);
        
        return {
            totalDuration: total,
            criticalPath: decidePct > 40 ? 'DECIDE_PHASE' : 'SEQUENTIAL',
            bottleneckCount: this.bottlenecks.length,
            worstBottleneck: this.bottlenecks[0] || null,
            efficiency: this.calculateEfficiency()
        };
    }

    calculateEfficiency() {
        const total = this.getTotalDuration();
        const idealTotal = 27; // Minimum possible (2+5+15+5 for high-severity state actor missile)
        return Math.min(100, Math.round((idealTotal / total) * 100));
    }
}

/**
 * Render Ragnarok OODA loop visualization
 */
function renderRagnarok(incident) {
    const engine = new RagnarokEngine(incident);
    const stages = engine.getEscalationStages();
    const summary = engine.getBottleneckSummary();
    
    let html = `
    <div class="ragnarok-container">
        <div class="ragnarok-header">
            <div class="ragnarok-title">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                RAGNAROK — Escalation Timeline
            </div>
            <div class="ragnarok-subtitle">
                OODA Loop Analysis: ${incident.title || 'Threat Scenario'}
            </div>
        </div>

        <div class="ragnarok-summary">
            <div class="summary-stat">
                <div class="stat-value">${summary.totalDuration} min</div>
                <div class="stat-label">Total OODA Loop</div>
            </div>
            <div class="summary-stat">
                <div class="stat-value">${summary.efficiency}%</div>
                <div class="stat-label">Efficiency</div>
            </div>
            <div class="summary-stat ${summary.bottleneckCount > 0 ? 'warning' : ''}">
                <div class="stat-value">${summary.bottleneckCount}</div>
                <div class="stat-label">Bottlenecks</div>
            </div>
            <div class="summary-stat">
                <div class="stat-value">${summary.criticalPath}</div>
                <div class="stat-label">Critical Path</div>
            </div>
        </div>

        <div class="ragnarok-timeline">
            ${stages.map((stage, i) => `
            <div class="timeline-stage" data-phase="${stage.phase.toLowerCase()}">
                <div class="stage-connector ${i === 0 ? 'first' : ''}">
                    ${i > 0 ? '<div class="connector-line"></div>' : ''}
                    <div class="stage-node">
                        <span class="stage-icon">${stage.icon}</span>
                        <span class="stage-time">${stage.duration}m</span>
                    </div>
                </div>
                <div class="stage-content">
                    <div class="stage-header">
                        <span class="stage-name">${stage.name}</span>
                        <span class="stage-phase">${stage.phase}</span>
                    </div>
                    <div class="stage-description">${stage.description}</div>
                    <div class="stage-actors">
                        ${stage.actors.map(a => `
                            <span class="actor-tag">
                                <span class="actor-icon">${a.icon}</span>
                                ${a.name}
                            </span>
                        `).join('')}
                    </div>
                    <div class="stage-metrics">
                        ${Object.entries(stage.data).map(([k, v]) => `
                            <div class="metric-item">
                                <span class="metric-key">${k.replace(/([A-Z])/g, ' $1').trim()}</span>
                                <span class="metric-value">${v}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
            `).join('')}
        </div>
    </div>`;

    // Bottleneck analysis
    if (summary.bottleneckCount > 0) {
        html += `
        <div class="ragnarok-bottlenecks">
            <div class="bottleneck-header">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                Bottleneck Analysis
            </div>
            <div class="bottleneck-list">
                ${engine.bottlenecks.map(b => `
                <div class="bottleneck-item severity-${b.severity}">
                    <div class="bottleneck-phase">
                        <span class="phase-badge">${b.phase.toUpperCase()}</span>
                        <span class="bottleneck-time">${b.time} min</span>
                    </div>
                    <div class="bottleneck-issue">${b.issue}</div>
                    <div class="bottleneck-recommendation">
                        <strong>Recommendation:</strong> ${b.recommendation}
                    </div>
                </div>
                `).join('')}
            </div>
        </div>`;
    }

    return html;
}

/**
 * Add Ragnarok button to incident cards
 */
function addRagnarokButton(incidentEl, incident) {
    const analyzeBtn = document.createElement('button');
    analyzeBtn.className = 'ragnarok-btn';
    analyzeBtn.innerHTML = '⚡ Ragnarok';
    analyzeBtn.onclick = (e) => {
        e.stopPropagation();
        showRagnarokModal(incident);
    };
    
    // Append near existing action buttons
    const actions = incidentEl.querySelector('.incident-actions');
    if (actions) {
        actions.appendChild(analyzeBtn);
    }
}

/**
 * Show Ragnarok modal
 */
function showRagnarokModal(incident) {
    const modal = document.createElement('div');
    modal.className = 'ragnarok-modal';
    modal.innerHTML = `
        <div class="ragnarok-modal-content">
            <button class="ragnarok-modal-close" onclick="this.closest('.ragnarok-modal').remove()">×</button>
            ${renderRagnarok(incident)}
        </div>
    `;
    document.body.appendChild(modal);
    
    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { RagnarokEngine, renderRagnarok, showRagnarokModal };
}
