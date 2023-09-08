class NotFoundError extends Error {
  constructor(error) {
    super('Cannot found the resource')
    this.error = error
  }
}

module.exports = NotFoundError
