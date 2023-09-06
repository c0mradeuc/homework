const { getProfile } = require('../middleware/getProfile')
const ContractStatus = require('../enums/contract_status')
const { Op } = require('sequelize')
const ContractsRepository = require('../repositories/contracts')
const express = require('express')
const router = express.Router()

/**
 * Seeks for a contract by id that belongs to the profile that's requesting.
 */
router.get('/:id', getProfile, async (req, res) => {
  const { Contract } = req.app.get('models')
  const { id } = req.params
  const repository = new ContractsRepository(Contract)
  const contract = await repository.findById(req.profile.id, id)

  if (!contract) return res.status(404).end()

  res.json(contract)
})

/**
 * Seeks for non terminated contracts belongs to the profile that's requesting.
 */
router.get('/', getProfile, async (req, res) => {
  const { Contract } = req.app.get('models')
  const repository = new ContractsRepository(Contract)
  const contracts = await repository.findNonTerminatedContracts(req.profile.id)

  res.json(contracts)
})

module.exports = router
