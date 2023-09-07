const { getProfile } = require('../middleware/getProfile')
const express = require('express')
const router = express.Router()
const ProfileType = require('../enums/profile_type')
const HttpStatus = require('../enums/http_status')
const { baseRouteBuilder } = require('../middleware/errorHandling')

const totalDebtMaxPercentageDeposit = 0.25

/**
 * Deposits money into the balance of a client
 * @param {*} req Express request object
 * @param {*} res Express response object
 */
async function depositBalance(req, res) {
  const profile = req.profile
  const depositAmount = req.body.amount
  if (profile.type === ProfileType.Contractor) return res.status(HttpStatus.BadRequest).json({ message: 'A Client profile cannot deposit money into its balance' }).end()

  const { jobsRepository, profilesRepository, contractsRepository } = req.app.get('repositories')
  const contracts = await contractsRepository.findContracts(profile.id, profile.type)
  const contractIds = contracts.map((c) => c.id)
  const unpaidJobs = await jobsRepository.findUnpaidJobs(contractIds)
  const totalDebt = unpaidJobs.reduce((acc, val) => acc + val.price, 0)

  if (depositAmount > totalDebt * totalDebtMaxPercentageDeposit) return res.status(HttpStatus.NotAcceptable).json({ message: 'A a client cant deposit more than 25% his total of jobs to pay' }).end()

  const client = await profilesRepository.balanceDeposit(profile.id, depositAmount)

  res.json({ client })
}

router.post('/deposit/:userId', getProfile, baseRouteBuilder(depositBalance))

module.exports = router
