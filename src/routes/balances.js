const { getProfile } = require('../middleware/getProfile')
const express = require('express')
const router = express.Router()
const ProfileType = require('../enums/profile_type')
const HttpStatus = require('../enums/http_status')
const { baseRouteBuilder } = require('../middleware/errorHandling')
const validateModel = require('../middleware/validateModel')
const Joi = require('joi')

const totalDebtMaxPercentageDeposit = 0.25

/**
 * Deposits money into the balance of a client
 * @param {*} req Express request object
 * @param {*} res Express response object
 */
async function depositBalance(req, res) {
  const { jobsRepository, profilesRepository, contractsRepository } = req.app.get('repositories')
  const profile = await profilesRepository.getProfileById(Number(req.params.userId))
  const depositAmount = req.body.amount

  if (profile.type === ProfileType.Contractor) return res.status(HttpStatus.NotAcceptable).json({ message: 'A Contractor profile cannot deposit money into its balance' }).end()

  const contracts = await contractsRepository.findContracts(profile.id, profile.type)
  const contractIds = contracts.map((c) => c.id)
  const unpaidJobs = await jobsRepository.findUnpaidJobs(contractIds)
  const totalDebt = unpaidJobs.reduce((acc, val) => acc + val.price, 0)

  if (depositAmount > totalDebt * totalDebtMaxPercentageDeposit) return res.status(HttpStatus.NotAcceptable).json({ message: 'A a client cant deposit more than 25% his total of jobs to pay' }).end()

  const client = await profilesRepository.balanceDeposit(profile.id, depositAmount)

  res.json({ client })
}

const depositBalanceSchema = Joi.object({
  userId: Joi.number().required(),
  amount: Joi.number().min(1).required(),
})

router.post('/deposit/:userId', getProfile, validateModel(depositBalanceSchema), baseRouteBuilder(depositBalance))

module.exports = router
