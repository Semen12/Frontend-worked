<template>
  <div class="password-reset">
    <h1 class="password-reset__title">Сброс пароля</h1>
    <form class="password-reset__form" @submit.prevent="resetPassword">
      <div class="password-reset__form-group">
        <label for="password" class="password-reset__label">Новый пароль</label>
        <input :type="ShowPassword ? 'text' : 'password'" @input="validatePassword" id="password" v-model="password" class="password-reset__input" required />
        <button type="button" @click="togleShowPassword" class="password-reset__toggle">{{ ShowPassword ? 'Скрыть' : 'Показать' }}</button>
        <div v-if="passwordError" class="password-reset__error">{{ passwordError }}</div>
      </div>
      <div class="password-reset__form-group">
        <label for="password_confirmation" class="password-reset__label">Подтвердите новый пароль</label>
        <input :type="showConfirmPassword ? 'text' : 'password'" @input="validatePasswordConfirm" id="password_confirmation" v-model="password_confirmation" class="password-reset__input" required />
        <button type="button" @click="toggleShowConfirmPassword" class="password-reset__toggle">
          {{ showConfirmPassword ? 'Скрыть' : 'Показать' }}
        </button>
        <div v-if="passwordErrorTwo" class="password-reset__error">{{ passwordErrorTwo }}</div>
      </div>
      <button class="password-reset__button" :disabled="isFormInvalid">Сбросить пароль</button>
    </form>
    <div v-if="status" class="password-reset__status">{{ status }}</div>
    <div v-if="emailError" class="password-reset__error">{{ emailError }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
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
const passwordError = ref('');
const passwordErrorTwo = ref('');
const emailError = ref('');

onMounted(() => {
  email.value = route.query.email || '';
  token.value = route.query.token || '';
  if(!email.value || !token.value) {
    router.push({ name: 'Login' });
  }
});

const resetPassword = async () => {
  passwordError.value = '';
  passwordErrorTwo.value = '';
  emailError.value = '';
  status.value = '';
  try {
    await useAuthStore().fetchCsrfToken()
    const response = await axios.post( '/password-reset', {
      email: email.value,
      token: token.value,
      password: password.value,
      password_confirmation: password_confirmation.value,
    });
    status.value = response.data.status;
    if (response.status === 200) {
      // Добавляем задержку перед перенаправлением на страницу логина
      setTimeout(async () => {
        await router.push({ name: 'Login' });
      }, 3000); // Задержка в 2 секунды 
    }
  } catch (error) {
    console.error('Ошибка при сбросе пароля:', error);
    const errors = error.response.data.errors;
    if (errors.password) {
      passwordError.value = Object.values(errors.password).join(' '); // вот так корректно извлекать ошибки!!!
    }
    if (errors.password_confirmation) {
      passwordErrorTwo.value = Object.values(errors.password_confirmation).join(' ');
    }
    if(errors.email) {
      emailError.value = Object.values(errors.email).join(' ') +  ' Попробуйте запросить ссылку для восстановления заново.';
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
    !email.value ||
    !token.value
  )
})

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

 min-width: 30%;
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
.password-reset__error {
  color: red;
  font-size: 0.9em;
  text-align: center;
}
</style>
