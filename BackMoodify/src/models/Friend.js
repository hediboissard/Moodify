const db = require('../db')

const Friend = {
  findOne: async (query) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM friends WHERE userId = ? AND friendId = ?'
      db.query(sql, [query.userId, query.friendId], (err, results) => {
        if (err) return reject(err)
        resolve(results[0])
      })
    })
  },

  create: async (data) => {
    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO friends (userId, friendId) VALUES (?, ?)'
      db.query(sql, [data.userId, data.friendId], (err, result) => {
        if (err) return reject(err)
        resolve({ id: result.insertId, ...data })
      })
    })
  },

  findAllByUserId: async (userId) => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT u.id, u.username, u.avatar, u.mood 
        FROM users u 
        INNER JOIN friends f ON f.friendId = u.id 
        WHERE f.userId = ?
      `
      db.query(sql, [userId], (err, results) => {
        if (err) return reject(err)
        resolve(results)
      })
    })
  }
}

module.exports = Friend