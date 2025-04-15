<template>
  <div class="music-player" v-if="track && track.title">
    <div class="track-info">
      <img :src="track.image" alt="cover" class="cover" />
      <div class="text">
        <h4>{{ track.title }}</h4>
        <p>{{ track.artist }}</p>
      </div>
    </div>

    <div class="controls">
      <button @click="prevTrack">⏮️</button>
      <button @click="togglePlay">
        {{ isPlaying ? '⏸️' : '▶️' }}
      </button>
      <button @click="nextTrack">⏭️</button>
    </div>

    <audio
      ref="audio"
      :src="track.preview_url"
      @canplay="onCanPlay"
      @ended="onEnded"
      autoplay
    />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
  track: Object,
  onPrev: Function,
  onNext: Function
})

const audio = ref(null)
const isPlaying = ref(false)

function onCanPlay() {
  // Dès que l'audio est prêt, on met à jour l’état
  isPlaying.value = true
}

watch(() => props.track, () => {
  if (audio.value && props.track?.preview_url) {
    audio.value.load()
    // L’event canplay va gérer le play + isPlaying
    audio.value.play().catch(err => {
      console.warn("Lecture bloquée :", err.message)
      isPlaying.value = false
    })
  }
})

function togglePlay() {
  if (!audio.value) return
  if (isPlaying.value) {
    audio.value.pause()
    isPlaying.value = false
  } else {
    audio.value.play()
      .then(() => {
        isPlaying.value = true
      })
      .catch(() => {
        isPlaying.value = false
      })
  }
}

function onEnded() {
  isPlaying.value = false
  if (props.onNext) props.onNext()
}

function prevTrack() {
  if (props.onPrev) props.onPrev()
}

function nextTrack() {
  if (props.onNext) props.onNext()
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
  display: flex;
  align-items: center;
}

.cover {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 1rem;
}

.text h4 {
  margin: 0;
  font-size: 1rem;
}

.text p {
  margin: 0;
  font-size: 0.85rem;
  color: #bbb;
}

.controls button {
  background: none;
  border: none;
  color: white;
  font-size: 1.8rem;
  cursor: pointer;
  margin: 0 8px;
  transition: transform 0.2s;
}

.controls button:hover {
  transform: scale(1.1);
}
</style>
