<template>
  <div class="home">

    <Navbar :color="currentMood.color" />

    <!-- Particles background -->
    <div id="particles-js"></div>

    <Sidebar :open="showLeftSidebar" side="left" @toggle="showLeftSidebar = !showLeftSidebar">
      <p class="sidebar-title" @click="toggleLikedExpanded" style="cursor: pointer;">
        <span v-if="likedExpanded">⬇️</span>
        <span v-else>➡️</span>
        ❤️ Titres Likés
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
                <img src="../../public/logo_spotify.svg" alt="Spotify" class="dropdown-icon" />
                Ouvrir dans Spotify
              </a>

              <button class="dropdown-link" @click="openPlaylistPopup(song)">
                <img src="../../public/logo_spotify.svg" alt="Add" class="dropdown-icon" />
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
          {{ isLiked(currentSong) ? '❤️' : '🤍' }}
        </button>
      </div>
    </div>

    <MusicPlayer
      :track="currentSong"
      :onPrev="playPrevious"
      :onNext="playNext"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import axios from 'axios';
import Navbar from '@/components/Navbar.vue'
import MusicPlayer from '@/components/MusicPlayer.vue'
import Sidebar from '@/components/Sidebar.vue'
import { saveLikedTrack, getLikedTracks, removeLikedTrack } from '@/services/likeService'
import { useToast } from 'vue-toastification'
const toast = useToast()




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

function openPlaylistPopup(song) {
  console.log("🎶 Ajout à une playlist :", song.title)
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
    const currentUserId = localStorage.getItem('userId')
    const response = await axios.get(`http://localhost:3000/api/friends/${currentUserId}`)
    friends.value = response.data
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des amis:', error)
  }
}



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
  padding: 0.5rem;
  background-color: #2a2a2a;
  border-radius: 8px;
}

.friend-avatar {
  width: 45px;
  height: 45px;
  object-fit: cover;
  border-radius: 50%;
  margin-right: 1rem;
}

.friend-info h4 {
  margin: 0;
  font-size: 1rem;
}

.friend-info p {
  margin: 2px 0;
  font-size: 0.85rem;
  color: #aaa;
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

</style>
