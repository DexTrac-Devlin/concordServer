const express = require('express');
const bcrypt = require('bcrypt');

module.exports = function(pool) {
  const router = express.Router();

  // Create a new user
  router.post('/create', async (req, res) => {
    try {
      const { username, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);

      const createUserQuery = {
        text: 'INSERT INTO users(username, password) VALUES($1, $2) RETURNING id, username',
        values: [username, hashedPassword],
      };

      const result = await pool.query(createUserQuery);
      res.status(201).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ message: 'Error creating user', error });
    }
  });

  // Get a user by ID
  router.get('/:id', async (req, res) => {
    try {
      const { id } = req.params;

      const getUserQuery = {
        text: 'SELECT id, username FROM users WHERE id = $1',
        values: [id],
      };

      const result = await pool.query(getUserQuery);
      if (result.rows.length > 0) {
        res.json(result.rows[0]);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving user', error });
    }
  });

  // Get all users
  router.get('/', async (req, res) => {
    try {
      const getAllUsersQuery = {
        text: 'SELECT id, username FROM users',
      };

      const result = await pool.query(getAllUsersQuery);
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving users', error });
    }
  });

  // Update a user's password
  router.put('/:id/updatePassword', async (req, res) => {
    try {
      const { id } = req.params;
      const { newPassword } = req.body;
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      const updateUserPasswordQuery = {
        text: 'UPDATE users SET password = $1 WHERE id = $2 RETURNING id, username',
        values: [hashedPassword, id],
      };

      const result = await pool.query(updateUserPasswordQuery);
      if (result.rows.length > 0) {
        res.json(result.rows[0]);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error updating user password', error });
    }
  });

  // Delete a user by ID
  router.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;

      const deleteUserQuery = {
        text: 'DELETE FROM users WHERE id = $1',
        values: [id],
      };

      await pool.query(deleteUserQuery);
      res.status(204).json({ message: 'User deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting user', error });
    }
  });

  return router;
};
