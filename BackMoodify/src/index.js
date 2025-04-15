const express = require('express')
const cors = require('cors')
const app = express()
require('dotenv').config()

const authRoutes = require('./routes/authRoutes')
const PORT = process.env.PORT || 3000

app.use(cors()) // 👈 ici
app.use(express.json())
app.use('/api/auth', authRoutes)

app.get('/', (req, res) => {
  res.send('Bienvenue sur le backend Moodify !')
})

app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`)
})
