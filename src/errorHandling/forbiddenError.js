class ForbbidenError extends Error {
  constructor(error) {
    super('The user does is not authorized for this request')
    this.error = error
  }
}

module.exports = ForbbidenError
