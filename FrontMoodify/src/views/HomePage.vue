<template>
  <div class="home">

    <Navbar :color="currentMood.color" />

    <div id="particles-js"></div>

    <Sidebar :open="showLeftSidebar" side="left" @toggle="showLeftSidebar = !showLeftSidebar">
      <p class="sidebar-title" @click="toggleLikedExpanded" style="cursor: pointer;">
        <span v-if="likedExpanded">⬇️</span>
        <span v-else>➡️</span>
        <span v-else>➡️</span>
<svg xmlns="http://www.w3.org/2000/svg"
     width="20" height="20"
     viewBox="0 0 24 24"
     fill="currentColor"
     class="icon icon-tabler icons-tabler-filled icon-tabler-heart"
     style="vertical-align: middle; margin-right: 5px;">
  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
  <path d="M6.979 3.074a6 6 0 0 1 4.988 1.425l.037 .033l.034 -.03a6 6 0 0 1 4.733 -1.44l.246 .036a6 6 0 0 1 3.364 10.008l-.18 .185l-.048 .041l-7.45 7.379a1 1 0 0 1 -1.313 .082l-.094 -.082l-7.493 -7.422a6 6 0 0 1 3.176 -10.215z" />
</svg>
Titres Likés
      </p>
      <div v-if="likedExpanded">
        <div v-for="(song, index) in likedSongs" :key="'liked-' + index" class="track-item">
          <img :src="song.image" class="track-cover" alt="cover" />
          <div class="track-info">
            <h4>{{ song.title }}</h4>
            <p>{{ song.artist }}</p>
          </div>
          <div class="menu-wrapper">
            <button class="more-btn" @click="toggleMenu(index)">⋯</button>
            <div v-if="openMenuIndex === index" class="dropdown-menu">
              <a :href="song.spotify_url" target="_blank" class="dropdown-link">
                <svg class="w-5 h-5" viewBox="0 0 168 168" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M84,0C37.7,0,0,37.7,0,84s37.7,84,84,84s84-37.7,84-84S130.3,0,84,0z M121.3,120.1c-1.5,2.5-4.7,3.3-7.2,1.8
                  c-19.8-12.1-44.8-14.9-74.2-8.4c-2.8,0.6-5.5-1.2-6.1-4s1.2-5.5,4-6.1c32.3-7,60.1-3.7,82.2,10.1
                  C121.9,114.2,122.7,117.5,121.3,120.1z M133.4,97.6c-1.9,3-5.8,3.9-8.7,2c-22.7-14-57.3-18-84.1-10.1c-3.4,1-6.9-0.9-7.9-4.3
                  c-1-3.4,0.9-6.9,4.3-7.9c31.8-9.2,70.5-4.7,97.5,11.6C134.3,90.8,135.2,94.7,133.4,97.6z M134.9,74.1c-27-16.2-71.5-17.7-97-10
                  c-4,1.2-8.2-1-9.4-5c-1.2-4,1-8.2,5-9.4c29.6-8.8,79-7.1,110.9,11.7c3.6,2.1,4.8,6.7,2.6,10.3C144.8,75.1,139.1,76.6,134.9,74.1z"/>
              </svg>
                Ouvrir dans Spotify
              </a>

              <button class="dropdown-link" @click="openPlaylistPopup(song)">
                <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-playlist-add"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M19 8h-14" /><path d="M5 12h9" /><path d="M11 16h-6" /><path d="M15 16h6" /><path d="M18 13v6" /></svg>
                Ajouter à une playlist
              </button>
            </div>
          </div>
          <button @click="removeLiked(song)" class="delike-btn">❌</button>
        </div>
      </div>
    </Sidebar>

    <Sidebar :open="showRightSidebar" side="right" @toggle="showRightSidebar = !showRightSidebar">
      <p class="sidebar-title">👥 Friends</p>
      <div v-for="(friend, i) in friends" :key="i" class="friend-card">
        <img :src="friend.avatar" class="friend-avatar" alt="avatar" />
        <div class="friend-info">
          <h4>{{ friend.username }}</h4>
          <p class="friend-mood">{{ friend.moodEmoji }} {{ friend.moodText }}</p>
          <p class="friend-track">🎵 {{ friend.currentTrack }}</p>
        </div>
        <router-link
          :to="{ name: 'FriendLikes', params: { id: friend.id, username: friend.username } }"
          class="view-likes-btn"
        >
          View Liked Songs
        </router-link>
        <button 
          @click="removeFriend(friend)" 
          class="remove-friend-btn"
          title="Retirer cet ami"
        >
          ❌
        </button>
      </div>
    </Sidebar>

    <div class="content-wrapper">
      <div class="sbar">
        <div class="emoji">{{ currentMood.emoji }}</div>
        <div class="mood-label" :style="{ color: currentMood.color }">{{ currentMood.mood }}</div>
        <div class="mood-label">Your Mood</div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          v-model="sliderValue"
          class="slider"
          @change="onSliderChange"
        />
        <div class="mood-text">{{ currentMood.text }}</div>
      </div>

      <div class="mood-track" v-if="currentSong">
        <img :src="currentSong.image" alt="cover" class="mood-cover" />
        <div class="track-meta">
          <h3>{{ currentSong.title }}</h3>
          <p>{{ currentSong.artist }}</p>
        </div>
        <button @click="toggleLikeCurrentTrack" class="like-button">
  <!-- Cœur rempli (liké) -->
  <svg v-if="isLiked(currentSong)"
    xmlns="http://www.w3.org/2000/svg"
    width="24" height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    class="icon icon-tabler icons-tabler-filled icon-tabler-heart">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M6.979 3.074a6 6 0 0 1 4.988 1.425l.037 .033l.034 -.03a6 6 0 0 1 4.733 -1.44l.246 .036a6 6 0 0 1 3.364 10.008l-.18 .185l-.048 .041l-7.45 7.379a1 1 0 0 1 -1.313 .082l-.094 -.082l-7.493 -7.422a6 6 0 0 1 3.176 -10.215z" />
  </svg>

  <!-- Cœur vide (non liké) -->
  <svg v-else
    xmlns="http://www.w3.org/2000/svg"
    width="24" height="24"
    viewBox="0 0 24 24"
    fill="none" stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="icon icon-tabler icons-tabler-outline icon-tabler-heart">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
  </svg>
