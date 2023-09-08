const seed = require('../../scripts/seedDb')
const ProfileType = require('../enums/profileType')
const Contract = require('../models/contract')
const ContractsRepository = require('./contracts')

describe('ContractsRepository', () => {
  let repo = null

  beforeAll(async () => {
    await seed()
    repo = new ContractsRepository(Contract)
  })

  it('[findById] Should return found contract', async () => {
    const profileId = 2
    const profileType = ProfileType.Client
    const contractId = 3
    const contract = await repo.findById(profileId, profileType, contractId)

    expect(contract.id).toEqual(3)
    expect(contract.terms).toEqual('bla bla bla')
    expect(contract.status).toEqual('in_progress')
    expect(contract.ContractorId).toEqual(6)
    expect(contract.ClientId).toEqual(2)
  })

  it('[findById] Should return null if the contract is not found', async () => {
    const profileId = 2
    const profileType = ProfileType.Client
    const contractId = 3312321
    const contract = await repo.findById(profileId, profileType, contractId)

    expect(contract).toStrictEqual(null)
  })

  it('[findContracts] Should return find contracts for the given profile', async () => {
    const profileId = 1
    const profileType = ProfileType.Client
    const contracts = await repo.findContracts(profileId, profileType)

    expect(contracts).toHaveLength(2)
    expect(contracts[0].id).toBe(1)
    expect(contracts[0].terms).toBe('bla bla bla')
    expect(contracts[0].status).toBe('terminated')
    expect(contracts[0].ClientId).toBe(1)
    expect(contracts[0].ContractorId).toBe(5)
    expect(contracts[1].id).toBe(2)
    expect(contracts[1].terms).toBe('bla bla bla')
    expect(contracts[1].status).toBe('in_progress')
    expect(contracts[1].ClientId).toBe(1)
    expect(contracts[1].ContractorId).toBe(6)
  })

  it('[findNonTerminatedContracts] Should return find non terminated contracts for the given profile', async () => {
    const profileId = 1
    const profileType = ProfileType.Client
    const contracts = await repo.findNonTerminatedContracts(profileId, profileType)

    expect(contracts).toHaveLength(1)
    expect(contracts[0].id).toBe(2)
    expect(contracts[0].terms).toBe('bla bla bla')
    expect(contracts[0].status).toBe('in_progress')
    expect(contracts[0].ClientId).toBe(1)
    expect(contracts[0].ContractorId).toBe(6)
  })

  it('[findActiveContracts] Should return find non terminated contracts for the given profile', async () => {
    const profileId = 3
    const profileType = ProfileType.Client
    const contracts = await repo.findActiveContracts(profileId, profileType)

    expect(contracts).toHaveLength(1)
    expect(contracts[0].id).toBe(6)
    expect(contracts[0].terms).toBe('bla bla bla')
    expect(contracts[0].status).toBe('in_progress')
    expect(contracts[0].ClientId).toBe(3)
    expect(contracts[0].ContractorId).toBe(7)
  })
})
