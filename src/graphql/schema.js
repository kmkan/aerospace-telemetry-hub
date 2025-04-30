const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLFloat, GraphQLList, GraphQLInt } = require('graphql');
const pool = require('../config/db');

const AircraftType = new GraphQLObjectType({
  name: 'Aircraft',
  fields: {
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    model: { type: GraphQLString },
    max_altitude: { type: GraphQLFloat },
    max_speed: { type: GraphQLFloat },
    min_temp: { type: GraphQLFloat },
    max_temp: { type: GraphQLFloat },
    min_pressure: { type: GraphQLFloat },
    max_pressure: { type: GraphQLFloat },
  }
});

const TelemetryType = new GraphQLObjectType({
  name: 'Telemetry',
  fields: {
    id: { type: GraphQLInt },
    aircraft_id: { type: GraphQLString },
    metric_type: { type: GraphQLString },
    value: { type: GraphQLFloat },
    timestamp: { type: GraphQLString },
  }
});

const AnomalyType = new GraphQLObjectType({
  name: 'Anomaly',
  fields: {
    id: { type: GraphQLInt },
    telemetry_id: { type: GraphQLInt },
    aircraft_id: { type: GraphQLString },
    metric_type: { type: GraphQLString },
    value: { type: GraphQLFloat },
    reason: { type: GraphQLString },
    timestamp: { type: GraphQLString },
  }
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    telemetry: {
      type: new GraphQLList(TelemetryType),
      resolve: async () => {
        const res = await pool.query('SELECT * FROM telemetry ORDER BY timestamp DESC LIMIT 10');
        return res.rows;
      }
    },
    anomalies: {
      type: new GraphQLList(AnomalyType),
      resolve: async () => {
        const res = await pool.query('SELECT * FROM anomalies ORDER BY timestamp DESC LIMIT 10');
        return res.rows;
      }
    },
    aircraft: {
      type: new GraphQLList(AircraftType),
      resolve: async () => {
        const res = await pool.query('SELECT * FROM aircraft ORDER BY name');
        return res.rows;
      }
    },    
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});