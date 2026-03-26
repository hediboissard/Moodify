<template>
  <div class="page">
    <Navbar />
    <div class="container">
      <button @click="$router.back()" class="btn-back">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 12H5M12 5l-7 7 7 7"/>
        </svg>
        Retour
      </button>

      <div class="page-header">
        <h1>Titres aimés de {{ friend.username }}</h1>
        <span class="count-badge" v-if="likedSongs.length > 0">{{ likedSongs.length }} titres</span>
      </div>

      <div v-if="likedSongs.length > 0" class="songs-grid">
        <div v-for="song in likedSongs" :key="song.id" class="song-card">
          <div class="song-img-wrap">
            <img :src="song.image" alt="cover" class="song-img" />
            <div class="song-overlay">
              <a :href="song.spotify_url" target="_blank" class="spotify-btn" title="Ouvrir dans Spotify">
                <svg viewBox="0 0 168 168" fill="#1DB954" xmlns="http://www.w3.org/2000/svg">
                  <path d="M84,0C37.7,0,0,37.7,0,84s37.7,84,84,84s84-37.7,84-84S130.3,0,84,0z M121.3,120.1c-1.5,2.5-4.7,3.3-7.2,1.8c-19.8-12.1-44.8-14.9-74.2-8.4c-2.8,0.6-5.5-1.2-6.1-4s1.2-5.5,4-6.1c32.3-7,60.1-3.7,82.2,10.1C121.9,114.2,122.7,117.5,121.3,120.1z M133.4,97.6c-1.9,3-5.8,3.9-8.7,2c-22.7-14-57.3-18-84.1-10.1c-3.4,1-6.9-0.9-7.9-4.3c-1-3.4,0.9-6.9,4.3-7.9c31.8-9.2,70.5-4.7,97.5,11.6C134.3,90.8,135.2,94.7,133.4,97.6z M134.9,74.1c-27-16.2-71.5-17.7-97-10c-4,1.2-8.2-1-9.4-5c-1.2-4,1-8.2,5-9.4c29.6-8.8,79-7.1,110.9,11.7c3.6,2.1,4.8,6.7,2.6,10.3C144.8,75.1,139.1,76.6,134.9,74.1z"/>
                </svg>
              </a>
            </div>
          </div>
          <div class="song-meta">
            <h3>{{ song.title }}</h3>
            <p>{{ song.artist }}</p>
          </div>
        </div>
      </div>

      <div v-else class="empty">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" style="color: rgba(158,197,171,0.2)">
          <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
        </svg>
        <p>Aucun titre aimé trouvé.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import axios from 'axios'

const route = useRoute()
const friend = ref({})
const likedSongs = ref([])

onMounted(async () => {
  const { id, username } = route.params
  friend.value = { id, username }
  try {
    const res = await axios.get(`http://localhost:3000/api/users/likes?user_id=${id}`)
    likedSongs.value = res.data
  } catch (err) {
    console.error('Erreur:', err)
  }
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: radial-gradient(ellipse at 40% 30%, #01200F 0%, #011502 70%);
  color: #F0F7F2;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
}

.btn-back {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(16, 79, 85, 0.25);
  border: 1px solid rgba(158, 197, 171, 0.15);
  border-radius: 10px;
  color: #9EC5AB;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 2rem;
  transition: background 0.2s, color 0.2s;
}
.btn-back:hover { background: rgba(50, 116, 109, 0.35); color: #F0F7F2; }

.page-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}
.page-header h1 {
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
}

.count-badge {
  padding: 4px 12px;
  background: rgba(16, 79, 85, 0.4);
  border: 1px solid rgba(158, 197, 171, 0.15);
  border-radius: 20px;
  font-size: 0.8rem;
  color: #9EC5AB;
  font-weight: 600;
}

.songs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.song-card {
  background: rgba(1, 32, 15, 0.6);
  border: 1px solid rgba(158, 197, 171, 0.1);
  border-radius: 14px;
  overflow: hidden;
  backdrop-filter: blur(12px);
  transition: transform 0.2s, border-color 0.2s;
}
.song-card:hover {
  transform: translateY(-3px);
  border-color: rgba(158, 197, 171, 0.2);
}

.song-img-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  overflow: hidden;
}

.song-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}
.song-card:hover .song-img { transform: scale(1.04); }

.song-overlay {
  position: absolute;
  inset: 0;
  background: rgba(1, 15, 6, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
}
.song-card:hover .song-overlay { opacity: 1; }

.spotify-btn {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.5);
  border-radius: 50%;
  transition: transform 0.15s;
}
.spotify-btn svg { width: 28px; height: 28px; }
.spotify-btn:hover { transform: scale(1.1); }

.song-meta {
  padding: 0.85rem 1rem;
}
.song-meta h3 {
  margin: 0 0 4px;
  font-size: 0.9rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.song-meta p {
  margin: 0;
  font-size: 0.78rem;
  color: rgba(158, 197, 171, 0.5);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.empty {
  text-align: center;
  padding: 5rem 0;
  color: rgba(158, 197, 171, 0.35);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  font-size: 0.9rem;
}
</style>
