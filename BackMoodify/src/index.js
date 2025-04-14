const express = require('express');
const cors = require('cors');
const { getSongFromMood, getAvailableGenres } = require('./spotifyService');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // autorise les appels depuis le front
app.use(express.json());

app.get('/mood/:score', async (req, res) => {
  try {
    const result = await getSongFromMood(req.params.score);
    res.json(result);
  } catch (err) {
    console.error(err.response?.data || err);
    res.status(500).json({ error: 'Erreur API Spotify' });
  }
});


app.get('/genres', async (req, res) => {
    try {
      const genres = await getAvailableGenres();
      res.json(genres);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erreur lors de la récupération des genres' });
    }
  });
  


app.listen(PORT, () => {
  console.log(`Serveur backend en écoute sur http://localhost:${PORT}`);
});
