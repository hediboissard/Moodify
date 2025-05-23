const db = require('../db')

// ✅ Créer un utilisateur
const createUser = (email, password, username) => {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO users (email, password, username)
      VALUES (?, ?, ?)
    `
    const values = [email, password, username]
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("❌ Erreur d'insertion SQL :", err.sqlMessage)
        return reject(err)
      }
      resolve(result.insertId)
    })
  })
}

// 🔍 Trouver un utilisateur par email
const findUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users WHERE email = ?'
    db.query(sql, [email], (err, results) => {
      if (err) {
        console.error("❌ Erreur SQL dans findUserByEmail :", err)
        return reject(err)
      }
      resolve(results[0] || null)
    })
  })
}

// 🔍 Trouver un utilisateur par ID
const findUserById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT id, username, email, avatar FROM users WHERE id = ?';
    db.query(sql, [id], (err, results) => {
      if (err) {
        console.error("❌ Erreur SQL dans findUserById :", err);
        return reject(err);
      }
      resolve(results[0]);
    });
  });
};

// ❌ Supprimer un utilisateur
const deleteUserById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM users WHERE id = ?';
    db.query(sql, [id], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};




// 🔍 Trouver un utilisateur par Spotify ID
const findUserBySpotifyId = (spotifyId) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users WHERE spotify_id = ?'
    db.query(sql, [spotifyId], (err, results) => {
      if (err) {
        console.error("❌ Erreur SQL dans findUserBySpotifyId :", err)
        return reject(err)
      }
      resolve(results[0] || null)
    })
  })
}

// 🔄 Mettre à jour le nom d'utilisateur
const updateUsername = (id, newUsername) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE users SET username = ? WHERE id = ?';
    db.query(sql, [newUsername, id], (err, result) => {
      if (err) {
        console.error("❌ Erreur SQL dans updateUsername :", err);
        return reject(err);
      }
      resolve(result);
    });
  });
};

const updateAvatar = (id, avatarPath) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE users SET avatar = ? WHERE id = ?';
    db.query(sql, [avatarPath, id], (err, result) => {
      if (err) {
        console.error("❌ Erreur SQL dans updateAvatar :", err);
        return reject(err);
      }
      resolve(result);
    });
  });
};




module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  deleteUserById,
  findUserBySpotifyId,
  updateUsername,
  updateAvatar
}
