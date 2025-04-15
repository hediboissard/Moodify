<template>
    <nav class="navbar">
      <router-link to="/home" class="logo">
        <img src="@/assets/logo.png" alt="Logo" class="logo-img" />
        <span>Moodify</span>
      </router-link>
  
      <input type="text" placeholder="Rechercher..." class="search-input" />
  
      <div class="links">
        <router-link
          to="/home"
          :class="{ active: route.path === '/home' }"
        >
          Home
        </router-link>
        <router-link
          to="/friends"
          :class="{ active: route.path === '/friends' }"
        >
          Friends
        </router-link>
        <button
          @click="goToProfil"
          :class="{ active: route.path === '/profil' }"
        >
          Profil
        </button>
      </div>
    </nav>
  </template>
  
  <script setup>
  import { useRouter, useRoute } from 'vue-router'
  const router = useRouter()
  const route = useRoute()
  
  function goToProfil() {
    router.push('/profil')
  }
  </script>
  
  <style scoped>
  .navbar {
    height: 10vh;
    background-color: #2c2c2c;
    padding: 1rem 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .logo {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: white;
    font-size: 1.2rem;
    font-weight: bold;
  }
  
  .logo-img {
    height: 30px;
    margin-right: 10px;
    animation: spin 3s linear infinite;
  }
  
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
  
    100% {
      transform: rotate(360deg);
    }
  }
  
  .logo span {
    color: #00FF5F;
  }
  
  .search-input {
    padding: 0.5rem;
    border: none;
    border-radius: 4px;
    background-color: #444;
    color: white;
    width: 100%;
    max-width: 500px;
  }
  
  .links {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .links a {
    color: white;
    text-decoration: none;
    transition: color 1ms;
  }
  
  .links a.active {
    color: #00ff88;
    font-weight: bold;
  }
  
  .links button {
    color: white;
    text-decoration: none;
    transition: color 1s;
    border: 2px #00ff88 solid;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .links button.active {
    color: #00ff88;
    font-weight: bold;
  }
  </style>
  