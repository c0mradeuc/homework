const errorHandling = async (error, req, res, next) => {
  console.error(error)
  res.status(500).json({ error: 'Internal Server Error' })
}

module.exports = errorHandling