</button>

      </div>
    </div>

    <MusicPlayer
      :track="currentSong"
      :onPrev="playPrevious"
      :onNext="playNext"
    />

    <!-- 🎵 Popup d'ajout à une playlist -->
<div v-if="showPlaylistModal" class="modal-overlay" @click.self="closePlaylistPopup">
  <div class="modal-content">
    <h3>Ajouter à une playlist</h3>
    <div class="playlist-grid" v-if="userPlaylists.length > 0">
  <div
    v-for="playlist in userPlaylists"
    :key="playlist.id"
    class="playlist-card"
    @click="addTrackToPlaylist(playlist.id)"
  >
    <img :src="playlist.images?.[0]?.url || defaultImage" class="playlist-image" />
    <div class="playlist-name">{{ playlist.name }}</div>
  </div>
  <li @click="createNewPlaylist" class="playlist-card create-card">
  <div class="playlist-image">
    <span class="plus-icon">＋</span>
  </div>
  <p>Nouvelle playlist</p>
</li>

</div>

    <p v-else>Aucune playlist trouvée.</p>
    <button class="close-btn" @click="closePlaylistPopup">Fermer</button>
  </div>
</div>


  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue'
import axios from 'axios';
import Navbar from '@/components/Navbar.vue'
import MusicPlayer from '@/components/MusicPlayer.vue'
import Sidebar from '@/components/Sidebar.vue'
import { saveLikedTrack, getLikedTracks, removeLikedTrack } from '@/services/likeService'
import { useToast } from 'vue-toastification'
const toast = useToast()

const showPlaylistModal = ref(false)
const userPlaylists = ref([])
const selectedTrack = ref(null)
const defaultImage = '/default_playlist_cover.png'



const showLeftSidebar = ref(false)
const showRightSidebar = ref(false)
const sliderValue = ref(0)
const currentSong = ref(null)
const songs = ref([])
const currentIndex = ref(0)
const likedSongs = ref([])
const likedExpanded = ref(true)

const friends = ref([]);

