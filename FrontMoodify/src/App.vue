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

  if (spotifyId) {
    console.log("🎧 [App.vue] Spotify ID reçu:", spotifyId)
    localStorage.setItem('spotify_id', spotifyId)
    router.push('/home')
  }
})

</script>
