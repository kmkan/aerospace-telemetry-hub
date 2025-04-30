CREATE TABLE IF NOT EXISTS aircraft (
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

INSERT INTO aircraft (name, model, max_altitude, max_speed, min_temp, max_temp, min_pressure, max_pressure)
VALUES
('A320', 'Airbus A320', 39000, 540, -60, 50, 300, 1050),
('B737', 'Boeing 737', 41000, 530, -60, 55, 300, 1050),
('F16', 'F-16 Fighting Falcon', 50000, 1500, -70, 60, 200, 1200)
ON CONFLICT (name) DO NOTHING;