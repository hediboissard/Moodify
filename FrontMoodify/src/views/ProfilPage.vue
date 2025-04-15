<template>
  <Navbar />
  <div class="bg-neutral-900 text-white flex flex-col items-center min-h-screen">

    <div class="mt-12">
      <img src="https://www.svgrepo.com/show/382106/profile-avatar.svg"
           alt="Profile"
           class="w-32 h-32 rounded-full border-2 border-gray-600" />
    </div>

    <div class="mt-10 space-y-6 text-lg">
      <p><span class="font-bold">Username:</span> {{ user.username }}</p>
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
import Navbar from '@/components/Navbar.vue'

const user = ref({ username: '' })

onMounted(() => {
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    try {
      const parsed = JSON.parse(storedUser)
      user.value.username = parsed.username || parsed.pseudo || 'Unknown'
    } catch (e) {
      console.error("❌ Erreur parsing localStorage :", e)
    }
  }
})
</script>

