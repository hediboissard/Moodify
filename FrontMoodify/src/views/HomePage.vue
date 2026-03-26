<template>
  <div class="home">
    <div id="particles-js"></div>

    <Navbar />

    <!-- Left sidebar: Liked tracks -->
    <Sidebar :open="showLeftSidebar" side="left" @toggle="showLeftSidebar = !showLeftSidebar">
      <div class="sidebar-header">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#9EC5AB">
          <path d="M6.979 3.074a6 6 0 0 1 4.988 1.425l.037.033.034-.03a6 6 0 0 1 4.733-1.44l.246.036a6 6 0 0 1 3.364 10.008l-.18.185-.048.041-7.45 7.379a1 1 0 0 1-1.313.082l-.094-.082-7.493-7.422a6 6 0 0 1 3.176-10.215z"/>
        </svg>
        <span>Titres aimés</span>
        <span class="badge">{{ likedSongs.length }}</span>
      </div>

      <div v-if="likedSongs.length === 0" class="empty-state">
        <p>Aucun titre aimé pour l'instant.</p>
      </div>

      <div v-for="(song, index) in likedSongs" :key="'liked-' + index" class="track-item">
        <img :src="song.image" class="track-cover" alt="cover" />
        <div class="track-info">
          <h4>{{ song.title }}</h4>
          <p>{{ song.artist }}</p>
        </div>
        <div class="menu-wrapper">
          <button class="more-btn" @click.stop="toggleMenu(index)">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
            </svg>
          </button>
          <div v-if="openMenuIndex === index" class="dropdown-menu">
            <a :href="song.spotify_url" target="_blank" class="dropdown-link">
              <svg class="icon-sm" viewBox="0 0 168 168" fill="#1DB954" xmlns="http://www.w3.org/2000/svg">
                <path d="M84,0C37.7,0,0,37.7,0,84s37.7,84,84,84s84-37.7,84-84S130.3,0,84,0z M121.3,120.1c-1.5,2.5-4.7,3.3-7.2,1.8c-19.8-12.1-44.8-14.9-74.2-8.4c-2.8,0.6-5.5-1.2-6.1-4s1.2-5.5,4-6.1c32.3-7,60.1-3.7,82.2,10.1C121.9,114.2,122.7,117.5,121.3,120.1z M133.4,97.6c-1.9,3-5.8,3.9-8.7,2c-22.7-14-57.3-18-84.1-10.1c-3.4,1-6.9-0.9-7.9-4.3c-1-3.4,0.9-6.9,4.3-7.9c31.8-9.2,70.5-4.7,97.5,11.6C134.3,90.8,135.2,94.7,133.4,97.6z M134.9,74.1c-27-16.2-71.5-17.7-97-10c-4,1.2-8.2-1-9.4-5c-1.2-4,1-8.2,5-9.4c29.6-8.8,79-7.1,110.9,11.7c3.6,2.1,4.8,6.7,2.6,10.3C144.8,75.1,139.1,76.6,134.9,74.1z"/>
              </svg>
              Ouvrir dans Spotify
            </a>
            <button class="dropdown-link" @click="openPlaylistPopup(song)">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 8h-14"/><path d="M5 12h9"/><path d="M11 16h-6"/><path d="M15 16h6"/><path d="M18 13v6"/>
              </svg>
              Ajouter à une playlist
            </button>
          </div>
        </div>
        <button @click="removeLiked(song)" class="remove-btn" title="Retirer">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </Sidebar>

    <!-- Right sidebar: Friends -->
    <Sidebar :open="showRightSidebar" side="right" @toggle="showRightSidebar = !showRightSidebar">
      <div class="sidebar-header">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#9EC5AB">
          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zm8 0a3 3 0 11-6 0 3 3 0 016 0zm-4.5 7a4.5 4.5 0 00-9 0V14h9v-1zm5.5 1a4 4 0 00-3.19 1.578A6.985 6.985 0 0117 19v1h4v-1a4.5 4.5 0 00-3.5-4.4V13z"/>
        </svg>
        <span>Amis</span>
        <span class="badge">{{ friends.length }}</span>
      </div>

      <div v-if="friends.length === 0" class="empty-state">
        <p>Aucun ami pour l'instant.</p>
        <router-link to="/friends" class="empty-cta">Découvrir des personnes</router-link>
      </div>

      <div v-for="(friend, i) in friends" :key="i" class="friend-card">
        <img :src="friend.avatar" class="friend-avatar" alt="avatar" />
        <div class="friend-info">
          <h4>{{ friend.username }}</h4>
          <router-link
            :to="{ name: 'FriendLikes', params: { id: friend.id, username: friend.username } }"
            class="view-likes-btn"
          >
            Voir ses titres aimés
          </router-link>
        </div>
        <button @click="removeFriend(friend)" class="remove-btn" title="Retirer l'ami">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </Sidebar>

    <!-- Main content -->
    <main class="main-content">
      <!-- Mood card -->
      <div class="mood-card">
        <div class="mood-emoji">{{ currentMood.emoji }}</div>
        <div class="mood-name" :style="{ color: currentMood.color }">{{ currentMood.mood }}</div>
        <p class="mood-hint">Faites glisser pour changer d'humeur</p>

        <div class="slider-wrap">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            v-model="sliderValue"
            class="mood-slider"
            :style="{ '--mood-color': currentMood.color }"
            @change="onSliderChange"
          />
          <div class="mood-labels">
            <span>😴</span>
            <span>🔥</span>
          </div>
        </div>

        <div class="mood-desc">{{ currentMood.text }}</div>
      </div>

      <!-- Now playing -->
      <div v-if="currentSong" class="now-playing">
        <img :src="currentSong.image" alt="cover" class="np-cover" />
        <div class="np-meta">
          <span class="np-label">En cours de lecture</span>
          <h3>{{ currentSong.title }}</h3>
          <p>{{ currentSong.artist }}</p>
        </div>
        <button @click="toggleLikeCurrentTrack" class="like-btn" :class="{ liked: isLiked(currentSong) }">
          <svg v-if="isLiked(currentSong)" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6.979 3.074a6 6 0 0 1 4.988 1.425l.037.033.034-.03a6 6 0 0 1 4.733-1.44l.246.036a6 6 0 0 1 3.364 10.008l-.18.185-.048.041-7.45 7.379a1 1 0 0 1-1.313.082l-.094-.082-7.493-7.422a6 6 0 0 1 3.176-10.215z"/>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19.5 12.572l-7.5 7.428-7.5-7.428a5 5 0 1 1 7.5-6.566 5 5 0 1 1 7.5 6.572"/>
          </svg>
        </button>
      </div>

      <div v-else class="no-song">
        <p>Déplacez le curseur pour découvrir de la musique selon votre humeur</p>
      </div>
    </main>

    <MusicPlayer :track="currentSong" :onPrev="playPrevious" :onNext="playNext" />

    <!-- Playlist modal -->
    <div v-if="showPlaylistModal" class="modal-overlay" @click.self="closePlaylistPopup">
      <div class="modal">
        <div class="modal-header">
          <h3>Ajouter à une playlist</h3>
          <button @click="closePlaylistPopup" class="modal-close">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <div class="playlist-grid" v-if="userPlaylists.length > 0">
          <div
            v-for="playlist in userPlaylists"
            :key="playlist.id"
            class="playlist-card"
            @click="addTrackToPlaylist(playlist.id)"
          >
            <img :src="playlist.images?.[0]?.url || '/default_playlist_cover.png'" class="pl-img" />
            <span class="pl-name">{{ playlist.name }}</span>
          </div>
          <div class="playlist-card create-card" @click="createNewPlaylist">
            <div class="pl-img plus-img">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 5v14M5 12h14"/>
              </svg>
            </div>
            <span class="pl-name">Nouvelle playlist</span>
          </div>
        </div>
        <p v-else class="empty-state">Aucune playlist trouvée.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue'
