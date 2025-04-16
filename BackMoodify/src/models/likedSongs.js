const db = require('../db');

const saveLikedSong = async (userId, track) => {
  const sql = `
    INSERT INTO liked_songs (user_id, title, artist, image, preview_url, spotify_url)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const values = [userId, track.title, track.artist, track.image, track.preview_url, track.spotify_url];
  return db.promise().query(sql, values);
};

const removeLikedSong = async (userId, track) => {
  const sql = `
    DELETE FROM liked_songs
    WHERE user_id = ? AND title = ? AND artist = ?
  `;
  return db.promise().query(sql, [userId, track.title, track.artist]);
};

const getLikedSongs = async (userId) => {
  const sql = `SELECT * FROM liked_songs WHERE user_id = ? ORDER BY created_at DESC`;
  const [rows] = await db.promise().query(sql, [userId]);
  return rows;
};

module.exports = {
  saveLikedSong,
  removeLikedSong,
  getLikedSongs,
};
