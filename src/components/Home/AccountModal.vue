<template>
    <div class="view-account">
        <div class="view-account__overlay" @click="closeModal">
            <div class="view-account__content" @click.stop>
                <h2 class="view-account__title">Учётная запись</h2>
                <form @submit.prevent="updateAccount" class="view-account__form">

                    <div class="view-account__form-group">
                        <label for="name" class="view-account__label">Тип *</label>
                        <v-select style="color:#2c3e50 ;"
                            :options="accountTypes.map((accountType) => accountType.value)" v-model="accountData.type"
                            id="type" required />
                        <p class="view-account__error" v-if="typeError">{{ typeError }}</p>
                    </div>

                    <div class="view-account__form-group">
                        <label for="name" class="view-account__label">Название *</label>
                        <input type="text" id="name" v-model="accountData.name" class="view-account__input" required />
                        <p class="view-account__error" v-if="nameError">{{ nameError }}</p>
                    </div>

                    <div class="view-account__form-group">
                        <label for="login" class="view-account__label">Логин *</label>
                        <input type="text" id="login" v-model="accountData.login" class="view-account__input"
                            required />
                        <p class="view-account__error" v-if="loginError">{{ loginError }}</p>
                    </div>

                    <div class="view-account__form-group view-account__form-group--password">
                        <label for="password" class="view-account__label">Пароль</label>
                        <div class="view-account__input-container">
                            <input :type="showPassword ? 'text' : 'password'" id="password"
                                v-model="accountData.password" class="view-account__input" :disabled="!canShowPassword"
                                />
                            <button type="button" @click="toggleShowPassword" class="view-account__toggle">
                                {{ showPassword ? 'Скрыть' : 'Показать' }} пароль
                            </button>
                        </div>
                        <p class="view-account__error" v-if="passwordError">{{ passwordError }}</p>
                    </div>
                    <a class="view-account__generate-password-link" @click.prevent="generatePasswordVisible"
                        v-if="genpassword">Хотите сгенирировать надёжный пароль ?</a>
                    <p class="view-account__error" v-if="passwordError">{{ passwordError }}</p>
                    <div class="view-account__generate-password" v-if="!genpassword">
                        <div>
                            <label for="length" class="view-account__label">Длина пароля</label><br />
                            <p>{{ passwordLength }}</p>
                            <input type="range" id="length" min="8" max="16" v-model="passwordLength" />
                        </div>
                        <div class="view-account__generate-password-buttons"><button type="button"
                                @click="generatePasswordVisible"
                                class="view-account__button view-account__generate">Закрыть</button>
                            <button type="button" @click="generatePassword"
                                class=" view-account__button view-account__generate">Сгенерировать пароль
                            </button>
                        </div>
                    </div>
                    <div class="view-account__form-group">
                        <label for="url" class="view-account__label">URL <span
                                v-if="type == 'интернет-ресурс'">*</span></label>
                        <input :type="type == 'интернет-ресурс' ? 'url' : type == 'другое' ? 'text' : 'url'" id="url"
                            :required="type == 'интернет-ресурс'"
                            :placeholder="type == 'другое' ? 'нетипичный вид url' : 'http(s)://example.com'"
                            v-model="accountData.url" class="view-account__input" />
                        <p class="view-account__error" v-if="urlError">{{ urlError }}</p>
                    </div>


                    <div class="view-account__form-group">
                        <label for="description" class="view-account__label">Описание</label>
                        <textarea id="description" v-model="accountData.description"
                            class="view-account__input"></textarea>
                        <p class="view-account__error" v-if="descriptionError">{{ descriptionError }}</p>
                    </div>
                    <p class="view-account__status-message" v-if="status">{{ status }}</p>
                    <p class="view-account__required">* - обязательное поле для заполнения</p>
                    <div class="view-account__actions">
                        <button type="submit" class="view-account__button">Обновить</button>
                        <button type="button" @click="deleteAccount"
                            class="view-account__button view-account__button--delete">
                            Удалить
                        </button>
                        <button type="button" @click="closeModal" class="view-account__button">Закрыть</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { onMounted, onUnmounted, ref, watch } from 'vue';
    import axios from 'axios';
    import { useMasterPasswordStore } from '@/stores/masterpassword.js';

    // Добавьте класс modal-open к body при монтировании компонента
    document.body.classList.add('modal-open');
    onMounted(() => {
        if (!sessionStorage.getItem('accountTypes')) {
            fetchAccountTypes();
        } else {
            loadAccountTypesFromCache();
        }
    });
    const fetchAccountTypes = async () => {
        try {
            const response = await axios.get('/accounts/types');
            // Преобразование массива строк в массив объектов с ключами value и name
            const transformedData = response.data.map(item => ({ value: item, name: item }));
            accountTypes.value = transformedData;
            // Сохранение данных в локальное хранилище
            sessionStorage.setItem('accountTypes', JSON.stringify(transformedData));
            console.log('Account types с сервера:', transformedData);
        } catch (error) {
            console.error('Error fetching account types:', error);
        }
    };

    const loadAccountTypesFromCache = () => {
        const cachedData = sessionStorage.getItem('accountTypes');
        if (cachedData) {
            accountTypes.value = JSON.parse(cachedData);
            console.log('Account types loaded from cache:', accountTypes.value);
        }
    };
    onUnmounted(() => {
        document.body.classList.remove('modal-open');
    });
    const closeModal = () => {
        emit('close');
        document.body.classList.remove('modal-open');
    };

    const props = defineProps({
        account: {
            type: Object,
            required: true,
        },
    });

    const emit = defineEmits(['close']);
    const masterPasswordStore = useMasterPasswordStore();
    const accountData = ref({ ...props.account });
    const showPassword = ref(false);
    const accountTypes = ref([]);
    const passwordLength = ref(8);
    const genpassword = ref(true)
    const urlError = ref('')
    const descriptionError = ref('')
    const nameError = ref('')
    const passwordError = ref('')
    const status = ref('')
    const typeError = ref('')



    watch(() => props.account, (newAccount) => {
        accountData.value = { ...newAccount };
    });

    const canShowPassword = ref(masterPasswordStore.checkMasterPasswordStatus);

    const generatePasswordVisible = () => {
        genpassword.value = !genpassword.value;
        showPassword.value = false
    }
    const generatePassword = () => {
        showPassword.value = true;
        const lowercase = 'abcdefghijklmnopqrstuvwxyz';
        const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const digits = '0123456789';
        const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
        const charset = lowercase + uppercase + digits + specialChars;

        let generatedPassword = '';

        // Ensure at least one lowercase letter
        generatedPassword += lowercase[Math.floor(Math.random() * lowercase.length)];

        // Ensure at least one uppercase letter
        generatedPassword += uppercase[Math.floor(Math.random() * uppercase.length)];

        // Ensure at least one digit
        generatedPassword += digits[Math.floor(Math.random() * digits.length)];

        // Ensure at least one special character
        generatedPassword += specialChars[Math.floor(Math.random() * specialChars.length)];

        // Generate the rest of the password
        for (let i = generatedPassword.length; i < passwordLength.value; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            generatedPassword += charset[randomIndex];
        }

        // Shuffle the password to ensure randomness
        generatedPassword = generatedPassword.split('').sort(() => 0.5 - Math.random()).join('');

        accountData.value.password = generatedPassword;
    };
    const toggleShowPassword = () => {
        if (!canShowPassword.value) {
            alert('Для просмотра пароля требуется действительный мастер-пароль.');
        } else {
            showPassword.value = !showPassword.value;
        }
    };

    const updateAccount = async () => {
        status.value = 'Обновляем...'
        try {
            const response = await axios.put(`/accounts/update/${accountData.value.id}`, accountData.value);
            if (response.status === 200) {
                status.value=response.data.message;
                // emit('close');
            }
        } catch (error) {
            console.error('Error updating account:', error);
            const errors = error.response.data.errors;
            if (errors.type) {
                typeError.value = Object.values(errors.type).join(' ');
            }
            if (errors.url) {
                urlError.value = Object.values(errors.url).join(' ');
            }
            if (errors.description) {
                descriptionError.value = Object.values(errors.description).join(' ');
            }
            if (errors.name) {
                nameError.value = Object.values(errors.name).join(' ');
            }
            if (errors.password) {
                passwordError.value = Object.values(errors.password).join(' ');
            }
            if(error.response.data.error){
                status.value = error.response.data.error;
            }
        }
    };

    const deleteAccount = async () => {
        status.value = 'Удаляем...';
        try {
            const response = await axios.delete(`/accounts/destroy/${accountData.value.id}`);
            if (response.status === 200) {
                status.value = response.data.message;
                setTimeout(() => {
                    status.value = '';
                    emit('close');
                    emit('accountDeleted', accountData.value.id); // Добавьть это для удаления 
                },1100)
                
            } 
        } catch (error) {
            console.error('Error deleting account:', error);
            status.value = error.response.data.error || Object.values(error.response.data.errors).join(' ') || 'Ошибка удаления';
        }
    };
