<template>
    <div class="two-factor-auth-enable">
        <h2 class="two-factor-auth-enable__title">Двухфакторная аутентификация</h2>
        <p class="two-factor-auth-enable__status-message" v-if="statusmessage">{{ statusmessage }}</p>
        <button @click="sendEnableCode" class="two-factor-auth-enable__button" v-if="on2FA">Включить</button>

        <div v-if="showVerification" class="two-factor-auth-enable__verification">
            <form @submit.prevent="verifyEnableCode" class="two-factor-auth-enable__form">
                <div class="two-factor-auth-enable__form-group">
                    <label for="password" class="two-factor-auth-enable__label">Пароль от учётной записи</label>
                    <input type="password" id="password" v-model="password" class="two-factor-auth-enable__input"
                        required />
                </div>
                <div class="two-factor-auth-enable__form-group">
                    <label for="code" class="two-factor-auth-enable__label">Код подтверждения</label>
                    <input type="text" id="code" v-model="code" class="two-factor-auth-enable__input"  required />
                </div>
                <p class="two-factor-auth-enable__status-message" v-if="verifycodestatus">{{ verifycodestatus }}</p>
                <div v-if="errorMessage" class="two-factor-auth-enable__error">{{ errorMessage }}</div>

                <button type="submit" class="two-factor-auth-enable__button" :disabled="disableButton">Подтвердить</button>
                <button type="button" @click="sendEnableCode" class="two-factor-auth-enable__resend">Отправить код
                    повторно</button>
            </form>

        </div>

        <div v-if="showQRCode" class="two-factor-auth-enable__qrcode">
            <h3 class="two-factor-auth-enable__subtitle">Сканируйте QR-код</h3>
            <div v-html="qrCodeSvg" class="two-factor-auth-enable__qr"></div>
            <div class="two-factor-auth-enable__url">{{ url }}</div>

            <form @submit.prevent="confirm2FA" class="two-factor-auth-enable__form">
                <div class="two-factor-auth-enable__form-group">
                    <label for="authCode" class="two-factor-auth-enable__label">Код из приложения (Я.Ключ, Google
                        Authenticator и др.)</label>
                    <input type="text" id="authCode" v-model="authCode" class="two-factor-auth-enable__input"
                        required @input="validateAuthCode"/>
                </div>
                <p class="two-factor-auth-enable__status-message" v-if="verify2fa">{{ verify2fa }}</p>
                <button type="submit" class="two-factor-auth-enable__button" :disabled="disableButtonon2FA">Подтвердить</button>
            </form>
        </div>
        <div v-if="showRecoveryCodes" class="two-factor-auth-enable__recovery-codes">
            <h3 class="two-factor-auth-enable__subtitle">Сохраните эти резервные коды в надежном месте</h3>
            <p>Незабудьте сохранить эти коды. Повторная генерация возможна только для новых кодов.</p>
            <ul>
                <li v-for="code in recoveryCodes" :key="code">{{ code }}</li>
            </ul>
            <button @click="closeRecoveryCodes" class="two-factor-auth-enable__button-close">Закрыть</button>
        </div>
    </div>
</template>

