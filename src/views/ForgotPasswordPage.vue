<template>
  <div class="password-forgot">
    <h1 class="password-forgot__title">Восстановление пароля</h1>
    <form class="password-forgot__form" @submit.prevent="sendResetLink">
      <div class="password-forgot__form-group">
        <label for="email" class="password-forgot__label">Введите email</label>
        <input type="email" id="email" v-model="email" class="password-forgot__input" required />
      </div>
      <button class="password-forgot__button">Отправить ссылку для </button>
    </form>
    <div v-if="status" class="password-forgot__status">{{ status }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const email = ref('');
const status = ref('');

const sendResetLink = async () => {
  try {
    const response = await axios.post( '/password-forgot', { email: email.value });
    status.value = response.data.status;
  } catch (error) {
    console.error('Ошибка при отправке ссылки на восстановление пароля:', error);
    const errors = error.response.data.errors;
    if (errors.password){
      status.value = errors.password;
    }
  }
};
</script>

<style scoped>
.password-forgot {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100vw;
  background-color: #f9f9f9;
}

.password-forgot__title {
  font-size: 2em;
  margin-bottom: 20px;
  color: #2c3e50;
  text-align: center;
}

.password-forgot__form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.password-forgot__form-group {
  display: flex;
  flex-direction: column;
  position: relative;
  max-width: 150%;
}

.password-forgot__label {
  margin-bottom: 5px;
  color: #8e8edd;
}

.password-forgot__input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.password-forgot__button {
  padding: 10px 20px;
  font-size: 1.2em;
  color: white;
  background-color: #42b983;
  border: none;
  border-radius: 5px;
}

.password-forgot__button:hover {
  background-color: #369870;
}

.password-forgot__button:disabled {
  background-color: #cccccc;
}

.password-forgot__status {
  margin-top: 20px;
  font-size: 1rem;
  color: #0a4919;
  text-align: center;
}
</style>