import axios from 'axios'
import Navbar from '@/components/Navbar.vue'
import MusicPlayer from '@/components/MusicPlayer.vue'
import Sidebar from '@/components/Sidebar.vue'
import { saveLikedTrack, getLikedTracks, removeLikedTrack } from '@/services/likeService'
import { useToast } from 'vue-toastification'

const toast = useToast()

const showPlaylistModal = ref(false)
const userPlaylists = ref([])
const selectedTrack = ref(null)
const showLeftSidebar = ref(false)
const showRightSidebar = ref(false)
const sliderValue = ref(0)
const currentSong = ref(null)
const songs = ref([])
const currentIndex = ref(0)
const likedSongs = ref([])
const friends = ref([])
const openMenuIndex = ref(null)

const moods = [
  { mood: "Productif",    emoji: "✅", color: "#4CAF50", text: "Mode concentration activé" },
  { mood: "Nostalgique",  emoji: "🌅", color: "#FFA07A", text: "Les souvenirs affluent" },
  { mood: "Amoureux",     emoji: "💘", color: "#FF69B4", text: "Le cœur en émoi" },
  { mood: "Chill",        emoji: "☕", color: "#87CEFA", text: "Tout en douceur" },
  { mood: "Sport",        emoji: "🏋️", color: "#FF4500", text: "On se dépasse !" },
  { mood: "Créatif",      emoji: "🎨", color: "#9C27B0", text: "Les idées s'envolent" },
  { mood: "Cocooning",    emoji: "🕯️", color: "#D2B48C", text: "Bien au chaud chez soi" },
  { mood: "Gamer",        emoji: "🎮", color: "#1E90FF", text: "La partie commence" },
  { mood: "Fêtard",       emoji: "🎉", color: "#FFD700", text: "C'est la fête !" },
  { mood: "Mélancolique", emoji: "🌧️", color: "#708090", text: "Une ambiance pluvieuse" }
]

