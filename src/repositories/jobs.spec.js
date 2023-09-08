const seed = require('../../scripts/seedDb')
const Job = require('../models/job')
const JobsRepository = require('./jobs')

describe('JobsRepository', () => {
  let repo = null

  beforeAll(async () => {
    await seed()
    repo = new JobsRepository(Job)
  })

  it('[findUnpaidJobs] Should return unpaid jobs for the given contracts', async () => {
    const contractIds = [1, 2]
    const jobs = await repo.findUnpaidJobs(contractIds)

    expect(jobs).toHaveLength(2)
    expect(jobs[0].id).toEqual(1)
    expect(jobs[0].description).toEqual('work')
    expect(jobs[0].price).toEqual(200)
    expect(jobs[0].paid).toEqual(false)
    expect(jobs[0].paymentDate).toEqual(null)
    expect(jobs[0].ContractId).toEqual(1)
    expect(jobs[1].id).toEqual(2)
    expect(jobs[1].description).toEqual('work')
    expect(jobs[1].price).toEqual(201)
    expect(jobs[1].paid).toEqual(false)
    expect(jobs[1].paymentDate).toEqual(null)
    expect(jobs[1].ContractId).toEqual(2)
  })

  it('[findJobById] Should return the found job', async () => {
    const jobId = 10
    const job = await repo.findJobById(jobId)

    expect(job.id).toEqual(10)
    expect(job.description).toEqual('work')
    expect(job.price).toEqual(200)
    expect(job.paid).toEqual(true)
    expect(job.paymentDate).toEqual(new Date('2020-08-17T19:11:26.737Z'))
    expect(job.ContractId).toEqual(5)
  })

  it('[findJobById] Should return null if the job is not found', async () => {
    const jobId = 10233
    const job = await repo.findJobById(jobId)

    expect(job).toEqual(null)
  })

  it('[findPaidJobs] Should the found paid jobs in the given time range', async () => {
    const start = new Date('2020-08-09T00:00:00.000Z')
    const end = new Date('2020-08-11T00:00:00.000Z')
    const jobs = await repo.findPaidJobs(start, end)

    expect(jobs).toHaveLength(1)
    expect(jobs[0].id).toEqual(11)
    expect(jobs[0].paid).toEqual(true)
    expect(jobs[0].price).toEqual(21)
    expect(jobs[0].description).toEqual('work')
    expect(jobs[0].ContractId).toEqual(1)
    expect(jobs[0].paymentDate).toEqual(new Date('2020-08-10T19:11:26.737Z'))
  })

  it('[findPaidJobs] Should the empty array if no jobs is found in the given time range', async () => {
    const start = new Date('2023-08-09T00:00:00.000Z')
    const end = new Date('2023-08-11T00:00:00.000Z')
    const jobs = await repo.findPaidJobs(start, end)

    expect(jobs).toHaveLength(0)
  })
})
