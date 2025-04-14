<template>
    <Navbar />
    <div class="min-h-screen bg-neutral-900 text-white flex flex-col items-center">
  
      <div class="mt-12">
        <img src="https://www.svgrepo.com/show/382106/profile-avatar.svg"
             alt="Profile"
             class="w-32 h-32 rounded-full border-2 border-gray-600" />
      </div>
  
      <div class="mt-10 space-y-6 text-lg">
        <p><span class="font-bold">Pseudo:</span> {{ user.pseudo }}</p>
        <p><span class="font-bold">Name:</span> {{ user.name }}</p>
        <p><span class="font-bold">Surname:</span> {{ user.surname }}</p>
      </div>
  
      <button class="mt-12 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg">
        Account Delete
      </button>
    </div>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router'
  import Navbar from '@/components/Navbar.vue';

  const user = {
    pseudo: 'vincentleb',
    name: 'Vincent',
    surname: 'Lebel'
  }
  const router = useRouter()
  
  function goToHome() {
    router.push('/home')
  }
  </script>