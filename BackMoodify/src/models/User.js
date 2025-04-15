const db = require('../db')

// ➕ Créer un utilisateur
const createUser = (email, password, username) => {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO users (email, password, username)
      VALUES (?, ?, ?)
    `
    const values = [email, password, username]
    console.log("🟡 Insertion SQL avec :", values)

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("❌ Erreur d'insertion SQL :", err.sqlMessage)
        return reject(err)
      }
      console.log("✅ Résultat insertion :", result)
      resolve(result.insertId)
    })
  })
}

// 🔍 Trouver un utilisateur par email
const findUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users WHERE email = ?'
    console.log("🔍 Requête SQL :", sql, email)

    db.query(sql, [email], (err, results) => {
      if (err) {
        console.error("❌ Erreur SQL dans findUserByEmail :", err)
        return reject(err)
      }
      console.log("✅ Résultats SQL :", results)
      resolve(results[0] || null)
    })
  })
}

// 🔍 Trouver un utilisateur par ID
const findUserById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users WHERE id = ?'
    db.query(sql, [id], (err, results) => {
      if (err) return reject(err)
      resolve(results[0])
    })
  })
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserById
}
