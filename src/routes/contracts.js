const { getProfile } = require('../middleware/getProfile')
const { baseRouteBuilder } = require('../middleware/errorHandling')
const express = require('express')
const router = express.Router()

/**
 * Seeks for a contract by id that belongs to the profile that's requesting.
 * @param {*} req Express request object
 * @param {*} res Express response object
 */
async function getContractById(req, res) {
  const { contractsRepository } = req.app.get('repositories')
  const contract = await contractsRepository.findById(req.profile.id, req.profile.type, req.params.id)

  if (!contract) return res.status(404).end()

  res.json(contract)
}

/**
 * Seeks for non terminated contracts belongs to the profile that's requesting.
 * @param {*} req Express request object
 * @param {*} res Express response object
 */
async function getNonTerminatedContracts(req, res) {
  const { contractsRepository } = req.app.get('repositories')
  const contracts = await contractsRepository.findNonTerminatedContracts(req.profile.id, req.profile.type)

  res.json(contracts)
}

router.get('/:id', getProfile, baseRouteBuilder(getContractById))
router.get('/', getProfile, baseRouteBuilder(getNonTerminatedContracts))

module.exports = router
