const db = require('../db')

const createUser = (email, password, username, name, surname, birthdate) => {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO users (email, password, username, name, surname, birthdate)
      VALUES (?, ?, ?, ?, ?, ?)
    `
    const values = [email, password, username, name, surname, birthdate]
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
      resolve(results[0] || null) // sécurité anti-undefined
    })
  })
}

module.exports = {
  createUser,
  findUserByEmail
}
