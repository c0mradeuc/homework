const { Op } = require('sequelize')
const ContractStatus = require('../enums/contractStatus')
const ProfileType = require('../enums/profileType')

class ContractsRepository {
  constructor(contractDb) {
    this.contractDb = contractDb
  }

  /**
   * Seeks for a contract by id that belongs to the profile that's requesting.
   * @param {number} profileId The profile id
   * @param {number} profileType The profile type
   * @param {number} contractId The contract id
   * @return {Promise<Contract>} the found contract.
   */
  async findById(profileId, profileType, contractId) {
    const query = {
      where: {
        id: contractId
      }
    }

    if (profileType === ProfileType.Client) query.where.ClientId = profileId
    else if (profileType === ProfileType.Contractor) query.where.ContractorId = profileId

    return await this.contractDb.findOne(query)
  }

  /**
   * Seeks for terminated contracts belongs to the profile that's requesting and in given statuses
   * @param {number} profileId The profile id
   * @param {number} profileType The profile type
   * @param {string[]} statuses The profile type
   * @return {Promise<Contract[]>} a list of contracts
   */
  async findContracts(profileId, profileType, statuses = []) {
    const query = { where: {} }

    if (statuses && statuses.length === 1) query.where.status = statuses[0]
    else if (statuses && statuses.length > 1) query.where.status = { [Op.in]: statuses }

    if (profileType === ProfileType.Client) query.where.ClientId = profileId
    else if (profileType === ProfileType.Contractor) query.where.ContractorId = profileId

    return await this.contractDb.findAll(query)
  }

  /**
   * Seeks for non terminated contracts belongs to the profile that's requesting.
   * @param {number} profileId The profile id
   * @param {number} profileType The profile type
   * @return {Promise<Contract[]>} a list of contracts
   */
  async findNonTerminatedContracts(profileId, profileType) {
    return await this.findContracts(profileId, profileType, [ContractStatus.New, ContractStatus.InProgress])
  }

  /**
   * Seeks for active contracts belongs to the profile that's requesting.
   * @param {number} profileId The profile id
   * @param {number} profileType The profile type
   * @return {Promise<Contract[]>} a list of contracts
   */
  async findActiveContracts(profileId, profileType) {
    return await this.findContracts(profileId, profileType, [ContractStatus.InProgress])
  }
}

module.exports = ContractsRepository
