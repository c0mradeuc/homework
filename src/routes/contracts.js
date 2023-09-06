const { getProfile } = require('../middleware/getProfile')
const ContractStatus = require('../enums/contract_status')
const { Op } = require('sequelize')
const express = require('express')
const router = express.Router()

/**
 * Seeks for a contract by id that belongs to the profile that's requesting.
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

/**
 * Seeks for non terminated contracts belongs to the profile that's requesting.
 * @returns a list of contracts
 */
router.get('/', getProfile, async (req, res) => {
  const { Contract } = req.app.get('models')
  const query = {
    where: {
      [Op.and]: [
        {
          status: {
            [Op.in]: [ContractStatus.New, ContractStatus.InProgress]
          }
        },
        {
          [Op.or]: [
            { ContractorId: req.profile.id },
            { ClientId: req.profile.id }
          ]
        }
      ]
    }
  }
  const contract = await Contract.findAll(query)

  if (!contract) return res.status(404).end()

  res.json(contract)
})

module.exports = router
