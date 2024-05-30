<template>
  <div class="register">
    <!--   !!! Возможно убрать автозаполнение для пароля, сейчас для теста нужно-->
    <h1 class="register__title">Регистрация</h1>
    <form class="register__form" @submit.prevent="register" autocomplete="on">
      <div class="register__form-group">
        <label for="name" class="register__label">Имя</label>
        <input type="text" id="name" v-model="name" class="register__input" required />
        <div v-if="nameError" class="register__error">
          {{ nameError }}
        </div>
      </div>
      <div class="register__form-group">
        <label for="email" class="register__label">Email</label>
        <input
          type="email"
          id="email"
          v-model="email"
          class="register__input"
          @input="inputEmail"
          required
        />
        <div v-if="emailError" class="register__error">
          {{ emailError }}
        </div>
      </div>
      <div class="register__form-group">
        <label for="password" class="register__label">Пароль</label>
        <input
          :type="showPassword ? 'text' : 'password'"
          id="password"
          v-model="password"
          class="register__input error"
          @input="validatePassword"
          required
        />
        <button type="button" @click="toggleShowPassword" class="register__toggle-password">
          {{ showPassword ? 'Скрыть' : 'Показать' }}
        </button>
      </div>
      <div v-if="passwordError" class="register__error">{{ passwordError }}</div>
      <div class="register__form-group">
        <label for="password_confirmation" class="register__label">Подтвердите пароль</label>
        <input
          :type="showConfirmPassword ? 'text' : 'password'"
          id="password_confirmation"
          v-model="password_confirmation"
          class="register__input error"
          @input="validatePasswordConfirm"
          required
        />
        <button type="button" @click="toggleShowConfirmPassword" class="register__toggle-password">
          {{ showConfirmPassword ? 'Скрыть' : 'Показать' }}
        </button>
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
  await authStore.fetchCsrfToken()
  try {
    await authStore.register({
      name: name.value,
      email: email.value,
      password: password.value,
      password_confirmation: password_confirmation.value
    })
    await router.push('/about')
  } catch (error) {
    console.error('Registration failed:', error)
    const errors = error.response.data.errors
    if (errors.name) {
      nameError.value = errors.name[0]
    }
    if (errors.email) {
      emailError.value = errors.email[0]
    }
    if (errors.password) {
      passwordError.value = errors.password[0]
    }
    if (errors.password_confirmation) {
      passwordErrorTwo.value = errors.password_confirmation[0]
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

  // validatePasswordConfirm()
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

const inputEmail = () => {
  emailError.value = ''
}
const inputName = () => {
  nameError.value = ''
}
</script>

<style scoped>
.register {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100vw;
  background-color: #f9f9f9;
  flex: 1 0 100%;
}

.register__title {
  font-size: 2em;
  margin-bottom: 20px;
  color: #333;
  text-align: center;
}
.register__link {
  text-align: center;
}
.register__form {
  display: flex;
  flex-direction: column;
  gap: 21px;
}

.register__form-group {
  display: flex;
  flex-direction: column;
  position: relative;
  max-width: 150%;
}

.register__label {
  margin-bottom: 5px;
  color: #8e8edd;
}

.register__input {
  padding: 10px 0 10px 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
}
#password,
#password_confirmation {
  padding-right: 75px;
}

.register__toggle-password {
  position: absolute;
  right: 10px;
  top: 40px;
  background: none;
  border: none;
  cursor: pointer;
  color: #42b983;
}

.register__button {
  padding: 10px 20px;
  font-size: 1.2em;
  color: white;
  background-color: #42b983;
  border: none;
  border-radius: 5px;
}

.register__button:hover {
  background-color: #369870;
}
.register__button:disabled {
  background-color: #cccccc;
}
.register__error {
  color: red;
  font-size: 0.9em;
  text-align: center;
}
/*.error {
  border: 2px solid orange;
}*/
</style>
