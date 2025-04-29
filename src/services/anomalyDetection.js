const pool = require('../config/db');

const thresholds = {
  altitude: { min: 0, max: 40000 },
  speed: { min: 0, max: 600 },
  temperature: { min: -50, max: 150 },
  pressure: { min: 0, max: 2000 },
};

async function detectAnomaly(telemetryRow) {
  const { id, aircraft_id, metric_type, value } = telemetryRow;
  const range = thresholds[metric_type];

  if (!range) return; 

  if (value < range.min || value > range.max) {
    const reason = `Value ${value} out of range for ${metric_type}`;

    await pool.query(
      'INSERT INTO anomalies (telemetry_id, aircraft_id, metric_type, value, reason) VALUES ($1, $2, $3, $4, $5)',
      [id, aircraft_id, metric_type, value, reason]
    );

    console.log(`[ANOMALY DETECTED] ${aircraft_id} - ${metric_type}: ${value} (${reason})`);
  }
}

module.exports = detectAnomaly;