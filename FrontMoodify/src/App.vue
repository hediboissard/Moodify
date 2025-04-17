<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  const params = new URLSearchParams(window.location.search)
  const token = params.get('token')
  const spotifyId = params.get('spotify_id')
  const accessToken = params.get('access_token')

  if (token) {
    console.log("🔑 [App.vue] Token JWT reçu:", token)
    localStorage.setItem('token', token)
  }

  if (spotifyId) {
    console.log("🎧 [App.vue] Spotify ID reçu:", spotifyId)
    localStorage.setItem('spotify_id', spotifyId)
  }

  if (accessToken) {
    console.log("🟢 [App.vue] Access Token Spotify reçu:", accessToken)
    localStorage.setItem('access_token', accessToken)
  }

  if (token || accessToken || spotifyId) {
    window.history.replaceState({}, document.title, "/")
  }

  if (token) {
    router.push('/home')
  }
})
</script>
