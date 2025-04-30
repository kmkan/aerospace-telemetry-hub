CREATE TABLE telemetry (
  id SERIAL PRIMARY KEY,
  aircraft_id VARCHAR(255),
  metric_type VARCHAR(255),
  value FLOAT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);