const currentMood = computed(() => {
  const index = Math.floor(sliderValue.value * (moods.length - 1))
  return moods[index]
})

function onSliderChange() {
  updateParticleColor()
  fetchSongByMood()
}

function updateParticleColor() {
  const pjs = window.pJSDom?.[0]?.pJS
  if (pjs) {
    pjs.particles.color.value = currentMood.value.color
    pjs.fn.particlesRefresh()
  }
}

function sliderToMoodLevel() {
  return Math.floor(sliderValue.value * 9) + 1
}

async function fetchSongByMood() {
  try {
    const level = sliderToMoodLevel()
    const res = await fetch(`http://localhost:3000/mood/${level}`)
    songs.value = await res.json()
    currentIndex.value = 0
    currentSong.value = songs.value[0]
  } catch (err) {
    console.error('❌ Erreur fetch mood:', err)
  }
}

function playNext() {
  if (currentIndex.value < songs.value.length - 1) {
    currentIndex.value++
    currentSong.value = songs.value[currentIndex.value]
  }
}

function playPrevious() {
  if (currentIndex.value > 0) {
    currentIndex.value--
    currentSong.value = songs.value[currentIndex.value]
  }
}

function isLiked(song) {
  return likedSongs.value.some(s => s.title === song.title && s.artist === song.artist)
}

function toggleMenu(index) {
  openMenuIndex.value = openMenuIndex.value === index ? null : index
}

async function openPlaylistPopup(song) {
  const uri = song.spotify_uri || (
    song.spotify_url?.includes('/track/')
      ? `spotify:track:${song.spotify_url.split('/track/')[1].split('?')[0]}`
      : null
  )
  if (!uri) { toast.error("URI Spotify introuvable pour ce morceau"); return }
  selectedTrack.value = { ...song, spotify_uri: uri }
  showPlaylistModal.value = true
  const accessToken = localStorage.getItem('access_token')
  if (!accessToken) return toast.error("Token Spotify introuvable")
  try {
    const res = await axios.get('https://api.spotify.com/v1/me/playlists', {
      headers: { Authorization: `Bearer ${accessToken}` }
    })
    userPlaylists.value = res.data.items
  } catch (err) {
    toast.error("Erreur lors du chargement des playlists")
  }
}

function closePlaylistPopup() {
  showPlaylistModal.value = false
  selectedTrack.value = null
}

async function addTrackToPlaylist(playlistId) {
  const accessToken = localStorage.getItem('access_token')
  if (!accessToken) return toast.error("Token Spotify introuvable")
  const uri = selectedTrack.value?.spotify_uri
  if (!uri) return toast.error("URI du morceau introuvable")
  try {
    await axios.post(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      { uris: [uri] },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )
    toast.success(`🎶 « ${selectedTrack.value.title} » ajouté à la playlist !`)
    closePlaylistPopup()
  } catch (err) {
    toast.error("Erreur lors de l'ajout du morceau")
  }
}

