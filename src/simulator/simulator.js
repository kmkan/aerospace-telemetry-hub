const pool = require('../config/db');

const METRICS = ['altitude', 'speed', 'temperature', 'pressure'];
const AIRCRAFTS = ['A320', 'B737', 'F16'];

function randomValue(metric) {
  switch(metric) {
    case 'altitude': return Math.random() * 40000;
    case 'speed': return Math.random() * 600;
    case 'temperature': return Math.random() * 100;
    case 'pressure': return Math.random() * 2000;
    default: return 0;
  }
}

async function generateTelemetry() {
  const aircraft = AIRCRAFTS[Math.floor(Math.random() * AIRCRAFTS.length)];
  const metric = METRICS[Math.floor(Math.random() * METRICS.length)];
  const value = randomValue(metric);

  await pool.query(
    'INSERT INTO telemetry (aircraft_id, metric_type, value) VALUES ($1, $2, $3)',
    [aircraft, metric, value]
  );

  console.log(`[SIMULATOR] ${aircraft} - ${metric}: ${value.toFixed(2)}`);
}

module.exports = generateTelemetry;