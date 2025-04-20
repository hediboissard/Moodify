const express = require("express");
const bcrypt = require('bcrypt');
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const db = require("../db");
const User = require("../models/User");
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/avatars')); 
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Route avec token (utilisateur classique)
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    res.json({
      username: user.username,
      email: user.email,
      avatar: user.avatar || null
    });
  } catch (err) {
    console.error("❌ Erreur dans /me :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// ✅ Route pour les users Spotify (sans authMiddleware)
router.get("/me/spotify/:spotify_id", async (req, res) => {
  const spotifyId = req.params.spotify_id;

  try {
    const [rows] = await db.promise().query(
      "SELECT id, username, email, mood, avatar FROM users WHERE spotify_id = ?",
      [spotifyId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Utilisateur Spotify introuvable" });
    }
    console.log("➡️ Reçu spotify_id:", spotifyId);

    res.json(rows[0]);
  } catch (err) {
    console.error("❌ Erreur dans /me/spotify :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.post('/like', async (req, res) => {
  const { spotify_id, track } = req.body;

  if (!track || !track.title || !track.artist || !spotify_id) {
    return res.status(400).json({ message: 'Champs manquants' });
  }

  try {
    const [rows] = await db.promise().query(
      "SELECT id FROM users WHERE spotify_id = ?",
      [spotify_id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'User Spotify non trouvé' });

    const userId = rows[0].id;

    await db.promise().query(
      `INSERT INTO liked_songs (user_id, title, artist, image, preview_url, spotify_url)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, track.title, track.artist, track.image, track.preview_url, track.spotify_url]
    );

    res.status(201).json({ message: '🎵 Titre liké enregistré' });
  } catch (err) {
    console.error("❌ Erreur lors de l'enregistrement du like :", err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.get('/likes', async (req, res) => {
  const { user_id, spotify_id } = req.query;

  if (!user_id && !spotify_id) {
    return res.status(400).json({ message: 'ID utilisateur requis' });
  }

  try {
    let finalUserId = user_id;

    if (spotify_id) {
      const [rows] = await db.promise().query(
        "SELECT id FROM users WHERE spotify_id = ?",
        [spotify_id]
      );
      if (rows.length === 0) {
        return res.status(404).json({ message: 'Utilisateur Spotify non trouvé' });
      }
      finalUserId = rows[0].id;
    }

    const [likedSongs] = await db.promise().query(
      `SELECT * FROM liked_songs WHERE user_id = ? ORDER BY id DESC`,
      [finalUserId]
    );

    res.json(likedSongs);
  } catch (err) {
    console.error("❌ Erreur lors de la récupération des likes :", err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.delete('/likes', async (req, res) => {
  const { title, artist, spotify_id } = req.body;

  if (!title || !artist || !spotify_id) {
    return res.status(400).json({ message: "Données manquantes" });
  }

  try {
    const [rows] = await db.promise().query(
      "SELECT id FROM users WHERE spotify_id = ?",
      [spotify_id]
    );
    if (rows.length === 0) return res.status(404).json({ message: "Utilisateur non trouvé" });

    const userId = rows[0].id;

    const [result] = await db.promise().query(
      "DELETE FROM liked_songs WHERE title = ? AND artist = ? AND user_id = ?",
      [title, artist, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Titre non trouvé" });
    }

    res.json({ message: "👍 Titre supprimé des favoris" });
  } catch (err) {
    console.error("❌ Erreur suppression track:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// ✅ Route pour supprimer un utilisateur
router.delete('/delete', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    await User.deleteUserById(userId);
    res.json({ message: '✅ Compte supprimé avec succès.' });
  } catch (err) {
    console.error("❌ Erreur suppression compte :", err);
    res.status(500).json({ message: "Erreur lors de la suppression du compte" });
  }
});

// Get all users
router.get('/', async (req, res) => {
  try {
    const [users] = await db.promise().query(
      "SELECT id, username, mood, avatar FROM users"
    );
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Route pour mettre à jour le nom d'utilisateur
router.put('/update-username', authMiddleware, async (req, res) => {
  const { newUsername } = req.body;

  if (!newUsername) {
    return res.status(400).json({ message: 'Le nouveau nom d\'utilisateur est requis.' });
  }

  try {
    const userId = req.user.id;
    await User.updateUsername(userId, newUsername);
    res.json({ message: 'Nom d\'utilisateur mis à jour avec succès.' });
  } catch (err) {
    console.error("❌ Erreur lors de la mise à jour du nom d'utilisateur :", err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// Route pour uploader l'avatar
router.post('/upload-avatar', authMiddleware, upload.single('avatar'), async (req, res) => {
  try {
    const userId = req.user.id;
    const avatarPath = `/uploads/avatars/${req.file.filename}`;

    // Mise à jour de l'avatar dans la base de données
    await User.updateAvatar(userId, avatarPath);

    res.json({ message: 'Avatar mis à jour avec succès.', avatarUrl: avatarPath });
  } catch (err) {
    console.error('❌ Erreur lors de l\'upload de l\'avatar :', err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});



module.exports = router;