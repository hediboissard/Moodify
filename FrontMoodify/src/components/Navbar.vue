<template>
    <nav class="navbar">
        <router-link to="/" class="logo">
            <img src="@/assets/logo.png" alt="Logo" class="logo-img" />
            <span>Moodify</span>
        </router-link>

  
      <input type="text" placeholder="Rechercher..." class="search-input" />
  
      <div class="links">
        <router-link to="/about">À propos</router-link>
        <button>Profil</button>
      </div>
    </nav>
  </template>
  
  <script setup>
  </script>
  
  <style scoped>
    .navbar {
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
    transition: transform 3s ease;
    }
    .logo-img:hover {
        transform: rotate(360deg);
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
  }
  
  .links button {
    background-color: #007bff;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    color: white;
    cursor: pointer;
  }
  </style>
  