const db = require('../db') // Assure-toi que ce fichier existe et fonctionne

const createUser = (email, password, username, name, surname, birthdate) => {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO users (email, password, username, name, surname, birthdate)
      VALUES (?, ?, ?, ?, ?, ?)
    `
    db.query(sql, [email, password, username, name, surname, birthdate], (err, result) => {
      if (err) {
        console.error("❌ Erreur d'insertion MySQL :", err)
        return reject(err)
      }
      console.log("✅ Insertion dans MySQL réussie :", result)
      resolve(result.insertId)
    })
  })
}

const findUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users WHERE email = ?'
    db.query(sql, [email], (err, results) => {
      if (err) return reject(err)
      resolve(results[0]) // retourne un seul user
    })
  })
}

module.exports = {
  createUser,
  findUserByEmail
}
