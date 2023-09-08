const seed = require('../../scripts/seedDb')
const request = require('supertest')
const app = require('../app')
const HttpStatus = require('../enums/httpStatus')

describe('Contracts Routes', () => {
  const api = request(app)

  beforeAll(async () => {
    await seed()
    console.error = () => {}
  })

  it('[/contracts] Should return 401 status code if no profile is provided in header', async () => {
    const response = await api.get('/contracts/3')
    expect(response.status).toEqual(HttpStatus.Unauthorized)
  })

  it('[/contracts] Should return respond with contract and status code 200', async () => {
    const response = await api.get('/contracts/3').set('profile_id', 2)
    expect(response.status).toEqual(HttpStatus.Ok)
  })

  it('[/contracts] Should return responde with status code 404 if contract is not found', async () => {
    const response = await api.get('/contracts/69').set('profile_id', 2)
    expect(response.status).toEqual(HttpStatus.NotFound)
  })
})
