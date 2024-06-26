<template>
    <div class="two-factor-auth-disable">
        <h2 class="two-factor-auth-disable__title">Отключить двухфакторную аутентификацию</h2>
        <p class="two-factor-auth-disable__status-message" v-if="statusmessage">{{ statusmessage }}</p>
        <button @click="sendDisableCode" v-if="sendoff2FA" class="two-factor-auth-disable__button">Отключить</button>

        <div v-if="showVerification" class="two-factor-auth-disable__verification">
            <form @submit.prevent="verifyDisableCode" class="two-factor-auth-disable__form">
                <div class="two-factor-auth-disable__form-group">
                    <label for="password" class="two-factor-auth-disable__label">Пароль</label>
                    <input type="password" id="password" v-model="password" class="two-factor-auth-disable__input"
                        required />
                </div>
                <div class="two-factor-auth-disable__form-group">
                    <label for="code" class="two-factor-auth-disable__label">Код подтверждения</label>
                    <input type="text" id="code" v-model="code" class="two-factor-auth-disable__input" required />
                </div>
                <p class="two-factor-auth-disable__status-message" v-if="verifycodestatus">{{ verifycodestatus }}</p>
                <div v-if="errorMessage" class="two-factor-auth-disable__error">{{ errorMessage }}</div>
                <button type="submit" class="two-factor-auth-disable__button" :disabled="disableButton">Подтвердить</button>
             <button type="button" @click="sendDisableCode" class="two-factor-auth-disable__resend">Отправить код повторно</button>
        
            </form>
            </div>
    </div>
</template>

<script setup>
    import { ref, computed } from 'vue';
    import axios from 'axios';
    import { useAuthStore } from '@/stores/auth';
    const authStore = useAuthStore();

    const password = ref('');
    const code = ref('');
    const showVerification = ref(false);
    const errorMessage = ref('');
    const statusmessage = ref('');
    const sendoff2FA = ref(true);
    const verifycodestatus = ref('');

    const disableButton = computed(() => {
        return (!code.value|| !password.value ) ;
    });

    const sendDisableCode = async () => {
        statusmessage.value = 'Отправка кода...';
        errorMessage.value = '';
        try {
           const response = await axios.post('/user/two-factor/send-confirmation-code');
            showVerification.value = true;
            errorMessage.value = '';
            statusmessage.value = response.data.message;
            sendoff2FA.value = false;
        } catch (error) {
            statusmessage.value = '';
            errorMessage.value = error.response.data.error || Object.values(error.response.data.errors).join(' ') || 'Ошибка при отправке кода';
        }
    };

    const verifyDisableCode = async () => {
        if(!password.value || !code.value){
            return;
        }
        errorMessage.value = '';
        verifycodestatus.value = 'Подтверждение кода...';
        try {
          const response =   await axios.delete('/user/two-factor-authentication', {
                data: {
                    password: password.value,
                    confirmation_code: code.value
                }
            });
            verifycodestatus.value = response.data.message;
            setTimeout(() => {
                showVerification.value = false;
                authStore.user.two_factor = false;
            },1500)
            password.value = '';
            code.value = '';
        } catch (error) {
            verifycodestatus.value = '';
            errorMessage.value = error.response.data.error || 
            Object.values(error.response.data.errors).join(' ') || 'Ошибка при подтверждении кода';
        }
    };
</script>

<style scoped>
    .two-factor-auth-disable{
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        padding: 20px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .two-factor-auth-disable__title {
        font-size: 1.5em;
        margin-bottom: 5px;
        color: #2c3e50;
        text-align: center;
    }

    .two-factor-auth-disable__button,
    .two-factor-auth-disable__resend {
        padding: 10px 20px;
        font-size: 1.2em;
        color: white;
        background-color: #e74c3c;
        border: none;
        border-radius: 5px;
        margin-top: 5px;
        cursor: pointer;
    }

    .two-factor-auth-disable__button-close {
        padding: 10px 20px;
        font-size: 1.2em;
        color: white;
        background-color: #c74a34ec;
        border: none;
        border-radius: 5px;
        margin-top: 5px;
        cursor: pointer;
    }

    .two-factor-auth-disable__button:hover,
    .two-factor-auth-disable__resend:hover {
        background-color:  #c0392b;
    }

    .two-factor-auth-disable__button:disabled{
        background-color: #ccc;
    }

    .two-factor-auth-disable__form {
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 100%;
        max-width: 450px;
        margin-top: 5px;
    }

    .two-factor-auth-disable__form-group {
        display: flex;
        flex-direction: column;
    }

    .two-factor-auth-disable__label {
        margin-bottom: 5px;
        color: #8e8edd;
    }

    .two-factor-auth-disable__input {
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        width: 100%;
    }

    .two-factor-auth-disable__error {
        color: red;
        font-size: 0.9em;
        text-align: center;
        margin-top: 5px;
    }

    .two-factor-auth-disable__qrcode {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .two-factor-auth-disable__qr {
        /*   margin: 20px 0; */
    }

    .two-factor-auth-disable__url {
        text-align: center;
        color: #2c3e50;
        font-size: 1em;
    }

    .two-factor-auth-disable__subtitle {
        font-size: 1.5em;
        margin-bottom: 5px;
        color: #2c3e50;
        text-align: center;
    }

    .two-factor-auth-disable__status-message {
        color: #2c3e50;
        font-size: 0.8em;
        text-align: center;
        transition: all 0.3s ease 0s;
    }

    .two-factor-auth-disable__recovery-codes {
        color: #2c3e50;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;

    }
</style>