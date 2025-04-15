const User = require('../models/User')

const getProfile = async (req, res) => {
  try {
    const user = await User.findUserById(req.user.id)
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' })

    res.json({
      id: user.id,
      username: user.username,
      email: user.email
    })
  } catch (err) {
    console.error("❌ Erreur getProfile :", err)
    res.status(500).json({ message: err.message })
  }
}

module.exports = { getProfile }
