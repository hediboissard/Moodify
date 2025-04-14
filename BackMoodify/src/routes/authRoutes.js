const express = require('express');
const router = express.Router();

// Route POST /api/auth/register
router.post('/register', (req, res) => {
  const { username, email, password, name, surname, birthdate } = req.body;

  console.log('Données reçues :', req.body);

  // Ici, tu ajouteras plus tard l'insertion dans ta base de données
  res.status(201).json({ message: 'Inscription réussie !' });
});

module.exports = router;
