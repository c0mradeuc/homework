const { baseRouteBuilder } = require('../middleware/errorHandling')
const { getProfile } = require('../middleware/getProfile')
const express = require('express')
const router = express.Router()
const ProfileType = require('../enums/profileType')
const validateModel = require('../middleware/validateModel')
const Joi = require('joi')
const NotAcceptableError = require('../errorHandling/notAcceptableError')
const ForbbidenError = require('../errorHandling/forbiddenError')
const NotFoundError = require('../errorHandling/notFoundError')

/**
 * Seeks for a unpaid jobs for the given user in active contracts
 * @param {*} req Express request object
 * @param {*} res Express response object
 */
async function getUnpaidJobs(req, res) {
  const { jobsRepository, contractsRepository } = req.app.get('repositories')
  const activeContracts = await contractsRepository.findActiveContracts(req.profile.id, req.profile.type)
  const contractIds = activeContracts.map((c) => c.id)
  const unpaidJobs = await jobsRepository.findUnpaidJobs(contractIds)

  res.json(unpaidJobs)
}

/**
 * Pay for a job
 * @param {*} req Express request object
 * @param {*} res Express response object
 */
async function payJob(req, res) {
  const profile = req.profile
  if (profile.type === ProfileType.Contractor) throw new NotAcceptableError('A Contractor profile cannot pay a job')
  const { jobsRepository, profilesRepository, contractsRepository } = req.app.get('repositories')
  const jobId = Number(req.params.jobId)
  const job = await jobsRepository.findJobById(jobId, profile.id)
  const contract = await contractsRepository.findById(profile.id, profile.type, job.ContractId)

  if (!job) throw new NotFoundError('The client does not has a job with the given id')
  if (job.paid) throw new NotAcceptableError('The job is already paid')
  if (!contract) throw new ForbbidenError('The client is not authorized to pay for this job')
  if (profile.balance < job.price) throw new NotAcceptableError('The client does not has enough balance to pay for this job')

  const result = await profilesRepository.payJob(contract.ClientId, contract.ContractorId, job.id)

  res.json(result)
}

const payJobSchema = Joi.object({
  jobId: Joi.number().required(),
})

router.get('/unpaid', getProfile, baseRouteBuilder(getUnpaidJobs))
router.post('/:jobId/pay', getProfile, validateModel(payJobSchema), baseRouteBuilder(payJob))

module.exports = router
