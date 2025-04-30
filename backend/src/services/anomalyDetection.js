const pool = require('../config/db');
const { getAircraftSpec } = require('../db/aircraftCache');

async function detectAnomaly(telemetryRow) {
  const { id, aircraft_id, metric_type, value } = telemetryRow;
  const specs = getAircraftSpec(aircraft_id);

  if (!specs) return;

  let min = 0, max = Infinity;

  switch (metric_type) {
    case 'altitude':
      max = specs.max_altitude;
      break;
    case 'speed':
      max = specs.max_speed;
      break;
    case 'temperature':
      min = specs.min_temp;
      max = specs.max_temp;
      break;
    case 'pressure':
      min = specs.min_pressure;
      max = specs.max_pressure;
      break;
    default:
      return;
  }

  if (value < min || value > max) {
    const reason = `Value ${value.toFixed(2)} out of range for ${metric_type} (${min}-${max})`;

    await pool.query(
      'INSERT INTO anomalies (telemetry_id, aircraft_id, metric_type, value, reason) VALUES ($1, $2, $3, $4, $5)',
      [id, aircraft_id, metric_type, value, reason]
    );

    console.log(`[ANOMALY DETECTED] ${aircraft_id} - ${metric_type}: ${value.toFixed(2)} (${reason})`);
  }
}

module.exports = detectAnomaly;