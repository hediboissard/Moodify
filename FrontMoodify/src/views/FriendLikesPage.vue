<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
    <Navbar />
    <div class="container mx-auto px-4 py-8">
      <button 
        @click="$router.back()" 
        class="text-white bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded mb-6 transition-all duration-300 shadow-lg"
      >
        ← Retour
      </button>
      <h1 class="text-4xl font-extrabold mb-10 text-center">
        🎵 {{ friend.username }}'s Liked Songs
      </h1>
      <div v-if="likedSongs.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div 
          v-for="song in likedSongs" 
          :key="song.id" 
          class="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
        >
          <img 
            :src="song.image" 
            alt="cover" 
            class="w-full h-48 object-cover rounded-lg mb-4"
          />
          <h3 class="text-2xl font-semibold mb-2">{{ song.title }}</h3>
          <p class="text-gray-400 mb-4">{{ song.artist }}</p>
          <a 
            :href="song.spotify_url" 
            target="_blank" 
            class="text-green-500 font-medium hover:text-green-400 transition-colors duration-300"
          >
            Open in Spotify
          </a>
        </div>
      </div>
      <p v-else class="text-center text-gray-400 text-lg mt-10">
        No liked songs found.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from '@/components/Navbar.vue';
import axios from 'axios';

const route = useRoute();
const friend = ref({});
const likedSongs = ref([]);

onMounted(async () => {
  const { id, username } = route.params;
  friend.value = { id, username };

  try {
    const res = await axios.get(`http://localhost:3000/api/users/likes?user_id=${id}`);
    likedSongs.value = res.data;
  } catch (err) {
    console.error('❌ Error fetching liked songs:', err);
  }
});
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
}

button {
  font-size: 1rem;
}

h1 {
  color: #ffffff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
}

img {
  border: 2px solid #444;
}

a {
  font-size: 1rem;
}
</style>