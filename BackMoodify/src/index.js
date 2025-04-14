require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db'); // ← tu peux l’enlever si non utilisé
const authRoutes = require('./routes/authRoutes'); // ← garde une seule importation

const app = express();
const PORT = process.env.PORT || 3000;

// Autoriser les requêtes depuis ton frontend (localhost:5173)
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Autoriser les JSON dans les requêtes POST
app.use(express.json());

// Test de route
app.get('/', (req, res) => {
  res.send('Bienvenue sur le backend Moodify !');
});

// Routes d'authentification
app.use('/api/auth', authRoutes);

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});
