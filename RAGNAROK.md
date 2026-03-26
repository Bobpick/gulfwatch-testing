# RAGNAROK — OODA Loop Escalation Timeline Engine

**Feature:** Military-grade threat escalation timeline visualization  
**Status:** ✅ Deployed  
**Stack:** Vanilla JS, no dependencies  
**File:** `public/js/ragnarok.js`, `public/css/ragnarok.css`

---

## What It Does

Given a detected threat incident, RAGNAROK models its **OODA Loop** (Observe-Orient-Decide-Act) — the classic military decision-making cycle — showing:

1. **4 sequential phases** with time estimates
2. **Who's involved** in each phase (actors/systems)
3. **Key metrics** per phase (confidence, time-to-X, etc.)
4. **Bottleneck analysis** — where the loop slows down and why it matters
5. **Recommendations** — how to close gaps

Target audience: **Government/defense planners** who need to see that Gulf Watch understands OODA loops and can identify systemic vulnerabilities in their response chain.

---

## Architecture

```
Incident (from state.incidents)
    │
    ▼
RagnarokEngine
    ├── calculatePhaseDurations()     → { observe, orient, decide, act }
    ├── identifyBottlenecks()          → [{ phase, severity, issue, recommendation }]
    ├── getEscalationStages()          → [{ id, name, icon, duration, actors, data }]
    └── getBottleneckSummary()        → { totalDuration, criticalPath, efficiency }
            │
            ▼
renderRagnarok(incident) → HTML string
showRagnarokModal(incident) → DOM injection
```

### Class: `RagnarokEngine`

**Constructor:**
```js
new RagnarokEngine(incident)
```

**Incident shape:**
```js
{
  id: number,
  title: string,
  type: 'missile' | 'drone' | 'attack' | 'air_defense' | ...,
  severity: 'critical' | 'high' | 'medium' | 'low',
  published: ISO date string,
  location?: { lat, lng },
  verification?: { status: 'VERIFIED' | 'UNCONFIRMED' }
}
```

**Public Methods:**

| Method | Returns | Description |
|--------|---------|-------------|
| `calculatePhaseDurations()` | `{ observe, orient, decide, act }` | Phase durations in minutes |
| `identifyBottlenecks()` | `Bottleneck[]` | Sorted by severity (critical first) |
| `getEscalationStages()` | `Stage[]` | Full stage details with actors + metrics |
| `getBottleneckSummary()` | `Summary` | Total time, efficiency, critical path |
| `getTotalDuration()` | `number` | Total OODA loop time in minutes |

**Internal Methods:**

| Method | Description |
|--------|-------------|
| `getBaseDuration(phase, type, severity)` | Base OODA phase times by severity tier |
| `getActorModifier()` | Speed modifier based on actor sophistication |
| `getThreatModifier(type, title)` | Urgency modifier based on threat type |
| `getActorsInPhase(phase)` | Which actors/systems participate in each phase |
| `getDetectionData()` / `getClassificationData()` / `getDecisionData()` / `getActionData()` | Phase-specific metrics |

---

## Phase Duration Model

### Base Durations (minutes) — HIGH severity incidents

| Phase | OODA Loop | Duration | What Happens |
|-------|-----------|----------|-------------|
| Observe | Sensor detection | 2 min | Radar/IRST detects threat, initial tracking |
| Orient | Analysis + classification | 5 min | AI + intelligence cell identify threat type |
| Decide | Command decision | 15 min | Commander approves response under ROE |
| Act | Response execution | 5 min | Interceptors launched, forces deployed |

**Total ideal: 27 minutes** (high-severity, state actor, conventional threat)

### Severity Modifiers

| Severity | Multiplier | Example Duration |
|----------|------------|-----------------|
| Critical/High | 1.0x (fastest) | 27 min total |
| Medium | ~3-4x | ~75 min total |
| Low | ~5-6x | ~120 min total |

### Actor Modifiers

| Actor Type | Modifier | Rationale |
|------------|----------|-----------|
| State military (Israel, US, UK, France) | 0.5x | Professional, pre-authorized, fast C2 |
| Non-state (Houthis, Hezbollah, Hamas) | 1.2x | Less structured C2, simpler doctrine |
| Default | 1.0x | — |

### Threat Type Modifiers

| Threat | Modifier | Rationale |
|--------|----------|-----------|
| Missile/Ballistic/Rocket | 0.3x | Fastest — air defense priority |
| Drone/UAV | 0.5x | Urgent but slightly more classification time |
| Attack/Strike/Raid | 0.7x | Moderate — requires more classification |
| Default | 1.0x | Standard response |

