<template>
  <div class="min-h-screen bg-black text-white">
    <Navbar />
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8">🎵 {{ friend.username }}'s Liked Songs</h1>
      <div v-if="likedSongs.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="song in likedSongs" :key="song.id" class="bg-gray-800 p-4 rounded-lg">
          <img :src="song.image" alt="cover" class="w-full h-40 object-cover rounded-lg mb-4" />
          <h3 class="text-xl font-semibold">{{ song.title }}</h3>
          <p class="text-gray-400">{{ song.artist }}</p>
          <a :href="song.spotify_url" target="_blank" class="text-green-500 mt-2 block">Open in Spotify</a>
        </div>
      </div>
      <p v-else class="text-center text-gray-400">No liked songs found.</p>
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
</style>