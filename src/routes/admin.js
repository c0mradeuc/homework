const { getProfile } = require('../middleware/getProfile')
const ProfileRepository = require('../repositories/profile')
const JobsRepository = require('../repositories/jobs')
const express = require('express')
const router = express.Router()

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
    if (paymentsReceivedByContractor[job.Contract.ContractorId]) paymentsReceivedByContractor[job.Contract.ContractorId] += job.price
    else paymentsReceivedByContractor[job.Contract.ContractorId] = job.price

    if (maxPayment < paymentsReceivedByContractor[job.Contract.ContractorId]) {
      maxPayment = paymentsReceivedByContractor[job.Contract.ContractorId]
      maxPaymentProfileId = job.Contract.ContractorId
    }
  }

  if (!maxPaymentProfileId) res.json({ profession: null })

  const user = await profileRepo.getProfileById(maxPaymentProfileId)

  res.json({ profession: user.profession })
})


module.exports = router
