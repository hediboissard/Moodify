<template>
  <div class="min-h-screen bg-black text-white">
    <Navbar />
    
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8">Discover People</h1>
      
      <!-- Search bar -->
      <input 
        type="text" 
        v-model="searchQuery" 
        placeholder="Search users..."
        class="w-full max-w-md mb-8 px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-green-500 focus:outline-none"
      >
      
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <!-- User Cards -->
        <div 
          v-for="user in filteredUsers" 
          :key="user.id" 
          class="bg-gray-900 rounded-lg p-6 flex items-center space-x-4 hover:bg-gray-800 transition-colors"
        >
          <!-- Avatar -->
          <div class="flex-shrink-0">
            <img 
              :src="user.avatar || 'https://www.svgrepo.com/show/382106/profile-avatar.svg'" 
              :alt="user.username"
              class="w-16 h-16 rounded-full object-cover border-2 border-green-500"
            >
          </div>
          
          <!-- User Info -->
          <div class="flex-grow">
            <h3 class="text-xl font-semibold">{{ user.username }}</h3>
          </div>
          
          <!-- Add Friend Button -->
          <button 
            @click="addFriend(user)"
            class="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
          >
            Add Friend
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Navbar from '@/components/Navbar.vue'
import axios from 'axios'

const users = ref([])
const searchQuery = ref('')

// Filtrer les utilisateurs en fonction de la recherche
const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value
  
  const query = searchQuery.value.toLowerCase()
  return users.value.filter(user => 
    user.username.toLowerCase().includes(query)
  )
})

const fetchUsers = async () => {
  try {
    const currentId = localStorage.getItem('spotify_id')
    const response = await axios.get(`http://localhost:3000/api/users/all?spotify_id=${currentId}`)
    users.value = response.data
  } catch (err) {
    console.error('❌ Erreur chargement users:', err)
  }
}

onMounted(() => {
  fetchUsers()
})

// Ajouter une fonction pour stocker les amis localement
const addFriend = (user) => {
  // Récupérer les amis existants du localStorage
  const storedFriends = localStorage.getItem('friends')
  let friends = storedFriends ? JSON.parse(storedFriends) : []
  
  // Vérifier si l'utilisateur n'est pas déjà ami
  if (!friends.some(friend => friend.id === user.id)) {
    // Créer un objet ami avec les informations nécessaires
    const newFriend = {
      id: user.id,
      username: user.username,
      avatar: user.avatar || 'https://www.svgrepo.com/show/382106/profile-avatar.svg',
      moodEmoji: '😊', // Emoji par défaut
      moodText: 'Feeling good', // Texte par défaut
      currentTrack: 'No track playing' // Track par défaut
    }
    
    // Ajouter le nouvel ami
    friends.push(newFriend)
    
    // Sauvegarder dans localStorage
    localStorage.setItem('friends', JSON.stringify(friends))
    
    // Afficher une notification
    alert(`${user.username} ajouté aux amis!`)
  } else {
    alert('Cet utilisateur est déjà dans vos amis!')
  }
}
</script>