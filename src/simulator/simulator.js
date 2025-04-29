const pool = require('../config/db');
const detectAnomaly = require('../services/anomalyDetection');

const AIRCRAFTS = ['A320', 'B737', 'F16'];

const aircraftStates = AIRCRAFTS.reduce((acc, aircraft) => {
  acc[aircraft] = {
    phase: 'Ground',
    altitude: 0,
    speed: 0,
  };
  return acc;
}, {});

function nextPhase(currentPhase) {
  switch (currentPhase) {
    case 'Ground': return 'Takeoff';
    case 'Takeoff': return 'Climb';
    case 'Climb': return 'Cruise';
    case 'Cruise': return 'Descent';
    case 'Descent': return 'Landed';
    case 'Landed': return 'Ground';
    default: return 'Ground';
  }
}

function updateAircraft(aircraft) {
  let state = aircraftStates[aircraft];

  switch (state.phase) {
    case 'Ground':
    case 'Landed':
      state.altitude = 0;
      state.speed = 0;
      state.phase = nextPhase(state.phase);
      break;

    case 'Takeoff':
      state.altitude += 500 + Math.random() * 500; 
      state.speed += 10 + Math.random() * 20;       
      if (state.altitude >= 10000) state.phase = 'Climb';
      break;

    case 'Climb':
      state.altitude += 300 + Math.random() * 300; 
      state.speed += 5 + Math.random() * 10;        
      if (state.altitude >= 35000) state.phase = 'Cruise';
      break;

    case 'Cruise':
      state.altitude += Math.random() * 10 - 5;
      state.speed += Math.random() * 2 - 1;
      if (Math.random() < 0.01) {
        state.phase = 'Descent';
      }
      break;

    case 'Descent':
      state.altitude -= 500 + Math.random() * 500;
      state.speed -= 10 + Math.random() * 20;
      if (state.altitude <= 0) {
        state.altitude = 0;
        state.speed = 0;
        state.phase = 'Landed';
      }
      break;
  }
}

function calculateTemperature(altitude) {
  return 15 - (altitude / 1000) * 2; 
}

function calculatePressure(altitude) {
  return 1013 - (altitude / 30); 
}

async function generateTelemetry() {
  for (let aircraft of AIRCRAFTS) {
    updateAircraft(aircraft);

    const state = aircraftStates[aircraft];

    const telemetryData = [
      { metric_type: 'altitude', value: state.altitude },
      { metric_type: 'speed', value: state.speed },
      { metric_type: 'temperature', value: calculateTemperature(state.altitude) },
      { metric_type: 'pressure', value: calculatePressure(state.altitude) }
    ];

    for (let data of telemetryData) {
      const res = await pool.query(
        'INSERT INTO telemetry (aircraft_id, metric_type, value) VALUES ($1, $2, $3) RETURNING *',
        [aircraft, data.metric_type, data.value]
      );

      const telemetryRow = res.rows[0];

      console.log(`[${aircraft} - ${state.phase}] ${data.metric_type}: ${data.value.toFixed(2)}`);

      await detectAnomaly(telemetryRow);
    }
  }
}

module.exports = generateTelemetry;