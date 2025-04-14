const db = require('../db')

const createUser = (email, hashedPassword, username, name, surname, birthdate) => {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO users (email, password, username, name, surname, birthdate)
      VALUES (?, ?, ?, ?, ?, ?)
    `
    db.query(sql, [email, hashedPassword, username, name, surname, birthdate], (err, result) => {
      if (err) return reject(err)
      resolve(result.insertId)
    })
  })
}

const findUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
      if (err) return reject(err)
      resolve(results[0])
    })
  })
}

module.exports = { createUser, findUserByEmail }
