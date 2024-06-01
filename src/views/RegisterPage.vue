<template>
  <div class="register">
    <h1 class="register__title">Регистрация</h1>
    <form class="register__form" @submit.prevent="register" autocomplete="on">
      <div class="register__form-group">
        <label for="name" class="register__label">Имя</label>
        <input type="text" id="name" v-model="name" class="register__input" required />
        <div v-if="nameError" class="register__error">{{ nameError }}</div>
      </div>
      <div class="register__form-group">
        <label for="email" class="register__label">Email</label>
        <input type="email" id="email" v-model="email" class="register__input" required />
        <div v-if="emailError" class="register__error">{{ emailError }}</div>
      </div>
      <div class="register__form-group">
        <label for="password" class="register__label">Пароль</label>
       <div class="register__input-container"><input :type="showPassword ? 'text' : 'password'" id="password" v-model="password" class="register__input" @input="validatePassword" required />
        <button type="button" @click="toggleShowPassword" class="register__toggle">
          {{ showPassword ? 'Скрыть' : 'Показать' }}
        </button>
      </div>
        
      </div>
      <div v-if="passwordError" class="register__error">{{ passwordError }}</div>
      <div class="register__form-group">
        <label for="password_confirmation" class="register__label">Подтвердите пароль</label>
       <div class="register__input-container">
        <input :type="showConfirmPassword ? 'text' : 'password'" id="password_confirmation" v-model="password_confirmation" class="register__input" @input="validatePasswordConfirm" required />
        <button type="button" @click="toggleShowConfirmPassword" class="register__toggle">
          {{ showConfirmPassword ? 'Скрыть' : 'Показать' }}
        </button>
      </div> 
        
      </div>
      <div v-if="passwordErrorTwo" class="register__error">{{ passwordErrorTwo }}</div>
      <button class="register__button" :disabled="isFormInvalid">Регистрация</button>
      <router-link :to="'/login'" class="register__link">Уже зарегистрированы? Войти</router-link>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios';

const name = ref('')
const email = ref('')
const password = ref('')
const password_confirmation = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const passwordError = ref('')
const passwordErrorTwo = ref('')
const emailError = ref('')
const nameError = ref('')
const authStore = useAuthStore()
const router = useRouter()

const register = async () => {
  nameError.value = ''
  emailError.value = ''
  passwordError.value = ''
  passwordErrorTwo.value = ''

  if (isFormInvalid.value) {
    event.preventDefault()
    return
  }
  try {
    await axios.get('/sanctum/csrf-cookie').then( async () => {
     await authStore.register({
      name: name.value,
      email: email.value,
      password: password.value,
      password_confirmation: password_confirmation.value
    })
   await router.push('/about')
  })
  } catch (error) {
    console.error('Registration failed:', error)
    const errors = error.response.data.errors
    if (errors.name) {
      nameError.value = Object.values(errors.name).join(' ')
    }
    if (errors.email) {
      emailError.value = Object.values(errors.email).join(' ')
    }
    if (errors.password) {
      passwordError.value = Object.values(errors.password).join(' ')
    }
    if (errors.password_confirmation) {
      passwordErrorTwo.value = Object.values(errors.password_confirmation).join(' ')
    }
  }
}

const toggleShowPassword = () => {
  showPassword.value = !showPassword.value
}

const toggleShowConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value
}

const validatePassword = () => {
  const passwordValue = password.value
  const minLength = 8
  const hasNumber = /\d/
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>_-`~]/
  const hasUpperCase = /[A-ZА-ЯЁ]/ // Проверка на заглавные буквы латиницы и кириллицы
  const hasLowerCase = /[a-zа-яё]/ // Проверка на строчные буквы латиницы и кириллицы

  if (
    passwordValue.length < minLength ||
    !hasNumber.test(passwordValue) ||
    !hasSpecialChar.test(passwordValue) ||
    !hasUpperCase.test(passwordValue) ||
    !hasLowerCase.test(passwordValue)
  ) {
    passwordError.value =
      'Пароль должен иметь длину не менее 8 символов, содержать хотя бы одну цифру, один специальный символ (!@#$%^&*(),.?":{}|<>_-`~), одну строчную и одну заглавную букву.'
  } else {
    passwordError.value = ''
  }
}

const validatePasswordConfirm = () => {
  if (password.value !== password_confirmation.value) {
    passwordErrorTwo.value = 'Пароли не совпадают!'
  } else {
    passwordErrorTwo.value = ''
  }
}

const isFormInvalid = computed(() => {
  return (
    passwordError.value ||
    passwordErrorTwo.value ||
    !password.value ||
    !password_confirmation.value ||
    !name.value
  )
})
</script>

<style lang="scss" scoped>
.register {
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
    &:nth-child(2) {
      margin-bottom: 0px;
    }
    @media (min-width: 768px) {
      flex-direction: column;
    }

    &--checkbox {
      flex-direction: row;
      align-items: center;
      justify-content: center;
      gap: 5px;
       margin-bottom: 0px;
      /* .login__label {
        margin-bottom: 0;
      } */
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
    margin-bottom: 10px;
    cursor: pointer;
    &:hover {
      background-color: #369870;
    }

    &:disabled {
      background-color: #cccccc;
    }
  }
  &__forgot-password {
    text-align: center;
    font: 0.9em sans-serif;
    margin-bottom: 5px;
    padding: 7px;
  }
  &__link {
    text-align: center;
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
