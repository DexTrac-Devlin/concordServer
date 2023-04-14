const WebSocket = require('ws');

module.exports = function(server, pool) {
  const wss = new WebSocket.Server({ server });

  // Helper function to process Ethereum JSON-RPC requests
  async function processEthereumRequest(method, params) {
    let response;
    switch (method) {
      case 'eth_blockNumber':
        const blockNumberResult = await pool.query('SELECT MAX(block_number) FROM blocks');
        response = parseInt(blockNumberResult.rows[0].max, 10).toString(16);
        break;

      case 'eth_getBalance':
        const [account, block] = params;
        const balanceResult = await pool.query('SELECT balance FROM accounts WHERE address = $1', [account]);
        response = balanceResult.rows[0] ? balanceResult.rows[0].balance : '0x0';
        break;

      case 'eth_getBlockByNumber':
        const blockParam = params[0];
        const fullTx = params[1] === true;
        const blockQuery = `SELECT * FROM blocks WHERE block_number = $1`;
        const blockResult = await pool.query(blockQuery, [parseInt(blockParam, 16)]);
        response = blockResult.rows[0] ? blockResult.rows[0] : null;
        break;

      case 'eth_getLogs':
        const filter = params[0];
        const fromBlock = parseInt(filter.fromBlock || '0x0', 16);
        const toBlock = parseInt(filter.toBlock || 'latest', 16);
        const address = filter.address ? (Array.isArray(filter.address) ? filter.address : [filter.address]) : null;
        const topics = filter.topics || [];

        let logsQuery = 'SELECT * FROM logs WHERE block_number BETWEEN $1 AND $2';
        let queryParams = [fromBlock, toBlock];

        if (address) {
          logsQuery += ` AND address IN (${address.map((_, i) => `$${i + 3}`).join(', ')})`;
          queryParams = queryParams.concat(address);
        }

        if (topics.length > 0) {
          topics.forEach((topic, i) => {
            if (topic) {
              logsQuery += ` AND topics[$${i + queryParams.length + 1}] = $${i + queryParams.length + 2}`;
              queryParams.push(i + 1, topic);
            }
          });
        }

        const logsResult = await pool.query(logsQuery, queryParams);
        response = logsResult.rows;
        break;

      default:
        throw new Error(`Method ${method} not supported`);
    }
    return response;
  }

  wss.on('connection', (ws, req) => {
    ws.on('message', async message => {
      try {
        const parsedMessage = JSON.parse(message);
        const { jsonrpc, id, method, params } = parsedMessage;

        if (jsonrpc === '2.0' && id && method) {
          try {
            const result = await processEthereumRequest(method, params);
            ws.send(JSON.stringify({ jsonrpc, id, result }));
          } catch (error) {
            ws.send(JSON.stringify({ jsonrpc, id, error: { message: error.message, code: -32603 } }));
          }
        } else {
          // Handle custom events or invalid requests
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    });

    // Send welcome message
   ws.send(JSON.stringify({ event: 'welcome', data: { message: 'Welcome to the custom WebSocket server!' } }));
});

return wss;
};



// ---------
// Inside the oracles.js and requests.js files, after creating new resources
// wss.broadcast('newRequest', newRequest);

// Inside the responses.js file, after creating new resources
// wss.broadcast('newResponse', newResponse);
