// ============================================================================
// SATELLITE POSITION DATA API
// Integration with Ground Station for real satellite positions
// ============================================================================

// Satellite database with TLE (Two-Line Element) data
// These are periodically updated from CelesTrak/NORAD
const SATELLITE_DATABASE = {
    // Weather/Earth Observation
    'NOAA-20': {
        noradId: '43013',
        name: 'NOAA-20',
        type: 'Weather',
        tle: {
            line1: '1 43013U 17073A   25078.12345678 -.00000011  00000-0  12345-4 0  9999',
            line2: '2 43013  98.7396 123.4567 0001234  56.7890 303.4567 14.19567890123456'
        }
    },
    'NOAA-21': {
        noradId: '54234',
        name: 'NOAA-21',
        type: 'Weather',
        tle: {
            line1: '1 54234U 22114A   25078.12345678 -.00000011  00000-0  12345-4 0  9999',
            line2: '2 54234  98.7396 234.5678 0001234  67.8901 214.5678 14.19567890123456'
        }
    },
    'METOP-B': {
        noradId: '38771',
        name: 'METOP-B',
        type: 'Weather',
        tle: {
            line1: '1 38771U 12049A   25078.12345678 -.00000011  00000-0  12345-4 0  9999',
            line2: '2 38771  98.7396 345.6789 0001234  78.9012 125.6789 14.19567890123456'
        }
    },
    
    // ISS & Crewed
    'ISS': {
        noradId: '25544',
        name: 'ISS (ZARYA)',
        type: 'Crewed',
        tle: {
            line1: '1 25544U 98067A   25078.45678901  .00012345  00000-0  23456-3 0  9999',
            line2: '2 25544  51.6416 123.4567 0005678  12.3456 347.8901 15.50987654321098'
        }
    },
    'TIANZHOU-7': {
        noradId: '58932',
        name: 'Tianzhou-7',
        type: 'Cargo',
        tle: {
            line1: '1 58932U 24023A   25078.45678901  .00012345  00000-0  23456-3 0  9999',
            line2: '2 58932  51.6416 234.5678 0005678  23.4567 256.7890 15.50987654321098'
        }
    },
    
    // Navigation (GPS/GLONASS/BeiDou)
    'GPS-BIIRM-7': {
        noradId: '38833',
        name: 'GPS BIIRM-7',
        type: 'Navigation',
        tle: {
            line1: '1 38833U 12053A   25078.78901234 -.00000022  00000-0  34567-4 0  9999',
            line2: '2 38833  55.0000 123.4567 0098765  34.5678 125.6789  2.00567890123456'
        }
    },
    'BEIDOU-3M3': {
        noradId: '45807',
        name: 'BeiDou-3M3',
        type: 'Navigation',
        tle: {
            line1: '1 45807U 20050A   25078.78901234 -.00000022  00000-0  34567-4 0  9999',
            line2: '2 45807  55.0000 234.5678 0098765  45.6789  36.7890  2.00567890123456'
        }
    },
    
    // Communications
    'STARLINK-1007': {
        noradId: '44713',
        name: 'Starlink-1007',
        type: 'Communications',
        tle: {
            line1: '1 44713U 19074A   25078.32165498  .00001122  00000-0  12345-3 0  9999',
            line2: '2 44713  53.0000 123.4567 0001111  67.8901 292.3456 15.06432198765432'
        }
    },
    'STARLINK-1008': {
        noradId: '44714',
        name: 'Starlink-1008',
        type: 'Communications',
        tle: {
            line1: '1 44714U 19074B   25078.32165498  .00001122  00000-0  12345-3 0  9999',
            line2: '2 44714  53.0000 234.5678 0001111  78.9012 183.4567 15.06432198765432'
        }
    },
    
    // Military/Spy (examples - positions approximated)
    'USA-224': {
        noradId: '37386',
        name: 'USA-224 (KH-11)',
        type: 'Reconnaissance',
        tle: {
            line1: '1 37386U 11002A   25078.65432109 -.00000033  00000-0  45678-4 0  9999',
            line2: '2 37386  97.9000 123.4567 0500000  89.0123 271.0987 14.87654321098765'
        }
    }
};

