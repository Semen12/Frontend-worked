<template>
    <div class="master-password-update">
        <h1 class="master-password-update__title">Обновление мастер-пароля</h1>
        <form class="master-password-update__form" @submit.prevent="updateMasterPassword">
            <div class="master-password-update__form-group">
                <label for="master_password" class="master-password-update__label">Текущий мастер-пароль</label>
                <div class="master-password-update__input-container">
                    <input :type="showCurrentMasterPassword ? 'text' : 'password'" id="master_password"
                        v-model="master_password" class="master-password-update__input" required />
                    <button type="button" @click="toggleShowCurrentMasterPassword"
                        class="master-password-update__toggle">
                        {{ showCurrentMasterPassword ? 'Скрыть' : 'Показать' }}
                    </button>
                </div>
                <div v-if="passwordError" class="master-password-update__error">{{ passwordError }}</div>
            </div>

            <div class="master-password-update__form-group">
                <label for="new_master_password" class="master-password-update__label">Новый мастер-пароль</label>
                <div class="master-password-update__input-container">
                    <input :type="showNewMasterPassword ? 'text' : 'password'" id="new_master_password"
                        v-model="new_master_password" class="master-password-update__input" @input="validatePassword"
                        required />
                    <button type="button" @click="toggleShowNewMasterPassword" class="master-password-update__toggle">
                        {{ showNewMasterPassword ? 'Скрыть' : 'Показать' }}
                    </button>
                </div>
                <div v-if="passwordErrorTwo" class="master-password-update__error">{{ passwordErrorTwo }}</div>
            </div>

            <div class="master-password-update__form-group">
                <label for="master_password_confirmation" class="master-password-update__label">Подтвердите новый
                    мастер-пароль</label>
                <div class="master-password-update__input-container">
                    <input :type="showConfirmPassword ? 'text' : 'password'" id="master_password_confirmation"
                        v-model="master_password_confirmation" class="master-password-update__input"
                        @input="validatePasswordConfirm" required />
                    <button type="button" @click="toggleShowConfirmPassword" class="master-password-update__toggle">
                        {{ showConfirmPassword ? 'Скрыть' : 'Показать' }}
                    </button>
                </div>
                <div v-if="passwordErrorThree" class="master-password-update__error">{{ passwordErrorThree }}</div>
            </div>
            <p class="master-password-update__status-message" v-if="status_password_update">{{ status_password_update }}</p>
            <button class="master-password-update__button" type="submit" :disabled="isFormInvalid">Обновить
                мастер-пароль</button>
        </form>
    </div>
</template>

<script setup>
    import { ref } from 'vue';
    import axios from 'axios';

    const master_password = ref('');
    const new_master_password = ref('');
    const master_password_confirmation = ref('');
    const status_password_update = ref('');
    const showCurrentMasterPassword = ref(false);
    const showNewMasterPassword = ref(false);
    const showConfirmPassword = ref(false);
    const passwordError = ref('');
    const passwordErrorTwo = ref('');
    const passwordErrorThree = ref('');
    const updateMasterPassword = async () => {
        passwordError.value = '';
        passwordErrorTwo.value = '';
        passwordErrorThree.value = '';
        status_password_update.value = 'Обновляем...';
        try {
            const response = await axios.patch('/user/update-master-password', {
                master_password: master_password.value,
                new_master_password: new_master_password.value,
                new_master_password_confirmation: new_master_password.value,
            });
            setTimeout(() => {
                status_password_update.value = '';
            },850)
            status_password_update.value = response.data.message;
            master_password.value = '';
            new_master_password.value = '';
            master_password_confirmation.value = '';
        } catch (error) {
            const errors = error.response.data.errors;
            if (errors.master_password) {
                passwordError.value = errors.master_password.join(' ');
            }
            if (errors.new_master_password) {
                passwordErrorTwo.value = errors.new_master_password.join(' ');
            }
            if (errors.master_password_confirmation) {
                passwordErrorThree.value = errors.master_password_confirmation.join(' ');
            }
        }
    };

    const toggleShowCurrentMasterPassword = () => {
        showCurrentMasterPassword.value = !showCurrentMasterPassword.value;
    };

    const toggleShowNewMasterPassword = () => {
        showNewMasterPassword.value = !showNewMasterPassword.value;
    };

    const toggleShowConfirmPassword = () => {
        showConfirmPassword.value = !showConfirmPassword.value;
    };

    const validatePassword = () => {
        const passwordValue = new_master_password.value;
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
            passwordErrorTwo.value =
                'Пароль должен иметь длину не менее 6 символов, содержать хотя бы одну цифру, один специальный символ (!@#$%^&*(),.?":{}|<>_-`~), одну строчную и одну заглавную букву.';
        } else {
            passwordErrorTwo.value = '';
        }
    };

    const validatePasswordConfirm = () => {
        if (new_master_password.value !== master_password_confirmation.value) {
            passwordErrorThree.value = 'Пароли не совпадают!';
        } else {
            passwordErrorThree.value = '';
        }
    };
/* 
    const isFormInvalid = computed(() => {
        return (
            !master_password.value ||
            !new_master_password.value ||
            !master_password_confirmation.value
        );
    }); */
</script>

<style lang="scss" scoped>
.master-password-update {
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