const Sequelize = require('sequelize')

const isTesting = process.env.NODE_ENV === 'test'

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: isTesting ? ':memory:' : './database.sqlite3',
  logging: !isTesting
})

module.exports = sequelize
