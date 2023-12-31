const HttpStatus = require('../enums/httpStatus')
const ModelValidationError = require('../errorHandling/modelValidationError')
const BadRequestError = require('../errorHandling/badRequestError')
const NotAcceptableError = require('../errorHandling/notAcceptableError')
const ForbbidenError = require('../errorHandling/forbiddenError')
const NotFoundError = require('../errorHandling/notFoundError')
const UnauthorizedError = require('../errorHandling/UnauthorizedError')

/**
 * Error handling midleware
 * @param {*} error Express error object
 * @param {*} req Express request object
 * @param {*} res Express response object
 * @param {*} next Express next object
 */
const errorHandling = async (error, req, res, next) => {
  console.error(error)

  if (error instanceof ModelValidationError) {
    res.status(HttpStatus.BadRequest).json({ message: error.message, error: error.errors })
  }
  else if (error instanceof BadRequestError) {
    res.status(HttpStatus.BadRequest).json({ message: error.message, error: error.error })
  }
  else if (error instanceof UnauthorizedError) {
    res.status(HttpStatus.Unauthorized).json({ message: error.message, error: error.error })
  }
  else if (error instanceof NotAcceptableError) {
    res.status(HttpStatus.NotAcceptable).json({ message: error.message, error: error.error })
  }
  else if (error instanceof ForbbidenError) {
    res.status(HttpStatus.Forbidden).json({ message: error.message, error: error.error })
  }
  else if (error instanceof NotFoundError) {
    res.status(HttpStatus.NotFound).json({ message: error.message, error: error.error })
  }
  else {
    res.status(HttpStatus.InternalServerError).json({ message: 'Internal Server Error', error: error.message })
  }
}

/**
 * A base route builder that wrap the route handler in a try catch block to avoid duplicating code for each route
 * @param {*} handler The route handler
 * @return {*} The wrapped handler
 */
const baseRouteBuilder = function(handler) {
  const wrappedHandler = async (req, res, next) => {
    try {
      await handler(req, res, next)
    }
    catch (error) {
      next(error)
    }
  }

  return wrappedHandler
}

module.exports = { errorHandling, baseRouteBuilder }
