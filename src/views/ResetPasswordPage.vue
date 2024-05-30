<template>
  <div class="password-reset">
    <h1 class="password-reset__title">Сброс пароля</h1>
    <form class="password-reset__form" @submit.prevent="resetPassword">
      <div class="password-reset__form-group">
        <label for="password" class="password-reset__label">Новый пароль</label>
        <input :type="ShowPassword ? 'text' : 'password'" id="password" v-model="password" class="password-reset__input" required />
        <button type="button" @click="togleShowPassword" class="password-reset__toggle">{{ ShowPassword ? 'Скрыть' : 'Показать' }}</button>
      </div>
      <div class="password-reset__form-group">
        <label for="password_confirmation" class="password-reset__label">Подтвердите новый пароль</label>
        <input :type="showConfirmPassword ? 'text' : 'password'" id="password_confirmation" v-model="password_confirmation" class="password-reset__input" required />
        <button type="button" @click="toggleShowConfirmPassword" class="password-reset__toggle">
          {{ showConfirmPassword ? 'Скрыть' : 'Показать' }}
        </button>
      </div>
      <button class="password-reset__button">Сбросить пароль</button>
    </form>
    <div v-if="status" class="password-reset__status">{{ status }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { useAuthStore } from '@/stores/auth.js'

const route = useRoute();
const router = useRouter();

const email = ref('');
const token = ref('');
const password = ref('');
const password_confirmation = ref('');
const status = ref('');

onMounted(() => {
  email.value = route.query.email || '';
  token.value = route.query.token || '';
});

const resetPassword = async () => {
  try {
    await useAuthStore().fetchCsrfToken()
    const response = await axios.post( '/password-reset', {
      email: email.value,
      token: token.value,
      password: password.value,
      password_confirmation: password_confirmation.value,
    });
    status.value = response.data.status;
    if (response.data.status === 'Пароль успешно изменен') {
      router.push({ name: 'Login' });
    }
  } catch (error) {
    console.error('Ошибка при сбросе пароля:', error);
    const errors = error.response.data.errors;
    if (errors.password) {
      status.value = errors.password[0];
    }
    if (errors.password_confirmation) {
      status.value = errors.password_confirmation[0];
    }
  }
};

const showConfirmPassword = ref(false);
const toggleShowConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value;
};

const ShowPassword = ref(false);
const togleShowPassword = () => {
  ShowPassword.value = !ShowPassword.value;
};

</script>

<style scoped>
.password-reset {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100vw;
  background-color: #f9f9f9;
}

.password-reset__title {
  font-size: 2em;
  margin-bottom: 20px;
  color: #2c3e50;
  text-align: center;
}

.password-reset__form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.password-reset__form-group {
  display: flex;
  flex-direction: column;
  position: relative;
  max-width: 150%;
}

.password-reset__label {
  margin-bottom: 5px;
  color: #8e8edd;
}

.password-reset__input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.password-reset__button {
  padding: 10px 20px;
  font-size: 1.2em;
  color: white;
  background-color: #42b983;
  border: none;
  border-radius: 5px;
}

.password-reset__button:hover {
  background-color: #369870;
}

.password-reset__button:disabled {
  background-color: #cccccc;
}

.password-reset__status {
  margin-top: 20px;
  font-size: 1rem;
  color: #28a745;
  text-align: center;
}
.password-reset__toggle{
  position: absolute;
  right: 10px;
  top: 40px;
  background: none;
  border: none;
  cursor: pointer;
  color: #42b983;
}
</style>
