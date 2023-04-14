const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const dotenv = require('dotenv');
const users = require('./api/users');
const oracles = require('./api/oracles');
const requests = require('./api/requests');
const responses = require('./api/responses');
const getBalance = require('./api/getBalance');
const getBlockByNumber = require('./api/getBlockByNumber');
const getLogs = require('./api/getLogs');
const websocket = require('./websocket/websocket');

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const app = express();
const server = require('http').createServer(app);
const wss = websocket(server);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/users', users(pool));
app.use('/api/oracles', oracles(pool));
app.use('/api/requests', requests(pool, wss));
app.use('/api/responses', responses(pool, wss));
app.use('/api/balance', getBalance(pool));
app.use('/api/block', getBlockByNumber(pool));
app.use('/api/logs', getLogs(pool));

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
