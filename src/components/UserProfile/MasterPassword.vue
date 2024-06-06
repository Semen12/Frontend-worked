<template>
  <div class="master-password">
    <MasterPasswordCreate v-if="!hasMasterPassword && isEmailVerified" />
    <MasterPasswordUpdate v-if="hasMasterPassword && isEmailVerified" />
    <div v-if="!isEmailVerified" class="master-password__error">Пожалуйста, подтвердите свою почту, чтобы создать или
      обновить мастер-пароль.</div>
  </div>
</template>

<script setup>
  // eslint-disable-next-line no-unused-vars
  import { ref, onMounted, reactive, computed } from 'vue';
  import MasterPasswordCreate from '@/components/UserProfile/MasterPassword/MasterPasswordCreate.vue';
  import MasterPasswordUpdate from '@/components/UserProfile/MasterPassword/MasterPasswordUpdate.vue';
  import { useAuthStore } from '@/stores/auth.js'
 
  const authStore = useAuthStore()
  const isEmailVerified = computed(() => authStore.user?.email_verified ?? false);
  const hasMasterPassword = computed(() => authStore.user?.master_password ?? false)
</script>

<style lang="scss" scoped>
  .master-password {
    /* margin-top: 20px;
      width: 100%;
      max-width: 600px; */

    &__error {
      color: red;
      font-size: 1.2em;
      //text-align: center;
      margin-top: 20px;
    }
  }
</style>