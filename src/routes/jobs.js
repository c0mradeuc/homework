const { getProfile } = require('../middleware/getProfile')
const ContractsRepository = require('../repositories/contracts')
const JobsRepository = require('../repositories/jobs')
const express = require('express')
const router = express.Router()

/**
 * Seeks for a unpaid jobs for the given user in active contracts
 */
router.get('/unpaid', getProfile, async (req, res) => {
  const { Contract, Job } = req.app.get('models')
  const contractRepo = new ContractsRepository(Contract)
  const jobsRepo = new JobsRepository(Job)
  const activeContracts = await contractRepo.findActiveContracts(req.profile.id, req.profile.type)
  const contractIds = activeContracts.map((c) => c.id)
  const unpaidJobs = await jobsRepo.findUnpaidJobs(contractIds)

  res.json(unpaidJobs)
})

module.exports = router
