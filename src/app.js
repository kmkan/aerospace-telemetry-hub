const cors = require('cors');
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./graphql/schema');
const adminRoutes = require('./routes/admin');
const authenticateToken = require('./middleware/auth');

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());

app.use('/admin', adminRoutes);

app.use('/graphql', authenticateToken, graphqlHTTP({
  schema,
  graphiql: true,
}));

module.exports = app;