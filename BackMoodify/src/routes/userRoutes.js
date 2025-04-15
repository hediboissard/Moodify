const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");
const upload = require("../middleware/upload");

// ✅ Obtenir les infos du profil
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

// ✅ Mettre à jour l'avatar
router.post(
  '/avatar',
  authMiddleware,
  upload.single('avatar'),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: 'Aucun fichier envoyé.' })
    }

    const avatarPath = `/uploads/${req.file.filename}`
    try {
      await User.updateAvatar(req.user.id, avatarPath)
      res.json({ message: '✅ Avatar mis à jour avec succès', avatar: avatarPath })
    } catch (err) {
      console.error('❌ Erreur upload avatar :', err)
      res.status(500).json({ message: 'Erreur serveur' })
    }
  }
),


module.exports = router;