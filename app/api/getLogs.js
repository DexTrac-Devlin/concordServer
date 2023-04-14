const Router = require('express-promise-router');
const router = new Router();

module.exports = (pool) => {
  router.post('/', async (req, res) => {
    const filter = req.body;
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
    res.json(logsResult.rows);
  });

  return router;
};
