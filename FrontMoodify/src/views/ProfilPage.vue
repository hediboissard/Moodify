<template>
  <div class="page">
    <Navbar />
    <div class="container">
      <div class="profile-card">
        <!-- Avatar -->
        <div class="avatar-wrap" @click="!isSpotifyUser && triggerFileInput()" :class="{ clickable: !isSpotifyUser }" :title="isSpotifyUser ? '' : 'Cliquer pour changer l\'avatar'">
          <img
            :src="user?.avatar || 'https://www.svgrepo.com/show/382106/profile-avatar.svg'"
            alt="Photo de profil"
            class="avatar"
          />
          <div v-if="!isSpotifyUser" class="avatar-overlay">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
          </div>
          <input ref="fileInput" type="file" accept="image/*" class="hidden-input" @change="uploadAvatar" />
        </div>

        <h2 class="username">{{ user?.username || 'Inconnu' }}</h2>

        <div v-if="isSpotifyUser" class="spotify-badge">
          <svg class="spotify-icon" viewBox="0 0 168 168" fill="#1DB954" xmlns="http://www.w3.org/2000/svg">
            <path d="M84,0C37.7,0,0,37.7,0,84s37.7,84,84,84s84-37.7,84-84S130.3,0,84,0z M121.3,120.1c-1.5,2.5-4.7,3.3-7.2,1.8c-19.8-12.1-44.8-14.9-74.2-8.4c-2.8,0.6-5.5-1.2-6.1-4s1.2-5.5,4-6.1c32.3-7,60.1-3.7,82.2,10.1C121.9,114.2,122.7,117.5,121.3,120.1z M133.4,97.6c-1.9,3-5.8,3.9-8.7,2c-22.7-14-57.3-18-84.1-10.1c-3.4,1-6.9-0.9-7.9-4.3c-1-3.4,0.9-6.9,4.3-7.9c31.8-9.2,70.5-4.7,97.5,11.6C134.3,90.8,135.2,94.7,133.4,97.6z M134.9,74.1c-27-16.2-71.5-17.7-97-10c-4,1.2-8.2-1-9.4-5c-1.2-4,1-8.2,5-9.4c29.6-8.8,79-7.1,110.9,11.7c3.6,2.1,4.8,6.7,2.6,10.3C144.8,75.1,139.1,76.6,134.9,74.1z"/>
          </svg>
          Connecté via Spotify
        </div>

        <div v-if="!isSpotifyUser" class="edit-section">
          <div class="form-group">
            <label>Nouveau pseudo</label>
            <div class="input-row">
              <input v-model="newUsername" type="text" placeholder="Entrez votre nouveau pseudo..." />
              <button @click="confirmNewUsername" class="btn-confirm">Enregistrer</button>
            </div>
          </div>
        </div>

        <div class="divider"></div>

        <div class="actions">
          <button @click="handleLogout" class="btn-logout">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
              Se déconnecter
          </button>
          <button @click="deleteAccount" class="btn-delete">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
            Supprimer le compte
          </button>
        </div>
      </div>
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
const newUsername = ref('')
const fileInput = ref(null)

const triggerFileInput = () => { fileInput.value?.click() }

const uploadAvatar = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  const formData = new FormData()
  formData.append('avatar', file)
  try {
    const token = localStorage.getItem('token')
    const r = await axios.post('http://localhost:3000/api/users/upload-avatar', formData, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
    })
    user.value.avatar = `http://localhost:3000${r.data.avatarUrl}`
  } catch (err) {
    alert("Erreur lors de la mise à jour de l'avatar.")
  }
}

const confirmNewUsername = async () => {
  if (!newUsername.value.trim()) return
  try {
    const r = await axios.put('http://localhost:3000/api/users/update-username',
      { newUsername: newUsername.value },
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
    )
    user.value.username = newUsername.value
    newUsername.value = ''
    alert(r.data.message)
  } catch (err) {
    alert('Erreur lors de la mise à jour du nom d\'utilisateur.')
  }
}

onMounted(async () => {
  try {
    const spotifyId = localStorage.getItem('spotify_id')
    if (spotifyId) {
      user.value = await getSpotifyProfile(spotifyId)
      isSpotifyUser.value = true
    } else {
      const profile = await getProfile()
      if (profile.avatar) profile.avatar = `http://localhost:3000${profile.avatar}`
      user.value = profile
      isSpotifyUser.value = false
    }
  } catch (err) {
    console.error("Erreur profil:", err)
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
  } catch {
    alert("Une erreur est survenue lors de la suppression du compte.")
  }
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: radial-gradient(ellipse at 60% 70%, #01200F 0%, #011502 70%);
  color: #F0F7F2;
}

.container {
  max-width: 480px;
  margin: 0 auto;
  padding: 3rem 1.5rem;
  display: flex;
  justify-content: center;
}

.profile-card {
  width: 100%;
  background: rgba(1, 32, 15, 0.65);
  border: 1px solid rgba(158, 197, 171, 0.12);
  border-radius: 24px;
  backdrop-filter: blur(20px);
  padding: 2.5rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  box-shadow: 0 24px 60px rgba(0,0,0,0.4);
}

.avatar-wrap {
  position: relative;
  width: 110px;
  height: 110px;
  border-radius: 50%;
}
.avatar-wrap.clickable { cursor: pointer; }
.avatar-wrap.clickable:hover .avatar { filter: brightness(0.6); }
.avatar-wrap.clickable:hover .avatar-overlay { opacity: 1; }

.avatar {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid rgba(50, 116, 109, 0.5);
  transition: filter 0.2s;
}

.avatar-overlay {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #F0F7F2;
  opacity: 0;
  transition: opacity 0.2s;
}

.hidden-input { display: none; }

.username {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
}

.spotify-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  background: rgba(29, 185, 84, 0.08);
  border: 1px solid rgba(29, 185, 84, 0.2);
  border-radius: 20px;
  font-size: 0.82rem;
  color: #1DB954;
}
.spotify-icon { width: 16px; height: 16px; }

.edit-section { width: 100%; }
.form-group label {
  display: block;
  font-size: 0.78rem;
  color: #9EC5AB;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 8px;
}

.input-row {
  display: flex;
  gap: 8px;
}
.input-row input {
  flex: 1;
  padding: 0.65rem 0.9rem;
  background: rgba(1, 32, 15, 0.8);
  border: 1px solid rgba(158, 197, 171, 0.2);
  border-radius: 10px;
  color: #F0F7F2;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s;
}
.input-row input::placeholder { color: rgba(158, 197, 171, 0.3); }
.input-row input:focus { border-color: #32746D; }

.btn-confirm {
  padding: 0 1.1rem;
  background: #104F55;
  border: none;
  border-radius: 10px;
  color: #9EC5AB;
  font-weight: 600;
  font-size: 0.88rem;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-confirm:hover { background: #32746D; color: #F0F7F2; }

.divider {
  width: 100%;
  height: 1px;
  background: rgba(158, 197, 171, 0.1);
}

.actions {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.btn-logout {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 0.7rem;
  background: rgba(16, 79, 85, 0.25);
  border: 1px solid rgba(158, 197, 171, 0.15);
  border-radius: 12px;
  color: #9EC5AB;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.btn-logout:hover { background: rgba(16, 79, 85, 0.45); color: #F0F7F2; }

.btn-delete {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 0.7rem;
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 12px;
  color: rgba(239, 68, 68, 0.7);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.btn-delete:hover { background: rgba(239, 68, 68, 0.15); color: #ef4444; }
</style>
