const { getProfile } = require('../middleware/getProfile')
const ProfileRepository = require('../repositories/profile')
const JobsRepository = require('../repositories/jobs')
const express = require('express')
const router = express.Router()

const defaultLimit = 2

/**
 * Search for the most paid profession in a given time range
 */
router.get('/best-profession', getProfile, async (req, res) => {
  const { start, end } = req.query
  const { Job, Profile } = req.app.get('models')
  const sequelize = req.app.get('sequelize')
  const jobsRepo = new JobsRepository(Job)
  const profileRepo = new ProfileRepository(Profile, sequelize, Job)
  const paidJobs = await jobsRepo.findPaidJobs(start, end)
  const paymentsReceivedByContractor = {}
  let maxPayment = -Infinity
  let maxPaymentProfileId = null

  for (const job of paidJobs) {
    const jobContractorId = job.Contract.ContractorId
    if (paymentsReceivedByContractor[jobContractorId]) paymentsReceivedByContractor[jobContractorId] += job.price
    else paymentsReceivedByContractor[jobContractorId] = job.price

    if (maxPayment < paymentsReceivedByContractor[jobContractorId]) {
      maxPayment = paymentsReceivedByContractor[jobContractorId]
      maxPaymentProfileId = jobContractorId
    }
  }

  if (!maxPaymentProfileId) res.json({ profession: null })

  const user = await profileRepo.getProfileById(Number(maxPaymentProfileId))

  res.json({ profession: user.profession })
})

/**
 * Search the clients that paid the most for jobs in a given time range
 */
router.get('/best-clients', getProfile, async (req, res) => {
  const { start, end, limit = defaultLimit } = req.query
  const { Job, Profile } = req.app.get('models')
  const sequelize = req.app.get('sequelize')
  const jobsRepo = new JobsRepository(Job)
  const profileRepo = new ProfileRepository(Profile, sequelize, Job)
  const paidJobs = await jobsRepo.findPaidJobs(start, end)
  let bestClients = []

  if (paidJobs.length === 0) res.json({ bestClients })

  const paymentsReceivedByClient = {}

  for (const job of paidJobs) {
    const jobClientId = job.Contract.ClientId

    if (paymentsReceivedByClient[jobClientId]) paymentsReceivedByClient[jobClientId] += job.price
    else paymentsReceivedByClient[jobClientId] = job.price
  }

  for (const userId in paymentsReceivedByClient) {
    if (Object.hasOwn(paymentsReceivedByClient, userId)) {
      const totalPaid = paymentsReceivedByClient[userId]
      bestClients.push({ id: Number(userId), paid: totalPaid })
    }
  }

  bestClients = bestClients.sort((a, b) => b.paid - a.paid).slice(0, limit)

  for (const client of bestClients) {
    const profile = await profileRepo.getProfileById(client.id)
    client.fullName = `${profile.firstName} ${profile.lastName}`
  }

  res.json({ bestClients })
})

module.exports = router
