<template>
    <div class="master-password-reset">
        <h1 class="master-password-reset__title">Сброс мастер-пароля</h1>
        <form class="master-password-reset__form" @submit.prevent="resetMasterPassword">
            <div class="master-password-reset__form-group">
                <label for="master_password" class="master-password-reset__label">Новый мастер-пароль</label>
                <div class="master-password-reset__input-container">
                    <input :type="showMasterPassword ? 'text' : 'password'" @input="validateMasterPassword"
                        id="master_password" v-model="masterPassword" class="master-password-reset__input" required />
                    <button type="button" @click="toggleShowMasterPassword" class="master-password-reset__toggle">
                        {{ showMasterPassword ? 'Скрыть' : 'Показать' }}
                    </button>
                </div>
                <div v-if="masterPasswordError" class="master-password-reset__error">{{ masterPasswordError }}</div>
            </div>
            <div class="master-password-reset__form-group">
                <label for="master_password_confirmation" class="master-password-reset__label">Подтвердите новый
                    мастер-пароль</label>
                <div class="master-password-reset__input-container">
                    <input :type="showConfirmMasterPassword ? 'text' : 'password'"
                        @input="validateMasterPasswordConfirm" id="master_password_confirmation"
                        v-model="masterPasswordConfirmation" class="master-password-reset__input" required />
                    <button type="button" @click="toggleShowConfirmMasterPassword"
                        class="master-password-reset__toggle">
                        {{ showConfirmMasterPassword ? 'Скрыть' : 'Показать' }}
                    </button>
                </div>
                <div v-if="masterPasswordErrorTwo" class="master-password-reset__error">{{ masterPasswordErrorTwo }}
                </div>
            </div>
            <div v-if="requires2FA" class="master-password-reset__form-group">
                <label for="auth_code" class="master-password-reset__label">Введите код аутентификации или
                    восстановления</label>
                <input type="text" id="auth_code" v-model="authCode" class="master-password-reset__input" required />
                <div v-if="TwoFactorReset" class="master-password-reset__error">{{ TwoFactorReset }}</div>
            </div>
            <div v-if="status" class="master-password-reset__status">{{ status }}</div>
            <button class="master-password-reset__button" :disabled="isFormInvalid">Сбросить мастер-пароль</button>
        </form>

    </div>
</template>

<script setup>
    import { ref, onMounted, computed, onBeforeMount } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import axios from 'axios'
    import { useAuthStore } from '@/stores/auth.js'

    const route = useRoute()
    const router = useRouter()



    const masterPassword = ref('')
    const masterPasswordConfirmation = ref('')
    const authCode = ref('')
    const status = ref('')
    const masterPasswordError = ref('')
    const masterPasswordErrorTwo = ref('')
    const resetError = ref('')
    const TwoFactorReset = ref('')
    const requires2FA =  computed(() => authStore.user?.two_factor ?? false);
  

    const authStore = useAuthStore()

    onBeforeMount(async () => {
        const expires = route.query.expires || ''
        const userId = route.query.id || ''
        const token = route.query.token || ''
        const signature = route.query.signature || ''
        if (!userId || !token || !expires || !signature) {
            router.push({ name: 'Home' })
        }

        if(!requires2FA.value){
             try {
            const response = await authStore.fetchUser();
            requires2FA.value = response.data.user.two_factor
        } catch (error) {
            console.error('Ошибка при проверке 2FA:', error)
        }
        }
       
    })

    const resetMasterPassword = async () => {
        masterPasswordError.value = ''
        masterPasswordErrorTwo.value = ''

        status.value = 'Проверяем...'
        if (isFormInvalid.value) {
            event.preventDefault()
            return
        }
        try {
            const expires = route.query.expires,
                id = route.query.id,
                token = route.query.token,
                signature = route.query.signature;
            const response = await axios.post('/user/reset-master-password', {
                master_password: masterPassword.value,
                master_password_confirmation: masterPasswordConfirmation.value,
                auth_code: requires2FA.value ? authCode.value : undefined
            },{ params: {
                expires,id,token,signature
            }});

            if (response.status === 200) {
                status.value = response.data.message
                // Добавляем задержку перед перенаправлением на страницу логина
                setTimeout(async () => {
                    await router.push({ name: 'Home' })
                }, 1500) // Задержка в 1.5 секунды
            }

        } catch (error) {
            status.value = ''
            console.error('Ошибка при сбросе мастер-пароля:', error)
            const errors = error.response.data.errors
            if (error.response.data.status === 403) {
                status.value = 'Ссылка для сброса мастер-пароля недейсвительна. Пожалуйста, запросите ссылку повторно.'
            }
            if (errors.master_password) {
                masterPasswordError.value = Object.values(errors.master_password).join(' ')
            }
            if (errors.master_password_confirmation) {
                masterPasswordErrorTwo.value = Object.values(errors.master_password_confirmation).join(' ')
            }
            if (errors.auth_code) {
                TwoFactorReset.value = Object.values(errors.auth_code).join(' ')
            } 
             if (error.response.data.error) {
                status.value = errors.response.data.error || ''
            }
                
            
        }
    }

    const showMasterPassword = ref(false)
    const toggleShowMasterPassword = () => {
        showMasterPassword.value = !showMasterPassword.value
    }

    const showConfirmMasterPassword = ref(false)
    const toggleShowConfirmMasterPassword = () => {
        showConfirmMasterPassword.value = !showConfirmMasterPassword.value
    }

    const validateMasterPassword = () => {
        const masterPasswordValue = masterPassword.value
        const minLength = 6
        const hasNumber = /\d/
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>_-`~]/
        const hasUpperCase = /[A-ZА-ЯЁ]/
        const hasLowerCase = /[a-zа-яё]/

        if (
            masterPasswordValue.length < minLength ||
            !hasNumber.test(masterPasswordValue) ||
            !hasSpecialChar.test(masterPasswordValue) ||
            !hasUpperCase.test(masterPasswordValue) ||
            !hasLowerCase.test(masterPasswordValue)
        ) {
            masterPasswordError.value =
                'Пароль должен иметь длину не менее 6 символов, содержать хотя бы одну цифру, один специальный символ (!@#$%^&*(),.?":{}|<>_-`~), одну строчную и одну заглавную букву.'
        } else {
            masterPasswordError.value = ''
        }
    }

    const validateMasterPasswordConfirm = () => {
        if (masterPassword.value !== masterPasswordConfirmation.value) {
            masterPasswordErrorTwo.value = 'Пароли не совпадают!'
        } else {
            masterPasswordErrorTwo.value = ''
        }
    }

    const isFormInvalid = computed(() => {
        return (
            !masterPassword.value ||
            !masterPasswordConfirmation.value ||
            (requires2FA.value && !authCode.value)

        )
    })
</script>

<style scoped lang="scss">
    .master-password-reset {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        width: 100%;
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
            background-color: #ffffff;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        &__form-group {
            display: flex;
            flex-direction: column;
            margin-bottom: 5px;
        }

        &__label {
            margin-bottom: 5px;
            color: #8e8edd;
        }

        &__input-container {
            display: flex;
            align-items: center;
            position: relative;
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

            font-size: 1rem;

            color: #2c3e50;

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