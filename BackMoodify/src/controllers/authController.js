const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const register = async (req, res) => {
  const { email, password, username } = req.body

  try {
    const existing = await User.findUserByEmail(email)
    if (existing) {
      return res.status(400).json({ message: 'Email déjà utilisé.' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const userId = await User.createUser(email, hashedPassword, username)

    res.status(201).json({ message: 'Utilisateur créé avec succès', userId })
  } catch (err) {
    console.error("❌ Erreur lors de l'inscription :", err)
    res.status(500).json({ message: "Erreur serveur : " + err.message })
  }
}


// ✅ LOGIN
const login = async (req, res) => {
  const { email, password } = req.body
  console.log("🟢 Tentative de connexion pour :", email)

  try {
    const user = await User.findUserByEmail(email)
    console.log("👤 Résultat de la recherche utilisateur :", user)

    if (!user) {
      return res.status(401).json({ message: "Utilisateur non trouvé" })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return res.status(401).json({ message: "Mot de passe incorrect" })
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "moodifysupersecret",
      { expiresIn: '24h' }
    )

    // ✅ Envoie réponse avec token et infos utiles
    res.status(200).json({
      message: "Connexion réussie",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    })
  } catch (err) {
    console.error("❌ Erreur lors de la connexion :", err)
    res.status(500).json({ message: "Erreur serveur : " + err.message })
  }
}

module.exports = {
  register,
  login
}
