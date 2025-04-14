<template>
  <div class="min-h-screen flex items-center justify-center" style="background-color: var(--black-main)">
    <div class="text-center text-green-500 space-y-5" style="background-color: var(--gray-main); padding: 40px; border-radius: 10px;">
      <div class="flex items-center justify-center space-x-4">
        <img src="@/assets/logo.png" alt="Logo" class="logo h-16 w-16" />
        <h1 class="text-5xl font-bold text-green-500">Moodify</h1>
      </div>


      <button @click="goToRegister"
      class="w-full border border-green-500 rounded-lg py-2 hover:bg-green-600 hover:text-white transition">
        Create account
      </button>

      <div class="flex items-center justify-center space-x-4">
        <hr class="border-green-500 flex-1" />
        <span class="text-green-500">or</span>
        <hr class="border-green-500 flex-1" />
      </div>

      <button class="w-full border border-green-500 rounded-lg py-2 flex items-center justify-center space-x-2 hover:bg-green-600 hover:text-white transition">
        <svg class="w-5 h-5" viewBox="0 0 168 168" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M84,0C37.7,0,0,37.7,0,84s37.7,84,84,84s84-37.7,84-84S130.3,0,84,0z M121.3,120.1c-1.5,2.5-4.7,3.3-7.2,1.8
            c-19.8-12.1-44.8-14.9-74.2-8.4c-2.8,0.6-5.5-1.2-6.1-4s1.2-5.5,4-6.1c32.3-7,60.1-3.7,82.2,10.1
            C121.9,114.2,122.7,117.5,121.3,120.1z M133.4,97.6c-1.9,3-5.8,3.9-8.7,2c-22.7-14-57.3-18-84.1-10.1c-3.4,1-6.9-0.9-7.9-4.3
            c-1-3.4,0.9-6.9,4.3-7.9c31.8-9.2,70.5-4.7,97.5,11.6C134.3,90.8,135.2,94.7,133.4,97.6z M134.9,74.1c-27-16.2-71.5-17.7-97-10
            c-4,1.2-8.2-1-9.4-5c-1.2-4,1-8.2,5-9.4c29.6-8.8,79-7.1,110.9,11.7c3.6,2.1,4.8,6.7,2.6,10.3C144.8,75.1,139.1,76.6,134.9,74.1z"/>
        </svg>
        <span>Continue with Spotify</span>
      </button>

      <input
        v-model="emailOrUsername"
        type="text"
        placeholder="Username"
        class="w-full border border-green-500 rounded-lg py-2 px-4 bg-CustomBlack text-green-500 placeholder-green-500 focus:outline-none focus:ring-2 focus:ring-green-600"
      />
      <input
        type="text"
        placeholder="Email"
        class="w-full border border-green-500 rounded-lg py-2 px-4 bg-CustomBlack text-green-500 placeholder-green-500 focus:outline-none focus:ring-2 focus:ring-green-600"
      />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        class="w-full border border-green-500 rounded-lg py-2 px-4 bg-CustomBlack text-green-500 placeholder-green-500 focus:outline-none focus:ring-2 focus:ring-green-600"
      />

      <button
        @click="handleLogin"
        class="w-full bg-green-500 text-white font-semibold py-2 rounded-lg hover:bg-green-600 transition"
      >
        Log in
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '../services/authService'

const router = useRouter()

const emailOrUsername = ref('')
const password = ref('')

const handleLogin = async () => {
  try {
    const response = await login({
      email: emailOrUsername.value,
      password: password.value
    })
    localStorage.setItem('token', response.data.token)
    router.push('/home')
  } catch (err) {
    console.error(err)
    alert('Connexion échouée : ' + (err.response?.data?.message || err.message))
  }
}
function goToRegister() {
  router.push('/register')
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
