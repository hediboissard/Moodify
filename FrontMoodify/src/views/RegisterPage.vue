<template>
  <div class="min-h-screen flex items-center justify-center bg-black">
    <div class="w-full max-w-sm text-center text-green-500 space-y-5">
      <h1 class="text-4xl font-bold">Moodify</h1>

      <input
        v-model="username"
        type="text"
        placeholder="Username"
        class="w-full border border-green-500 rounded-lg py-2 px-4 bg-black text-green-500 placeholder-green-500"
      />
      <input
        v-model="email"
        type="text"
        placeholder="Email"
        class="w-full border border-green-500 rounded-lg py-2 px-4 bg-black text-green-500 placeholder-green-500"
      />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        class="w-full border border-green-500 rounded-lg py-2 px-4 bg-black text-green-500 placeholder-green-500"
      />
      <input
        v-model="confirmPassword"
        type="password"
        placeholder="Confirm Password"
        class="w-full border border-green-500 rounded-lg py-2 px-4 bg-black text-green-500 placeholder-green-500"
      />

      <button
        @click="handleRegister"
        class="w-full bg-green-500 text-black font-semibold py-2 rounded-lg hover:bg-green-600 transition"
      >
        Register
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '@/services/authService'

const router = useRouter()

const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    alert("Les mots de passe ne correspondent pas.")
    return
  }

  try {
    await register({
      username: username.value,
      email: email.value,
      password: password.value
    })
    alert("Inscription réussie ! Vous pouvez vous connecter.")
    router.push('/')
  } catch (err) {
    alert('Erreur : ' + (err.response?.data?.message || err.message))
  }
}
</script>
