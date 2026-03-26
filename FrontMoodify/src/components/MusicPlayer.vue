<template>
  <div
    class="player"
    :class="{ expanded }"
    v-if="track && track.title"
    @click="handleClick"
  >
    <transition name="fade">
      <img v-show="expanded" :src="track.image" alt="cover" class="big-cover" />
    </transition>

    <div class="player-body">
      <div class="main-row">
        <!-- Track info -->
        <div class="track-info">
          <img :src="track.image" alt="cover" class="cover" />
          <div class="track-text">
            <h4>{{ track.title }}</h4>
            <p>{{ track.artist }}</p>
          </div>
        </div>

        <!-- Controls -->
        <div class="controls">
          <button @click.stop="prevTrack" class="ctrl-btn" title="Précédent">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M11 7l-5 5 5 5"/><path d="M17 7l-5 5 5 5"/>
            </svg>
          </button>
          <button @click.stop="togglePlay" class="ctrl-btn play-btn" :title="isPlaying ? 'Pause' : 'Lecture'">
            <svg v-if="isPlaying" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 4h-2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/>
              <path d="M17 4h-2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 4v16a1 1 0 0 0 1.524.852l13-8a1 1 0 0 0 0-1.704l-13-8A1 1 0 0 0 6 4z"/>
            </svg>
          </button>
          <button @click.stop="nextTrack" class="ctrl-btn" title="Suivant">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M7 7l5 5-5 5"/><path d="M13 7l5 5-5 5"/>
            </svg>
          </button>
        </div>

        <!-- Volume (mini) -->
        <div class="volume-mini" v-show="!expanded">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M11 5L6 9H2v6h4l5 4V5z"/>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
          </svg>
          <input type="range" min="0" max="1" step="0.01" v-model="volume" @input="updateVolume" @click.stop />
        </div>
      </div>

      <!-- Progress bar (always visible) -->
      <div class="progress-row" @click.stop>
        <span class="time">{{ formatTime(currentTime) }}</span>
        <input
          type="range"
          class="progress"
          min="0"
          :max="duration"
          step="0.1"
          v-model="currentTime"
          @input="seek"
        />
        <span class="time">{{ formatTime(duration) }}</span>
      </div>

      <!-- Expanded extra controls -->
      <div class="extra-controls" v-show="expanded" @click.stop>
        <div class="volume-full">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M11 5L6 9H2v6h4l5 4V5z"/>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
          </svg>
          <input type="range" min="0" max="1" step="0.01" v-model="volume" @input="updateVolume" />
        </div>
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
const volume = ref(0.8)

function handleClick(e) {
  if (!e.target.closest('button') && !e.target.closest('input')) {
    expanded.value = !expanded.value
  }
}

function togglePlay() {
  if (!audio.value) return
  if (isPlaying.value) {
    audio.value.pause()
    isPlaying.value = false
  } else {
    audio.value.play().then(() => { isPlaying.value = true }).catch(() => {})
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

function prevTrack() { if (props.onPrev) props.onPrev() }
function nextTrack() { if (props.onNext) props.onNext() }
function updateTime() { if (audio.value) currentTime.value = audio.value.currentTime }
function seek() { if (audio.value) audio.value.currentTime = currentTime.value }
function updateVolume() { if (audio.value) audio.value.volume = volume.value }

function formatTime(s) {
  if (!s || isNaN(s)) return '0:00'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60).toString().padStart(2, '0')
  return `${m}:${sec}`
}

watch(() => props.track, () => {
  if (audio.value && props.track?.preview_url) {
    audio.value.load()
    audio.value.play().catch(() => {})
    isPlaying.value = true
  }
})
</script>

<style scoped>
.player {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(1, 15, 6, 0.92);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(158, 197, 171, 0.12);
  z-index: 200;
  overflow: hidden;
  max-height: 88px;
  transition: max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.player.expanded {
  max-height: 90vh;
  cursor: default;
}

.big-cover {
  width: 220px;
  height: 220px;
  object-fit: cover;
  border-radius: 16px;
  margin: 1.5rem auto 1rem;
  display: block;
  box-shadow: 0 16px 40px rgba(0,0,0,0.5);
  animation: popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes popIn {
  from { opacity: 0; transform: scale(0.9); }
  to   { opacity: 1; transform: scale(1); }
}

.player-body {
  padding: 0 2rem;
  display: flex;
  flex-direction: column;
}

.player.expanded .player-body { padding-top: 1rem; }

.main-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 72px;
}

.player.expanded .main-row {
  flex-direction: column;
  height: auto;
  padding: 0.5rem 0;
  gap: 1rem;
  text-align: center;
}

.track-info {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 200px;
}

.player.expanded .track-info {
  flex-direction: column;
  min-width: unset;
}

.cover {
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
}

.player.expanded .cover { display: none; }

.track-text h4 {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: #F0F7F2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

.track-text p {
  margin: 2px 0 0;
  font-size: 0.8rem;
  color: rgba(158, 197, 171, 0.6);
}

.controls {
  display: flex;
  align-items: center;
  gap: 4px;
}

.ctrl-btn {
  background: none;
  border: none;
  color: rgba(158, 197, 171, 0.7);
  padding: 8px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s, background 0.2s;
}
.ctrl-btn:hover {
  color: #9EC5AB;
  background: rgba(16, 79, 85, 0.3);
}
.play-btn {
  width: 44px;
  height: 44px;
  background: #104F55;
  color: #9EC5AB;
  border-radius: 50%;
}
.play-btn:hover {
  background: #32746D;
  color: #F0F7F2;
}

.volume-mini {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(158, 197, 171, 0.5);
  min-width: 140px;
  justify-content: flex-end;
}

.volume-mini input {
  width: 80px;
}

.progress-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 0.6rem;
}

.player.expanded .progress-row {
  padding: 0.25rem 0 0.75rem;
}

.time {
  font-size: 0.72rem;
  color: rgba(158, 197, 171, 0.45);
  width: 32px;
  text-align: center;
  flex-shrink: 0;
}

.progress {
  flex: 1;
  height: 4px;
  background: rgba(158, 197, 171, 0.15);
  appearance: none;
  border-radius: 4px;
  cursor: pointer;
}
.progress::-webkit-slider-thumb {
  appearance: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #9EC5AB;
  cursor: pointer;
  transition: transform 0.15s;
}
.progress::-webkit-slider-thumb:hover {
  transform: scale(1.3);
}

.extra-controls { padding-bottom: 1rem; }

.volume-full {
  display: flex;
  align-items: center;
  gap: 10px;
  color: rgba(158, 197, 171, 0.5);
  max-width: 240px;
  margin: 0 auto;
}
.volume-full input { flex: 1; }

input[type="range"] {
  accent-color: #32746D;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to       { opacity: 0; }
</style>