const moods = [
  { mood: "Productif", emoji: "✅", color: "#4CAF50" },
  { mood: "Nostalgique", emoji: "🌅", color: "#FFA07A" },
  { mood: "Amoureux", emoji: "💘", color: "#FF69B4" },
  { mood: "Chill", emoji: "☕", color: "#87CEFA" },
  { mood: "Sport", emoji: "🏋️", color: "#FF4500" },
  { mood: "Créatif", emoji: "🎨", color: "#9C27B0" },
  { mood: "Cocooning", emoji: "🕯️", color: "#D2B48C" },
  { mood: "Gamer", emoji: "🎮", color: "#1E90FF" },
  { mood: "Fêtard", emoji: "🎉", color: "#FFD700" },
  { mood: "Mélancolique", emoji: "🌧️", color: "#708090" }
]

const currentMood = computed(() => {
  const index = Math.floor(sliderValue.value * (moods.length - 1))
  return moods[index]
})

function onSliderChange() {
  updateSliderColor()
  console.log("Slider changed, mood level:", sliderToMoodLevel())
  fetchSongByMood()
}

function updateSliderColor() {
  const slider = document.querySelector('.slider')
  if (slider) {
    slider.style.background = currentMood.value.color
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

const openMenuIndex = ref(null)

function toggleMenu(index) {
  openMenuIndex.value = openMenuIndex.value === index ? null : index
}

async function openPlaylistPopup(song) {
  // Si le champ spotify_uri n'existe pas, on le dérive depuis l'URL
  const uri = song.spotify_uri || (
    song.spotify_url?.includes('/track/')
      ? `spotify:track:${song.spotify_url.split('/track/')[1].split('?')[0]}`
      : null
  )

  if (!uri) {
    toast.error("URI Spotify introuvable pour ce morceau")
    return
  }

  // On stocke la track avec la bonne URI
  selectedTrack.value = { ...song, spotify_uri: uri }
  showPlaylistModal.value = true

  const accessToken = localStorage.getItem('access_token')
  if (!accessToken) return toast.error("Pas de token Spotify")

  try {
    const res = await axios.get('https://api.spotify.com/v1/me/playlists', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    userPlaylists.value = res.data.items
  } catch (err) {
    console.error("❌ Erreur récupération playlists :", err)
    toast.error("Erreur récupération des playlists")
  }
}

function closePlaylistPopup() {
  showPlaylistModal.value = false
  selectedTrack.value = null
}

async function addTrackToPlaylist(playlistId) {
  const accessToken = localStorage.getItem('access_token')
  if (!accessToken) return toast.error("Pas de token Spotify")

  const uri = selectedTrack.value?.spotify_uri
  if (!uri) return toast.error("URI manquante pour ce morceau")

  try {
    await axios.post(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      { uris: [uri] },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    )
    toast.success(`🎶 « ${selectedTrack.value.title} » ajouté à la playlist !`)
    closePlaylistPopup()
  } catch (err) {
    console.error("❌ Erreur ajout à la playlist :", err)
    toast.error("Erreur ajout du morceau")
  }
}

async function fetchUserPlaylists() {
  const accessToken = localStorage.getItem('access_token')
  if (!accessToken) return toast.error("Pas de token Spotify")

  try {
    const res = await axios.get('https://api.spotify.com/v1/me/playlists?limit=50', {
      headers: { Authorization: `Bearer ${accessToken}` }
    })
    userPlaylists.value = res.data.items
    console.log("Playlists récupérées 🎧", res.data.items)
    


  } catch (err) {
    console.error("❌ Erreur récupération playlists :", err)
    toast.error("Erreur récupération des playlists")
  }
}

async function createNewPlaylist() {
  const accessToken = localStorage.getItem('access_token')
  if (!accessToken) return toast.error("Pas de token Spotify")

  const playlistName = prompt("Nom de la nouvelle playlist :")
  if (!playlistName) return

  try {
    const userRes = await axios.get('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${accessToken}` }
    })
    const userId = userRes.data.id

    // Création de la playlist
    const playlistRes = await axios.post(
      `https://api.spotify.com/v1/users/${userId}/playlists`,
      {
        name: playlistName,
        public: false,
        description: "Playlist créée depuis Moodify 🎧"
      },
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    )


    const newPlaylistId = playlistRes.data.id

    // Ajouter le morceau
    await axios.post(
      `https://api.spotify.com/v1/playlists/${newPlaylistId}/tracks`,
      {
        uris: [selectedTrack.value.spotify_uri]
      },
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    )

    toast.success(`✅ Playlist « ${playlistName} » créée et morceau ajouté !`)

    // 🔁 Petite pause pour laisser Spotify "propager" la playlist
    await new Promise(resolve => setTimeout(resolve, 500))

    // 🔄 Recharge les playlists
    await fetchUserPlaylists()

  } catch (err) {
    console.error('❌ Erreur création playlist:', err)
    toast.error("Erreur lors de la création")
  }
}







async function toggleLikeCurrentTrack() {
  if (!currentSong.value) return;

  const index = likedSongs.value.findIndex(
    s => s.title === currentSong.value.title && s.artist === currentSong.value.artist
  );

  if (index !== -1) {
    const removedTrack = likedSongs.value.splice(index, 1)[0];
    try {
      await removeLikedTrack(removedTrack);
      console.log("🗑️ Titre supprimé de la BDD :", removedTrack.title);
      toast.info(`🗑️ « ${removedTrack.title} » supprimé des favoris`);
    } catch (err) {
      console.error('❌ Erreur lors de la suppression du like :', err);
      toast.error("Erreur lors de la suppression du like");
    }
  } else {
    likedSongs.value.push({ ...currentSong.value });
    try {
      const res = await saveLikedTrack(currentSong.value);
      console.log("✅ Titre liké enregistré dans la BDD :", currentSong.value.title, res);
      toast.success(`❤️ « ${currentSong.value.title} » ajouté aux favoris`);
    } catch (err) {
      console.error('❌ Erreur en sauvegardant le like :', err);
      toast.error("Erreur lors de l'enregistrement du like");
    }
  }
}

async function removeLiked(song) {
  try {
    await removeLikedTrack(song)
    likedSongs.value = likedSongs.value.filter(s =>
      !(s.title === song.title && s.artist === song.artist)
    )
    toast.info(`🗑️ « ${song.title} » retiré de vos favoris`)
  } catch (err) {
    console.error('❌ Erreur lors de la suppression du like depuis la sidebar :', err)
    toast.error("Erreur lors de la suppression du titre")
  }
}




function toggleLikedExpanded() {
  likedExpanded.value = !likedExpanded.value
}
const fetchFriends = async () => {
  try {
    // Récupérer les amis du localStorage
    const storedFriends = localStorage.getItem('friends')
    if (storedFriends) {
      friends.value = JSON.parse(storedFriends)
    } else {
      friends.value = [] // Si pas d'amis, tableau vide
    }
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des amis:', error)
    friends.value = []
  }
}

const removeFriend = (friend) => {
  try {
    const storedFriends = localStorage.getItem('friends')
    let friends = storedFriends ? JSON.parse(storedFriends) : []
    
    friends = friends.filter(f => f.id !== friend.id)
    
    localStorage.setItem('friends', JSON.stringify(friends))
    
    fetchFriends()
    
    toast.error(`❌ ${friend.username} a été retiré de vos amis`, {
      timeout: 3000,
      position: "bottom-right",
    })
  } catch (error) {
    console.error('❌ Erreur lors de la suppression de l\'ami:', error)
    toast.error("Erreur lors de la suppression de l'ami")
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
    const currentMenuWrapper = document.querySelectorAll('.menu-wrapper')[openMenuIndex.value]
    const dropdownMenu = currentMenuWrapper?.querySelector('.dropdown-menu')
    const toggleButton = currentMenuWrapper?.querySelector('.more-btn')

    const clickedOutsideMenu =
      dropdownMenu && !dropdownMenu.contains(event.target) &&
      toggleButton && !toggleButton.contains(event.target)

    if (clickedOutsideMenu) {
      toggleMenu(openMenuIndex.value)
    }
  }
}


onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});