<script setup>
    import { ref ,  computed } from 'vue';
    import axios from 'axios';
    import { useAuthStore } from '@/stores/auth';
    const authStore = useAuthStore();

    const password = ref('');
    const code = ref('');
    const authCode = ref('');
    const on2FA = ref(true);
    const showVerification = ref(false);
    const showQRCode = ref(false);
    const qrCodeSvg = ref('');
    const url = ref('');
    const errorMessage = ref('');
    const statusmessage = ref('');
    const verifycodestatus = ref('');
    const verify2fa = ref('');
    const showRecoveryCodes = ref(false);
    const recoveryCodes = ref([]);
    

    const disableButton = computed(() => {
        return (!code.value|| !password.value ) ;
    });

    const disableButtonon2FA = computed(() => {
        return !authCode.value; 
    });
    const sendEnableCode = async () => {
        
        statusmessage.value = 'Отправка кода...';
        errorMessage.value = '';
        try {
            const respons = await axios.post('/user/two-factor/send-enable-code');

            errorMessage.value = '';
            setTimeout(() => {
                statusmessage.value = respons.data.message;
                showVerification.value = true;
                on2FA.value = false;
            }, 1350)

        } catch (error) {
            statusmessage.value = '';
            errorMessage.value = error.response.data.error || Object.values(error.response.data.errors).join(' ') || 'Ошибка при отправке кода';
        }
    };

    const verifyEnableCode = async () => {
            if(!password.value || !code.value){
                return;
            };  
        errorMessage.value = '';
        verifycodestatus.value = 'Подтверждение кода...';
        try {
            const res = await axios.post('/user/two-factor-authentication', {
                password: password.value,
                code: code.value
            });
            verifycodestatus.value = res.data.message;
        if (res.status === 200) {
            try {
        const respons = await axios.post('/user/confirm-password', { password: password.value });
        if (respons.status === 201) {
            try {
                verifycodestatus.value = 'Пароль подтверждён...';
                const response = await axios.get('/user/two-factor-qr-code');
                qrCodeSvg.value = response.data.svg;
                const urlres = response.data.url;
                const urlObject = new URL(urlres.replace("otpauth://totp/", "http://dummy/"));
                const searchParams = new URLSearchParams(urlObject.search);
                url.value = 'Или введите код в приложении в ручную: ' + searchParams.get('secret');
                showQRCode.value = true;
                showVerification.value = false;
                statusmessage.value = '';
                errorMessage.value = '';
            } catch (error) {
                errorMessage.value = error.response.data.error || 
                Object.values(error.response.data.errors).join(' ');
            }
        }
            } catch (error) {
                errorMessage.value = error.response.data.error || 
                Object.values(error.response.data.errors).join(' ') || 'Ошибка подтверждения ...';
            }
        }
        } catch (error) {
            console.log(error);
            verifycodestatus.value = '';
            errorMessage.value = error.response.data.error || 
            Object.values(error.response.data.errors).join(' ') || 'Ошибка подтверждения кода';
        }
    };

    const fetchRecoveryCodes = async () => {
        try {
            const response = await axios.get('/user/two-factor-recovery-codes');
            if (response.status === 200) {

                recoveryCodes.value = response.data;
                showRecoveryCodes.value = true;
            }
        } catch (error) {
            errorMessage.value = 'Ошибка получения резервных кодов';
        }
    };
    const confirm2FA = async () => {
        verify2fa.value = 'Проверка кода утентификации...';
        try {
            await axios.post('/user/confirmed-two-factor-authentication', { code: authCode.value });

            verify2fa.value = 'Двухфакторная аутентификация подтверждена и включена. Заправшиваем коды восстановения...';
             await fetchRecoveryCodes();
                showQRCode.value = false;
                authCode.value = '';
                         
           
        } catch (error) {
            verify2fa.value = error.response.data.error || Object.values(error.response.data.errors).join(' ') || 'Ошибка подтверждения кода';
        }
    };
    const closeRecoveryCodes = async () => {
        authStore.user.two_factor = true;
        showRecoveryCodes.value = false;
    };
</script>

<style scoped>
    .two-factor-auth-enable {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        padding: 20px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .two-factor-auth-enable__title {
        font-size: 1.5em;
        margin-bottom: 5px;
        color: #2c3e50;
        text-align: center;
    }

    .two-factor-auth-enable__button,
    .two-factor-auth-enable__resend {
        padding: 10px 20px;
        font-size: 1.2em;
        color: white;
        background-color: #42b983;
        border: none;
        border-radius: 5px;
        margin-top: 5px;
        cursor: pointer;
    }

    .two-factor-auth-enable__button-close {
        padding: 10px 20px;
        font-size: 1.2em;
        color: white;
        background-color: #c74a34ec;
        border: none;
        border-radius: 5px;
        margin-top: 5px;
        cursor: pointer;
    }
    .two-factor-auth-enable__button:hover,
    .two-factor-auth-enable__resend:hover {
        background-color: #369870;
    }
    .two-factor-auth-enable__button:disabled{
        background-color: #ccc;
    }
    

    .two-factor-auth-enable__button-close:hover {
        background-color: #c74a34ec;
    }

    .two-factor-auth-enable__form {
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 100%;
        max-width: 450px;
        margin-top: 20px;
    }

    .two-factor-auth-enable__form-group {
        display: flex;
        flex-direction: column;
    }

    .two-factor-auth-enable__label {
        margin-bottom: 5px;
        color: #8e8edd;
    }

    .two-factor-auth-enable__input {
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        width: 100%;
    }

    .two-factor-auth-enable__error {
        color: red;
        font-size: 0.9em;
        text-align: center;
        margin-top: 5px;
    }

    .two-factor-auth-enable__qrcode {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .two-factor-auth-enable__qr {
        /*   margin: 20px 0; */
    }

    .two-factor-auth-enable__url {
        text-align: center;
        color: #2c3e50;
        font-size: 1em;
    }

    .two-factor-auth-enable__subtitle {
        font-size: 1.5em;
        margin-bottom: 5px;
        color: #2c3e50;
        text-align: center;
    }

    .two-factor-auth-enable__status-message {
        color: #2c3e50;
        font-size: 0.8em;
        text-align: center;
        transition: all 0.3s ease 0s;
    }

    .two-factor-auth-enable__recovery-codes {
        color: #2c3e50;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;

    }
</style>