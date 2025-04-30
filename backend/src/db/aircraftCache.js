const pool = require('../config/db');

let aircraftData = {};

async function loadAircraftSpecs() {
  const res = await pool.query('SELECT * FROM aircraft');
  aircraftData = res.rows.reduce((acc, row) => {
    acc[row.name] = row; 
    return acc;
  }, {});
}

function getAircraftSpec(name) {
  return aircraftData[name];
}

module.exports = {
  loadAircraftSpecs,
  getAircraftSpec,
};