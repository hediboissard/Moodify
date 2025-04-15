<template>
  <div class="home">
    <Navbar />

    <Sidebar :open="showLeftSidebar" side="left" @toggle="showLeftSidebar = !showLeftSidebar">
      <p class="sidebar-title">🎵 Bibliothèques</p>

      <div v-for="i in 5" :key="i" class="track-item">
        <img src="../assets/logo.png" class="track-cover" alt="cover" />
        <div class="track-info">
          <h4>Titre {{ i }}</h4>
          <p>Artiste Démo</p>
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
        <div class="mood-label">Your Mood</div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          v-model="sliderValue"
          class="slider"
          @input="updateMood"
        />
        <div class="mood-text">{{ currentMood.text }}</div>
      </div>

      <div class="mood-track">
        <img :src="currentTrackByMood.cover" alt="cover" class="mood-cover" />
        <div class="track-meta">
          <h3>{{ currentTrackByMood.title }}</h3>
          <p>{{ currentTrackByMood.artist }}</p>
        </div>
      </div>
    </div>

    <MusicPlayer />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import Navbar from '@/components/Navbar.vue';
import MusicPlayer from '@/components/MusicPlayer.vue';
import Sidebar from '@/components/Sidebar.vue';

const showLeftSidebar = ref(false);
const showRightSidebar = ref(false);

const sliderValue = ref(0);

const moods = [
  { text: "Happy", emoji: "😊", color: "#00ff88" },
  { text: "Excited", emoji: "🤩", color: "#66ff66" },
  { text: "Calm", emoji: "🧘‍♂️", color: "#ffff66" },
  { text: "Meh", emoji: "😶", color: "#ffcc66" },
  { text: "Tired", emoji: "😴", color: "#ff8844" },
  { text: "Sad", emoji: "😭", color: "#ff4444" }
];

const currentMood = computed(() => {
  const index = Math.floor(sliderValue.value * (moods.length - 1));
  return moods[index];
});

function updateMood() {
  const slider = document.querySelector('.slider');
  slider.style.background = currentMood.value.color;
}

const moodTracks = {
  Happy: { title: "Uplift Me", artist: "Joy Beats", cover: "../assets/logo.png" },
  Excited: { title: "Hype Time", artist: "Pump Squad", cover: "../assets/logo.png" },
  Calm: { title: "Serenity", artist: "Ocean Flow", cover: "../assets/logo.png" },
  Meh: { title: "Neutral Ground", artist: "LoLine", cover: "../assets/logo.png" },
  Tired: { title: "Slow Mode", artist: "Dreamcore", cover: "../assets/logo.png" },
  Sad: { title: "Rainy Soul", artist: "DeepEcho", cover: "../assets/logo.png" }
};

const currentTrackByMood = computed(() => moodTracks[currentMood.value.text]);

const friends = [
  {
    avatar: 'https://i.pravatar.cc/150?img=1',
    username: 'lil_moody',
    moodEmoji: '😎',
    moodText: 'Chill',
    currentTrack: 'Lo-Fi Vibes'
  },
  {
    avatar: 'https://i.pravatar.cc/150?img=2',
    username: 'sunny_day',
    moodEmoji: '😊',
    moodText: 'Happy',
    currentTrack: 'Sunshine Beats'
  },
  {
    avatar: 'https://i.pravatar.cc/150?img=3',
    username: 'deep_mind',
    moodEmoji: '🧘‍♂️',
    moodText: 'Calm',
    currentTrack: 'Zen Flow'
  }
];
</script>

<style scoped>
.home {
  background: #121212;
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
  border: solid 4px #1e1e1e;
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
  height: 10px;
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

.sidebar-title {
  font-weight: bold;
  font-size: 1.1rem;
  margin-bottom: 1rem;
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
</style>
