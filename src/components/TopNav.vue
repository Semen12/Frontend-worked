<template>
    <nav class="top-nav" ref="navRef">
        <div class="top-nav__left">
            <router-link to="/home" class="top-nav__link" @click="closeMenuIfOpen">Главная страница</router-link>
        </div>
        <div class="top-nav__right">
            <div class="top-nav__right-content" @click="toggleDropdownAndArrow">
                <span class="top-nav__username">{{ userName }}</span>
                <svg xmlns="http://www.w3.org/2000/svg" id="arrow" viewBox="0 0 19 19" width="19" height="19" fill="currentColor">
                    <path :d="dropdownOpen ? 'M12 8.59l4.29 4.29a1.009 1.009 0 0 0 1.42-1.42l-5-5a1.009 1.009 0 0 0-1.42 0l-5 5a1.009 1.009 0 0 0 1.42 1.42L12 8.59z' : 'M12 15.41l-4.29-4.29a1.009 1.009 0 0 0-1.42 1.42l5 5a1.009 1.009 0 0 0 1.42 0l5-5a1.009 1.009 0 0 0-1.42-1.42L12 15.41z'"/>
                </svg>
            </div>

            <div v-if="dropdownOpen" class="top-nav__dropdown">
                <button @click="goToProfile" class="top-nav__dropdown-item">Профиль</button>
                <button @click="logout" class="top-nav__dropdown-item">Выйти</button>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const dropdownOpen = ref(false);
const authStore = useAuthStore();
const router = useRouter();
const navRef = ref(null);

const userName = computed(() => authStore.user.name);

const toggleDropdownAndArrow = () => {
    dropdownOpen.value = !dropdownOpen.value;
};

const closeDropdown = () => {
    dropdownOpen.value = false;
};

const closeMenuIfOpen = () => {
    if (dropdownOpen.value) {
        toggleDropdownAndArrow();
    }
};

const goToProfile = () => {
    router.push('/user');
};

const logout = async () => {
    await authStore.logout();
    router.push('/login');
};

const handleClickOutside = (event) => {
    if (navRef.value && !navRef.value.contains(event.target)) {
        closeDropdown();
    }
};

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
});
</script>


<style scoped lang="scss">
    .top-nav {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 20px;
        background-color: #3498db;
        color: white;
        position: relative;

        &__left {
            .top-nav__link {
                color: white;
                text-decoration: none;
                font-size: 1.2em;

                &:hover {
                    text-decoration: underline;
                }
            }
        }

        &__right {
            display: flex;
            align-items: center;
            cursor: pointer;

            &-content {
                display: flex;

            }

            /* CSS */
            &>.top-nav__username {
                margin-right: 10px;
                font-size: 1.3em;
                position: relative;



            }


            &>.top-nav__dropdown {
                position: absolute;
                top: 100%;
                right: 20px;
                background-color: white;
                color: #3498db;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                border-radius: 5px;
                overflow: hidden;

                &>.top-nav__dropdown-item {
                    padding: 10px 20px;
                    width: 100%;
                    text-align: left;
                    border: none;
                    background: none;
                    cursor: pointer;

                    &:hover {
                        background-color: #ecf0f1;
                    }
                }
            }
        }
    }
</style>
