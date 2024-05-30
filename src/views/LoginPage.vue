<template>
  <div class="login">
    <h1 class="login__title">Вход</h1>
    <form class="login__form" @submit.prevent="login">
      <div class="login__form-group">
        <label for="email" class="login__label">Email</label>
        <input type="email" id="email" v-model="email" class="login__input" required />
      </div>
      <div class="login__form-group">
        <label for="password" class="login__label">Пароль</label>
        <input
          :type="showPassword ? 'text' : 'password'"
          id="password"
          v-model="password"
          class="login__input"
          required
        />
        <button type="button" @click="toggleShowPassword" class="login__toggle-password">
          {{ showPassword ? 'Скрыть' : 'Показать' }}
        </button>
      </div>
      <div class="login__form-group login__form-group--checkbox">
        <label for="remember-me" class="login__label">Запомнить меня</label>
        <input type="checkbox" id="remember-me" v-model="rememberMe" class="login__checkbox" />
      </div>
      <div v-if="loginError" class="login__error">{{ loginError }}</div>
      <button type="submit" class="login__button" :disabled="isFormInvalid">Войти</button>
      <router-link :to="'/register'" class="register__link"
        >Ещё нет аккаунта? Зарегистрироваться</router-link
      >
    </form>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'

const email = ref('')
const password = ref('')
const authStore = useAuthStore()
const router = useRouter()
const showPassword = ref(false)
const loginError = ref('')
const rememberMe = ref(false)

const login = async () => {
  await authStore.fetchCsrfToken()
  try {
    const response = await authStore.login({
      email: email.value,
      password: password.value,
      rememberMe: rememberMe.value
    })
    console.log(response.data.two_factor)
    if (response.data.two_factor) {
      router.push('/two-factor')
    } else {
      router.push('/home')
    }
  } catch (error) {
    console.error('Login failed:', error)
    loginError.value = error.response.data.errors.email;
  }
}
const toggleShowPassword = () => {
  showPassword.value = !showPassword.value
}

const isFormInvalid = computed(() => {
  return !email.value || !password.value
})
</script>

<style scoped>
.login {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100vw;
  background-color: #f9f9f9;
}

.login__title {
  font-size: 2em;
  margin-bottom: 20px;
  color: #2c3e50;
  text-align: center;
}

.login__form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.login__form-group {
  display: flex;
  flex-direction: column;
  position: relative;
  max-width: 150%;
}
.login__form-group--checkbox {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 23px;
  line-height: 1.2;
  .login__label {
    margin-bottom: 0;
  }
}

.login__label {
  margin-bottom: 5px;
  color: #8e8edd;
}

.login__input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.login__button {
  padding: 10px 20px;
  font-size: 1.2em;
  color: white;
  background-color: #42b983;
  border: none;
  border-radius: 5px;
}

.login__button:hover {
  background-color: #369870;
}
.login__button:disabled {
  background-color: #cccccc;
}
.login__toggle-password {
  position: absolute;
  right: 10px;
  top: 40px;
  background: none;
  border: none;
  cursor: pointer;
  color: #42b983;
}
.login__error {
  color: red;
  font-size: 0.9em;
  text-align: center;
}
</style>
