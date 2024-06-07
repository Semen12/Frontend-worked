<template>
  <div class="add-account">
    <h2 class="add-account__title">Добавить учетную запись</h2>
    <form @submit.prevent="submitForm" class="add-account__form">
      <div class="add-account__form-group">
        <label for="type" class="add-account__label">Тип *</label>
        <v-select style="color:#2c3e50 ;" :options="accountTypes.map((accountType) => accountType.value)" v-model="type"
          id="type" required />
        <p class="add-account__error" v-if="typeError">{{ typeError }}</p>
      </div>

      <div class="add-account__form-group">
        <label for="url" class="add-account__label">URL <span v-if="type == 'интернет-ресурс'">*</span></label>
        <input :type="type == 'интернет-ресурс' ? 'url' : type == 'другое' ? 'text' : 'url'" id="url" v-model="url"
          class="add-account__input" :required="type == 'интернет-ресурс'"
          :placeholder="type == 'другое' ? 'нетипичный вид url' : 'http(s)://example.com'" />
        <p class="add-account__error" v-if="urlError">{{ urlError }}</p>
      </div>

      <div class="add-account__form-group">
        <label for="name" class="add-account__label">Название *</label>
        <input type="text" id="name" v-model="name" class="add-account__input" required />
        <p class="add-account__error" v-if="nameError">{{ nameError }}</p>
      </div>

      <div class="add-account__form-group">
        <label for="login" class="add-account__label">Логин *</label>
        <input type="text" id="login" v-model="login" class="add-account__input" required />
        <p class="add-account__error" v-if="loginError">{{ loginError }}</p>
      </div>

      <div class="add-account__form-group add-account__form-group--password">
        <label for="password" class="add-account__label">Пароль</label>
        <div class="add-account__input-container">
          <input :type="showPassword ? 'text' : 'password'" id="password" v-model="password"
            class="add-account__input" />
          <button type="button" @click="togglePasswordVisibility" class="add-account__toggle">
            {{ showPassword ? 'Скрыть' : 'Показать' }} пароль
          </button>
        </div>
        <a class="add-account__generate-password-link" @click.prevent="generatePasswordVisible"
          v-if="genpassword">Хотите сгенирировать надёжный пароль ?</a>
        <p class="add-account__error" v-if="passwordError">{{ passwordError }}</p>
        <div class="add-account__generate-password" v-if="!genpassword">
          <div>
            <label for="length" class="add-account__label">Длина пароля</label><br />
            <p>{{ passwordLength }}</p>
            <input type="range" id="length" min="8" max="16" v-model="passwordLength" />
          </div>
          <div class="add-account__generate-password-buttons"><button type="button" @click="generatePasswordVisible"
              class="add-account__button add-account__generate">Закрыть</button>
            <button type="button" @click="generatePassword"
              class=" add-account__button add-account__generate">Сгенерировать пароль
            </button>
          </div>

        </div>
      </div>

      <div class="add-account__form-group">
        <label for="description" class="add-account__label">Описание</label>
        <textarea id="description" v-model="description" class="add-account__input"></textarea>
        <p class="add-account__error" v-if="descriptionError">{{ descriptionError }}</p>
      </div>
      <p class="add-account__required">* - обязательное поле для заполнения</p>
      <p class="add-account__status-message" v-if="status">{{ status }}</p>
      <button type="submit" class="add-account__button" :disabled="isDisabled">Добавить</button>
    </form>
  </div>
</template>


<script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import 'vs-vue3-select/dist/vs-vue3-select.css'
  import { computed } from 'vue';

  const type = ref('');
  const url = ref('');
  const name = ref('');
  const login = ref('');
  const password = ref('');
  const description = ref('');
  const showPassword = ref(false);
  const accountTypes = ref([]);
  const passwordLength = ref(8);
  const genpassword = ref(true)
  const typeError = ref('');
  const urlError = ref('');
  const nameError = ref('');
  const loginError = ref('');
  const passwordError = ref('');
  const descriptionError = ref('');
  const status = ref('');


  onMounted(() => {
    if (!sessionStorage.getItem('accountTypes')) {
      fetchAccountTypes();
    } else {
      loadAccountTypesFromCache();
    }
  });
  const isDisabled = computed(() => {
    return (!type.value || (!url.value && type.value == 'интернет-ресурс') || !name.value || !login.value)  
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

  const togglePasswordVisibility = () => {
    showPassword.value = !showPassword.value;
  };

  const submitForm = async () => {
    if (isDisabled.value) {
      return 
    }
    typeError.value = '';
    urlError.value = '';
    nameError.value = '';
    loginError.value = '';
    passwordError.value = '';
    descriptionError.value = '';
    status.value = 'Создаём запись...';

    try {
      const response = await axios.post('/accounts/create', {
        type: type.value,
        url: url.value,
        name: name.value,
        login: login.value,
        password: password.value,
        description: description.value,
      });
      status.value = response.data.message;
      setTimeout(() => {
        type.value = '';
        url.value = '';
        name.value = '';
        login.value = '';
        password.value = '';
        description.value = '';
      }, 1000);
      setTimeout(() => {
        status.value = '';
      }, 1400)
    } catch (error) {
      status.value = error.response.data.error;
      const errors = error.response.data.errors;
      if (errors.type) {
        typeError.value = Object.values(errors).join(' ');
      }
      if (errors.url) {
        urlError.value = Object.values(errors).join(' ');
      }
      if (errors.name) {
        nameError.value = Object.values(errors).join(' ');
      }
      if (errors.login) {
        loginError.value = Object.values(errors).join(' ');
      }
      if (errors.password) {
        passwordError.value = Object.values(errors).join(' ');
      }
      if (errors.description) {
        descriptionError.value = Object.values(errors).join(' ');
      }

    }
  };

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

    password.value = generatedPassword;
  };
</script>

<style scoped lang="scss">
  @import "vue-select/dist/vue-select.css";

  .add-account {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    width: 100vw;
    background-color: #f9f9f9;
    padding: 20px;

    &__generate-password {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background-color: #f9f9f9;
      border-radius: 8px;
      //padding: 20px;
      margin-top: 7px;
     
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
       gap:10px;
       flex-wrap: wrap-reverse;
       
      & > button {
        background-color: #0e8d54;
      }
       
      }
    }

    &__status-message {
      color: #2c3e50;
      font-size: 0.9em;
      text-align: center;
      transition: all 0.3s ease 0s;
    }

    &__error {
      color: red;

    }

    &__required {
      text-align: center;
      color: rgb(0, 60, 255);
    }

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

      &:nth-child(2) {
        margin-bottom: 0px;
      }

      @media (min-width: 768px) {
        flex-direction: column;
      }

      /*  &--password {
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: 5px;
        margin-bottom: 0px;
      } */
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
      margin-bottom: 10px;
      cursor: pointer;

      &:hover {
        background-color: #369870;
      }

      &:disabled {
        background-color: #cccccc;
      }
    }

    &__alert {
      margin-top: 20px;
      font-size: 1rem;
      color: #28a745;
      text-align: center;
    }
  }
</style>