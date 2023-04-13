const express = require('express');

module.exports = function(pool) {
  const router = express.Router();

  // Create a new oracle
  router.post('/create', async (req, res) => {
    try {
      const { userId, jobId, payment } = req.body;

      const createOracleQuery = {
        text: 'INSERT INTO oracles(user_id, job_id, payment) VALUES($1, $2, $3) RETURNING *',
        values: [userId, jobId, payment],
      };

      const result = await pool.query(createOracleQuery);
      res.status(201).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ message: 'Error creating oracle', error });
    }
  });

  // Get an oracle by ID
  router.get('/:id', async (req, res) => {
    try {
      const { id } = req.params;

      const getOracleQuery = {
        text: 'SELECT * FROM oracles WHERE id = $1',
        values: [id],
      };

      const result = await pool.query(getOracleQuery);
      if (result.rows.length > 0) {
        res.json(result.rows[0]);
      } else {
        res.status(404).json({ message: 'Oracle not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving oracle', error });
    }
  });

  // Get all oracles
  router.get('/', async (req, res) => {
    try {
      const getAllOraclesQuery = {
        text: 'SELECT * FROM oracles',
      };

      const result = await pool.query(getAllOraclesQuery);
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving oracles', error });
    }
  });

  // Update an oracle's payment
  router.put('/:id/updatePayment', async (req, res) => {
    try {
      const { id } = req.params;
      const { payment } = req.body;

      const updateOraclePaymentQuery = {
        text: 'UPDATE oracles SET payment = $1 WHERE id = $2 RETURNING *',
        values: [payment, id],
      };

      const result = await pool.query(updateOraclePaymentQuery);
      if (result.rows.length > 0) {
        res.json(result.rows[0]);
      } else {
        res.status(404).json({ message: 'Oracle not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error updating oracle payment', error });
    }
  });

  // Delete an oracle by ID
  router.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;

      const deleteOracleQuery = {
        text: 'DELETE FROM oracles WHERE id = $1',
        values: [id],
      };

      await pool.query(deleteOracleQuery);
      res.status(204).json({ message: 'Oracle deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting oracle', error });
    }
  });

  return router;
};
