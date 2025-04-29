const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLFloat, GraphQLList, GraphQLInt } = require('graphql');
const pool = require('../config/db');

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

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    telemetry: {
      type: new GraphQLList(TelemetryType),
      resolve: async () => {
        const res = await pool.query('SELECT * FROM telemetry ORDER BY timestamp DESC LIMIT 10');
        return res.rows;
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});