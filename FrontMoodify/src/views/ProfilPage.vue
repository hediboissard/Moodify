<template>
  <Navbar />
  <div class="bg-neutral-900 text-white flex flex-col items-center min-h-screen px-4 py-12">

    <!-- ✅ Avatar (non modifiable si Spotify) -->
    <div class="mt-6">
      <img
        :src="user?.avatar || 'https://www.svgrepo.com/show/382106/profile-avatar.svg'"
        alt="Profile"
        class="w-32 h-32 rounded-full border-2 border-gray-600 object-cover"
      />
    </div>

    <!-- 🧑 Infos utilisateur -->
    <div class="mt-10 space-y-6 text-lg w-full max-w-md">
      <p><span class="font-bold">Username:</span> {{ user?.username || 'Inconnu' }}</p>

      <p v-if="isSpotifyUser" class="text-gray-400 text-sm italic">
        Informations synchronisées avec Spotify — non modifiables.
      </p>

      <div v-if="!isSpotifyUser">
        <input
          type="text"
          placeholder="New Username"
          class="w-full border border-green-500 rounded-lg py-2 px-4 bg-black text-green-500 placeholder-green-500"
        />
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
    </div>

    <!-- 🔧 Actions -->
    <div class="mt-8 flex flex-col items-center space-y-4">
      <button @click="deleteAccount" class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg">
        Delete Account
      </button>

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
import axios from 'axios'

const user = ref({ username: '', avatar: '' })
const isSpotifyUser = ref(false)
const router = useRouter()

onMounted(async () => {
  try {
    const spotifyId = localStorage.getItem('spotify_id')
    if (spotifyId) {
      const profile = await getSpotifyProfile(spotifyId)
      user.value = profile
      isSpotifyUser.value = true
    } else {
      const profile = await getProfile()
      user.value = profile
      isSpotifyUser.value = false
    }
  } catch (err) {
    console.error("❌ Erreur lors de la récupération du profil :", err)
  }
})

// 🔓 Déconnexion
const handleLogout = () => {
  if (confirm("Voulez-vous vraiment vous déconnecter ?")) {
    localStorage.removeItem('token')
    localStorage.removeItem('spotify_id')
    localStorage.removeItem('user')
    router.push('/')
  }
}

// ❌ Suppression de compte
const deleteAccount = async () => {
  if (!confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.")) return

  try {
    const token = localStorage.getItem('token')
    await axios.delete('http://localhost:3000/api/users/delete', {
      headers: { Authorization: `Bearer ${token}` }
    })

    localStorage.removeItem('token')
    localStorage.removeItem('spotify_id')
    router.push('/')
  } catch (error) {
    console.error("Erreur suppression :", error)
    alert("❌ Une erreur est survenue lors de la suppression.")
  }
}
</script>
