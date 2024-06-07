<template>
    <div class="master-password-modal">
        <div class="master-password-modal__overlay" @click="$emit('close')"></div>
        <div class="master-password-modal__content">
            <h3 class="master-password-modal__title" v-if="ResetLink">Введите мастер-пароль</h3>
            <form @submit.prevent="submitMasterPassword" v-if="ResetLink">
                <label class="master-password-modal__label">
                    Мастер-пароль
                    <div class="master-password-modal__input-container">
                        <input :type="showPassword ? 'text' : 'password'" id="password" v-model="masterPassword"
                            class="master-password-modal__input" />
                        <button type="button" @click="togglePasswordVisibility" class="master-password-modal__toggle">
                            {{ showPassword ? 'Скрыть' : 'Показать' }} пароль
                        </button>
                    </div>
                </label>
                <p class="master-password-modal__status-message" v-if="masterPasswordStatus">{{ masterPasswordStatus }}</p>
                <div class="master-password-modal__actions">
                    
                    <button type="button" @click="$emit('close')" class="master-password-modal__button master-password-modal__button-cancel">Закрыть</button><button type="submit" class="master-password-modal__button">Подтвердить</button>
                </div>
            </form>
            <a class="master-password-modal__reset-link" @click.prevent="openReset" v-if="ResetLink" >Отправить ссылку для сброса мастер-пароля?</a>
           <h3 class=master-password-modal__title v-if="!ResetLink">Отправить ссылку для сброса мастер-пароля</h3>
            <form @submit.prevent="sendResetLink" v-if="!ResetLink">
                <label class="master-password-modal__label">
                    Пароль от аккаунта
                    <input type="password" v-model="password" class="master-password-modal__input" required />
                </label>
                <p class="master-password-modal__status-message" v-if="sendLink">{{ sendLink }}</p>
                <div class="master-password-modal__actions"> 
                    <button type="button" @click="openReset" class="master-password-modal__button master-password-modal__button-cancel">Отмена</button>
                    <button type="submit" class="master-password-modal__button">Отправить</button>
                </div>
                
            </form>
        </div>
    </div>
</template>

<script setup>
    import { ref } from 'vue';
    import axios from 'axios';
    import { useMasterPasswordStore } from '@/stores/masterpassword.js';

    const emit = defineEmits(['close', 'master-password-set']);
    const masterPasswordStore = useMasterPasswordStore();
    
    const masterPassword = ref('');
    const password = ref('');
    const showPassword = ref(false);
    const ResetLink = ref(true);
    const masterPasswordStatus = ref('');
    const sendLink = ref('');
    const togglePasswordVisibility = () => {
        showPassword.value = !showPassword.value;
    };
    const openReset = () => {
        ResetLink.value = !ResetLink.value
    }
    const submitMasterPassword = async () => {
        masterPasswordStatus.value = 'Проверяем мастер-пароль...';
        try {
            const response = await axios.post('/set-master-password', { master_password: masterPassword.value });
            if (response.status === 200) {
                masterPasswordStore.setMasterPassword(true, new Date());
                masterPasswordStatus.value = 'Мастер-пароль проверен, открываем учётную запись...';
                setTimeout(() => {
                    emit('master-password-set');
                },300)
                
            } 
        } catch (error) {
            console.error('Error setting master password:', error);
            masterPasswordStatus.value = error.response.data.error ||Object.values(error.response.data.errors).join(' ')|| 'Ошибка при установке мастер-пароля';
        }
    };

    const sendResetLink = async () => {
        sendLink.value = 'Отправляем ссылку для сброса мастер-пароля...';
        try {
            const response = await axios.post('/user/link-master-password', { password: password.value });
            if (response.status === 200) {              
                sendLink.value = response.data.message;
            }
        } catch (error) {
            console.error('Error sending reset link:', error);
            sendLink.value = error.response.data.error ||Object.values(error.response.data.errors).join(' ')|| 'Ошибка при отправке ссылки';
        }
    };
</script>

<style scoped lang="scss">
    .master-password-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;

        &__overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
        }

        &__content {
            position: relative;
            padding: 20px;
            background-color: #fff;
            border-radius: 5px;
            z-index: 1001;
            width: 90%;
            max-width: 400px;
           
        }

        &__title {
            font-size: 1.5em;
            margin-bottom: 10px;
            text-align: center;
            color: #2c3e50;
        }

        &__title-reset {
            font-size: 1.5em;
            margin-top: 20px;
            margin-bottom: 10px;
        }
        &__reset-link {
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            color: #42b983;
            cursor: pointer;
            font: 1em sans-serif;
           // white-space: nowrap;
  //word-break: keep-all;
  margin-top: 7px;

        }
        &__status-message{
             color: #2c3e50;
        }
        &__label {
            display: block;
            margin-bottom: 10px;
            font-weight: bold;
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
            width: 100%;
            padding: 10px;
            margin-top: 5px;
            border: 1px solid #ccc;
            border-radius: 5px;
        }

        &__actions {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
            gap: 10px;
        }


        &__button {
            padding: 10px 20px;
            background-color: #3498db;
            color: #fff;
            border: none;
            border-radius: 5px;
            cursor: pointer;

            &:hover {
                background-color: #2980b9;
            }
            &-cancel {
                background-color: #42426e;
            }
        }
       
    }
</style>