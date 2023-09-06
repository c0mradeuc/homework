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
}

module.exports = JobsRepository
