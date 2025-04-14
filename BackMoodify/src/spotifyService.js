const axios = require('axios');
const findPreview = require('spotify-preview-finder');
require('dotenv').config();

let accessToken;
let tokenExpiresAt = 0;

const moodToPlaylist = {
    0: '1ctpkuNEQGEH3UflkUi9qq', // Bad | Musicas tristes 2025
    1: '37i9dQZF1DX0eXqYHdgDwI', // piangere fortissimo
    2: '37i9dQZF1DWVV27DiNWxkR', // Sad Indie
    3: '37i9dQZF1DX3YSRoSdA634', // Life Sucks
    4: '37i9dQZF1DX3csziQj0d5b', // homework vibes
    5: '4quQa2RBA1PbNMaJGEXvWA', // Music joyeuse
    6: '1llkez7kiZtBeOw5UjFlJq', // The Ultimate Happy Playlist
    7: '6mGhgb5BFsmxEWDHMjCQ1S', // Happy Hits!
    8: '37i9dQZF1DX3rxVfibe1L0', // Mood Booster
    9: '1h90L3LP8kAJ7KGjCV2Xfd', // Feel Good Happy Hits
    10: '37i9dQZF1DX7KNKjOK0o75' // Have a Great Day!
  };
  

function getPlaylistIdFromMood(mood) {
  const normalizedMood = Math.max(0, Math.min(10, Math.round(mood)));
  return moodToPlaylist[normalizedMood];
}

async function getAccessToken() {
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
}

async function getSongFromMood(score) {
  if (!accessToken || Date.now() >= tokenExpiresAt) await getAccessToken();

  const mood = Math.max(0, Math.min(10, parseInt(score)));
  const playlistId = getPlaylistIdFromMood(mood);
  console.log("🎚️ Mood:", mood, "=> Playlist ID:", playlistId);

  try {
    const res = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      params: {
        limit: 50
      }
    });

    const items = res.data.items.map(item => item.track).filter(Boolean);
    const randomTrack = items[Math.floor(Math.random() * items.length)];

    let preview_url = randomTrack.preview_url;

    // 🔍 Tentative de récupération alternative si pas de preview dans l'API
    if (!preview_url) {
      const query = `${randomTrack.name} ${randomTrack.artists[0].name}`;
      try {
        const result = await findPreview(query, 1);
        if (result.success && result.results.length > 0) {
          preview_url = result.results[0].previewUrls[0] ?? null;
          console.log("🔁 Preview récupérée via preview-finder:", preview_url);
        }
      } catch (scrapeError) {
        console.warn("⚠️ Erreur lors du fallback preview:", scrapeError.message);
      }
    }

    return {
      title: randomTrack.name,
      artist: randomTrack.artists[0].name,
      image: randomTrack.album.images[0]?.url || null,
      preview_url,
      spotify_url: randomTrack.external_urls.spotify
    };

  } catch (err) {
    console.error("❌ Erreur dans getSongFromMood:", err.stack || err.message);
    throw new Error("Erreur lors de la récupération de la musique.");
  }
}

module.exports = {
  getSongFromMood
};
