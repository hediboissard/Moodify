const bcrypt = require('bcrypt')
const User = require('../models/User')

const register = async (req, res) => {
  const { email, password, username, name, surname, birthdate } = req.body

  try {
    const existing = await User.findUserByEmail(email)
    if (existing) return res.status(400).json({ message: 'Email déjà utilisé.' })

    const hashedPassword = await bcrypt.hash(password, 10)

    const userId = await User.createUser(email, hashedPassword, username, name, surname, birthdate)

    console.log("✅ User inséré avec l'ID :", userId)

    res.status(201).json({ message: 'Utilisateur créé avec succès', userId })
  } catch (err) {
    console.error("❌ Erreur dans register :", err)
    res.status(500).json({ message: err.message })
  }
}

module.exports = { register }
