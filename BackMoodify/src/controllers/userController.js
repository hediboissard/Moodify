const User = require('../models/User')

const getProfile = async (req, res) => {
  try {
    const user = await User.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar, // Inclure l'avatar dans la réponse
    });
  } catch (err) {
    console.error("❌ Erreur getProfile :", err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

module.exports = { getProfile }
