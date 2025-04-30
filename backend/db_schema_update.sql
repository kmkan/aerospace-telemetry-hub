CREATE TABLE anomalies (
  id SERIAL PRIMARY KEY,
  telemetry_id INT REFERENCES telemetry(id),
  aircraft_id VARCHAR(255),
  metric_type VARCHAR(255),
  value FLOAT,
  reason TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE aircraft (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE,
  model VARCHAR(100),
  max_altitude FLOAT,
  max_speed FLOAT,
  min_temp FLOAT,
  max_temp FLOAT,
  min_pressure FLOAT,
  max_pressure FLOAT
);