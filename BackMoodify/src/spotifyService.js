const axios = require("axios");
const findPreview = require("spotify-preview-finder");
require("dotenv").config();

let accessToken;
let tokenExpiresAt = 0;

const moodToPlaylist = {
  0: "66mlVn4GNwwbpJZrE8XuGi",
  1: "66mlVn4GNwwbpJZrE8XuGi",
  2: "37i9dQZF1DWVV27DiNWxkR",
  3: "37i9dQZF1DX3YSRoSdA634",
  4: "37i9dQZF1DX3csziQj0d5b",
  5: "4quQa2RBA1PbNMaJGEXvWA",
  6: "1llkez7kiZtBeOw5UjFlJq",
  7: "6mGhgb5BFsmxEWDHMjCQ1S",
  8: "37i9dQZF1DX3rxVfibe1L0",
  9: "1h90L3LP8kAJ7KGjCV2Xfd",
  10: "37i9dQZF1DX7KNKjOK0o75",
};

function getPlaylistIdFromMood(mood) {
  const normalizedMood = Math.max(0, Math.min(10, Math.round(mood)));
  return moodToPlaylist[normalizedMood];
}

async function getAccessToken() {
  const res = await axios.post(
    "https://accounts.spotify.com/api/token",
    new URLSearchParams({ grant_type: "client_credentials" }),
    {
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(
            process.env.SPOTIFY_CLIENT_ID +
              ":" +
              process.env.SPOTIFY_CLIENT_SECRET
          ).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  accessToken = res.data.access_token;
  tokenExpiresAt = Date.now() + res.data.expires_in * 1000;
}

async function getSongsFromMood(score) {
  if (!accessToken || Date.now() >= tokenExpiresAt) await getAccessToken();

  const mood = Math.max(0, Math.min(10, parseInt(score)));
  const playlistId = getPlaylistIdFromMood(mood);

  try {
    const res = await axios.get(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { limit: 50 },
      }
    );

    const items = res.data.items.map(item => item.track).filter(Boolean);

    const results = await Promise.all(items.map(async (track) => {
      let preview_url = track.preview_url;

      if (!preview_url) {
        const query = `${track.name} ${track.artists[0].name}`;
        try {
          const result = await findPreview(query, 1);
          preview_url = result.success ? result.results[0].previewUrls[0] ?? null : null;
        } catch (err) {
          preview_url = null;
        }
      }

      return {
        title: track.name,
        artist: track.artists[0].name,
        image: track.album.images[0]?.url || null,
        preview_url,
        spotify_url: track.external_urls.spotify,
      };
    }));

    return results.filter(track => track.preview_url);
  } catch (err) {
    console.error("❌ Erreur dans getSongsFromMood:", err.stack || err.message);
    throw new Error("Erreur lors de la récupération des musiques.");
  }
}

module.exports = {
  getSongsFromMood,
};