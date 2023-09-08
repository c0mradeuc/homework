const { getProfile } = require('../middleware/getProfile')
const express = require('express')
const router = express.Router()
const ProfileType = require('../enums/profileType')
const HttpStatus = require('../enums/httpStatus')
const { baseRouteBuilder } = require('../middleware/errorHandling')
const validateModel = require('../middleware/validateModel')
const Joi = require('joi')
const NotAcceptableError = require('../errorHandling/notAcceptableError')

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

  if (profile.type === ProfileType.Contractor) throw new NotAcceptableError('A Contractor profile cannot deposit money into its balance')

  const contracts = await contractsRepository.findContracts(profile.id, profile.type)
  const contractIds = contracts.map((c) => c.id)
  const unpaidJobs = await jobsRepository.findUnpaidJobs(contractIds)
  const totalDebt = unpaidJobs.reduce((acc, val) => acc + val.price, 0)

  if (depositAmount > totalDebt * totalDebtMaxPercentageDeposit) throw new NotAcceptableError('A a client cant deposit more than 25% his total of jobs to pay')

  const client = await profilesRepository.balanceDeposit(profile.id, depositAmount)

  res.json({ client })
}

const depositBalanceSchema = Joi.object({
  userId: Joi.number().required(),
  amount: Joi.number().min(1).required(),
})

router.post('/deposit/:userId', getProfile, validateModel(depositBalanceSchema), baseRouteBuilder(depositBalance))

module.exports = router
