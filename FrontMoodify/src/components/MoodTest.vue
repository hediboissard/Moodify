<template>
    <div class="p-6">
      <h1 class="text-2xl mb-4">Choisis ton mood 🎚️</h1>
      <input type="range" min="1" max="10" v-model="mood" class="mb-4" />
      <p>Mood: {{ mood }}</p>
      <button @click="getSong" class="mt-2 px-4 py-2 bg-blue-500 text-white rounded">Trouver une musique</button>
  
      <div v-if="song" class="mt-6">
        <img :src="song.image" alt="cover" class="w-48 h-48 object-cover rounded" />
        <h2 class="text-xl mt-2">{{ song.title }}</h2>
        <p class="text-gray-600">{{ song.artist }}</p>
        <audio
        v-if="song.preview_url"
        :src="song.preview_url"
        controls
        class="mt-2"
        @error="console.log('❌ Audio error')"
        @canplay="console.log('✅ Audio can play')"
        />
        <p v-else class="text-sm mt-2 text-red-400">Pas de preview disponible</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  const mood = ref(5);
  const song = ref(null);
  
  async function getSong() {
    const res = await fetch(`http://localhost:3000/mood/${mood.value}`);
    song.value = await res.json();
  }
  </script>
  