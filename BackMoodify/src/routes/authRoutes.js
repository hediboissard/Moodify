const express = require('express')
const router = express.Router()
const { register, login } = require('../controllers/authController')

// Routes API :
router.post('/register', register)
router.post('/login', login) // 👈 cette ligne ajoute le login

module.exports = router
