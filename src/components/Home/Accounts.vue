<template>
    <div class="view-accounts" v-if="isEmailVerified && hasMasterPassword">
        <h2 class="view-accounts__title">Ваши учётные записи</h2>
        <input type="text" v-model="searchQuery" placeholder="Поиск по названию, логину или типу"
            class="view-accounts__search" />
        <div class="view-accounts__list">
            <div v-for="account in filteredAccounts" :key="account.id" class="view-accounts__item"
                @click="handleAccountClick(account.id)">
                <p class="view-accounts__name"><span>Название: </span> {{ account.name }}</p>
                <p class="view-accounts__login"><span>Логин: </span>{{ account.login }}</p>
                <p class="view-accounts__url"><span>Тип: </span>{{ account.type }}</p>
            </div>
        </div>
        <AccountModal v-if="selectedAccount" :account="selectedAccount" 
        @close="selectedAccount = null" @accountDeleted="removeAccount"/>
        <MasterPasswordModal v-if="showMasterPasswordModal" @close="closeMasterPasswordModal"
            @master-password-set="fetchAccount" />
    </div>
    <ScrollToTop/>
</template>

<script setup>
    import { ref, computed, onMounted, onBeforeMount } from 'vue';
    import axios from 'axios';
    import { useMasterPasswordStore } from '@/stores/masterpassword.js';
    import AccountModal from '@/components/Home/AccountModal.vue';
    import MasterPasswordModal from '@/components/Home/MasterPasswordModal.vue';
    import ScrollToTop from '@/components/ScrollToTop.vue';
   
    import { useAuthStore } from '@/stores/auth';
    const authStore = useAuthStore();
   
    const accounts = ref([]);
    const selectedAccount = ref(null);
    const searchQuery = ref('');
    const showMasterPasswordModal = ref(false);
    const accountIdToFetch = ref(null);
    const masterPasswordStore = useMasterPasswordStore();

    const isEmailVerified = computed(() => authStore.user?.email_verified ?? false);
  const hasMasterPassword = computed(() => authStore.user?.master_password ?? false);
    const fetchAccounts = async () => {
        try {
            const response = await axios.get('/accounts');
            accounts.value = response.data.data;
        } catch (error) {
            console.error('Error fetching accounts:', error);
        }
    };

    const fetchAccount = async () => {
        try {
            const response = await axios.get(`/accounts/${accountIdToFetch.value}`);
            selectedAccount.value = response.data.data;
            closeMasterPasswordModal();
        } catch (error) {
            console.error('Error fetching account:', error);
        }
    };
   const  SetMasterPassword = computed(() => masterPasswordStore.checkMasterPasswordStatus ?? false)
    const handleAccountClick = (id) => {
        if (SetMasterPassword.value) {
            accountIdToFetch.value = id;
            fetchAccount();
        } else {
            accountIdToFetch.value = id;
            showMasterPasswordModal.value = true;
        }
    };

    const closeMasterPasswordModal = () => {
        showMasterPasswordModal.value = false;
    };

    const filteredAccounts = computed(() => {
        const query = searchQuery.value.toLowerCase();
        return accounts.value.filter(account =>
            account.name.toLowerCase().includes(query) ||
            account.login.toLowerCase().includes(query) ||
            account.type.toLowerCase().includes(query)
        );
    });
    const removeAccount = (accountId) => { // удаление аккаунта
    accounts.value = accounts.value.filter(account => account.id !== accountId);
};

    onMounted(fetchAccounts);
</script>

<style scoped lang="scss">
    .view-accounts {
        display: flex;
        flex-direction: column;
        align-items: center;

        &__title {
            font-size: 2em;
            margin-bottom: 20px;
            color: #2c3e50;
            text-align: center;
        }

        &__search {
            margin-bottom: 20px;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            width: 100%;
            max-width: 600px;
        }

        &__list {
            display: flex;
            flex-direction: column;
            gap: 10px;
            width: 100%;
            max-width: 600px;
        }

        &__item {
            padding: 15px;
            border: 1px solid #ddd;
            border-radius: 5px;
            background-color: #fff;
            cursor: pointer;
            transition: background-color 0.3s;
            color: #2c3e50;
            & > p span{
                font-weight: bold;
            }
            &:hover {
                background-color: #f1f1f1;
            }
        }

        &__name,
        &__login,
        &__url {
            margin: 0;
            font-size: 1em;

            &__item {
                padding: 15px;
                border: 1px solid #ddd;
                border-radius: 5px;
                background-color: #fff;
                cursor: pointer;
                transition: background-color 0.3s;

                &:hover {
                    background-color: #f1f1f1;
                }
            }

            &__name,
            &__login,
            &__url {
                margin: 0;
                font-size: 1em;
            }
        }
    }
</style>
