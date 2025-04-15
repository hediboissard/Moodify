<template>
  <Navbar />
  <div class="bg-neutral-900 text-white flex flex-col items-center min-h-screen px-4 py-12">

    <div class="mt-6">
      <img
        src="https://www.svgrepo.com/show/382106/profile-avatar.svg"
        alt="Profile"
        class="w-32 h-32 rounded-full border-2 border-gray-600"
      />
    </div>

    <div class="mt-10 space-y-6 text-lg w-full max-w-md">
      <!-- Username affiché -->
      <p><span class="font-bold">Username:</span> {{ user.username }}</p>
      <!-- Changement username -->
      <input
        type="text"
        placeholder="New Username"
        class="w-full border border-green-500 rounded-lg py-2 px-4 bg-black text-green-500 placeholder-green-500"
      />

      <!-- Modification de mot de passe -->
      <p><span class="font-bold">Change Password:</span></p>
      <input
        type="password"
        placeholder="New Password"
        class="w-full border border-green-500 rounded-lg py-2 px-4 bg-black text-green-500 placeholder-green-500"
      />
      <input
        type="password"
        placeholder="Confirm New Password"
        class="w-full border border-green-500 rounded-lg py-2 px-4 bg-black text-green-500 placeholder-green-500"
      />
    </div>

    <button
      class="mt-12 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg"
    >
      Account Delete
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import { getProfile } from '@/services/authService'

const user = ref({ username: '' })
const router = useRouter()

onMounted(async () => {
  try {
    const profile = await getProfile()
    user.value = profile
  } catch (err) {
    console.error("❌ Erreur lors de la récupération du profil :", err)
  }
})
</script>
