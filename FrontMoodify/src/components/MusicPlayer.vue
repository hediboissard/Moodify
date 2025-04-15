<template>
  <div
    class="music-player"
    :class="{ expanded }"
    v-if="track && track.title"
    @click="handleClick"
  >
    <!-- Image en grand quand agrandi -->
    <transition name="fade">
      <img
        v-show="expanded"
        :src="track.image"
        alt="cover"
        class="big-cover"
      />
    </transition>

    <div class="main-row">
      <div class="track-info">
        <img :src="track.image" alt="cover" class="cover" />
        <div class="text">
          <h4>{{ track.title }}</h4>
          <p>{{ track.artist }}</p>
        </div>
      </div>

      <div class="controls">
        <button @click.stop="prevTrack">⏮️</button>
        <button @click.stop="togglePlay">
          {{ isPlaying ? '⏸️' : '▶️' }}
        </button>
        <button @click.stop="nextTrack">⏭️</button>
      </div>
    </div>

    <!-- Barre de progression + Volume -->
    <div class="extra-controls" v-show="expanded">
      <input
        type="range"
        class="progress"
        min="0"
        :max="duration"
        step="0.1"
        v-model="currentTime"
        @input="seek"
      />
      <div class="volume">
        🔊
        <input type="range" min="0" max="1" step="0.01" v-model="volume" @input="updateVolume" />
      </div>
    </div>

    <audio
      ref="audio"
      :src="track.preview_url"
      @canplay="onCanPlay"
      @ended="onEnded"
      @timeupdate="updateTime"
      autoplay
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  track: Object,
  onPrev: Function,
  onNext: Function
})

const audio = ref(null)
const isPlaying = ref(false)
const expanded = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(1)

function handleClick(e) {
  const clickedButton = e.target.closest('button')
  if (!clickedButton) {
    expanded.value = !expanded.value
  }
}

function togglePlay() {
  if (!audio.value) return
  if (isPlaying.value) {
    audio.value.pause()
    isPlaying.value = false
  } else {
    audio.value.play().then(() => {
      isPlaying.value = true
    }).catch(() => {})
  }
}

function onCanPlay() {
  if (audio.value) {
    duration.value = audio.value.duration
    audio.value.volume = volume.value
    isPlaying.value = true
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

function updateTime() {
  if (audio.value) currentTime.value = audio.value.currentTime
}

function seek() {
  if (audio.value) audio.value.currentTime = currentTime.value
}

function updateVolume() {
  if (audio.value) audio.value.volume = volume.value
}

watch(() => props.track, () => {
  if (audio.value && props.track?.preview_url) {
    audio.value.load()
    audio.value.play().catch(err => {
      console.warn("Lecture bloquée :", err.message)
    })
    isPlaying.value = true
  }
})
</script>

<style scoped>
.music-player {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #1e1e1e;
  color: white;
  overflow: hidden;
  border-top: 1px solid #333;
  z-index: 999;
  padding: 1rem 5rem;
  max-height: 90px;
  transition: max-height 0.6s ease;
  display: flex;
  flex-direction: column;
  cursor: pointer;
}

.music-player.expanded {
  max-height: 90vh;
  padding: 10rem 5rem;
}

.big-cover {
  width: 300px;
  height: 300px;
  object-fit: cover;
  border-radius: 20px;
  margin: 0 auto 1rem;
  animation: fadeIn 0.4s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.main-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.music-player.expanded .main-row {
  flex-direction: column;
  text-align: center;
  gap: 1rem;
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

.music-player.expanded .cover {
  display: none;
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

.controls {
  display: flex;
  justify-content: center;
  margin-top: 0.5rem;
}

.controls button {
  background: none;
  border: none;
  color: white;
  font-size: 1.8rem;
  cursor: pointer;
  margin: 0 10px;
  transition: transform 0.2s;
}

.controls button:hover {
  transform: scale(1.2);
}

.extra-controls {
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  margin-top: 1rem;
  align-items: center;
}

.progress {
  flex: 1;
  height: 5px;
  background: #555;
  appearance: none;
  border-radius: 5px;
}

.progress::-webkit-slider-thumb {
  appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: white;
  cursor: pointer;
}

.volume {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.volume input {
  width: 100px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