</script>

<style scoped lang="scss">

    .view-account {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        // overflow-y: scroll;

        &__overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            background-color: rgba(0, 0, 0, 0.5);
            overflow-y: auto;
        }

        &__status-message {
            color: #2c3e50;
            font-size: 0.9em;
            text-align: center;
            transition: all 0.3s ease 0s;
        }
        &__required {
      text-align: center;
      color: rgb(0, 60, 255);
    }

        &__generate-password {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background-color: #f9f9f9;
            border-radius: 8px;
            //padding: 20px;
            margin-top: 7px;

            &-link {
                display: flex;
                text-align: center;
                justify-content: center;
                cursor: pointer;
            }

            & p {
                color: #2c3e50;
            }

            &>div {
                /* display: flex;
        flex-direction: column;
        align-items: center;
      //  justify-content: center;
        gap: 5px;*/
                width: 100%;
                max-width: 450px;
            }

            &>div input[type="range"] {
                width: 100%;
                /* Установите полную ширину для input range */
            }

            &-buttons {
                display: flex;
                justify-content: center;
                gap: 10px;
                flex-wrap: wrap-reverse;

                &>button {
                    background-color: #0e8d54;
                }

            }
        }

        &__content {
            position: relative;
            left: 50%;
            transform: translateX(-50%);
            padding: 20px;
            background-color: #fff;
            border-radius: 5px;
            z-index: 1001;
            width: 90%;
            max-width: 500px;
            // overflow-y: auto;
        }

        &__title {
            font-size: 1.5em;
            margin-bottom: 10px;
            color: #2c3e50;
        }

        &__form {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }

        &__form-group {
            display: flex;
            flex-direction: column;

            /*   &--password {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
      } */
        }

        &__label {
            margin-bottom: 5px;
            color: #8e8edd;
        }

        &__error {
            color: red;

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

        &__textarea {
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            width: 100%;
            resize: none;
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

        &__actions {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;

            @media (max-width: 410px) {
                flex-direction: column;
                gap: 10px;

            }
        }

        &__button {
            padding: 10px 20px;
            background-color: #42b983;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;

            &:hover {
                background-color: #369870;
            }

            &--delete {
                background-color: #e74c3c;

                &:hover {
                    background-color: #c0392b;
                }
            }
        }
    }
</style>