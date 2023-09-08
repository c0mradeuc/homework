class UnauthorizedError extends Error {
  constructor(error) {
    super('The client must authenticate itself to get the requested response')
    this.error = error
  }
}

module.exports = UnauthorizedError
