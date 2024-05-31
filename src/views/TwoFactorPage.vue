<template>
  <div class="two-factor">
    <h1 class="two-factor__title">Двухфакторная аутентификация</h1>
    <form class="two-factor__form" @submit.prevent="verifyCode">
      <div class="two-factor__form-group">
        <label for="code" class="two-factor__label"
          >Введите код <span v-if="!showRecoveryCodeInput"> аутентификации из приложения </span>
          <span v-else>восстановления </span></label
        >
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
          <span v-else>Использовать код аутентификации </span>
        </button>
        
      </div>
      <div v-if="twofactorError" class="two-factor__error">{{ twofactorError }}</div>
      <div v-if="twofactorStatus" class="two-factor__status">{{ twofactorStatus }}</div>
      <button type="submit" class="two-factor__button" :disabled="isFormInvalid">
        Подтвердить
      </button>
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
   if(isFormInvalid.value) {
    event.preventDefault()
    return
  } 
  try {
   const response = await authStore.verifyTwoFactorCode(
      !showRecoveryCodeInput.value ? { code: code.value } : { recovery_code: recovery_code.value }
    )
    
    if(response.status === 204) {
      twofactorStatus.value = 'Ваш код был успешно подтвержден. Вы будете перенаправлены на главную страницу.'
      setTimeout(async () => {
        await router.push({ name: 'Home' })
      },1500)
    }
  } catch (error) {
     console.error('Failed to verify two-factor code:', error)
    const errors = error.response.data.errors
    
   if(errors.code){
      twofactorError.value = errors.code[0]
   }
   if(errors.recovery_code){
     twofactorError.value = errors.recovery_code[0]
   }
  }

}



const toggleRecoveryCodeInput = () => {
  showRecoveryCodeInput.value = !showRecoveryCodeInput.value
}


 const isFormInvalid = computed(() => {
  if (!showRecoveryCodeInput.value) {
    return code.value.length < 4
  }
  if (showRecoveryCodeInput.value) {
    return recovery_code.value.length < 4
  }
  return (!code.value || !recovery_code.value )
}); 

const validateCode = () => {
  if (!showRecoveryCodeInput.value) {
    if (code.value.length < 4) {
      twofactorError.value = 'Код должен содержать не менее 4 символов в длину'
      isFormInvalid.value = false
    } else {
      twofactorError.value = ''
    }
  } else {
    if (recovery_code.value.length < 6) {
      twofactorError.value = 'Код востановления должен содержать не менее 4 символов в длину'
      isFormInvalid.value = false
    } else {
      twofactorError.value = ''
    }
  }
}

</script>

<style scoped>
.two-factor {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f9f9f9;
}

.two-factor__title {
  font-size: 2em;
  margin-bottom: 20px;
  color: #2c3e50;
  text-align: center;
}

.two-factor__form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.two-factor__form-group {
  display: flex;
  flex-direction: column;
}

.two-factor__label {
  margin-bottom: 5px;
  color: #8e8edd;
  text-align: center;
}

.two-factor__input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.two-factor__button {
  padding: 10px 20px;
  font-size: 1.2em;
  color: white;
  background-color: #42b983;
  border: none;
  border-radius: 5px;
}
.two-factor__button:hover {
  background-color: #369870;
}
.two-factor__button:disabled {
  background-color: #cccccc;
}
.two-factor__toggle {
  background: none;
  border: none;
  cursor: pointer;
  color: #42b983;
}
.two-factor__error {
  color: red;
  font-size: 0.9em;
  text-align: center;
}
.two-factor__status {
  color: green;
  font-size: 0.9em;
  text-align: center;
}
</style>
