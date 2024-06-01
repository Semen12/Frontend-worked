<template>
  <div class="password-forgot">
    <h1 class="password-forgot__title">Восстановление пароля</h1>
    <form class="password-forgot__form" @submit.prevent="sendResetLink">
      <div class="password-forgot__form-group">
        <label for="email" class="password-forgot__label">Введите email</label>
        <input type="email" id="email" v-model="email" class="password-forgot__input" placeholder="mail@example.ru" required />
        <div v-if="emailError" class="password-forgot__error">{{ emailError }}</div>
      </div>
      <button class="password-forgot__button" :disabled="isFormInvalid">Отправить ссылку для восстановления</button>
    </form>
    <div v-if="status" class="password-forgot__status">{{ status }}</div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const email = ref('')
const status = ref('')
const emailError = ref('')

const sendResetLink = async () => {
  status.value = ''
  emailError.value = ''
  if (!email.value) {
    event.preventDefault()
    return
  }
  try {

    await axios.get('/sanctum/csrf-cookie').then(async () => {
       const response = await axios.post('/password-forgot', { email: email.value })
    status.value = response.data.status
    })
  } catch (error) {
    console.error('Ошибка при отправке ссылки на восстановление пароля:', error)
    const errors = error.response.data.errors
    emailError.value = Object.values(errors).join(' ')
  }
}
const isFormInvalid = computed(() => {
  return !email.value || email.value.match(/^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i) === null
})
</script>

<style scoped lang="scss">
.password-forgot {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100vw;
  background-color: #f9f9f9;
  padding: 20px;

  &__title {
    font-size: 2em;
    margin-bottom: 20px;
    color: #2c3e50;
    text-align: center;
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: 5px;
    width: 100%;
    max-width: 450px;
    padding: 20px;
    border-radius: 8px;
  }

  &__form-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 15px;

    @media (min-width: 768px) {
      flex-direction: column;
    }
  }

  &__label {
    margin-bottom: 5px;
    color: #8e8edd;
  }

  &__input-container {
    display: flex;
    align-items: center;
    position: relative;

    @media (min-width: 768px) {
      flex: 1;
      margin-bottom: 0;
    }
  }

  &__input {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    flex: 1;
    width: 100%;
  }

  &__toggle {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    color: #42b983;
  }

  &__button {
    padding: 10px 20px;
    font-size: 1.2em;
    color: white;
    background-color: #42b983;
    border: none;
    border-radius: 5px;
    margin-top: 5px;

    &:hover {
      background-color: #369870;
    }

    &:disabled {
      background-color: #cccccc;
    }
  }

  &__status {
    margin-top: 20px;
    font-size: 1rem;
    color: #28a745;
    text-align: center;
  }

  &__error {
    color: red;
    font-size: 0.9em;
    text-align: center;
    margin-top: 5px;
  }
}
</style>
