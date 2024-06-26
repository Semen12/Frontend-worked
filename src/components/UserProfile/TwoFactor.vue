<template>
    <div class="two-factor">
        <div v-if="isEmailVerified">
            <div v-if="hasTwoFactor">
                <TwoFactorAuthDisable />
            </div>
            <div v-else>
                <TwoFactorAuthEnable />
            </div>
        </div>

        <div v-if="!isEmailVerified" class="two-factor__error">
          Пожалуйста, подтвердите свою почту, чтобы включить двухфакторную аутентификацию</div>
    </div>
</template>
<script setup>
    import { ref, onMounted, reactive, computed } from 'vue';
    import TwoFactorAuthEnable from '@/components/UserProfile/TwoFactor/TwoFactorAuthEnable.vue';
    import TwoFactorAuthDisable from '@/components/UserProfile/TwoFactor/TwoFactorAuthDisable.vue';
    import { useAuthStore } from '@/stores/auth.js';
    import axios from 'axios';

    const authStore = useAuthStore();

    const isEmailVerified = computed(() => authStore.user?.email_verified ?? false);
    const hasTwoFactor = computed(() => authStore.user?.two_factor ?? false);
</script>

<style scoped>
.two-factor {
    /* margin-top: 20px;
      width: 100%;
      max-width: 600px; */
  
    &__error {
      color: red;
      font-size: 1.2em;
      /* text-align: center; */
      margin-top: 20px;
    }
}
</style>