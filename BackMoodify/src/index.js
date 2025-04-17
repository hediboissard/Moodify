const express = require('express');
const cors = require('cors');
const path = require('path');
const { getSongsFromMood } = require('./spotifyService');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// 🔐 Middlewares
app.use(cors());
app.use(express.json());

// 📂 Servir les fichiers uploadés
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));


// 🧩 Routes
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// 🎵 Route Spotify
app.get('/mood/:score', async (req, res) => {
  try {
    const songs = await getSongsFromMood(req.params.score);
    res.json(songs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur API Spotify' });
  }
});


// 🌐 Route de base
app.get('/', (req, res) => {
  res.send('Bienvenue sur le backend Moodify !');
});

// 🚀 Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur backend en écoute sur http://localhost:${PORT}`);
});
