const ModelValidationError = require('../errorHandling/modelValidationError')

const validateModel = function(schema) {
  return (req, res, next) => {
    const model = { ...req.body, ...req.query, ...req.params }
    const { error } = schema.validate(model)

    if (error) {
      throw new ModelValidationError(error.details)
    }

    next()
  }
}

module.exports = validateModel
