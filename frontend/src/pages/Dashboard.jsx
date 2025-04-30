import { gql, useQuery } from '@apollo/client';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';

const GET_DATA = gql`
  query {
  metrics {
    totalAircraft
    totalTelemetry
    totalAnomalies
    anomaliesLastHour
  }
  telemetryCounts {
    anomalies
    normal
  }
  aircraft {
    name
    model
    max_altitude
    max_speed
  }
  anomalies {
    aircraft_id
    metric_type
    value
    reason
    timestamp
  }
}`;

export default function Dashboard() {
  const { data, loading, error } = useQuery(GET_DATA, {
    pollInterval: 5000, 
  });  

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading data</p>;

  return (
    <div className="container">
      <div className="metrics">
        <h2>System Metrics</h2>
        <ul>
          <li><strong>Aircraft Tracked:</strong> {data.metrics.totalAircraft}</li>
          <li><strong>Total Telemetry Points:</strong> {data.metrics.totalTelemetry}</li>
          <li><strong>Total Anomalies:</strong> {data.metrics.totalAnomalies}</li>
          <li><strong>Last Hour Anomalies:</strong> {data.metrics.anomaliesLastHour}</li>
        </ul>
      </div>
      {data.telemetryCounts && (
        <div style={{ marginTop: '2rem' }}>
          <h2>Telemetry Health</h2>
          <PieChart width={300} height={250}>
            <Pie
              data={[
                { name: 'Normal', value: data.telemetryCounts.normal },
                { name: 'Anomalies', value: data.telemetryCounts.anomalies }
              ]}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              <Cell fill="#34d399" />  {/* green */}
              <Cell fill="#f87171" />  {/* red */}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      )}
      <h2>Aircraft</h2>
      <ul>
        {data.aircraft.map(a => (
          <li key={a.name}>{a.name} ({a.model}) – Max Alt: {a.max_altitude} ft, Max Spd: {a.max_speed} kt</li>
        ))}
      </ul>

      <h2>Recent Anomalies</h2>
      <ul>
        {data.anomalies.map((a, i) => (
          <li key={i}>{a.timestamp} — {a.aircraft_id} – {a.metric_type}: {a.value} – {a.reason}</li>
        ))}
      </ul>
    </div>
  );
}