<template>
    <div class="min-h-screen flex items-center justify-center" style="background-color: var(--black-main)">
      <div class="text-center w-[500px] text-green-500 space-y-5" style="background-color: var(--gray-main); padding: 40px; border-radius: 10px;">
        <div class="flex items-center justify-center space-x-4">
        <img src="@/assets/logo.png" alt="Logo" class="logo h-16 w-16" />
        <h1 class="text-5xl font-bold text-green-500" id="moodify">Moodify</h1>
      </div>
  
        <input
          type="text"
          placeholder="Username"
          class="w-full border border-green-500 rounded-lg py-2 px-4 bg-CustomBlack text-white placeholder-green-500 focus:outline-none focus:ring-2 focus:ring-green-600"
        />
        <input
          type="text"
          placeholder="Email"
          class="w-full border border-green-500 rounded-lg py-2 px-4 bg-CustomBlack text-white placeholder-green-500 focus:outline-none focus:ring-2 focus:ring-green-600"
        />
        <input
          type="password"
          placeholder="Password"
          class="w-full border border-green-500 rounded-lg py-2 px-4 bg-CustomBlack text-white placeholder-green-500 focus:outline-none focus:ring-2 focus:ring-green-600"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          class="w-full border border-green-500 rounded-lg py-2 px-4 bg-CustomBlack text-white placeholder-green-500 focus:outline-none focus:ring-2 focus:ring-green-600"
        />
  
        <button
          @click="goToHome"
          class="w-full bg-green-500 text-white font-semibold py-2 rounded-lg hover:bg-green-600 transition"
        >
          Register
        </button>

        <div class="flex items-center justify-center space-x-4">
        <hr class="border-green-500 flex-1" />
        <span class="text-green-500">or</span>
        <hr class="border-green-500 flex-1" />
        </div>

        <button
          @click="goToLogin"
          class="w-full bg-green-500 text-white font-semibold py-2 rounded-lg hover:bg-green-600 transition"
        >
          Login
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  
  function goToHome() {
    router.push('/home')
  }
  function goToLogin() {
    router.push('/')
  }
  </script>

<style scoped>

.logo {
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
</style >
