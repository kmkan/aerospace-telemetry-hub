const pool = require('../config/db');
const detectAnomaly = require('../services/anomalyDetection');
const { getAircraftSpec } = require('../db/aircraftCache');

const AIRCRAFTS = ['A320', 'B737', 'F16'];

const aircraftStates = AIRCRAFTS.reduce((acc, aircraft) => {
  acc[aircraft] = {
    phase: 'Ground',
    altitude: 0,
    speed: 0,
  };
  return acc;
}, {});

function updateAircraft(aircraft) {
  let state = aircraftStates[aircraft];
  const specs = getAircraftSpec(aircraft);

  switch (state.phase) {
    case 'Ground':
    case 'Landed':
      state.altitude = 0;
      state.speed = 0;
      if (Math.random() < 0.2) {
        state.phase = 'Takeoff';
      }
      break;      

    case 'Takeoff':
      state.altitude += 1000;
      state.speed += 20;
      if (state.altitude >= specs.max_altitude * 0.25) state.phase = 'Climb';
      break;

    case 'Climb':
      state.altitude += 1000;
      state.speed += 10;
      if (state.altitude >= specs.max_altitude) state.phase = 'Cruise';
      break;

    case 'Cruise':
      state.altitude += Math.random() * 10 - 5;
      state.speed += Math.random() * 2 - 1;
      if (Math.random() < 0.01) state.phase = 'Descent';
      break;

    case 'Descent':
      state.altitude -= 1000;
      state.speed -= 20;
      if (state.altitude <= 0) {
        state.altitude = 0;
        state.speed = 0;
        state.phase = 'Landed';
      }
      break;
  }
}

function calculateTemperature(altitude, specs) {
  const temp = 15 - (altitude / 1000) * 2;
  return Math.max(specs.min_temp, Math.min(specs.max_temp, temp + (Math.random() * 4 - 2)));
}

function calculatePressure(altitude, specs) {
  const pressure = 1013 - (altitude / 30);
  return Math.max(specs.min_pressure, Math.min(specs.max_pressure, pressure + (Math.random() * 5 - 2.5)));
}

async function generateTelemetry() {
  for (let aircraft of AIRCRAFTS) {
    const specs = getAircraftSpec(aircraft);
    updateAircraft(aircraft);

    const state = aircraftStates[aircraft];

    const telemetryData = [
      { metric_type: 'altitude', value: state.altitude },
      { metric_type: 'speed', value: state.speed },
      { metric_type: 'temperature', value: calculateTemperature(state.altitude, specs) },
      { metric_type: 'pressure', value: calculatePressure(state.altitude, specs) }
    ];

    for (let data of telemetryData) {
      if (Math.random() < 0.05) {
        data.value *= 1.25; 
      }
    
      const res = await pool.query(
        'INSERT INTO telemetry (aircraft_id, metric_type, value) VALUES ($1, $2, $3) RETURNING *',
        [aircraft, data.metric_type, data.value]
      );
    
      const telemetryRow = res.rows[0];
      console.log(`[SIM] ${aircraft} (${state.phase}) → ${data.metric_type}: ${data.value.toFixed(2)}`);
    
      await detectAnomaly(telemetryRow);
    }    
  }
}

module.exports = generateTelemetry;