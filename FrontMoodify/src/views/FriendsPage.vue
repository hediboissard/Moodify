<template>
  <Navbar />
  <div class="min-h-screen py-10 px-6" style="background-color: var(--black-main);">
    <!-- Loading state -->
    <div v-if="loading" class="text-center text-white">
      <p>Loading users...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="text-center text-red-500">
      <p>{{ error }}</p>
    </div>

    <!-- Users grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      <div
        v-for="user in users"
        :key="user.id"
        class="rounded-2xl p-4 shadow-lg flex flex-col items-center"
        style="background-color: var(--gray-main);"
      >
        <img
          :src="user.avatar || '/default-avatar.jpg'"
          alt="User avatar"
          class="w-full h-56 object-cover rounded-lg mb-4"
        />
        <h3 class="text-white mb-2">{{ user.username }}</h3>
        <p class="text-gray-400 mb-4">Mood: {{ user.mood || 'Not set' }}</p>
        <div class="flex gap-2 w-full">
          <button
            @click="addFriend(user.id)"
            class="bg-[#9FFF6D] text-black font-bold py-2 flex-1 rounded-lg hover:bg-[#8be65a] transition"
          >
            Add Friend +
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Navbar from '@/components/Navbar.vue';
import axios from 'axios';
import { API_BASE_URL } from '@/config';

const users = ref([]);
const loading = ref(true);
const error = ref(null);

const fetchUsers = async () => {
  try {
    loading.value = true;
    error.value = null;
    const response = await axios.get(API_BASE_URL);
    users.value = response.data;
  } catch (err) {
    console.error('Error fetching users:', err);
    error.value = 'Failed to load users. Please try again later.';
  } finally {
    loading.value = false;
  }
};

const addFriend = async (userId) => {
  try {
    // TODO: Implémenter la logique d'ajout d'ami
    alert('Feature coming soon!');
  } catch (err) {
    console.error('Error adding friend:', err);
    alert('Failed to add friend. Please try again.');
  }
};

onMounted(() => {
  fetchUsers();
});
</script>
