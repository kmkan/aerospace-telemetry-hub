require('dotenv').config();
const pool = require('./config/db');
const generateTelemetry = require('./simulator/simulator');

pool.query('SELECT NOW()')
  .then(res => console.log('DB Connected:', res.rows[0]))
  .catch(err => console.error('DB Error', err));

setInterval(() => {
  generateTelemetry();
}, 3000);