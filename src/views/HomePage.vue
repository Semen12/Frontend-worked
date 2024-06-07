<template>
  <div class="home">
    <p v-if="!isEmailVerified" class="home__verification-status">{{ verificationStatus }}</p>
    <p v-if="!hasMasterPassword" class="home__verification-status">{{ statusMasterPassword }}</p>
    <div class="home__tabs" v-if="isEmailVerified && hasMasterPassword">
      <button :class="['home__tab', { 'home__tab--active': activeTab === 'accounts' }]"
        @click="setActiveTab('accounts')">
        Учётные записи
      </button>
      <button :class="['home__tab', { 'home__tab--active': activeTab === 'add' }]" @click="setActiveTab('add')">
        Добавить запись об акаунте
      </button>
    </div>
    <div class="home__content">
      <Accounts v-if="activeTab === 'accounts'" />
      <AddAccount v-if="activeTab === 'add'" />
    </div>
  </div>
</template>

<script setup>
  import { ref, computed } from 'vue';
  import { useAuthStore } from '@/stores/auth'; // Предположим, что у вас есть хранилище auth
  import Accounts from '@/components/Home/Accounts.vue';
  import AddAccount from '@/components/Home/AddAccount.vue';

  const authStore = useAuthStore();
  const activeTab = ref('accounts');

  const setActiveTab = (tab) => {
    activeTab.value = tab;
  };

  const isEmailVerified = computed(() => authStore.user?.email_verified ?? false);
  const hasMasterPassword = computed(() => authStore.user?.master_password ?? false)

  const verificationStatus = 'Подтвердите свою почту, чтобы создать или обновить мастер пароль.';
  const statusMasterPassword = 'Пожалуйста, создайте мастер-пароль в профиле пользователя, чтобы начать создавать записи об учетных записях.';

</script>

<style scoped lang="scss">
  .home {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    width: 100%;
    background-color: #f9f9f9;
    padding: 20px;
    align-items: center;
    &__tabs {
      display: flex;
      border-bottom: 1px solid #ddd;
    }

    &__tab {
      padding: 10px 20px;
      cursor: pointer;
      border: none;
      background: none;
      font-size: 16px;

      &--active {
        border-bottom: 2px solid #3498db;
        font-weight: 600;
      }
    }

    &__content {
      padding: 20px;
    }

    &__verification-status {
     // margin-top: 20px;
      font-size: 1.3em;
      color:rgb(230, 26, 26)
    }
  }
</style>
