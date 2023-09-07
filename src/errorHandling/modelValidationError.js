class ModelValidationError extends Error {
  constructor(errors) {
    super('The model is not valid for the request')
    this.errors = errors
  }
}

module.exports = ModelValidationError
