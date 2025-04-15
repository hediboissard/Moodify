<template>
    <Navbar />
    <div class=" bg-neutral-900 text-white flex flex-col items-center">
  
      <div class="mt-12">
        <img src="https://www.svgrepo.com/show/382106/profile-avatar.svg"
             alt="Profile"
             class="w-32 h-32 rounded-full border-2 border-gray-600" />
      </div>
  
      <div class="mt-10 space-y-6 text-lg">
        <p><span class="font-bold">Username:</span> {{ user.username }}</p> <input type="text" placeholder="Username" class="w-full border border-green-500 rounded-lg py-2 px-4 bg-black text-green-500 placeholder-green-500" />
        <p><span class="font-bold">Change Password:</span> {{ user.password }}</p><input type="password" placeholder="New Password" class="w-full border border-green-500 rounded-lg py-2 px-4 bg-black text-green-500 placeholder-green-500" />
        <p><span class="font-bold">Confirm Password:</span> {{ user.username }}</p> <input type="password" placeholder="Confirm New Password" class="w-full border border-green-500 rounded-lg py-2 px-4 bg-black text-green-500 placeholder-green-500" />
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