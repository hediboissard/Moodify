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
          v-memo="[user.id, user.avatar]" 
          class="bg-gray-900 rounded-lg p-6 flex items-center space-x-4 hover:bg-gray-800 transition-colors"
        >
          <!-- Avatar -->
          <div class="flex-shrink-0">
            <img 
              :src="getUserAvatar(user)"
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
            v-if="!isAlreadyFriend(user.id)"
            @click="addFriend(user)"
            class="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
          >
            Add Friend
          </button>
          <span 
            v-else 
            class="px-4 py-2 bg-gray-600 rounded-lg text-gray-300"
          >
            Already Friend
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import Navbar from '@/components/Navbar.vue';
import { useToast } from 'vue-toastification';

const toast = useToast();
const users = ref([]);
const searchQuery = ref('');
const currentUserId = ref(null);

// Après les autres refs...
const friends = ref([]);

// Fonction pour charger les amis
const loadFriends = () => {
  const storedFriends = localStorage.getItem('friends');
  friends.value = storedFriends ? JSON.parse(storedFriends) : [];
};

// Récupère l'utilisateur connecté
const getCurrentUser = async () => {
  const spotifyId = localStorage.getItem('spotify_id');
  const token = localStorage.getItem('token');

  if (spotifyId) {
    return { spotify_id: spotifyId };
  } else if (token) {
    try {
      const response = await axios.get('http://localhost:3000/api/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }
  return null;
};

// Filtre les utilisateurs
const filteredUsers = computed(() => {
  const spotifyId = localStorage.getItem('spotify_id');
  console.log('Current Spotify ID:', spotifyId);
  console.log('Current User ID:', currentUserId.value);
  
  return users.value.filter(user => {
    console.log('Checking user:', user);
    
    // Vérification pour utilisateur Spotify
    if (spotifyId && user.spotify_id) {
      console.log(`Comparing spotify IDs: ${spotifyId} vs ${user.spotify_id}`);
      if (user.spotify_id === spotifyId) {
        return false;
      }
    }
    
    // Vérification pour utilisateur avec email
    if (currentUserId.value && user.id) {
      console.log(`Comparing user IDs: ${currentUserId.value} vs ${user.id}`);
      if (user.id === currentUserId.value) {
        return false;
      }
    }
    
    // Filtre de recherche
    if (searchQuery.value) {
      return user.username.toLowerCase().includes(searchQuery.value.toLowerCase());
    }
    
    return true;
  });
});

// Charge tous les utilisateurs
const fetchUsers = async () => {
  try {
    const currentUser = await getCurrentUser();
    console.log('Current user:', currentUser);
    
    if (currentUser) {
      currentUserId.value = currentUser.id || currentUser.spotify_id;
      console.log('Set currentUserId to:', currentUserId.value);
    }

    const response = await axios.get('http://localhost:3000/api/users');
    users.value = response.data;
    console.log('All users:', users.value);
  } catch (error) {
    console.error('Error fetching users:', error);
    toast.error('Erreur lors du chargement des utilisateurs');
  }
};

// Ajoute un ami
const addFriend = (user) => {
  try {
    if (friends.value.some(f => f.id === user.id)) {
      return toast.warning("Cet utilisateur est déjà dans vos amis");
    }
    
    const avatarUrl = getUserAvatar(user);
    
    const newFriend = {
      id: user.id,
      username: user.username,
      avatar: avatarUrl,
      moodEmoji: '😊',
      moodText: 'En ligne',
      currentTrack: 'Aucune musique'
    };
    
    friends.value.push(newFriend);
    localStorage.setItem('friends', JSON.stringify(friends.value));
    toast.success(`✅ ${user.username} ajouté à vos amis !`);
  } catch (error) {
    console.error('Error adding friend:', error);
    toast.error("Erreur lors de l'ajout de l'ami");
  }
};

const getUserAvatar = (user) => {
  // Si pas d'avatar, retourner l'image par défaut
  if (!user.avatar) {
    return 'https://www.svgrepo.com/show/382106/profile-avatar.svg';
  }
  
  // Si l'avatar est déjà une URL complète, la retourner telle quelle
  if (user.avatar.startsWith('http')) {
    return user.avatar;
  }
  
  // Si c'est juste un nom de fichier, construire l'URL complète
  // en évitant la double inclusion de /uploads/
  const baseUrl = 'http://localhost:3000';
  const avatarPath = user.avatar.startsWith('/') ? user.avatar : '/uploads/' + user.avatar;
  return baseUrl + avatarPath;
};

// Après les autres const...
const isAlreadyFriend = (userId) => {
  return friends.value.some(friend => friend.id === userId);
};

onMounted(() => {
  loadFriends();
  fetchUsers();
});
</script>
