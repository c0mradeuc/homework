/**
 * Error handling midleware
 * @param {*} error Express error object
 * @param {*} req Express request object
 * @param {*} res Express response object
 * @param {*} next Express next object
 */
const errorHandling = async (error, req, res, next) => {
  console.error(error)
  res.status(500).json({ error: 'Internal Server Error', message: error.message })
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