onMounted(() => {
  const script = document.createElement('script')
  script.src = 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js'
  script.onload = () => {
    window.particlesJS('particles-js', {
      particles: {
        number: { value: 1000, density: { enable: true, value_area: 800 } },
        color: { value: '#00ff88' },
        shape: {
          type: 'circle',
          stroke: { width: 0, color: '#000000' },
          polygon: { nb_sides: 5 }
        },
        opacity: { value: 0.5, random: true, anim: { enable: false } },
        size: { value: 2, random: true, anim: { enable: false } },
        line_linked: { enable: false },
        move: {
          enable: true,
          speed: 1,
          direction: 'none',
          random: true,
          out_mode: 'out'
        }
      },
      interactivity: {
        detect_on: 'canvas',
        events: {
          onhover: { enable: true, mode: 'bubble' },
          onclick: { enable: true, mode: 'push' },
          resize: true
        },
        modes: {
          bubble: {
            distance: 250,
            size: 0,
            duration: 2,
            opacity: 0,
            speed: 3
          },
          push: { particles_nb: 4 }
        }
      },
      retina_detect: true
    })
  }
  document.head.appendChild(script)

  const fetchLikedSongs = async () => {
    try {
      likedSongs.value = await getLikedTracks()
    } catch (err) {
      console.error('❌ Erreur lors du chargement des titres likés :', err)
    }
  }

  fetchLikedSongs()
  fetchFriends()

})


