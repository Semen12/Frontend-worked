<template>
  <div class="two-factor">
    <h1 class="two-factor__title">Двухфакторная аутентификация</h1>
    <form class="two-factor__form" @submit.prevent="verifyCode">
      <div class="two-factor__form-group">
        <label for="code" class="two-factor__label">
          Введите код <span v-if="!showRecoveryCodeInput">аутентификации из приложения</span>
          <span v-else>восстановления</span>
        </label>
        <input
          v-if="!showRecoveryCodeInput"
          type="text"
          id="code"
          v-model="code"
          class="two-factor__input"
          @input="validateCode"
          required
        />
        <input
          v-else
          type="text"
          id="recovery_code"
          v-model="recovery_code"
          class="two-factor__input"
          @input="validateCode"
          required
        />
        <button type="button" class="two-factor__toggle" @click="toggleRecoveryCodeInput">
          <span v-if="!showRecoveryCodeInput">Использовать код восстановления</span>
          <span v-else>Использовать код аутентификации</span>
        </button>
      </div>
      <div v-if="twofactorError" class="two-factor__error">{{ twofactorError }}</div>
      <div v-if="twofactorStatus" class="two-factor__status">{{ twofactorStatus }}</div>
      <button type="submit" class="two-factor__button" :disabled="isFormInvalid">Подтвердить</button>
    </form>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'

const code = ref('')
const recovery_code = ref('')
const authStore = useAuthStore()
const router = useRouter()
const showRecoveryCodeInput = ref(false)
const twofactorError = ref('')
const twofactorStatus = ref('')

const verifyCode = async () => {
  twofactorError.value = ''
  twofactorStatus.value = ''
  
  if (isFormInvalid.value) {
    event.preventDefault()
    return
  }

  try {
    const response = await authStore.verifyTwoFactorCode(
      !showRecoveryCodeInput.value ? { code: code.value } : { recovery_code: recovery_code.value }
    )
    
    if (response.status === 204) {
      twofactorStatus.value = 'Ваш код был успешно подтвержден. Вы будете перенаправлены на главную страницу.'
      setTimeout(async () => {
        await router.push({ name: 'UserProfile' })
      }, 1500)
    }
  } catch (error) {
    console.error('Failed to verify two-factor code:', error)
    const errors = error.response?.data?.errors
    if (errors) {
      if (errors.code) {
        twofactorError.value = errors.code[0]
      }
      if (errors.recovery_code) {
        twofactorError.value = errors.recovery_code[0]
      }
    } else {
      twofactorError.value = 'Произошла ошибка при проверке кода.'
    }
  }
}

const toggleRecoveryCodeInput = () => {
  twofactorError.value = ''
  showRecoveryCodeInput.value = !showRecoveryCodeInput.value
}

const isFormInvalid = computed(() => {
  if (!showRecoveryCodeInput.value) {
    return code.value.length < 4
  }
  return recovery_code.value.length < 4
})

const validateCode = () => {
  if (!showRecoveryCodeInput.value) {
    if (code.value.length < 4) {
      twofactorError.value = 'Код должен содержать не менее 4 символов в длину'
    } else {
      twofactorError.value = ''
    }
  } else {
    if (recovery_code.value.length < 4) {
      twofactorError.value = 'Код восстановления должен содержать не менее 4 символов в длину'
    } else {
      twofactorError.value = ''
    }
  }
}
</script>

<style scoped lang="scss">
.two-factor {
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
    text-align: center;
    font: 1em sans-serif;
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
   // position: absolute;
    right: 10px;
    top: 50%;
   // transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    font: 0.9em sans-serif;
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
