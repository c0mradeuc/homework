const { Op } = require('sequelize')
const ContractStatus = require('../enums/contract_status')
const ProfileType = require('../enums/profile_type')

class ContractsRepository {
  constructor(contractDb) {
    this.contractDb = contractDb
  }

  /**
   * Seeks for a contract by id that belongs to the profile that's requesting.
   * @param {number} profileId The profile id
   * @param {number} profileType The profile type
   * @param {number} contractId The contract id
   * @returns {Promise<Contract>} the found contract.
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
   * Seeks for non terminated contracts belongs to the profile that's requesting.
   * @param {number} profileId The profile id
   * @param {number} profileType The profile type
   * @return {Promise<Contract[]>} a list of contracts
   */
  async findNonTerminatedContracts(profileId, profileType) {
    const query = {
      where: {
        status: {
          [Op.in]: [ContractStatus.New, ContractStatus.InProgress]
        }
      }
    }

    if (profileType === ProfileType.Client) query.where.ClientId = profileId
    else if (profileType === ProfileType.Contractor) query.where.ContractorId = profileId

    return await this.contractDb.findAll(query)
  }
}

module.exports = ContractsRepository
