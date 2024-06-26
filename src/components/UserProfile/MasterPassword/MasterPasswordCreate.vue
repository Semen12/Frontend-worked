<template>
  <div class="master-password-create">
    <h1 class="master-password-create__title">Создание мастер-пароля</h1>
    <form class="master-password-create__form" @submit.prevent="createMasterPassword">
      <div class="master-password-create__form-group">
        <label for="master_password" class="master-password-create__label">Мастер-пароль</label>
        <div class="master-password-create__input-container">
          <input :type="showMasterPassword ? 'text' : 'password'" id="master_password" v-model="master_password"
            class="master-password-create__input" @input="validatePassword" required />
          <button type="button" @click="toggleShowMasterPassword" class="master-password-create__toggle">
            {{ showMasterPassword ? 'Скрыть' : 'Показать' }}
          </button>
        </div>
        <div v-if="passwordError" class="master-password-create__error">{{ passwordError }}</div>
      </div>
      <div class="master-password-create__form-group">
        <label for="master_password_confirmation" class="master-password-create__label">Подтвердите
          мастер-пароль</label>
        <div class="master-password-create__input-container">
          <input :type="showConfirmPassword ? 'text' : 'password'" id="master_password_confirmation"
            v-model="master_password_confirmation" class="master-password-create__input"
            @input="validatePasswordConfirm" required />
          <button type="button" @click="toggleShowConfirmPassword" class="master-password-create__toggle">
            {{ showConfirmPassword ? 'Скрыть' : 'Показать' }}
          </button>
        </div>
        <div v-if="passwordErrorTwo" class="master-password-create__error">{{ passwordErrorTwo }}</div>
      </div>
      <p class="master-password-create__status-message" v-if="status_password_create">{{ status_password_create }}</p>
      <button class="master-password-create__button" type="submit" :disabled="isFormInvalid">Создать
        мастер-пароль</button>
    </form>
  </div>
</template>

<script setup>
  import { ref, computed } from 'vue';
  import axios from 'axios';
  import { useAuthStore } from '@/stores/auth';

  const master_password = ref('');
  const master_password_confirmation = ref('');
  const showMasterPassword = ref(false);
  const showConfirmPassword = ref(false);
  const passwordError = ref('');
  const passwordErrorTwo = ref('');
  const status_password_create = ref('');
  const authStore = useAuthStore();
  const createMasterPassword = async () => {
    passwordError.value = '';
    passwordErrorTwo.value = '';
    status_password_create.value = "Cоздаем мастер-пароль... ";
    try {
      const response = await axios.post('/user/create-master-password', {
        master_password: master_password.value,
        master_password_confirmation: master_password_confirmation.value,
      });

      status_password_create.value = response.data.message;
     /*  setTimeout(() => {
        status_password_create.value = '';
        authStore.setMasterPassword(true);
      }, 850) */
      master_password.value = '';
      master_password_confirmation.value = '';

    } catch (error) {

      const errors = error.response.data.errors;
      status_password_create.value = error.response.data.error;
      if (errors.master_password) {
        passwordError.value = errors.master_password.join(' ');
      }
      if (errors.master_password_confirmation) {
        passwordErrorTwo.value = errors.master_password_confirmation.join(' ');
      }
    }
  };

  const toggleShowMasterPassword = () => {
    showMasterPassword.value = !showMasterPassword.value;
  };

  const toggleShowConfirmPassword = () => {
    showConfirmPassword.value = !showConfirmPassword.value;
  };

  const validatePassword = () => {
    const passwordValue = master_password.value;
    const minLength = 6;
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
      passwordError.value =
        'Пароль должен иметь длину не менее 6 символов, содержать хотя бы одну цифру, один специальный символ (!@#$%^&*(),.?":{}|<>_-`~), одну строчную и одну заглавную букву.';
    } else {
      passwordError.value = '';
    }
  };

  const validatePasswordConfirm = () => {
    if (master_password.value !== master_password_confirmation.value) {
      passwordErrorTwo.value = 'Пароли не совпадают!';
    } else {
      passwordErrorTwo.value = '';
    }
  };

  const isFormInvalid = computed(() => {
    return (
      !master_password.value ||
      !master_password_confirmation.value
    );
  });
</script>

<style lang="scss" scoped>
  .master-password-create {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    padding: 20px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    &__title {
      text-align: center;
      font-size: 1.5em;
      margin-bottom: 20px;
      color: #2c3e50;
      white-space: nowrap;
      word-break: keep-all;
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