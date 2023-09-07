const Sequelize = require('sequelize')
const sequelize = require('../sequelize')
const ContractStatus = require('../enums/contractStatus')

class Contract extends Sequelize.Model { }
Contract.init(
  {
    terms: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    status: {
      type: Sequelize.ENUM(ContractStatus.New, ContractStatus.InProgress, ContractStatus.Terminated)
    },
  },
  {
    sequelize,
    modelName: 'Contract',
  }
)

module.exports = Contract
