const express = require('express')
const cors = require('cors')
const app = express()
require('dotenv').config()

const userRoutes = require('./routes/userRoutes')
const authRoutes = require('./routes/authRoutes')

const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)

app.get('/', (req, res) => {
  res.send('Bienvenue sur le backend Moodify !')
})

app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`)
})
