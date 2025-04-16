const express = require('express')
const router = express.Router()
const Friend = require('../models/Friend')
const authMiddleware = require('../middleware/authMiddleware')

// Ajouter un ami
router.post('/api/friends', authMiddleware, async (req, res) => {
  try {
    const { userId, friendId } = req.body
    
    // Vérification des IDs
    if (!userId || !friendId) {
      return res.status(400).json({ error: 'userId et friendId sont requis' })
    }

    // Vérification si l'amitié existe déjà
    const existingFriend = await Friend.findOne({ userId, friendId })
    if (existingFriend) {
      return res.status(409).json({ error: 'Friendship already exists' })
    }

    // Création de l'amitié
    const newFriend = await Friend.create({ userId, friendId })
    
    res.status(201).json(newFriend)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Récupérer la liste des amis
router.get('/api/friends/:userId', authMiddleware, async (req, res) => {
  try {
    const friends = await Friend.findAllByUserId(req.params.userId)
    res.json(friends)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router