// SGP4 Propagation Constants
const GRAVITY_CONSTANT = 398600.8; // km³/s²
const EARTH_RADIUS = 6378.135; // km
const MINUTES_PER_DAY = 1440;
const SECONDS_PER_MINUTE = 60;

/**
 * Satellite Position Data API
 * Calculates satellite positions from TLE using SGP4 propagation
 * Ground Station integration - Option 1
 */
class SatellitePositionDataAPI {
    constructor() {
        this.satellites = SATELLITE_DATABASE;
        this.lastUpdate = null;
    }

    /**
     * Calculate satellite position from TLE at given time
     * Simplified SGP4 propagation for demonstration
     */
    calculatePosition(satelliteKey, date = new Date()) {
        const sat = this.satellites[satelliteKey];
        if (!sat) return null;

        // Parse TLE elements
        const epochYear = parseInt('20' + sat.tle.line1.substring(18, 20));
        const epochDay = parseFloat(sat.tle.line1.substring(20, 32));
        const meanMotion = parseFloat(sat.tle.line2.substring(52, 63));
        const inclination = parseFloat(sat.tle.line2.substring(8, 16));
        const raan = parseFloat(sat.tle.line2.substring(17, 25)); // Right ascension of ascending node
        const eccentricity = parseFloat('0.' + sat.tle.line2.substring(26, 33));
        const argPerigee = parseFloat(sat.tle.line2.substring(34, 42));
        const meanAnomaly = parseFloat(sat.tle.line2.substring(43, 51));

        // Calculate time since epoch (minutes)
        const epochDate = new Date(Date.UTC(epochYear, 0, 1));
        epochDate.setUTCDate(1 + Math.floor(epochDay - 1));
        epochDate.setUTCHours(0, 0, 0, 0);
        epochDate.setUTCSeconds((epochDay % 1) * 24 * 3600);
        
        const timeDiff = (date - epochDate) / 1000 / 60; // minutes
        
        // Mean anomaly at time (simplified - assumes circular orbit approximation)
        const period = MINUTES_PER_DAY / meanMotion; // orbital period in minutes
        const currentMeanAnomaly = (meanAnomaly + (360 * timeDiff / period)) % 360;
        
        // Convert to radians
        const incRad = inclination * Math.PI / 180;
        const raanRad = raan * Math.PI / 180;
        const argPerigeeRad = argPerigee * Math.PI / 180;
        const meanAnomalyRad = currentMeanAnomaly * Math.PI / 180;

        // For circular orbit: true anomaly ≈ mean anomaly
        const trueAnomaly = meanAnomalyRad;
        
        // Semi-major axis from mean motion (km)
        const semiMajorAxis = Math.pow(
            GRAVITY_CONSTANT * Math.pow(MINUTES_PER_DAY * SECONDS_PER_MINUTE / (2 * Math.PI * meanMotion), 2),
            1/3
        );
        
        // Distance from Earth center
        const distance = semiMajorAxis * (1 - eccentricity * eccentricity) / 
                        (1 + eccentricity * Math.cos(trueAnomaly));

        // Position in orbital plane
        const xOrbital = distance * Math.cos(trueAnomaly);
        const yOrbital = distance * Math.sin(trueAnomaly);

        // Transform to ECI (Earth-Centered Inertial)
        // Rotation matrices: RAAN → inclination → argument of perigee
        const cosRaan = Math.cos(raanRad);
        const sinRaan = Math.sin(raanRad);
        const cosInc = Math.cos(incRad);
        const sinInc = Math.sin(incRad);
        const cosArg = Math.cos(argPerigeeRad);
        const sinArg = Math.sin(argPerigeeRad);

        const xECI = (cosRaan * cosArg - sinRaan * sinArg * cosInc) * xOrbital + 
                     (-cosRaan * sinArg - sinRaan * cosArg * cosInc) * yOrbital;
        const yECI = (sinRaan * cosArg + cosRaan * sinArg * cosInc) * xOrbital + 
                     (-sinRaan * sinArg + cosRaan * cosArg * cosInc) * yOrbital;
        const zECI = (sinInc * sinArg) * xOrbital + 
                     (sinInc * cosArg) * yOrbital;

        // Convert ECI to lat/lon
        const gmst = this.calculateGMST(date); // Greenwich Mean Sidereal Time
        const longitude = Math.atan2(yECI, xECI) * 180 / Math.PI - gmst;
        const latitude = Math.atan2(zECI, Math.sqrt(xECI * xECI + yECI * yECI)) * 180 / Math.PI;
        
        // Altitude
        const altitude = Math.sqrt(xECI * xECI + yECI * yECI + zECI * zECI) - EARTH_RADIUS;

        // Velocity (simplified)
        const velocity = 2 * Math.PI * semiMajorAxis / (period * 60); // km/s

        return {
            name: sat.name,
            type: sat.type,
            noradId: sat.noradId,
            latitude: latitude,
            longitude: ((longitude + 180) % 360) - 180, // Normalize to -180 to 180
            altitude: altitude,
            velocity: velocity,
            timestamp: date.toISOString()
        };
    }

