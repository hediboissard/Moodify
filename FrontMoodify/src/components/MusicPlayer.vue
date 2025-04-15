<template>
    <div class="music-player">
      <div class="track-info">
        🎧 {{ currentTrack.title }}
      </div>
  
      <div class="controls">
        <button @click="prevTrack">⏮️</button>
        <button @click="togglePlay">
          {{ isPlaying ? '⏸️' : '▶️' }}
        </button>
        <button @click="nextTrack">⏭️</button>
      </div>
  
      <audio ref="audio" :src="currentTrack.src" @ended="nextTrack" />
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  
  const tracks = [
    { title: 'Chill Vibes', src: '/music/chill.mp3' },
    { title: 'Lo-Fi Focus', src: '/music/lofi.mp3' },
    { title: 'Smooth Beats', src: '/music/smooth.mp3' }
  ];
  
  const currentIndex = ref(0);
  const isPlaying = ref(false);
  const audio = ref(null);
  
  const currentTrack = computed(() => tracks[currentIndex.value]);
  
  function togglePlay() {
    if (!audio.value) return;
    if (isPlaying.value) {
      audio.value.pause();
    } else {
      audio.value.play();
    }
    isPlaying.value = !isPlaying.value;
  }
  
  function nextTrack() {
    currentIndex.value = (currentIndex.value + 1) % tracks.length;
    reloadAndPlay();
  }
  
  function prevTrack() {
    currentIndex.value =
      (currentIndex.value - 1 + tracks.length) % tracks.length;
    reloadAndPlay();
  }
  
  function reloadAndPlay() {
    isPlaying.value = false;
    audio.value.load();
    audio.value.play();
    isPlaying.value = true;
  }
  </script>
  
  <style scoped>
  .music-player {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #1e1e1e;
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 5rem;
    border-top: 1px solid #333;
    z-index: 999;
  }
  
  .track-info {
    font-weight: bold;
    font-size: 1rem;
  }
  
  .controls button {
    background: none;
    border: none;
    color: white;
    font-size: 1.5rem;
    margin: 0 10px;
    cursor: pointer;
    transition: transform 0.2s;
  }
  
  .controls button:hover {
    transform: scale(1.2);
  }
  </style>
  