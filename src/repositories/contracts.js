const { Op } = require('sequelize')
const ContractStatus = require('../enums/contract_status')

class ContractsRepository {
  constructor(contractDb) {
    this.contractDb = contractDb
  }

  /**
   * Seeks for a contract by id that belongs to the profile that's requesting.
   * @param {number} profileId The profile id
   * @param {number} contractId The contract id
   * @returns {Promise<Contract>} the found contract.
   */
  async findById(profileId, contractId) {
    const query = {
      where: {
        [Op.and]: [
          { id: contractId },
          {
            [Op.or]: [
              { ContractorId: profileId },
              { ClientId: profileId }
            ]
          }
        ]
      }
    }

    return await this.contractDb.findOne(query)
  }

  /**
   * Seeks for non terminated contracts belongs to the profile that's requesting.
   * @param {number} profileId The profile id
   * @return {Promise<Contract[]>} a list of contracts
   */
  async findNonTerminatedContracts(profileId) {
    const query = {
      where: {
        [Op.and]: [
          {
            status: {
              [Op.in]: [ContractStatus.New, ContractStatus.InProgress]
            }
          },
          {
            [Op.or]: [
              { ContractorId: profileId },
              { ClientId: profileId }
            ]
          }
        ]
      }
    }

    return await this.contractDb.findAll(query)
  }
}

module.exports = ContractsRepository
