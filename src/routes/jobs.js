const { getProfile } = require('../middleware/getProfile')
const express = require('express')
const router = express.Router()
const ProfileType = require('../enums/profile_type')
const HttpStatus = require('../enums/http_status')

/**
 * Seeks for a unpaid jobs for the given user in active contracts
 */
router.get('/unpaid', getProfile, async (req, res) => {
  const { jobsRepository, contractsRepository } = req.app.get('repositories')
  const activeContracts = await contractsRepository.findActiveContracts(req.profile.id, req.profile.type)
  const contractIds = activeContracts.map((c) => c.id)
  const unpaidJobs = await jobsRepository.findUnpaidJobs(contractIds)

  res.json(unpaidJobs)
})

/**
 * Pay for a job
 */
router.post('/:jobId/pay', getProfile, async (req, res) => {
  const profile = req.profile
  if (profile.type === ProfileType.Contractor) return res.status(HttpStatus.BadRequest).json({ message: 'A Contractor profile cannot pay a job' }).end()
  const { jobsRepository, profilesRepository, contractsRepository } = req.app.get('repositories')
  const jobId = Number(req.params.jobId)
  const job = await jobsRepository.findJobById(jobId, profile.id)
  const contract = await contractsRepository.findById(profile.id, profile.type, job.ContractId)

  if (!job) return res.status(HttpStatus.NotFound).json({ message: 'The client does not has a job with the given id' }).end()
  if (job.paid) return res.status(HttpStatus.NotAcceptable).json({ message: 'The job is already paid' }).end()
  if (!contract) return res.status(HttpStatus.Forbidden).json({ message: 'The client is not authorized to pay for this job' }).end()
  if (profile.balance < job.price) return res.status(HttpStatus.NotAcceptable).json({ message: 'The client does not has enough balance to pay for this job' }).end()

  const result = await profilesRepository.payJob(contract.ClientId, contract.ContractorId, job.id)

  res.json(result)
})

module.exports = router
