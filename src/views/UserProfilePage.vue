<template>
    <div class="profile">
      <h2 class="profile__title">Профиль пользователя</h2>
      
      <div class="profile__info">
        <div class="profile__avatar">
          <!-- Placeholder for avatar -->
          <img src="@/assets/img/user.png" width="150" alt="User Avatar" />
        </div>
        <div class="profile__details">
          <p><strong>Имя:</strong> {{ user.name }}</p>
          <p><strong>Email:</strong> {{ user.email }}</p>
          <p v-if="!user.email_verified" class="profile__error">Email не верифицирован</p>
          <p v-else class="profile__verified">Email верифицирован</p>
          <a v-if="!user.email_verified" class="profile__link-send"  @click.prevent="sendVerificationNotification">Отправить уведомление для верификации Email</a>
          <p v-if="status_emailsend" class="profile__status-emailsend">{{ status_emailsend }}></p>
          
        </div>
      </div>
      
      <form class="profile__form" @submit.prevent="updateName">
        <div class="profile__form-group">
          <label class="profile__label" for="name">Имя</label>
          <input
            class="profile__input"
            type="text"
            id="name"
            v-model="form.name"
            required
          />
        </div>
        <button class="profile__button" type="submit">Обновить имя</button>
      </form>
      
      <form class="profile__form" @submit.prevent="updateEmailUnverified">
        <div class="profile__form-group">
          <label class="profile__label" for="email">Email</label>
          <input
            class="profile__input"
            type="email"
            id="email"
            v-model="form.email"
            required
          />
        </div>
        <button class="profile__button" type="submit">Обновить Email</button>
      </form>
      
      <div v-if="user.email_verified">
        <form class="profile__form" @submit.prevent="sendCodeEmails">
          <div class="profile__form-group">
            <label class="profile__label" for="new_email">Новый Email</label>
            <input
              class="profile__input"
              type="email"
              id="new_email"
              v-model="form.new_email"
              required
            />
          </div>
          <button class="profile__button" type="submit">Отправить коды подтверждения</button>
        </form>
        
        <form class="profile__form" @submit.prevent="updateEmailVerified">
          <div class="profile__form-group">
            <label class="profile__label" for="code_oldemail">Код старого Email</label>
            <input
              class="profile__input"
              type="text"
              id="code_oldemail"
              v-model="form.code_oldemail"
              required
            />
          </div>
          <div class="profile__form-group">
            <label class="profile__label" for="code_newemail">Код нового Email</label>
            <input
              class="profile__input"
              type="text"
              id="code_newemail"
              v-model="form.code_newemail"
              required
            />
          </div>
          <button class="profile__button" type="submit">Подтвердить новый Email</button>
        </form>
      </div>
  
      <div class="profile__status" v-if="status">{{ status }}</div>
      <div class="profile__error" v-if="error">{{ error }}</div>
    </div>
</template>
  
<script>
  import { ref, reactive, onMounted } from 'vue';
  import axios from 'axios';
  
  export default {
    name: 'UserProfile',
    setup() {
      const user = reactive({
        name: '',
        email: '',
        email_verified: false,
      });
      
      const form = reactive({
        name: '',
        email: '',
        new_email: '',
        code_oldemail: '',
        code_newemail: ''
      });
  
      const status = ref('');
      const error = ref('');
     const status_emailsend = ref('');
  
      onMounted(async () => {
        try {
          const response = await axios.get('/user');
          user.name = response.data.user.name;
          user.email = response.data.user.email;
          user.email_verified = response.data.user.email_verified;
          form.name = user.name;
          form.email = user.email;
        } catch (err) {
          error.value = 'Ошибка при загрузке данных пользователя';
        }
      });
  
      const updateName = async () => {
        try {
          const response = await axios.patch('/user/update-name', { name: form.name });
          status.value = response.data.message;
          user.name = form.name;
          error.value = '';
        } catch (err) {
          error.value = err.response.data.message || 'Ошибка при обновлении имени';
        }
      };
  
      const updateEmailUnverified = async () => {
        try {
          const response = await axios.patch('/user/update-email-unverified', { email: form.email });
          status.value = response.data.message;
          user.email = form.email;
          error.value = '';
        } catch (err) {
          error.value = err.response.data.message || 'Ошибка при обновлении email';
        }
      };
  
      const sendCodeEmails = async () => {
        try {
          const response = await axios.post('/user/update-email-sent', { new_email: form.new_email });
          status.value = response.data.message;
          error.value = '';
        } catch (err) {
          error.value = err.response.data.message || 'Ошибка при отправке кодов';
        }
      };
  
      const updateEmailVerified = async () => {
        try {
          const response = await axios.post('/user/update-email-verified', {
            code_oldemail: form.code_oldemail,
            code_newemail: form.code_newemail
          });
          status.value = response.data.message;
          user.email = form.new_email;
          user.email_verified = true;
          error.value = '';
        } catch (err) {
          error.value = err.response.data.message || 'Ошибка при подтверждении нового email';
        }
      };
  
      const sendVerificationNotification = async () => {
        try {
          const response = await axios.post('/email/verification-notification');
          status_emailsend.value = response.data.message;
          
        } catch (err) {
          status_emailsend.value = err.response.data.error || 'Ошибка при отправке уведомления для верификации Email';
        }
      };
  
      return {
        user,
        form,
        status,
        error,
        status_emailsend,
        updateName,
        updateEmailUnverified,
        sendCodeEmails,
        updateEmailVerified,
        sendVerificationNotification
      }
    },
}
</script>
<style lang="scss" scoped>
  .profile {
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
  
    &__info {
      display: flex;
      align-items: center;
      gap: 20px;
  
      &__avatar {
        margin-right: 20px;
  
        img {
          border-radius: 50%;
        }
      }
      
  
      &__details {
        display: flex;
        flex-direction: column;
      }
    }
    &__link-send{
        text-decoration: underline;
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
    }
  
    &__label {
      margin-bottom: 5px;
      color: #8e8edd;
    }
  
    &__input {
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 5px;
      flex: 1;
      width: 100%;
    }
  
    &__button {
      padding: 10px 20px;
      font-size: 1.2em;
      color: white;
      background-color: #42b983;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      &:hover {
        background-color: #369870;
      }
  
      &:disabled {
        background-color: #cccccc;
      }
    }
  
    &__status {
      margin-top: 20px;
      font-size: 1rem;
      color: #28a745;
      text-align: center;
      &__emailsend{
        color: #28a745;
        font-size: 0.9em;
        text-align: center;
        margin-top: 5px;
      }
    }
  
    &__error {
      color: red;
      font-size: 0.9em;
      text-align: center;
      margin-top: 5px;
    }
  
    &__verified {
      color: green;
      font-size: 0.9em;
      text-align: center;
      margin-top: 5px;
    }
  }
</style>
  