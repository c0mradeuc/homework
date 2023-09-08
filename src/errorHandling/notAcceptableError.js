class NotAcceptableError extends Error {
  constructor(error) {
    super('Cannot proceed with the request')
    this.error = error
  }
}

module.exports = NotAcceptableError
