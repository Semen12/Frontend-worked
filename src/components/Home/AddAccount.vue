<template>
    <div class="add-account">
      <h2 class="add-account__title">Добавить учетную запись</h2>
      <form @submit.prevent="submitForm" class="add-account__form">
        <div class="add-account__form-group">
          <label for="type" class="add-account__label">Тип</label>
          <select v-model="type" id="type" class="add-account__input" required>
            <option v-for="accountType in accountTypes" :key="accountType.value" :value="accountType.value">
              {{ accountType.name }}
            </option>
          </select>
        </div>
  
        <div class="add-account__form-group">
          <label for="url" class="add-account__label">URL</label>
          <input type="url" id="url" v-model="url"  class="add-account__input" />
        </div>
  
        <div class="add-account__form-group">
          <label for="name" class="add-account__label">Название</label>
          <input type="text" id="name" v-model="name" class="add-account__input" />
        </div>
  
        <div class="add-account__form-group">
          <label for="login" class="add-account__label">Логин</label>
          <input type="text" id="login" v-model="login" class="add-account__input" />
        </div>
  
        <div class="add-account__form-group add-account__form-group--password">
          <label for="password" class="add-account__label">Пароль</label>
          <div class="add-account__input-container">
            <input :type="showPassword ? 'text' : 'password'" id="password" v-model="password" class="add-account__input" />
            <button type="button" @click="togglePasswordVisibility" class="add-account__toggle">
              {{ showPassword ? 'Скрыть' : 'Показать' }} пароль
            </button>
          </div>
        </div>
  
        <div class="add-account__form-group">
          <label for="description" class="add-account__label">Описание</label>
          <textarea id="description" v-model="description" class="add-account__input"></textarea>
        </div>
  
        <button type="submit" class="add-account__button">Добавить</button>
      </form>
  
      <div v-if="showAlert" class="add-account__alert">
        {{ alertMessage }}
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  
  const type = ref('');
  const url = ref('');
  const name = ref('');
  const login = ref('');
  const password = ref('');
  const description = ref('');
  const showPassword = ref(false);
  const accountTypes = ref([]);
  const showAlert = ref(false);
  const alertMessage = ref('');


   onMounted(() => {
    if (!sessionStorage.getItem('accountTypes')) {
        fetchAccountTypes();
      } else {
        loadAccountTypesFromCache();
      }
  })
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
    try {
      const response = await axios.post('/accounts/create', {
        type: type.value,
        url: url.value,
        name: name.value,
        login: login.value,
        password: password.value,
        description: description.value,
      });
      alertMessage.value = 'Учетная запись успешно создана';
      showAlert.value = true;
    } catch (error) {
      alertMessage.value = error.response.data.error || 'Произошла ошибка';
      showAlert.value = true;
    }
  };
  
 ;
  </script>
  
  <style scoped lang="scss">
  .add-account {
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
  