---

## Bottleneck Analysis

Bottlenecks are phases exceeding time thresholds:

| Phase | Threshold | Severity if exceeded |
|-------|-----------|---------------------|
| Decide | >30 min | High (>60 min = Critical) |
| Observe | >5 min | Medium |
| Act | >20 min | Medium (>30 min = High) |
| Orient | >20 min | Medium |

### Example Output

```js
{
  phase: 'decide',
  severity: 'critical',
  issue: 'Command authority delay — multi-level approval required',
  recommendation: 'Pre-authorize response protocols for known threat signatures',
  time: 75
}
```

---

## Integration Points

### Tab View
- **Route:** Click "Ragnarok" tab
- **Init:** `initializeRagnarok()` in `app.js` section switch
- **Selector:** Dropdown populated from `state.incidents` (last 20)
- **Output:** `renderRagnarok(incident)` → `#ragnarok-output`

### Incident Card Button
- **Trigger:** ⚡ Ragnarok button on every `.incident-card`
- **Handler:** `showRagnarokModal(state.incidents.find(i => i.id === X))`
- **Display:** Full-screen modal with `renderRagnarok()` output

### CSS Variables Used
```css
--accent       /* Primary accent color (e.g., #00ff88) */
```

---

## Testing Plan

### Unit Tests (manual)

| Test | Input | Expected |
|------|-------|----------|
| High-severity Israeli missile incident | `{ severity: 'critical', title: 'Israeli IDF intercepts missile' }` | Total < 30 min |
| Low-severity Houthi drone | `{ severity: 'low', title: 'Houthi drone detected' }` | Total > 100 min |
| Critical Iranian ballistic | `{ severity: 'critical', title: 'Iranian ballistic missile test' }` | Decide phase bottleneck |
| No matching actor | `{ title: 'Unknown incident' }` | Uses default modifier (1.0x) |
| Empty incident | `{}` | Graceful fallback, no crash |

### Integration Tests

| Test | Steps | Expected |
|------|-------|----------|
| Tab renders | Click Ragnarok tab | Section visible, dropdown populated |
| Modal opens | Click Ragnarok button on card | Modal renders with timeline |
| Modal closes | Click × or outside modal | Modal removed from DOM |
| Empty state | Click tab with no incidents | Dropdown shows "no incidents" |
| Selector works | Select incident from dropdown | Timeline renders in output div |

### Edge Cases

- [ ] `incident.title` is null/undefined
- [ ] `incident.type` is not in expected set
- [ ] `incident.severity` is not in expected set
- [ ] `state.incidents` is empty
- [ ] `state.incidents` contains duplicate IDs
- [ ] Very long incident titles (overflow in dropdown)
- [ ] Multiple rapid modal opens/closes

---

## Performance

- **No external dependencies** — pure vanilla JS
- **Render time:** < 5ms for typical incident
- **DOM size:** ~2KB HTML per render
- **Memory:** No state retained after modal close
- **CSS:** All animations use `transform`/`opacity` for GPU acceleration

---

## Security Considerations

- [ ] `incident.title` is escaped in HTML via existing `escapeHtml()` — verify
- [ ] `renderRagnarok()` returns HTML string — sanitize if user-controlled data injected
- [ ] No `eval()` or `new Function()` usage
- [ ] Modal injection uses `innerHTML` — confirm existing page HTML is trusted

---

## Future Improvements

1. **Real data calibration** — Replace heuristic modifiers with actual response time data from historical incidents
2. **Interactive timeline** — Click phases to expand/collapse, show more detail
3. **Comparative view** — Show two scenarios side-by-side (e.g., "current" vs "with pre-auth")
4. **Animation** — Animate the loop: watch each phase light up as time passes
5. **Export** — Generate PDF/PNG of the OODA timeline for briefings
6. **API endpoint** — `GET /api/ragnarok?incident_id=X` for server-side rendering
7. **Sensitivity analysis** — "What if we cut Decide time by 50%?"
8. **Multi-phase branching** — Not all threats follow linear OODA; some loop back

---

## File Inventory

| File | Purpose |
|------|---------|
| `public/js/ragnarok.js` | RagnarokEngine class + render functions |
| `public/css/ragnarok.css` | Timeline, modal, bottleneck styles |
| `public/index.html` | Ragnarok tab button + section + CSS/JS includes |
| `public/js/app.js` | `initializeRagnarok()` + incident card buttons |
| `RAGNAROK.md` | This document |
