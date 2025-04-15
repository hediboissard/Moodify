const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const db = require("../db");
const User = require("../models/User");

// Route avec token (utilisateur classique)
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findUserById(req.user.id);
    if (!user)
      return res.status(404).json({ message: "Utilisateur introuvable" });

    res.json({
      username: user.username,
      email: user.email,
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

module.exports = router;
