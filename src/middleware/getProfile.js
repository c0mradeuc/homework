const getProfile = async (req, res, next) => {
  const profileId = req.get('profile_id')

  if (!profileId) return res.status(401).end()

  const { profilesRepository } = req.app.get('repositories')
  const profile = await profilesRepository.getProfileById(Number(profileId))

  if (!profile) return res.status(401).end()

  req.profile = profile
  next()
}

module.exports = { getProfile }
