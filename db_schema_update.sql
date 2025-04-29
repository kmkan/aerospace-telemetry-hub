CREATE TABLE anomalies (
  id SERIAL PRIMARY KEY,
  telemetry_id INT REFERENCES telemetry(id),
  aircraft_id VARCHAR(255),
  metric_type VARCHAR(255),
  value FLOAT,
  reason TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);