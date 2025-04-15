<template>
  <div class="min-h-screen flex items-center justify-center bg-black">
    <div class="text-center w-[400px] text-green-500 space-y-5 bg-[#1e1e1e] p-10 rounded-xl">
      <h1 class="text-4xl font-bold" id="moodify">Moodify</h1>

      <input
        v-model="username"
        type="text"
        placeholder="Username"
        class="w-full border border-green-500 rounded-lg py-2 px-4 text-green-500 placeholder-green-500"
      />
      <input
        v-model="email"
        type="text"
        placeholder="Email"
        class="w-full border border-green-500 rounded-lg py-2 px-4 text-green-500 placeholder-green-500"
      />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        class="w-full border border-green-500 rounded-lg py-2 px-4 text-green-500 placeholder-green-500"
      />
      <input
        v-model="confirmPassword"
        type="password"
        placeholder="Confirm Password"
        class="w-full border border-green-500 rounded-lg py-2 px-4 text-green-500 placeholder-green-500"
      />

      <button
        @click="handleRegister"
        class="w-full bg-green-500 text-black font-semibold py-2 rounded-lg hover:bg-green-600 transition"
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
        class="w-full bg-green-500 text-black font-semibold py-2 rounded-lg hover:bg-green-600 transition"
      >
        Log In
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

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function goToLogin() {
  router.push('/')
}

const handleRegister = async () => {
  // ✅ Validation des champs
  if (!username.value || !email.value || !password.value || !confirmPassword.value) {
    alert("Tous les champs sont requis.")
    return
  }

  if (!emailRegex.test(email.value)) {
    alert("Format d'email invalide.")
    return
  }

  if (password.value.length < 8) {
    alert("Le mot de passe doit contenir au moins 8 caractères.")
    return
  }

  if (password.value !== confirmPassword.value) {
    alert("Les mots de passe ne correspondent pas.")
    return
  }

  // ✅ Si tout est bon, appel backend
  try {
    await register({
      username: username.value,
      email: email.value,
      password: password.value
    })
    alert("✅ Inscription réussie ! Vous pouvez vous connecter.")
    router.push('/')
  } catch (err) {
    alert("❌ Erreur : " + (err.response?.data?.message || err.message))
  }
}
</script>
