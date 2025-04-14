<template>
    <div class="home">
      <Navbar />
  
      <div class="content-wrapper">
        <div class="sidebar">
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
      </div>

      <MusicPlayer />

    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import Navbar from '@/components/Navbar.vue';
  import MusicPlayer from '@/components/MusicPlayer.vue';

  
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
  </script>
  
  <style scoped>
  .home {
    background: #121212;
    color: white;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  
  .content-wrapper {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 90vh;
  }
  
  .sidebar {
    width: 90%;
    height: 50vh;
    padding: 30px;
    background-color: #1e1e1e;
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
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
  </style>
  