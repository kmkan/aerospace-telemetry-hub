require('dotenv').config();
const app = require('./app');
const pool = require('./config/db');
const generateTelemetry = require('./simulator/simulator');
const { loadAircraftSpecs } = require('./db/aircraftCache');

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

pool.query('SELECT NOW()')
  .then(res => console.log('DB Connected:', res.rows[0]))
  .catch(err => console.error('DB Error', err));

  (async () => {
    await loadAircraftSpecs();
    console.log('Loaded aircraft specs.');
  
    setInterval(() => {
      generateTelemetry();
    }, 100000);
  })(); 