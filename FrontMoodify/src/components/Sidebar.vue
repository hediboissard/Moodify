<template>
    <div
      class="sidebar"
      :class="[side, { open }]"
      :style="{ width: open ? '25%' : '50px' }"
    >
      <button class="toggle-btn" @click="$emit('toggle')">
        <svg
          class="arrow"
          :class="{ flipped: open }"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="white"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15 18l-6-6 6-6"
          />
        </svg>
      </button>
  
      <div v-if="open" class="content">
        <slot />
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    open: Boolean,
    side: {
      type: String,
      default: 'left'
    }
  })
  defineEmits(['toggle'])
  </script>
  
  <style scoped>
  .sidebar {
    position: absolute;
    top: 10vh; /* Laisse la navbar visible */
    bottom: 0;
    background-color: #1e1e1e;
    color: white;
    transition: width 0.3s ease;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    z-index: 1000;
  }
  
  .sidebar.left {
    left: 0;
    border-right: 1px solid #333;
  }
  
  .sidebar.right {
    right: 0;
    border-left: 1px solid #333;
    align-items: flex-end;
  }
  
  .toggle-btn {
    background: none;
    border: none;
    color: white;
    padding: 10px;
    cursor: pointer;
    z-index: 1;
  }
  
  .arrow {
    transition: transform 0.3s ease;
  }
  
  .sidebar.left .arrow {
    transform: rotate(0deg);
  }
  
  .sidebar.left .arrow.flipped {
    transform: rotate(180deg);
  }
  
  .sidebar.right .arrow {
    transform: rotate(180deg);
  }
  
  .sidebar.right .arrow.flipped {
    transform: rotate(0deg);
  }
  
  .sidebar.right .toggle-btn {
    align-self: flex-end;
  }
  
  .content {
    padding: 1rem;
    width: 100%;
  }
  </style>
  