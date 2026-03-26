<template>
  <div class="sidebar" :class="[side, { open }]" :style="{ width: open ? '300px' : '48px' }">
    <button class="toggle-btn" @click="$emit('toggle')" :title="open ? 'Fermer' : 'Ouvrir'">
      <svg
        class="arrow"
        :class="{ flipped: open }"
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke="#9EC5AB"
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
  side: { type: String, default: 'left' }
})
defineEmits(['toggle'])
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 64px;
  bottom: 0;
  background: rgba(1, 20, 8, 0.82);
  backdrop-filter: blur(18px);
  color: #F0F7F2;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  z-index: 90;
}

.sidebar.left {
  left: 0;
  border-right: 1px solid rgba(158, 197, 171, 0.1);
}

.sidebar.right {
  right: 0;
  border-left: 1px solid rgba(158, 197, 171, 0.1);
  align-items: flex-end;
}

.toggle-btn {
  background: rgba(16, 79, 85, 0.25);
  border: none;
  color: #9EC5AB;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.2s;
}
.toggle-btn:hover {
  background: rgba(50, 116, 109, 0.35);
}

.arrow { transition: transform 0.3s ease; }

.sidebar.left .arrow         { transform: rotate(180deg); }
.sidebar.left .arrow.flipped { transform: rotate(0deg); }
.sidebar.right .arrow         { transform: rotate(0deg); }
.sidebar.right .arrow.flipped { transform: rotate(180deg); }

.sidebar.right .toggle-btn {
  align-self: flex-end;
}

.content {
  padding: 1rem 1rem 6rem;
  width: 300px;
  overflow-y: auto;
  flex: 1;
}
</style>
