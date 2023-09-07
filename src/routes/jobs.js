const { getProfile } = require('../middleware/getProfile')
const ContractsRepository = require('../repositories/contracts')
const JobsRepository = require('../repositories/jobs')
const ProfileRepository = require('../repositories/profile')
const express = require('express')
const router = express.Router()
const ProfileType = require('../enums/profile_type')
const HttpStatus = require('../enums/http_status')

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

/**
 * Pay for a job
 */
router.post('/:job_id/pay', getProfile, async (req, res) => {
  const profile = req.profile
  if (profile.type === ProfileType.Contractor) return res.status(HttpStatus.BadRequest).json({ message: 'A Contractor profile cannot pay a job' }).end()
  const { Contract, Job, Profile } = req.app.get('models')
  const sequelize = req.app.get('sequelize')
  const jobId = Number(req.params.job_id)
  const jobsRepo = new JobsRepository(Job)
  const contractRepo = new ContractsRepository(Contract)
  const profileRepo = new ProfileRepository(Profile, sequelize, Job)
  const job = await jobsRepo.findJobById(jobId, profile.id)
  const contract = await contractRepo.findById(profile.id, profile.type, job.ContractId)

  if (!job) return res.status(HttpStatus.NotFound).json({ message: 'The client does not has a job with the given id' }).end()
  if (job.paid) return res.status(HttpStatus.NotAcceptable).json({ message: 'The job is already paid' }).end()
  if (!contract) return res.status(HttpStatus.Forbidden).json({ message: 'The client is not authorized to pay for this job' }).end()
  if (profile.balance < job.price) return res.status(HttpStatus.NotAcceptable).json({ message: 'The client does not has enough balance to pay for this job' }).end()

  const result = await profileRepo.payJob(contract.ClientId, contract.ContractorId, job.id)

  res.json(result)
})

module.exports = router
