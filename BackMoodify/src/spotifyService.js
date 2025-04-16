const axios = require("axios");
const findPreview = require("spotify-preview-finder");
require("dotenv").config();

let accessToken;
let tokenExpiresAt = 0;

const moodToPlaylist = {
  1: "4z6eXTMEaSgSApVzYbUqWp", // Productif ✅  //ok
  2: "6nS31wmspvazxjq3jrhGMO", // Nostalgique 🌅  //ok
  3: "7i5yMpg2Rp44B4Jovm4BBm", // Amoureux 💘 //ok
  4: "7JabddFr3Q6JPsND4v9Swf", // Chill ☕ //ok
  5: "3czbpPlUYmNKbLf5RphdjY", // Sport 🏋️ //ok
  6: "35hasVCmKv52Va0wWLo4UK", // Créatif 🎨 //ok 
  7: "6xwCH60hsGvo2tLk1j07Ud", // Cocooning 🕯️ //ok
  8: "31JFVuGL18xiuhTfEutoW1", // Gamer 🎮 //ok
  9: "30WyFX7yixNvPqecVwzjwg", // Fêtard 🎉 //ok
  10: "7jkxvMgEo8WZwZTRJKiMja", // Mélancolique 🌧️ //ok
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

async function getSongFromMood(score) {
  if (!accessToken || Date.now() >= tokenExpiresAt) await getAccessToken();

  const mood = Math.max(0, Math.min(10, parseInt(score)));
  const playlistId = getPlaylistIdFromMood(mood);
  console.log("🎚️ Mood:", mood, "=> Playlist ID:", playlistId);

  try {
    const res = await axios.get(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          limit: 50,
        },
      }
    );

    const items = res.data.items.map((item) => item.track).filter(Boolean);
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
        console.warn(
          "⚠️ Erreur lors du fallback preview:",
          scrapeError.message
        );
      }
    }

    return {
      title: randomTrack.name,
      artist: randomTrack.artists[0].name,
      image: randomTrack.album.images[0]?.url || null,
      preview_url,
      spotify_url: randomTrack.external_urls.spotify,
    };
  } catch (err) {
    console.error("❌ Erreur dans getSongFromMood:", err.stack || err.message);
    throw new Error("Erreur lors de la récupération de la musique.");
  }
}

module.exports = {
  getSongFromMood,
};