<template>
  <div class="min-h-screen bg-black">
    <Navbar />
    
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-4xl font-bold text-green-500 mb-8">Tous les utilisateurs</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Card pour chaque utilisateur -->
        <div v-for="user in users" :key="user.id" 
             class="bg-[#1e1e1e] rounded-lg p-6 flex items-center space-x-4 hover:bg-[#2a2a2a] transition">
          <img 
            :src="user.avatar || 'https://www.svgrepo.com/show/382106/profile-avatar.svg'" 
            :alt="user.username"
            class="w-16 h-16 rounded-full object-cover border-2 border-green-500"
          />
          
          <div>
            <h3 class="text-xl text-white font-semibold">{{ user.username }}</h3>
            <p v-if="user.mood" class="text-green-500">
              Humeur actuelle : {{ user.mood }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Navbar from '@/components/Navbar.vue'
import axios from 'axios'

const users = ref([])

const fetchUsers = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/users')
    users.value = response.data
    console.log('✅ Utilisateurs récupérés:', users.value)
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des utilisateurs:', error)
  }
}

onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style>