async function createNewPlaylist() {
  const accessToken = localStorage.getItem('access_token')
  if (!accessToken) return toast.error("Token Spotify introuvable")
  const playlistName = prompt("Nom de la nouvelle playlist :")
  if (!playlistName) return
  try {
    const userRes = await axios.get('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${accessToken}` }
    })
    const userId = userRes.data.id
    const playlistRes = await axios.post(
      `https://api.spotify.com/v1/users/${userId}/playlists`,
      { name: playlistName, public: false, description: "Créée via Moodify 🎧" },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )
    const newPlaylistId = playlistRes.data.id
    await axios.post(
      `https://api.spotify.com/v1/playlists/${newPlaylistId}/tracks`,
      { uris: [selectedTrack.value.spotify_uri] },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )
    toast.success(`✅ Playlist « ${playlistName} » créée !`)
    await new Promise(r => setTimeout(r, 500))
    const res = await axios.get('https://api.spotify.com/v1/me/playlists?limit=50', {
      headers: { Authorization: `Bearer ${accessToken}` }
    })
    userPlaylists.value = res.data.items
  } catch (err) {
    toast.error("Erreur lors de la création de la playlist")
  }
}

async function toggleLikeCurrentTrack() {
  if (!currentSong.value) return
  const index = likedSongs.value.findIndex(
    s => s.title === currentSong.value.title && s.artist === currentSong.value.artist
  )
  if (index !== -1) {
    const removed = likedSongs.value.splice(index, 1)[0]
    try {
      await removeLikedTrack(removed)
      toast.info(`🗑️ « ${removed.title} » retiré des favoris`)
    } catch (err) {
      toast.error("Erreur lors du retrait des favoris")
    }
  } else {
    likedSongs.value.push({ ...currentSong.value })
    try {
      await saveLikedTrack(currentSong.value)
      toast.success(`❤️ « ${currentSong.value.title} » ajouté aux favoris`)
    } catch (err) {
      toast.error("Erreur lors de l'enregistrement du favori")
    }
  }
}

async function removeLiked(song) {
  try {
    await removeLikedTrack(song)
    likedSongs.value = likedSongs.value.filter(s =>
      !(s.title === song.title && s.artist === song.artist)
    )
    toast.info(`🗑️ « ${song.title} » retiré`)
  } catch (err) {
    toast.error("Erreur lors du retrait du titre")
  }
}

const fetchFriends = () => {
  try {
    const stored = localStorage.getItem('friends')
    friends.value = stored ? JSON.parse(stored) : []
  } catch (e) {
    friends.value = []
  }
}

const removeFriend = (friend) => {
  try {
    let list = JSON.parse(localStorage.getItem('friends') || '[]')
    list = list.filter(f => f.id !== friend.id)
    localStorage.setItem('friends', JSON.stringify(list))
    fetchFriends()
    toast.info(`${friend.username} retiré de vos amis`)
  } catch (e) {
    toast.error("Erreur lors du retrait de l'ami")
  }
}

