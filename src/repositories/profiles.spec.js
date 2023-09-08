const seed = require('../../scripts/seedDb')
const Job = require('../models/job')
const Profile = require('../models/profile')
const sequelize = require('../sequelize')
const ProfileRepository = require('./profiles')

describe('JobsRepository', () => {
  let repo = null

  beforeAll(async () => {
    await seed()
    repo = new ProfileRepository(Profile, sequelize, Job)
  })

  it('[getProfileById] Should return the given profile', async () => {
    const profileId = 5
    const profile = await repo.getProfileById(profileId)

    expect(profile.id).toEqual(5)
    expect(profile.firstName).toEqual('John')
    expect(profile.lastName).toEqual('Lenon')
    expect(profile.profession).toEqual('Musician')
    expect(profile.balance).toEqual(64)
    expect(profile.type).toEqual('contractor')
  })

  it('[getProfileById] Should return null if the profile is not found', async () => {
    const profileId = 55
    const profile = await repo.getProfileById(profileId)

    expect(profile).toEqual(null)
  })

  it('[balanceDeposit] Should return the client profile with balance updated', async () => {
    const profileId = 4
    const deposit = 100
    const client = await repo.balanceDeposit(profileId, deposit)

    expect(client.id).toEqual(4)
    expect(client.balance).toEqual(101.3)
  })

  it('[payJob] Should return a paid job and updated client and contractor balances', async () => {
    const clientId = 1
    const contractorId = 5
    const jobId = 1
    const result = await repo.payJob(clientId, contractorId, jobId)

    expect(result.client.balance).toEqual(950)
    expect(result.contractor.balance).toEqual(264)
    expect(result.job.paid).toEqual(true)
  })
})
