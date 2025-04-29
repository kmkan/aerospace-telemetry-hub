const pool = require('../config/db');
const detectAnomaly = require('../services/anomalyDetection');

const METRICS = ['altitude', 'speed', 'temperature', 'pressure'];
const AIRCRAFTS = ['A320', 'B737', 'F16'];

function randomValue(metric) {
  switch(metric) {
    case 'altitude': return Math.random() * 50000; 
    case 'speed': return Math.random() * 700;
    case 'temperature': return (Math.random() * 200) - 50; 
    case 'pressure': return Math.random() * 2500;
    default: return 0;
  }
}

async function generateTelemetry() {
  const aircraft = AIRCRAFTS[Math.floor(Math.random() * AIRCRAFTS.length)];
  const metric = METRICS[Math.floor(Math.random() * METRICS.length)];
  const value = randomValue(metric);

  const res = await pool.query(
    'INSERT INTO telemetry (aircraft_id, metric_type, value) VALUES ($1, $2, $3) RETURNING *',
    [aircraft, metric, value]
  );

  const telemetryRow = res.rows[0];

  console.log(`[SIMULATOR] ${aircraft} - ${metric}: ${value.toFixed(2)}`);

  await detectAnomaly(telemetryRow);
}

module.exports = generateTelemetry;