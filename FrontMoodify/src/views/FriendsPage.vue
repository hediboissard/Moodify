<template>
  <div class="page">
    <Navbar />
    <div class="container">
      <div class="page-header">
        <h1>Découvrir des personnes</h1>
        <p>Trouvez et connectez-vous avec d'autres utilisateurs Moodify</p>
      </div>

      <div class="search-wrap">
        <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Rechercher des utilisateurs..."
          class="search-input"
        />
      </div>

      <div class="users-grid">
        <div
          v-for="user in filteredUsers"
          :key="user.id"
          class="user-card"
        >
          <img :src="getUserAvatar(user)" :alt="user.username" class="user-avatar" />
          <div class="user-info">
            <h3>{{ user.username }}</h3>
          </div>
          <button
            v-if="!isAlreadyFriend(user.id)"
            @click="addFriend(user)"
            class="btn-add"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
            </svg>
            Ajouter
          </button>
          <span v-else class="badge-friend">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Ami
          </span>
        </div>

        <div v-if="filteredUsers.length === 0" class="empty">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" style="color: rgba(158,197,171,0.2)">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <p>Aucun utilisateur trouvé.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue"
import axios from "axios"
import Navbar from "@/components/Navbar.vue"
import { useToast } from "vue-toastification"

const toast = useToast()
const users = ref([])
const searchQuery = ref("")
const currentUserId = ref(null)
const friends = ref([])

const loadFriends = () => {
  const stored = localStorage.getItem("friends")
  friends.value = stored ? JSON.parse(stored) : []
}

const getCurrentUser = async () => {
  const spotifyId = localStorage.getItem("spotify_id")
  const token = localStorage.getItem("token")
  if (spotifyId) return { spotify_id: spotifyId }
  if (token) {
    try {
      const r = await axios.get("http://localhost:3000/api/users/me", {
        headers: { Authorization: `Bearer ${token}` }
      })
      return r.data
    } catch { return null }
  }
  return null
}

const filteredUsers = computed(() => {
  const spotifyId = localStorage.getItem("spotify_id")
  return users.value.filter((user) => {
    if (spotifyId && user.spotify_id === spotifyId) return false
    if (currentUserId.value && user.id === currentUserId.value) return false
    if (searchQuery.value) {
      return user.username.toLowerCase().includes(searchQuery.value.toLowerCase())
    }
    return true
  })
})

const fetchUsers = async () => {
  try {
    const currentUser = await getCurrentUser()
    if (currentUser) currentUserId.value = currentUser.id || currentUser.spotify_id
    const r = await axios.get("http://localhost:3000/api/users")
    users.value = r.data
  } catch {
    toast.error("Erreur lors du chargement des utilisateurs.")
  }
}

const getUserAvatar = (user) => {
  if (!user.avatar) return "https://www.svgrepo.com/show/382106/profile-avatar.svg"
  if (user.avatar.startsWith("http")) return user.avatar
  const avatarPath = user.avatar.startsWith("/") ? user.avatar : "/uploads/" + user.avatar
  return "http://localhost:3000" + avatarPath
}

const isAlreadyFriend = (userId) => friends.value.some(f => f.id === userId)

const addFriend = (user) => {
  if (friends.value.some(f => f.id === user.id)) {
    return toast.warning("Cet utilisateur est déjà dans votre liste d'amis")
  }
  friends.value.push({
    id: user.id,
    username: user.username,
    avatar: getUserAvatar(user),
    moodEmoji: "😊",
    moodText: "En ligne",
    currentTrack: "Aucune musique"
  })
  localStorage.setItem("friends", JSON.stringify(friends.value))
  toast.success(`✅ ${user.username} ajouté à vos amis !`)
}

onMounted(() => {
  loadFriends()
  fetchUsers()
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: radial-gradient(ellipse at 40% 30%, #01200F 0%, #011502 70%);
  color: #F0F7F2;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem;
}

.page-header {
  margin-bottom: 2rem;
}
.page-header h1 {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.25rem;
  color: #F0F7F2;
}
.page-header p {
  margin: 0;
  color: rgba(158, 197, 171, 0.45);
  font-size: 0.9rem;
}

.search-wrap {
  position: relative;
  max-width: 420px;
  margin-bottom: 2rem;
}
.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(158, 197, 171, 0.4);
  pointer-events: none;
}
.search-input {
  width: 100%;
  padding: 0.7rem 1rem 0.7rem 2.75rem;
  background: rgba(1, 32, 15, 0.7);
  border: 1px solid rgba(158, 197, 171, 0.15);
  border-radius: 12px;
  color: #F0F7F2;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.search-input::placeholder { color: rgba(158, 197, 171, 0.3); }
.search-input:focus {
  border-color: #32746D;
  box-shadow: 0 0 0 3px rgba(50, 116, 109, 0.12);
}

.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}

.user-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 1rem;
  background: rgba(1, 32, 15, 0.55);
  border: 1px solid rgba(158, 197, 171, 0.1);
  border-radius: 14px;
  backdrop-filter: blur(12px);
  transition: background 0.2s, border-color 0.2s, transform 0.15s;
}
.user-card:hover {
  background: rgba(16, 79, 85, 0.2);
  border-color: rgba(158, 197, 171, 0.18);
  transform: translateY(-2px);
}

.user-avatar {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(50, 116, 109, 0.5);
  flex-shrink: 0;
}

.user-info { flex: 1; min-width: 0; }
.user-info h3 {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.btn-add {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  background: #104F55;
  border: none;
  border-radius: 8px;
  color: #9EC5AB;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  flex-shrink: 0;
}
.btn-add:hover { background: #32746D; color: #F0F7F2; }

.badge-friend {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 5px 10px;
  background: rgba(50, 116, 109, 0.2);
  border: 1px solid rgba(50, 116, 109, 0.3);
  border-radius: 8px;
  color: #9EC5AB;
  font-size: 0.78rem;
  font-weight: 600;
  flex-shrink: 0;
}

.empty {
  grid-column: 1 / -1;
  text-align: center;
  padding: 4rem 0;
  color: rgba(158, 197, 171, 0.35);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  font-size: 0.9rem;
}
</style>
