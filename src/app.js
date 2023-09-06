const express = require('express')
const bodyParser = require('body-parser')
const sequelize = require('./sequelize')
const { getProfile } = require('./middleware/getProfile')
const app = express()

// Import sequelize models
const Profile = require('./models/profile')
const Job = require('./models/job')
const Contract = require('./models/contract')

// Configure relationships
Profile.hasMany(Contract, { as: 'Contractor', foreignKey: 'ContractorId' })
Profile.hasMany(Contract, { as: 'Client', foreignKey: 'ClientId' })
Contract.belongsTo(Profile, { as: 'Contractor' })
Contract.belongsTo(Profile, { as: 'Client' })
Contract.hasMany(Job)
Job.belongsTo(Contract)

// Config express
app.use(bodyParser.json())
app.set('sequelize', sequelize)
app.set('models', sequelize.models)

/**
 * FIX ME!
 * @returns contract by id
 */
app.get('/contracts/:id', getProfile, async (req, res) => {
  const { Contract } = req.app.get('models')
  const { id } = req.params
  const contract = await Contract.findOne({ where: { id } })
  if (!contract) return res.status(404).end()
  res.json(contract)
})
module.exports = app
