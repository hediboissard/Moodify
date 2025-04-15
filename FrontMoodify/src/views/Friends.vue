<template>
  <Navbar />
  <div class="min-h-screen py-10 px-6" style="background-color: var(--black-main);">
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      <div
        v-for="friend in friends"
        :key="friend.id"
        class="rounded-2xl p-4 shadow-lg flex flex-col items-center"
        style="background-color: var(--gray-main);"
      >
        <img
          :src="friend.image"
          alt="Friend"
          class="w-full h-56 object-cover rounded-lg mb-4"
        />
        <button
          class="bg-[#9FFF6D] text-black font-bold py-2 w-full rounded-lg hover:bg-[#8be65a] transition"
        >
          Add +
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue';

const friends = [
  {
    id: 1,
    image: '/friends/friend1.jpg', 
  },
  {
    id: 2,
    image: '/friends/friend1.jpg',
  },
  {
    id: 3,
    image: '/friends/friend1.jpg',
  },
  {
    id: 4,
    image: '/friends/friend1.jpg',
  },
  {
    id: 5,
    image: '/friends/friend1.jpg',
  },
  {
    id: 6,
    image: '/friends/friend1.jpg',
  },
]
  </script>
  