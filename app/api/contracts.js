const express = require('express');

function contracts(pool) {
  const router = express.Router();

  router.post('/deploy', async (req, res) => {
    const client = await pool.connect();
    try {
      const { contractAddress, ownerAddress, fulfillerAddress } = req.body;

      await client.query('BEGIN');

      // Insert the Oracle contract into the database
      const insertContractQuery = `
        INSERT INTO contracts (address, contract_type, owner)
        VALUES ($1, $2, $3)
        RETURNING id, address, contract_type, owner;
      `;
      const contractType = 'Oracle';
      const insertContractResult = await client.query(insertContractQuery, [contractAddress, contractType, ownerAddress]);
      const contract = insertContractResult.rows[0];

      // Modify the fulfillment permission for a specific address
      const setAddressFulfillmentPermissionQuery = `
        UPDATE contracts
        SET fulfillers = array_append(fulfillers, $1)
        WHERE id = $2;
      `;
      await client.query(setAddressFulfillmentPermissionQuery, [fulfillerAddress, contract.id]);

      await client.query('COMMIT');

      res.json({ message: 'Oracle contract deployed and fulfillment permission updated.', contract });
    } catch (error) {
      console.error('Error deploying Oracle contract:', error);
      await client.query('ROLLBACK');
      res.status(500).json({ message: 'Error deploying Oracle contract.' });
    } finally {
      client.release();
    }
  });

  return router;
}

module.exports = contracts;
