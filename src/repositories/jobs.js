const { Op } = require('sequelize')
const Contract = require('../models/contract')

class JobsRepository {
  constructor(jobsDb) {
    this.jobsDb = jobsDb
  }

  /**
   * Seeks for unpaid jobs for the given contract ids.
   * @param {number[]} contractIds A list of contract ids
   * @return {Promise<Job>} An array of jobs
   */
  async findUnpaidJobs(contractIds) {
    const query = {
      where: {
        contractId: {
          [Op.in]: contractIds
        },
        paid: false
      }
    }

    return await this.jobsDb.findAll(query)
  }

  /**
   * Seeks a job by its id
   * @param {number} jobId The job id
   * @return {Promise<Job>} The found job
   */
  async findJobById(jobId) {
    return await this.jobsDb.findOne({ where: { id: jobId } })
  }

  /**
   * Find paid jobs in a given time range
   * @param {Date} start The date start
   * @param {Date} end The date end
   * @return {Promise<Job[]>} A list of jobs
   */
  async findPaidJobs(start, end) {
    const query = {
      where: {
        paid: true,
        paymentDate: {
          [Op.lte]: end,
          [Op.gte]: start
        }
      },
      include: Contract
    }

    return await this.jobsDb.findAll(query)
  }
}

module.exports = JobsRepository
