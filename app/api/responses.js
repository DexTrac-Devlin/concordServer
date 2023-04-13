const express = require('express');

module.exports = function(pool, wss) {
  const router = express.Router();

  // Create a new response
  router.post('/create', async (req, res) => {
    try {
      const { requestId, oracleId, result } = req.body;

      const createResponseQuery = {
        text: 'INSERT INTO responses(request_id, oracle_id, result) VALUES($1, $2, $3) RETURNING *',
        values: [requestId, oracleId, result],
      };

      const result = await pool.query(createResponseQuery);
      const newResponse = result.rows[0];

      // Broadcast the new response to subscribed WebSocket clients
      wss.broadcast('newResponse', newResponse);

      res.status(201).json(newResponse);
    } catch (error) {
      res.status(500).json({ message: 'Error creating response', error });
    }
  });

  // Get a response by ID
  router.get('/:id', async (req, res) => {
    try {
      const { id } = req.params;

      const getResponseQuery = {
        text: 'SELECT * FROM responses WHERE id = $1',
        values: [id],
      };

      const result = await pool.query(getResponseQuery);
      if (result.rows.length > 0) {
        res.json(result.rows[0]);
      } else {
        res.status(404).json({ message: 'Response not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving response', error });
    }
  });

  // Get all responses
  router.get('/', async (req, res) => {
    try {
      const getAllResponsesQuery = {
        text: 'SELECT * FROM responses',
      };

      const result = await pool.query(getAllResponsesQuery);
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving responses', error });
    }
  });

  // Delete a response by ID
  router.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;

      const deleteResponseQuery = {
        text: 'DELETE FROM responses WHERE id = $1',
        values: [id],
      };

      await pool.query(deleteResponseQuery);
      res.status(204).json({ message: 'Response deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting response', error });
    }
  });

  return router;
};
