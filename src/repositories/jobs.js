const { Op } = require('sequelize')

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
    return await this.jobsDb.findOne({ where: { id: jobId }})
  }
}

module.exports = JobsRepository
