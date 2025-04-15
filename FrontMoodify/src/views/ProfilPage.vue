<template>
  <Navbar />
  <div class="bg-neutral-900 text-white flex flex-col items-center min-h-screen px-4 py-12">
    <div class="mt-6">
      <img
        :src="user?.avatar || 'https://www.svgrepo.com/show/382106/profile-avatar.svg'"
        alt="Profile"
        class="w-32 h-32 rounded-full border-2 border-gray-600"
      />
    </div>

    <div class="mt-10 space-y-6 text-lg w-full max-w-md">
      <!-- Username affiché -->
      <p><span class="font-bold">Username:</span> {{ user?.username || 'Inconnu' }}</p>

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

    <div class="mt-8 flex flex-col items-center space-y-4">
      <!-- 🔴 Suppression de compte -->
      <button class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg">
        Account Delete
      </button>

      <!-- 🔒 Déconnexion -->
      <button @click="handleLogout" class="bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-6 rounded-lg">
        Log out
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import { getProfile, getSpotifyProfile } from '@/services/authService'

const user = ref({})
const router = useRouter()

onMounted(async () => {
  try {
    const spotifyId = localStorage.getItem('spotify_id')
    if (spotifyId) {
      // 👤 Utilisateur Spotify
      const profile = await getSpotifyProfile(spotifyId)
      user.value = profile
    } else {
      // 🔐 Utilisateur avec token classique
      const profile = await getProfile()
      user.value = profile
    }
  } catch (err) {
    console.error("❌ Erreur lors de la récupération du profil :", err)
  }
})

const handleLogout = () => {
  if (confirm("Voulez-vous vraiment vous déconnecter ?")) {
    localStorage.removeItem('token')
    localStorage.removeItem('spotify_id')
    localStorage.removeItem('user')
    router.push('/')
  }
}
</script>