function handleClickOutside(event) {
  const leftSidebar = document.querySelector('.sidebar.left')
  const rightSidebar = document.querySelector('.sidebar.right')
  if (showLeftSidebar.value && leftSidebar && !leftSidebar.contains(event.target)) {
    showLeftSidebar.value = false
  }
  if (showRightSidebar.value && rightSidebar && !rightSidebar.contains(event.target)) {
    showRightSidebar.value = false
  }
  if (openMenuIndex.value !== null) {
    const menuWrapper = document.querySelectorAll('.menu-wrapper')[openMenuIndex.value]
    if (menuWrapper && !menuWrapper.contains(event.target)) {
      openMenuIndex.value = null
    }
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)

  const script = document.createElement('script')
  script.src = 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js'
  script.onload = () => {
    window.particlesJS('particles-js', {
      particles: {
        number: { value: 60, density: { enable: true, value_area: 800 } },
        color: { value: '#9EC5AB' },
        shape: { type: 'circle' },
        opacity: { value: 0.3, random: true },
        size: { value: 2.5, random: true },
        line_linked: { enable: true, distance: 120, color: '#32746D', opacity: 0.15, width: 1 },
        move: { enable: true, speed: 0.8, random: true, out_mode: 'out' }
      },
      interactivity: {
        detect_on: 'canvas',
        events: {
          onhover: { enable: true, mode: 'grab' },
          onclick: { enable: true, mode: 'push' },
          resize: true
        },
        modes: {
          grab: { distance: 140, line_linked: { opacity: 0.4 } },
          push: { particles_nb: 2 }
        }
      },
      retina_detect: true
    })
  }
  document.head.appendChild(script)

  getLikedTracks().then(t => { likedSongs.value = t }).catch(() => {})
  fetchFriends()
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

watch(() => currentMood.value.color, updateParticleColor)
</script>

<style scoped>
.home {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: radial-gradient(ellipse at 40% 30%, #01200F 0%, #011502 70%);
  color: #F0F7F2;
  position: relative;
}

#particles-js {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.main-content {
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  padding: 2rem 1rem 6rem;
  min-height: calc(100vh - 64px);
}

/* Mood card */
.mood-card {
  background: rgba(1, 32, 15, 0.55);
  border: 1px solid rgba(158, 197, 171, 0.12);
  border-radius: 24px;
  backdrop-filter: blur(20px);
  padding: 2.5rem 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 8px 40px rgba(0,0,0,0.35);
}

.mood-emoji {
  font-size: 5rem;
  line-height: 1;
  filter: drop-shadow(0 4px 12px rgba(0,0,0,0.3));
  transition: transform 0.3s ease;
}
.mood-emoji:hover { transform: scale(1.1); }

.mood-name {
  font-size: 1.6rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  transition: color 0.4s ease;
}

.mood-hint {
  font-size: 0.78rem;
  color: rgba(158, 197, 171, 0.4);
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.slider-wrap {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 0.5rem;
}

.mood-slider {
  width: 100%;
  height: 6px;
  appearance: none;
  border-radius: 6px;
  outline: none;
  cursor: pointer;
  background: linear-gradient(
    to right,
    var(--mood-color, #32746D) 0%,
    rgba(158, 197, 171, 0.15) 0%
  );
  transition: background 0.3s ease;
}

.mood-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #F0F7F2;
  cursor: pointer;
  border: 3px solid var(--mood-color, #32746D);
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  transition: transform 0.15s, border-color 0.3s;
}
.mood-slider::-webkit-slider-thumb:hover { transform: scale(1.2); }

.mood-labels {
  display: flex;
  justify-content: space-between;
  font-size: 1rem;
  padding: 0 2px;
}

.mood-desc {
  font-size: 0.95rem;
  color: rgba(158, 197, 171, 0.6);
  font-style: italic;
  margin-top: 0.25rem;
}

/* Now playing */
.now-playing {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(1, 32, 15, 0.55);
  border: 1px solid rgba(158, 197, 171, 0.12);
  border-radius: 16px;
  backdrop-filter: blur(16px);
  padding: 1rem 1.25rem;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.25);
}

.np-cover {
  width: 64px;
  height: 64px;
  object-fit: cover;
  border-radius: 10px;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0,0,0,0.4);
}

.np-meta { flex: 1; min-width: 0; }
.np-label {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #9EC5AB;
  opacity: 0.6;
}
.np-meta h3 {
  margin: 2px 0 2px;
  font-size: 1rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.np-meta p {
  margin: 0;
  font-size: 0.82rem;
  color: rgba(158, 197, 171, 0.55);
}

.like-btn {
  background: none;
  border: none;
  color: rgba(158, 197, 171, 0.5);
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s, background 0.2s, transform 0.2s;
  flex-shrink: 0;
}
.like-btn:hover { color: #9EC5AB; background: rgba(16, 79, 85, 0.3); transform: scale(1.1); }
.like-btn.liked { color: #ff6b8a; }
.like-btn.liked:hover { color: #ff4d74; }

.no-song {
  color: rgba(158, 197, 171, 0.4);
  font-size: 0.9rem;
  text-align: center;
}

/* Sidebar content */
.sidebar-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 0.75rem;
  margin-bottom: 0.75rem;
  border-bottom: 1px solid rgba(158, 197, 171, 0.1);
  font-size: 0.9rem;
  font-weight: 600;
  color: #9EC5AB;
}

.badge {
  margin-left: auto;
  background: rgba(16, 79, 85, 0.5);
  color: #9EC5AB;
  font-size: 0.72rem;
  padding: 2px 7px;
  border-radius: 10px;
  font-weight: 600;
}

.empty-state {
  text-align: center;
  color: rgba(158, 197, 171, 0.35);
  font-size: 0.85rem;
  padding: 1.5rem 0;
}
.empty-cta {
  display: inline-block;
  margin-top: 0.5rem;
  padding: 6px 14px;
  background: rgba(16, 79, 85, 0.4);
  border: 1px solid rgba(158, 197, 171, 0.2);
  border-radius: 8px;
  color: #9EC5AB;
  text-decoration: none;
  font-size: 0.8rem;
  transition: background 0.2s;
}
.empty-cta:hover { background: rgba(50, 116, 109, 0.5); }

.track-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0.5rem 0.5rem;
  border-radius: 10px;
  margin-bottom: 0.5rem;
  background: rgba(16, 79, 85, 0.08);
  border: 1px solid transparent;
  transition: background 0.2s, border-color 0.2s;
  position: relative;
}
.track-item:hover {
  background: rgba(16, 79, 85, 0.2);
  border-color: rgba(158, 197, 171, 0.1);
}

.track-cover {
  width: 42px;
  height: 42px;
  object-fit: cover;
  border-radius: 6px;
  flex-shrink: 0;
}

.track-info { flex: 1; min-width: 0; }
.track-info h4 {
  margin: 0;
  font-size: 0.85rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.track-info p {
  margin: 1px 0 0;
  font-size: 0.75rem;
  color: rgba(158, 197, 171, 0.5);
}

.remove-btn {
  background: none;
  border: none;
  color: rgba(158, 197, 171, 0.3);
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  transition: color 0.2s, background 0.2s;
  flex-shrink: 0;
}
.remove-btn:hover {
  color: #ff6b6b;
  background: rgba(255, 107, 107, 0.1);
}

.menu-wrapper { position: relative; }
.more-btn {
  background: none;
  border: none;
  color: rgba(158, 197, 171, 0.4);
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  border-radius: 4px;
  transition: color 0.2s;
}
.more-btn:hover { color: #9EC5AB; }

.dropdown-menu {
  position: absolute;
  right: 0;
  bottom: 100%;
  background: #01200F;
  border: 1px solid rgba(158, 197, 171, 0.15);
  border-radius: 10px;
  padding: 6px;
  z-index: 999;
  min-width: 170px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.5);
}
.dropdown-link {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(158, 197, 171, 0.8);
  background: none;
  border: none;
  text-decoration: none;
  padding: 7px 10px;
  font-size: 0.83rem;
  border-radius: 6px;
  cursor: pointer;
  width: 100%;
  transition: background 0.15s;
}
.dropdown-link:hover {
  background: rgba(16, 79, 85, 0.35);
  color: #F0F7F2;
}

.icon-sm { width: 16px; height: 16px; flex-shrink: 0; }

/* Friends */
.friend-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0.6rem 0.5rem;
  border-radius: 10px;
  margin-bottom: 0.6rem;
  background: rgba(16, 79, 85, 0.08);
  border: 1px solid transparent;
  transition: background 0.2s, border-color 0.2s;
}
.friend-card:hover {
  background: rgba(16, 79, 85, 0.2);
  border-color: rgba(158, 197, 171, 0.1);
}

.friend-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(50, 116, 109, 0.5);
  flex-shrink: 0;
}

.friend-info { flex: 1; min-width: 0; }
.friend-info h4 {
  margin: 0 0 4px;
  font-size: 0.88rem;
  font-weight: 600;
}

.view-likes-btn {
  display: inline-block;
  padding: 3px 10px;
  background: rgba(16, 79, 85, 0.4);
  border: 1px solid rgba(158, 197, 171, 0.2);
  border-radius: 6px;
  color: #9EC5AB;
  text-decoration: none;
  font-size: 0.75rem;
  transition: background 0.2s;
}
.view-likes-btn:hover { background: rgba(50, 116, 109, 0.5); }

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.75);
  backdrop-filter: blur(6px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal {
  background: #01200F;
  border: 1px solid rgba(158, 197, 171, 0.15);
  border-radius: 20px;
  padding: 1.5rem;
  width: 90%;
  max-width: 860px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 24px 60px rgba(0,0,0,0.6);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
}
.modal-header h3 {
  margin: 0;
  font-size: 1.2rem;
  color: #9EC5AB;
}
.modal-close {
  background: none;
  border: none;
  color: rgba(158, 197, 171, 0.5);
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  display: flex;
  transition: color 0.2s;
}
.modal-close:hover { color: #F0F7F2; }

.playlist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 14px;
}

.playlist-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 10px;
  background: rgba(16, 79, 85, 0.15);
  border: 1px solid rgba(158, 197, 171, 0.1);
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s;
}
.playlist-card:hover {
  background: rgba(50, 116, 109, 0.25);
  transform: translateY(-2px);
}

.pl-img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 8px;
}

.pl-name {
  font-size: 0.78rem;
  color: rgba(158, 197, 171, 0.8);
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}

.create-card {
  border: 1.5px dashed rgba(158, 197, 171, 0.25);
}

.plus-img {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(16, 79, 85, 0.3);
  color: #9EC5AB;
  aspect-ratio: 1;
  border-radius: 8px;
  width: 100%;
}
</style>
