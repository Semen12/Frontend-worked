<template>
    <div class="delete-account">
        <h2 class="delete-account__title">Удаление аккаунта</h2>
        <p class="delete-account__title-sub">Удалятся все данные, связанные с вашим аккаунтом. <br> Восстановить доступ
            к аккаунту будет невозможно.</p>
        <div v-if="showAlert" class="delete-account__alert delete-account__alert--warning">
            {{ alertMessage }}
        </div>
        <div v-if="emailVerified && !codeSent" class="delete-account__send-code">
            <button @click="sendDeleteCode" class="delete-account__btn delete-account__btn--primary">Отправить код
                подтверждения на почту</button>
        </div>
        
        <div v-if="emailVerified && codeSent" class="delete-account__form">
            <div class="delete-account__form-group">
                <label for="password" class="delete-account__label">Пароль</label>
                <div class="delete-account__input-container">
                    <input :type="showPassword ? 'text' : 'password'" id="password" v-model="password"
                        class="delete-account__input" required />
                    <button type="button" @click="toggleShowPassword" class="delete-account__toggle">
                        {{ showPassword ? 'Скрыть' : 'Показать' }}
                    </button>
                </div>
            </div>

            <div class="delete-account__form-group">
                <label for="confirmationCode" class="delete-account__label">Код подтверждения</label>
                <input type="text" id="confirmationCode" v-model="confirmationCode" class="delete-account__input" />
            </div>

            <div class="delete-account__form-group">

                <button @click="sendDeleteCode" class="delete-account__btn delete-account__btn--primary">Отправить код
                    повторно</button>
                <button @click="deleteAccount" class="delete-account__btn delete-account__btn--danger">Удалить
                    аккаунт</button>
            </div>

        </div>

        <div v-if="!emailVerified" class="delete-account__form">
            <div class="delete-account__form-group">
                <label for="password" class="delete-account__label">Пароль</label>
                <div class="delete-account__input-container">
                    <input :type="showPassword ? 'text' : 'password'" id="password" v-model="password"
                        class="delete-account__input" required />
                    <button type="button" @click="toggleShowPassword" class="delete-account__toggle">
                        {{ showPassword ? 'Скрыть' : 'Показать' }}
                    </button>
                </div>

            </div>

            <button @click="deleteAccount" class="delete-account__btn delete-account__btn--danger">Удалить аккаунт</button>
        </div>


    </div>
</template>

<script setup>
    import { ref, computed } from 'vue';
    import axios from 'axios';
    import { useAuthStore } from '@/stores/auth';
    import { useRouter } from 'vue-router'
    const router = useRouter()

    const authStore = useAuthStore();
    const codeSent = ref(false);
    const password = ref('');
    const confirmationCode = ref('');
    const showAlert = ref(false);
    const alertMessage = ref('');
    const showPassword = ref(false)

    // Проверяем статус подтверждения почты при загрузке компонента
    const emailVerified = computed(() => authStore.user?.email_verified ?? false);

    const toggleShowPassword = () => {
        showPassword.value = !showPassword.value
    }
   

    const sendDeleteCode = async () => {
        showAlert.value = true;
        alertMessage.value = 'Отправка кода...';
        try {
            const response = await axios.post('/user/send-delete-code');
            codeSent.value = true;
            alertMessage.value = response.data.message;
        } catch (error) {
            console.error('Ошибка отправки кода подтверждения:', error);
            showAlert.value = true;
            alertMessage.value = 'Ошибка отправки кода подтверждения';
        }
    };

    const deleteAccount = async () => {
        if(!password.value || (emailVerified.value && !confirmationCode.value)) {
            alertMessage.value = 'Заполните все обязательные поля';
            return
        }
        showAlert.value = true;
        alertMessage.value = 'Удаление аккаунта...';
        try {
            const payload = {
                password: password.value,
            };

            if (emailVerified.value) {
                payload.confirmation_code = confirmationCode.value;
            }

            const response = await axios.delete('/user/destroy', { data: payload });
            alertMessage.value = response.data.message;
            setTimeout(() => {
                router.push({ name: 'Login' });
            }, 1000)
        } catch (error) {
            console.error('Ошибка удаления аккаунта:', error);
            showAlert.value = true;
            alertMessage.value = error.response.data.error || Object.values(error.response.data.errors).join(' ') || 'Произошла ошибка при удалении аккаунта';
        }
    };




</script>

<style scoped lang="scss">
    .delete-account {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        padding: 20px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);


        &__title {
            font-size: 1.7em;
            margin-bottom: 5px;
            color: #c0392b;
            text-align: center;

            &-sub {
                font-size: 1.2em;
                margin-bottom: 5px;
                color: #2c3e50;
                text-align: center;
            }
        }

        &__form {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
            width: 100%;
            margin-top: 10px;
        }

        &__form-group {
            //margin-bottom: 5px;
            width: 100%;

            & .delete-account__label {
                margin-bottom: 5px;
                color: #8e8edd;

                display: block;
                font-size: 1em;

            }

            & .delete-account__input {
                width: 100%;
                padding: 10px;
                font-size: 1em;
                border: 1px solid #ccc;
                border-radius: 5px;
            }

            &:nth-child(3) {
                display: flex;
                gap: 10px;
                justify-content: center;
                align-items: center;
            }

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

        &__btn {
            padding: 10px 20px;
            font-size: 1em;
            color: white;
            background-color: #42b983;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            align-self: flex-end;

            padding: 10px 20px;
            font-size: 1em;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            text-align: center;
            margin-bottom: 10px;

            &--primary {
                background-color: #3498db;
                color: #fff;
                margin-top: 7px;

                &:hover {
                    background-color: #2980b9;
                }
            }

            &--danger {
                background-color: #e74c3c;
                color: #fff;

                &:hover {
                    background-color: #c0392b;
                }

                &:disabled {
                    background-color: #ccc;
                }
            }
        }

        &__alert {
            margin-top: 20px;
            padding: 15px;
            border-radius: 5px;
            font-size: 1em;

            &--warning {
                background-color: #f39c12;
                color: #fff;
            }
        }
    }
</style>