watch(
  () => currentMood.value.color,
  (newColor) => {
    // 🔄 Particules
    const pjs = window.pJSDom?.[0]?.pJS
    if (pjs) {
      window.pJSDom[0].pJS.particles.color.value = newColor
      window.pJSDom[0].pJS.fn.particlesRefresh()

    }

    // 🧠 Logo "Moodify"
    const moodifyText = document.getElementById('moodify')
    if (moodifyText) {
      moodifyText.style.color = newColor
    }
    const logo = document.getElementById('Ellipse 1')
    const logo2 = document.getElementById('Ellipse 2')
    if (logo && logo2) {
      logo.style.fill = newColor
      logo2.style.fill = newColor
    }

    // ✅ .link-button border color
    const linkButtons = document.querySelectorAll('.links button')
    linkButtons.forEach(btn => {
      btn.style.borderColor = newColor
      btn.style.color = newColor
    })

    // ✅ .links a.active color or border (adjust as needed)
    const activeLinks = document.querySelectorAll('.links a.active')
    activeLinks.forEach(link => {
      link.style.color = newColor
      link.style.borderBottom = `2px solid ${newColor}`
    })
  }
)


</script>

<style scoped>
#particles-js {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.home {
  background: linear-gradient(320deg, #101010 30%, #2a2a2a 100%);
  color: white;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
}
.content-wrapper,
.sbar,
.mood-track,
.friend-card {
  position: relative;
  z-index: 1;
}

.track-item {
  position: relative; /* ⬅️ Ajout nécessaire */
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  padding: 0.5rem;
  border-radius: 8px;
  background-color: #2a2a2a;
  transition: background 0.2s ease;
}

.home {
  background: linear-gradient(320deg, #101010 30%, #2a2a2a 100%);
  color: white;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
}

.content-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 90vh;
}

.sbar {
  background: #0000001f;
  width: 80%;
  margin: 30px 10px;
  height: 50vh;
  padding: 30px;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.emoji {
  font-size: 70px;
  margin-bottom: 20px;
}

.mood-label {
  margin: 20px 0 10px;
  font-size: 20px;
}

.slider {
  width: 50%;
  appearance: none;
  height: 7px;
  border-radius: 5px;
  outline: none;
  background: #00ff88;
  transition: background 0.3s;
  margin-top: 10px;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: white;
  cursor: pointer;
  border: 2px solid #fff;
}

.slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: white;
  cursor: pointer;
  border: 2px solid #fff;
}

.menu-wrapper {
  margin-left: auto;
  position: absolute;
  right: 45px;
  top: 50%;
  transform: translateY(-50%);
}

.more-btn {
  background: none;
  border: none;
  font-size: 20px;
  color: #ccc;
  margin-left: 10px;
  cursor: pointer;
}

.dropdown-menu {
  position: absolute;
  right: 0;
  bottom: 100%; 
  background-color: #2a2a2a;
  border: 1px solid #444;
  border-radius: 5px;
  padding: 5px 10px;
  z-index: 999; 
  display: flex;
  flex-direction: column;
  min-width: 160px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.6);
}


.dropdown-menu a {
  color: #fff;
  text-decoration: none;
  padding: 5px 0;
  font-size: 14px;
}

.dropdown-menu a:hover {
  color: #1DB954; /* Spotify green */
}


.mood-text {
  margin-top: 20px;
  font-size: 18px;
  font-weight: bold;
}

.mood-track {
  display: flex;
  width: 80%;
  align-items: center;
  margin-top: 2rem;
  background-color: #1b1b1b;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
}

.mood-cover {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 1rem;
}

.track-meta h3 {
  margin: 0;
  font-size: 1.2rem;
}

.track-meta p {
  margin: 0;
  font-size: 0.9rem;
  color: #ccc;
}

