const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// ✅ Spotify & BDD
const axios = require('axios');
const querystring = require('querystring');
const db = require('../db'); // ← Vérifie que ce chemin est correct selon ton projet

// Fonction pour générer un token JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Routes API de base
router.post('/register', register);
router.post('/login', login);

// Redirection vers Spotify
router.get('/spotify/login', (req, res) => {
  const scope = 'user-read-email playlist-modify-public';
  const queryParams = querystring.stringify({
    response_type: 'code',
    client_id: process.env.SPOTIFY_CLIENT_ID,
    scope,
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
  });
  res.redirect(`https://accounts.spotify.com/authorize?${queryParams}`);
});

// Callback Spotify → Génère token et récupère profil
router.get('/spotify/callback', async (req, res) => {
  const code = req.query.code;

  try {
    // 🔁 Échange le code contre un access_token
    const tokenRes = await axios.post('https://accounts.spotify.com/api/token',
      new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
        client_id: process.env.SPOTIFY_CLIENT_ID,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET,
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const accessToken = tokenRes.data.access_token;

    // Récupère les infos de l'utilisateur Spotify
    const userRes = await axios.get('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const { id: spotify_id, display_name, email, images } = userRes.data;
    const avatar = images?.[0]?.url || null;

    let [existingUser] = await db.promise().query(
      'SELECT * FROM users WHERE spotify_id = ?',
      [spotify_id]
    );

    let user = existingUser[0];

    // Si l'utilisateur n'existe pas encore, on le crée
    if (!user) {
      const [result] = await db.promise().query(
        'INSERT INTO users (email, username, spotify_id, avatar) VALUES (?, ?, ?, ?)',
        [email, display_name || 'Spotify User', spotify_id, avatar]
      );
      const [newUser] = await db.promise().query('SELECT * FROM users WHERE id = ?', [result.insertId]);
      user = newUser[0];
    }

    // Génère un token JWT
    const token = generateToken(user);

    // 🔁 Redirige vers le frontend avec token + spotify_id
    res.redirect(`http://localhost:5173/?token=${token}&spotify_id=${spotify_id}`);
  } catch (err) {
    console.error('❌ Erreur Spotify auth:', err);
    res.status(500).send('Erreur lors de l’authentification Spotify');
  }
});

module.exports = router;
