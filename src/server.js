require('dotenv').config();
const app = require('./app');
const pool = require('./config/db');
const generateTelemetry = require('./simulator/simulator');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

pool.query('SELECT NOW()')
  .then(res => console.log('DB Connected:', res.rows[0]))
  .catch(err => console.error('DB Error', err));

// setInterval(() => {
//   generateTelemetry();
// }, 3000);