.like-button {
  background: none;
  border: none;
  font-size: 24px;
  color: white;
  cursor: pointer;
  margin-left: auto;
  transition: transform 0.2s ease;
}

.like-button:hover {
  transform: scale(1.2);
}

.sidebar-title {
  font-weight: bold;
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.delike-btn {
  margin-left: auto;
  background: none;
  border: none;
  font-size: 18px;
  color: #ff5e5e;
  cursor: pointer;
  transition: transform 0.2s ease;
  top: 50%;

}

.delike-btn:hover {
  transform: scale(1.2);
}


.track-item {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  padding: 0.5rem;
  border-radius: 8px;
  background-color: #2a2a2a;
  transition: background 0.2s ease;
}

.track-item:hover {
  background-color: #333;
}

.track-cover {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 6px;
  margin-right: 1rem;
}

.track-info {
  display: flex;
  flex-direction: column;
}

.track-info h4 {
  margin: 0;
  font-size: 1rem;
}

.track-info p {
  margin: 0;
  font-size: 0.85rem;
  color: #aaa;
}

.friend-card {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  padding: 1rem;
  background-color: #2b2b2b;
  border-radius: 10px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.friend-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.friend-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 1rem;
  border: 2px solid #1db954;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.friend-card:hover .friend-avatar {
  transform: scale(1.1);
  box-shadow: 0 0 10px rgba(29, 185, 84, 0.5);
}

.friend-info {
  flex: 1;
}

.friend-info h4 {
  margin: 0;
  font-size: 1rem;
  font-weight: bold;
  color: #fff;
}

.friend-mood {
  margin: 5px 0;
  font-size: 0.9rem;
  color: #1db954;
  display: flex;
  align-items: center;
  gap: 5px;
}

.friend-track {
  font-size: 0.85rem;
  color: #aaa;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.remove-friend-btn {
  background: none;
  border: none;
  color: #ff4d4d;
  font-size: 1.2rem;
  cursor: pointer;
  transition: transform 0.3s ease, background-color 0.3s ease;
  padding: 8px;
  border-radius: 50%;
}

.friend-card:hover .remove-friend-btn {
  transform: scale(1.2);
  background-color: rgba(255, 77, 77, 0.1);
}

.remove-friend-btn:hover {
  background-color: rgba(255, 77, 77, 0.2);
}

/* Style pour le titre de la section amis */
.sidebar-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #fff;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #1DB954;
  display: flex;
  align-items: center;
  gap: 8px;
}

.dropdown-link {
  display: flex;
  align-items: center;
  color: white;
  background: none;
  border: none;
  text-decoration: none;
  padding: 4px 8px;
  gap: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.dropdown-link:hover {
  background-color: #333;
  border-radius: 4px;
}


.dropdown-icon {
  width: 16px;
  height: 16px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-content {
  background: #1e1e1e;
  padding: 20px;
  border-radius: 12px;
  width: 80%;
  max-width: 900px;
  color: white;
}

.modal-content h3 {
  margin-bottom: 20px;
  font-size: 1.5rem;
  text-align: center;
}

.playlist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 20px;
  justify-items: center;
}

.playlist-card {
  width: 140px;
  background-color: #2a2a2a;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  text-align: center;
}

.playlist-card:hover {
  transform: scale(1.05);
  background-color: #333;
}

.playlist-card img {
  width: 100%;
  height: 100px;
  object-fit: cover;
  border-radius: 6px;
}

.playlist-card span {
  margin-top: 8px;
  font-size: 14px;
  color: #ddd;
}

/* 🆕 Style spécial pour la "carte création" */
.create-card {
  background-color: #1DB95422;
  border: 2px dashed #1DB954;
  justify-content: center;
}

.create-card .plus-icon {
  font-size: 48px;
  color: #1DB954;
  margin-bottom: 10px;
}

.create-card span {
  font-weight: bold;
  color: #1DB954;
}

.close-btn {
  margin-top: 20px;
  background: transparent;
  border: 1px solid #fff;
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  display: block;
  margin-left: auto;
}

.view-likes-btn {
  display: inline-block;
  margin-top: 8px;
  padding: 6px 12px;
  background-color: #1db954;
  color: white;
  border-radius: 6px;
  text-decoration: none;
  font-size: 0.9rem;
  transition: background-color 0.3s ease;
}

.view-likes-btn:hover {
  background-color: #1ed760;
}




</style>
