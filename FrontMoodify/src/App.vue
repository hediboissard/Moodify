<template>
  <router-view />
</template>
<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  const params = new URLSearchParams(window.location.search)
  const spotifyId = params.get('spotify_id')
  const accessToken = params.get('access_token')

  if (spotifyId) {
    console.log("🎧 [App.vue] Spotify ID reçu:", spotifyId)
    localStorage.setItem('spotify_id', spotifyId)
  }

  if (accessToken) {
    console.log("🔑 [App.vue] Token Spotify reçu:", accessToken)
    localStorage.setItem('access_token', accessToken)
  }

  if (spotifyId || accessToken) {
    router.push('/home')
  }
})
</script>
