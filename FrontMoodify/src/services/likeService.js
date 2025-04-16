import axios from 'axios'

const API_URL = 'http://localhost:3000/api/users/like'

export const saveLikedTrack = async (track) => {
  const spotify_id = localStorage.getItem('spotify_id');
  if (!spotify_id) throw new Error('Aucun spotify_id trouvé');

  const payload = { track, spotify_id }; // Ensure spotify_id is included
  const res = await axios.post(API_URL, payload);
  return res.data;
};

export const getLikedTracks = async () => {
  const spotify_id = localStorage.getItem('spotify_id')
  if (!spotify_id) throw new Error('Aucun spotify_id trouvé')

    const res = await axios.get(`http://localhost:3000/api/users/likes?spotify_id=${spotify_id}`);
    return res.data
}

export const removeLikedTrack = async (track) => {
  const spotify_id = localStorage.getItem('spotify_id');
  if (!spotify_id) throw new Error('Aucun spotify_id trouvé');

  const payload = { title: track.title, artist: track.artist, spotify_id }; // Match backend expectations
  const res = await axios.delete(`http://localhost:3000/api/users/likes`, {
    data: payload,
  });

  return res.data;
};
