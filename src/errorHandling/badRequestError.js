class BadRequestError extends Error {
  constructor(error) {
    super('There is something wrong with the request')
    this.error = error
  }
}

module.exports = BadRequestError
