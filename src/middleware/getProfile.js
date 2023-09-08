const UnauthorizedError = require('../errorHandling/UnauthorizedError')

const getProfile = async (req, res, next) => {
  try {
    const profileId = req.get('profile_id')

    if (!profileId) throw new UnauthorizedError('The profile_id is not present in the headers')

    const { profilesRepository } = req.app.get('repositories')
    const profile = await profilesRepository.getProfileById(Number(profileId))

    if (!profile) throw new UnauthorizedError('Cannot find a profile with profile_id present in the headers')

    req.profile = profile
    next()
  }
  catch (error) {
    console.error(error)
    next(error)
  }
}

module.exports = { getProfile }
