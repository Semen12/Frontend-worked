<template>
    <div class="password-change">
      <h1 class="password-change__title">Смена пароля</h1>
      <form class="password-change__form" @submit.prevent="updatePassword">
        <div class="password-change__form-group">
          <label for="current_password" class="password-change__label">Текущий пароль</label>
          <div class="password-change__input-container">
            <input :type="showCurrentPassword ? 'text' : 'password'" id="current_password" v-model="current_password" class="password-change__input" required />
            <button type="button" @click="toggleShowCurrentPassword" class="password-change__toggle">
              {{ showCurrentPassword ? 'Скрыть' : 'Показать' }}
            </button>
          </div>
          <div v-if="passwordError" class="password-change__error">{{ passwordError }}</div>
        </div>
  
        <div class="password-change__form-group">
          <label for="new_password" class="password-change__label">Новый пароль</label>
          <div class="password-change__input-container">
            <input :type="showNewPassword ? 'text' : 'password'" id="new_password" v-model="password" class="password-change__input" @input="validatePassword" required />
            <button type="button" @click="toggleShowNewPassword" class="password-change__toggle">
              {{ showNewPassword ? 'Скрыть' : 'Показать' }}
            </button>
          </div>
          <div v-if="passwordErrorTwo" class="password-change__error">{{ passwordErrorTwo }}</div>
        </div>
  
        <div class="password-change__form-group">
          <label for="password_confirmation" class="password-change__label">Подтвердите новый пароль</label>
          <div class="password-change__input-container">
            <input :type="showConfirmPassword ? 'text' : 'password'" id="password_confirmation" v-model="password_confirmation" class="password-change__input" @input="validatePasswordConfirm" required />
            <button type="button" @click="toggleShowConfirmPassword" class="password-change__toggle">
              {{ showConfirmPassword ? 'Скрыть' : 'Показать' }}
            </button>
          </div>
          <div v-if="passwordErrorThree" class="password-change__error">{{ passwordErrorThree }}</div>
        </div>
        <p v-if="status_password_update" class="password-change__status-message">{{ status_password_update }}</p>
        <button class="password-change__button" type="submit" :disabled="isFormInvalid">Обновить пароль</button>
      </form>
    </div>
  </template>

<script setup>
    import { ref, computed } from 'vue';
import axios from 'axios';

const current_password = ref('');
const password = ref('');
const password_confirmation = ref('');
const showCurrentPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);
const passwordError = ref('');
const passwordErrorTwo = ref('');
const passwordErrorThree = ref('');
const status_password_update = ref('');


const updatePassword = async () => {
    /* if(isFormInvalid.value) { return; } */
  passwordError.value = '';
  passwordErrorTwo.value = '';
  passwordErrorThree.value = '';
  status_password_update.value = 'Обновляем...';

  try {
    const response = await axios.patch('/user/password-update', {
      current_password: current_password.value,
      password: password.value,
      password_confirmation: password_confirmation.value,
    });

    status_password_update.value = response.data.message;
    current_password.value = '';
    password.value = '';
    password_confirmation.value = '';
    setTimeout(() => {
      status_password_update.value = '';
    },750)
  } catch (error) {
    status_password_update.value = '';
    const errors = error.response.data.errors;
    if (errors.current_password) {
      passwordError.value = errors.current_password.join(' ');
    }
    if (errors.new_password) {
      passwordError.value = errors.password.join(' ');
    }
    if (errors.password_confirmation) {
      passwordErrorTwo.value = errors.password_confirmation.join(' ');
    }
  }
};

const toggleShowCurrentPassword = () => {
  showCurrentPassword.value = !showCurrentPassword.value;
};

const toggleShowNewPassword = () => {
  showNewPassword.value = !showNewPassword.value;
};

const toggleShowConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value;
};

const validatePassword = () => {
  const passwordValue = password.value;
  const minLength = 8;
  const hasNumber = /\d/;
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>_-`~]/;
  const hasUpperCase = /[A-ZА-ЯЁ]/;
  const hasLowerCase = /[a-zа-яё]/;

  if (
    passwordValue.length < minLength ||
    !hasNumber.test(passwordValue) ||
    !hasSpecialChar.test(passwordValue) ||
    !hasUpperCase.test(passwordValue) ||
    !hasLowerCase.test(passwordValue)
  ) {
    passwordErrorTwo.value =
      'Пароль должен иметь длину не менее 8 символов, содержать хотя бы одну цифру, один специальный символ (!@#$%^&*(),.?":{}|<>_-`~), одну строчную и одну заглавную букву.';
  } else {
    passwordErrorTwo.value = '';
  }
};

const validatePasswordConfirm = () => {
  if (password.value !== password_confirmation.value) {
    passwordErrorThree.value = 'Пароли не совпадают!';
  } else {
    passwordErrorThree.value = '';
  }
};

const isFormInvalid = computed(() => {
  return (
    !current_password.value ||
    !password.value ||
    !password_confirmation.value
  );
});
</script>
<style lang="scss" scoped>
    .password-change {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        padding: 20px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

        &__title {
            font-size: 1.5em;
            margin-bottom: 20px;
            color: #2c3e50;
        }

        &__form {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
            width: 100%;
            margin-top: 10px;

            &-group {
                display: flex;
                flex-direction: column;
                width: 100%;
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

        &__input {
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            width: 100%;
        }

        &__button {
            padding: 10px 20px;
            font-size: 1em;
            color: white;
            background-color: #42b983;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            align-self: flex-end;

            &:hover {
                background-color: #369870;
            }
        }

        &__status-message {
            color: #2c3e50;
      font-size: 0.8em;
      text-align: center;
      transition: all 0.3s ease 0s;
        }

        &__error {
            font-size: 0.9em;
            color: red;
            text-align: center;
        }
    }
</style>