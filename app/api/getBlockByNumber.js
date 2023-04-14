const Router = require('express-promise-router');
const router = new Router();

module.exports = (pool) => {
  router.get('/:blockNumber', async (req, res) => {
    const { blockNumber } = req.params;
    const result = await pool.query('SELECT * FROM blocks WHERE block_number = $1', [parseInt(blockNumber, 16)]);

    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Block not found' });
    }
  });

  return router;
};
