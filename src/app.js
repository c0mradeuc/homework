const express = require('express')
const bodyParser = require('body-parser')
const sequelize = require('./sequelize')
const errorHandling = require('./middleware/errorHandling')
const JobsRepository = require('./repositories/jobs')
const ProfileRepository = require('./repositories/profiles')
const ContractsRepository = require('./repositories/contracts')
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

// Create repository instances
const repos = {
  jobsRepository: new JobsRepository(Job),
  profilesRepository: new ProfileRepository(Profile, sequelize, Job),
  contractsRepository: new ContractsRepository(Contract)
}

// Config express
app.use(bodyParser.json())
app.set('sequelize', sequelize)
app.set('models', sequelize.models)
app.set('repositories', repos)

// Import routes
const contracts = require('./routes/contracts')
const jobs = require('./routes/jobs')
const balances = require('./routes/balances')
const admin = require('./routes/admin')

app.use('/contracts', contracts)
app.use('/jobs', jobs)
app.use('/balances', balances)
app.use('/admin', admin)
app.use(errorHandling)

module.exports = app
