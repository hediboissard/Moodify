// routes/userRoutes.js
const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/authMiddleware')
const User = require('../models/User')

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findUserById(req.user.id)
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" })

    res.json({
      id: user.id,
      username: user.username,
      email: user.email
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
