<template>
  <div class="min-h-screen flex items-center justify-center bg-black">
    <div class="w-full max-w-sm text-center text-green-500 space-y-5">
      <h1 class="text-4xl font-bold">Moodify</h1>

      <button class="w-full border border-green-500 rounded-lg py-2 hover:bg-green-600 hover:text-black transition">
        Create account
      </button>

      <div class="flex items-center justify-center space-x-4">
        <hr class="border-green-500 flex-1" />
        <span class="text-green-500">or</span>
        <hr class="border-green-500 flex-1" />
      </div>

      <button class="w-full border border-green-500 rounded-lg py-2 flex items-center justify-center space-x-2 hover:bg-green-600 hover:text-black transition">
        <svg class="w-5 h-5" viewBox="0 0 168 168" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="..."/>
        </svg>
        <span>Continue with Spotify</span>
      </button>

      <input
        v-model="emailOrUsername"
        type="text"
        placeholder="Email or username"
        class="w-full border border-green-500 rounded-lg py-2 px-4 bg-black text-green-500 placeholder-green-500 focus:outline-none focus:ring-2 focus:ring-green-600"
      />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        class="w-full border border-green-500 rounded-lg py-2 px-4 bg-black text-green-500 placeholder-green-500 focus:outline-none focus:ring-2 focus:ring-green-600"
      />

      <button
        @click="handleLogin"
        class="w-full bg-green-500 text-black font-semibold py-2 rounded-lg hover:bg-green-600 transition"
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
</script>
