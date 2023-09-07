class ProfileRepository {
  constructor(profilesDb, sequelize, jobsDb) {
    this.profilesDb = profilesDb
    this.sequelize = sequelize
    this.jobsDb = jobsDb
  }

  /**
   * Pay for a job. Moves the balance from client to contractor and update job payment status.
   * @param {number} clientId The client identifier
   * @param {number} contractorId The contractor identifier
   * @param {number} jobId The job identifier
   */
  async payJob(clientId, contractorId, jobId) {
    const t = await this.sequelize.transaction()
    try {
      const client = await this.profilesDb.findByPk(clientId, { transaction: t })
      const contractor = await this.profilesDb.findByPk(contractorId, { transaction: t })
      const job = await this.jobsDb.findByPk(jobId, { transaction: t })

      // Reduce job price from client balance
      client.balance -= job.price
      // Add job price to contractor balance
      contractor.balance += job.price
      // Update job payment status
      job.paid = true
      job.paymentDate = new Date()

      await client.save({ transaction: t })
      await contractor.save({ transaction: t })
      await job.save({ transaction: t })
      await t.commit()

      return { client, contractor, job }
    }
    catch (error) {
      await t.rollback()
      throw error
    }
  }

  /**
   * Deposit money into client balance
   * @param {number} clientId The client id
   * @param {number} amount The amount to deposit
   */
  async balanceDeposit(clientId, amount) {
    const client = await this.profilesDb.findByPk(clientId)

    client.balance += amount

    await client.save()

    return client
  }

  /**
   * Find a user profile by its id
   * @param {number} userId The user id
   * @return {Promise<Profile>} The user profile
   */
  async getProfileById(userId) {
    return await this.profilesDb.findOne({ where: { id: userId } })
  }
}

module.exports = ProfileRepository
