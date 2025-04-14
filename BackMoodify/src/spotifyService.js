const axios = require('axios');
require('dotenv').config();

let accessToken;
let tokenExpiresAt = 0;

const moodToPlaylist = {
  0: '6q7wChNuA3t72erCxyDYr7',
  1: '37i9dQZF1DX4Wsb4d7NKfP',
  2: '37i9dQZF1DX0eXqYHdgDwI',
  3: '37i9dQZF1DX0eXqYHdgDwI',
  4: '4NJTVh0PhiCrHqD1JwJqJy',
  6: '4NJTVh0PhiCrHqD1JwJqJy',
  7: '1llkez7kiZtBeOw5UjFlJq',
  8: '1llkez7kiZtBeOw5UjFlJq',
  9: '1h90L3LP8kAJ7KGjCV2Xfd',
  10: '1h90L3LP8kAJ7KGjCV2Xfd'
};

function getPlaylistIdFromMood(mood) {
  const normalizedMood = Math.max(0, Math.min(10, Math.round(mood)));
  return moodToPlaylist[normalizedMood];
}

async function getAccessToken() {
  console.log("🔁 Récupération du token Spotify...");
  const res = await axios.post(
    'https://accounts.spotify.com/api/token',
    new URLSearchParams({ grant_type: 'client_credentials' }),
    {
      headers: {
        Authorization: 'Basic ' + Buffer.from(
          process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
        ).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );

  accessToken = res.data.access_token;
  tokenExpiresAt = Date.now() + res.data.expires_in * 1000;
  console.log("✅ Nouveau token reçu, il expire à :", new Date(tokenExpiresAt).toLocaleTimeString());
}

async function getSongFromMood(score) {
  if (!accessToken || Date.now() >= tokenExpiresAt) await getAccessToken();

  const mood = Math.max(0, Math.min(10, parseInt(score)));
  console.log("🎚️ Mood:", mood);

  try {
    // Mood 5 : Blinding Lights direct
    if (mood === 5) {
      const res = await axios.get('https://api.spotify.com/v1/tracks/0VjIjW4GlUZAMYd2vXMi3b', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      const track = res.data;
      console.log("🔊 Preview URL (direct):", track.preview_url);

      return {
        title: track.name,
        artist: track.artists[0].name,
        image: track.album.images[0]?.url || null,
        preview_url: track.preview_url,
        spotify_url: track.external_urls.spotify
      };
    }

    // Autres moods via playlist
    const playlistId = getPlaylistIdFromMood(mood);
    const res = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      params: {
        limit: 50
      }
    });

    const items = res.data.items.map(item => item.track).filter(Boolean);
    if (!items.length) throw new Error("Aucun morceau trouvé.");

    const randomTrack = items[Math.floor(Math.random() * items.length)];

    console.log("🎵 Titre aléatoire:", randomTrack.name);
    console.log("🔊 Preview URL (playlist):", randomTrack.preview_url);

    return {
      title: randomTrack.name,
      artist: randomTrack.artists[0].name,
      image: randomTrack.album.images[0]?.url || null,
      preview_url: randomTrack.preview_url,
      spotify_url: randomTrack.external_urls.spotify
    };

  } catch (err) {
    console.error("❌ Erreur dans getSongFromMood:", err.response?.data || err.message);
    throw new Error("Erreur lors de la récupération de la musique.");
  }
}

module.exports = {
  getSongFromMood
};
