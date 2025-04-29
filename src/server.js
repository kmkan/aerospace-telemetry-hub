require('dotenv').config();
const pool = require('./config/db');

pool.query('SELECT NOW()')
  .then(res => console.log('DB Connected:', res.rows[0]))
  .catch(err => console.error('DB Error', err));