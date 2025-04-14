require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;


const db = require('./db');

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Bienvenue sur le backend Moodify !');
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});
