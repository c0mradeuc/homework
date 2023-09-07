const { getProfile } = require('../middleware/getProfile')
const ContractsRepository = require('../repositories/contracts')
const JobsRepository = require('../repositories/jobs')
const ProfileRepository = require('../repositories/profile')
const express = require('express')
const router = express.Router()
const ProfileType = require('../enums/profile_type')
const HttpStatus = require('../enums/http_status')

const totalDebtMaxPercentageDeposit = 0.25

/**
 * Deposits money into the balance of a client
 */
router.post('/deposit/:userId', getProfile, async (req, res) => {
  const profile = req.profile
  const depositAmount = req.body.amount
  if (profile.type === ProfileType.Contractor) return res.status(HttpStatus.BadRequest).json({ message: 'A Client profile cannot deposit money into its balance' }).end()

  const { Contract, Job, Profile } = req.app.get('models')
  const sequelize = req.app.get('sequelize')
  const contractRepo = new ContractsRepository(Contract)
  const jobsRepo = new JobsRepository(Job)
  const profileRepo = new ProfileRepository(Profile, sequelize, Job)
  const contracts = await contractRepo.findContracts(profile.id, profile.type)
  const contractIds = contracts.map((c) => c.id)
  const unpaidJobs = await jobsRepo.findUnpaidJobs(contractIds)
  const totalDebt = unpaidJobs.reduce((acc, val) => acc + val.price, 0)

  if (depositAmount > totalDebt * totalDebtMaxPercentageDeposit) return res.status(HttpStatus.NotAcceptable).json({ message: 'A a client cant deposit more than 25% his total of jobs to pay' }).end()

  const client = await profileRepo.balanceDeposit(profile.id, depositAmount)

  res.json({ client })
})

module.exports = router