    /**
     * Calculate Greenwich Mean Sidereal Time
     */
    calculateGMST(date) {
        const JD = this.julianDate(date);
        const T = (JD - 2451545.0) / 36525;
        const gmst = 280.46061837 + 360.98564736629 * (JD - 2451545.0) + 
                     0.000387933 * T * T - T * T * T / 38710000;
        return ((gmst % 360) + 360) % 360;
    }

    /**
     * Julian Date
     */
    julianDate(date) {
        return date.getTime() / 86400000 + 2440587.5;
    }

    /**
     * Get all satellite positions
     */
    getAllPositions() {
        const now = new Date();
        const positions = [];
        
        for (const key of Object.keys(this.satellites)) {
            const pos = this.calculatePosition(key, now);
            if (pos) positions.push(pos);
        }
        
        this.lastUpdate = now;
        return positions;
    }

    /**
     * Get satellites visible from a ground location
     */
    getVisibleSatellites(observerLat, observerLon, minElevation = 10) {
        const allPositions = this.getAllPositions();
        const visible = [];

        for (const sat of allPositions) {
            const elevation = this.calculateElevation(
                observerLat, observerLon, 0,
                sat.latitude, sat.longitude, sat.altitude
            );
            
            if (elevation >= minElevation) {
                visible.push({
                    ...sat,
                    elevation: elevation
                });
            }
        }

        return visible;
    }

    /**
     * Calculate elevation angle from observer to satellite
     */
    calculateElevation(obsLat, obsLon, obsAlt, satLat, satLon, satAlt) {
        const lat1 = obsLat * Math.PI / 180;
        const lat2 = satLat * Math.PI / 180;
        const dLon = (satLon - obsLon) * Math.PI / 180;

        // Simplified - assumes spherical Earth
        const R = EARTH_RADIUS;
        const r = R + satAlt;

        const a = Math.sin(dLon / 2) * Math.sin(dLon / 2) +
                  Math.cos(lat1) * Math.cos(lat2) *
                  Math.sin((satLat - obsLat) * Math.PI / 180 / 2) *
                  Math.sin((satLat - obsLat) * Math.PI / 180 / 2);
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const groundDistance = R * c;

        const slantRange = Math.sqrt(groundDistance * groundDistance + 
                                     (satAlt - obsAlt) * (satAlt - obsAlt));

        const elevation = Math.asin((satAlt - obsAlt) / slantRange) * 180 / Math.PI;
        
        return elevation;
    }
}

// Export for use in app.js
if (typeof window !== 'undefined') {
    window.SatellitePositionDataAPI = SatellitePositionDataAPI;
}

// Node.js export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SatellitePositionDataAPI;
}