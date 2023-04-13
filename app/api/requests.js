const express = require('express');

module.exports = function(pool, wss) {
  const router = express.Router();

  // Create a new request
  router.post('/create', async (req, res) => {
    try {
      const { oracleId, jobId, url, path, times } = req.body;

      const createRequestQuery = {
        text: 'INSERT INTO requests(oracle_id, job_id, url, path, times) VALUES($1, $2, $3, $4, $5) RETURNING *',
        values: [oracleId, jobId, url, path, times],
      };

      const result = await pool.query(createRequestQuery);
      const newRequest = result.rows[0];

      // Broadcast the new request to subscribed WebSocket clients
      wss.broadcast('newRequest', newRequest);

      res.status(201).json(newRequest);
    } catch (error) {
      res.status(500).json({ message: 'Error creating request', error });
    }
  });

  // Get a request by ID
  router.get('/:id', async (req, res) => {
    try {
      const { id } = req.params;

      const getRequestQuery = {
        text: 'SELECT * FROM requests WHERE id = $1',
        values: [id],
      };

      const result = await pool.query(getRequestQuery);
      if (result.rows.length > 0) {
        res.json(result.rows[0]);
      } else {
        res.status(404).json({ message: 'Request not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving request', error });
    }
  });

  // Get all requests
  router.get('/', async (req, res) => {
    try {
      const getAllRequestsQuery = {
        text: 'SELECT * FROM requests',
      };

      const result = await pool.query(getAllRequestsQuery);
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving requests', error });
    }
  });

  // Delete a request by ID
  router.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;

      const deleteRequestQuery = {
        text: 'DELETE FROM requests WHERE id = $1',
        values: [id],
      };

      await pool.query(deleteRequestQuery);
      res.status(204).json({ message: 'Request deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting request', error });
    }
  });

  return router;
};
