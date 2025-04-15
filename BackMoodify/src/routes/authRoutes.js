const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// ✅ À AJOUTER EN HAUT
const axios = require('axios');
const querystring = require('querystring');
const db = require('../db'); // ← attention au bon chemin selon ta structure

// Routes API :
router.post('/register', register);
router.post('/login', login);

// Redirige vers Spotify login
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

// Callback Spotify : échange code ↔ access_token + récupère infos utilisateur
router.get('/spotify/callback', async (req, res) => {
  const code = req.query.code;

  try {
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

    const userRes = await axios.get('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const { id: spotify_id, display_name, email, images } = userRes.data;
    const avatar = userRes.data.images?.[0]?.url || null;


    const [existingUser] = await db.promise().query(
      'SELECT * FROM users WHERE spotify_id = ?',
      [spotify_id]
    );



    if (existingUser.length === 0) {
        await db.promise().query(
            'INSERT INTO users (email, username, spotify_id, avatar) VALUES (?, ?, ?, ?)',
            [email, display_name || 'Spotify User', spotify_id, avatar]
          );
    }

    // Redirige vers le frontend avec l'ID Spotify en paramètre
    res.redirect(`http://localhost:5173/?spotify_id=${spotify_id}`);
  } catch (err) {
    console.error('Erreur Spotify auth:', err);
    res.status(500).send('Erreur lors de l’authentification Spotify');
  }
});

module.exports = router;
