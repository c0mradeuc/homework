const { getProfile } = require('../middleware/getProfile')
const { Op } = require('sequelize')
const express = require('express');
const router = express.Router();

/**
 * Search for a contract by id that belongs to the profile that's querying.
 * @returns contract by id.
 */
router.get('/:id', getProfile, async (req, res) => {
  const { Contract } = req.app.get('models')
  const { id } = req.params
  const query = {
    where: {
      [Op.and]: [
        { id },
        {
          [Op.or]: [
            { ContractorId: req.profile.id },
            { ClientId: req.profile.id }
          ]
        }
      ]
    }
  }
  const contract = await Contract.findOne(query)

  if (!contract) return res.status(404).end()

  res.json(contract)
})

module.exports = router
