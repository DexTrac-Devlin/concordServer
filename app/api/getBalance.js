const Router = require('express-promise-router');
const router = new Router();

module.exports = (pool) => {
  router.get('/:address', async (req, res) => {
    const { address } = req.params;
    const result = await pool.query('SELECT balance FROM accounts WHERE address = $1', [address]);

    if (result.rows.length > 0) {
      res.json({ balance: result.rows[0].balance });
    } else {
      res.status(404).json({ error: 'Account not found' });
    }
  });

  return router;
};
