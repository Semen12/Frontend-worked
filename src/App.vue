<template>
 <div id="app">
  <TopNav v-if="isAuthenticated" />
  <router-view />
  
 </div> 
  
</template>

<script setup>
import { RouterView } from 'vue-router';
import TopNav from '@/components/TopNav.vue';
import { useAuthStore } from '@/stores/auth';
import { computed } from 'vue';

const authStore = useAuthStore();
const isAuthenticated = computed(() => authStore.isAuthenticated);
</script>



<style scoped></style>
