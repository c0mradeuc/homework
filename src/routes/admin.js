const { getProfile } = require('../middleware/getProfile')
const express = require('express')
const router = express.Router()

const defaultLimit = 2

/**
 * Search for the most paid profession in a given time range
 */
router.get('/best-profession', getProfile, async (req, res) => {
  const { start, end } = req.query
  const { jobsRepository, profilesRepository } = req.app.get('repositories')
  const paidJobs = await jobsRepository.findPaidJobs(start, end)
  const paymentsReceivedByContractor = {}
  let maxPayment = -Infinity
  let maxPaymentProfileId = null

  // Sum paid amounts per contractor
  for (const job of paidJobs) {
    const jobContractorId = job.Contract.ContractorId
    if (paymentsReceivedByContractor[jobContractorId]) paymentsReceivedByContractor[jobContractorId] += job.price
    else paymentsReceivedByContractor[jobContractorId] = job.price

    // Set max paid amount
    if (maxPayment < paymentsReceivedByContractor[jobContractorId]) {
      maxPayment = paymentsReceivedByContractor[jobContractorId]
      maxPaymentProfileId = jobContractorId
    }
  }

  if (!maxPaymentProfileId) return res.json({ profession: null })

  const user = await profilesRepository.getProfileById(Number(maxPaymentProfileId))

  res.json({ profession: user.profession })
})

/**
 * Search the clients that paid the most for jobs in a given time range
 */
router.get('/best-clients', getProfile, async (req, res) => {
  const { start, end, limit = defaultLimit } = req.query
  const { jobsRepository, profilesRepository } = req.app.get('repositories')
  const paidJobs = await jobsRepository.findPaidJobs(start, end)
  let bestClients = []

  if (paidJobs.length === 0) return res.json({ bestClients })

  // Sum paid amounts per client
  for (const job of paidJobs) {
    const jobClientId = job.Contract.ClientId
    const clientIndex = bestClients.findIndex((c) => c.id === jobClientId)

    if (clientIndex > -1) bestClients[clientIndex].paid += job.price
    else bestClients.push({ id: Number(jobClientId), paid: job.price })
  }

  bestClients = bestClients.sort((a, b) => b.paid - a.paid).slice(0, limit)

  // Set client full name
  for (const client of bestClients) {
    const profile = await profilesRepository.getProfileById(client.id)
    client.fullName = `${profile.firstName} ${profile.lastName}`
  }

  return res.json({ bestClients })
})

module.exports = router
