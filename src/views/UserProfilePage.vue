<template>
  <div class="profile">
    <h2 class="profile__title">Профиль пользователя</h2>
    <div class="profile__info">
      <div class="profile__avatar">
        <img src="@/assets/img/user.png" width="150" alt="User Avatar" />
      </div>
      <div class="profile__details">
        <form class="profile__form" @submit.prevent="updateName">
          <div class="profile__form-group">
            <label class="profile__label" for="name">Имя</label>
            <input class="profile__input" type="text" id="name" v-model="form.name" required />
          </div>
          <p v-if="status_name" class="profile__status-message">{{ status_name }}</p>
          <button class="profile__button" type="submit">Обновить имя</button>
        </form>

        <div class="profile__form-group">
          <label class="profile__label" for="email">Email</label>
          <input class="profile__input" type="email" id="email" v-model="form.email" :disabled="user.email_verified"/>
          <p v-if="!user.email_verified" class="profile__error">
            Email не верифицирован.
            <a class="profile__link-send" @click.prevent="sendVerificationNotification">Отправить ссылку для верификации
              email</a>
            <p class="profile__status-message" v-if="status_emailsend">{{status_emailsend}}</p>  
          </p>
          <p v-else class="profile__verified">Email верифицирован</p>
          
        </div>

        <form class="profile__form" v-if="!user.email_verified" @submit.prevent="updateEmailUnverified">
          <p class="profile__status-message" v-if="status_emailunverified">{{status_emailunverified}}</p>
          <button class="profile__button" type="submit">Обновить email</button>
        </form>

        <form class="profile__form" v-if="user.email_verified && !emailUpdateStarted"
          @submit.prevent="startEmailUpdate">
          <button class="profile__button" type="submit">Обновить email</button>
        </form>
      </div>
      <div v-if="emailUpdateStarted">
        <form class="profile__form" @submit.prevent="sendCodeEmails">
          <div class="profile__form-group">
            <label class="profile__label" for="new_email">Новый email</label>
            <input class="profile__input" type="email" id="new_email" v-model="form.new_email" required />
          </div>
          <p v-if="status_sendcode" class="profile__status-message">{{ status_sendcode }}</p>
          <button class="profile__button" type="submit">Отправить коды подтверждения</button>
        </form>

        <form class="profile__form" v-if="codesSent" @submit.prevent="updateEmailVerified">
          <div class="profile__form-group">
            <label class="profile__label" for="code_oldemail">Код со старого email</label>
            <input class="profile__input" type="text" id="code_oldemail" v-model="form.code_oldemail" required />
          </div>
          <div class="profile__form-group">
            <label class="profile__label" for="code_newemail">Код с нового email</label>
            <input class="profile__input" type="text" id="code_newemail" v-model="form.code_newemail" required />
          </div>
          <p v-if="status_emailverified" class="profile__status-message">{{ status_emailverified }}</p>
          <button class="profile__button" type="submit">Подтвердить новый email</button>
        </form>
      </div>
    </div>



    <div class="profile__status" v-if="status">{{ status }}</div>
    <div class="profile__error" v-if="error">{{ error }}</div>
    <div class="profile__password-change">
      <PasswordChange />
    </div>
  <div class="profile__master-password">
    <MasterPassword />
  </div>

  <div class="profile__two-factor">
    <TwoFactor />
  </div>

  <div class="profile__delete-account">
    <DeleteAccount />
  </div>
  <ScrollToTop />
  </div>

</template>

<script>
  import { ref, reactive, onMounted, computed, onBeforeMount } from 'vue';
  import axios from 'axios';
  import PasswordChange from '@/components/UserProfile/PasswordChange.vue'; // Импортируем компонент изменения пароля
  import MasterPassword from '@/components/UserProfile/MasterPassword.vue';
  import TwoFactor from '@/components/UserProfile/TwoFactor.vue';
  import DeleteAccount from '@/components/UserProfile/DeleteAccount.vue';
  import ScrollToTop from '@/components/ScrollToTop.vue';
  import { useAuthStore } from '@/stores/auth.js'

  export default {
    name: 'UserProfile',
    components: {
      PasswordChange,
      MasterPassword,
      TwoFactor,
      DeleteAccount,
      ScrollToTop

    },
    setup() {
      const user = reactive({
        name: '',
        email: '',
        email_verified: false,
        master_password: false
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
      const status_name = ref('');
      const emailUpdateStarted = ref(false);
      const codesSent = ref(false);
      const status_emailunverified = ref('');
      const status_sendcode = ref('');
      const status_emailverified = ref('');
      const newemail = ref('');
      const authStore = useAuthStore()
     
      onMounted(async () => {
        try {
          const response = await authStore.fetchUser();  
          // axios.get('/user');
          user.name = response.data.user.name;
          user.email = response.data.user.email;
          user.email_verified = response.data.user.email_verified;
          user.master_password = response.data.user.master_password;
          form.name = user.name;
          form.email = user.email;
          console.log(response);
        } catch (err) {
          error.value = 'Ошибка при загрузке данных пользователя';
        }
      });

      const updateName = async () => {
        status_name.value ='Обновляем...'
        try {
          const response = await axios.patch('/user/update-name', { name: form.name });
          user.name = form.name;
          status_name.value = response.data.message;
          setTimeout(() => {
            status_name.value = '';
          }, 1000);
        } catch (err) {
          status_name.value = err.response.data.error ||
          Object.values(err.response.data.errors).join(' ') ||
           'Ошибка при обновлении имени';
        }
      };

      const updateEmailUnverified = async () => {
        status_emailunverified.value = 'Обновляем...'
        try {
          const response = await axios.patch('/user/update-email-unverified', { email: form.email });
          status_emailunverified.value = response.data.message;
          user.email = form.email;
          setTimeout(() => {
            status_emailunverified.value = '';
          }, 1000);
        } catch (err) {
          status_emailunverified.value = err.response.data.error ||
          Object.values(err.response.data.errors).join(' ') || 'Ошибка при обновлении email';
        }
      };

      const startEmailUpdate = () => {
        emailUpdateStarted.value = true;
      };

      const sendCodeEmails = async () => {
        status_sendcode.value = " Отправляем..."
        try {
          const response = await axios.post('/user/update-email-send', { new_email: form.new_email });
          status_sendcode.value = response.data.message;
          codesSent.value = true;
          newemail.value = form.new_email;
        } catch (err) {
          status_sendcode.value = err.response.data.error || Object.values(err.response.data.errors).join(' ') ||  'Ошибка при отправке кодов';
        }
      };

      const updateEmailVerified = async () => {
        status_emailverified.value = 'Проверяем...';
        try {
          const response = await axios.patch('user/update-email-verified', {
            code_oldemail: form.code_oldemail,
            code_newemail: form.code_newemail
          });
          status_emailverified.value = response.data.message;
          form.email = newemail.value;
          setTimeout(() => {
            user.email_verified = true;
          emailUpdateStarted.value = false;
          codesSent.value = false;
          },750)
          
        } catch (err) {
          status_emailverified.value = err.response.data.error|| Object.values(err.response.data.errors).join(' ') ||'Ошибка при подтверждении нового email';
        }
      };

      const sendVerificationNotification = async () => {
        status_emailsend.value = 'Отправляем...';
        try {
          const response = await axios.post('/email/verification-notification');
          status_emailsend.value = response.data.message;
        } catch (err) {
          status_emailsend.value = err.response.data.error || Object.values(err.response.data.errors).join(' ')|| 'Ошибка при отправке уведомления для верификации Email';
        }
      };
      const UserInfo = computed(() => {
       if(user.value.email_verified && user.value.master_password){
         return user
       }
        return null
      })
      return {
        user,
        form,
        newemail,
        status,
        error,
        status_name,
        status_emailunverified,
        status_emailsend,
        status_sendcode,
        status_emailverified,
        UserInfo,
        emailUpdateStarted,
        codesSent,
        updateName,
        updateEmailUnverified,
        startEmailUpdate,
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
    min-height: 100vh;
    width: 100%;
    background-color: #f9f9f9;
    padding: 20px;
    align-items: center;

    &__title {
      font-size: 2em;
      margin-bottom: 20px;
      color: #2c3e50;
      text-align: center;
    }

    &__info {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
      max-width: 600px;
      width: 100%;
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    }

    &__avatar {
      img {
        border-radius: 50%;
      }
    }

    &__details {
      width: 100%;
    }

    &__link-send {
      text-decoration: underline;
      cursor: pointer;
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

      &-group.disabled {
        opacity: 0.6;
        pointer-events: none;
      }

      &-group input[disabled] {
        background-color: #e9ecef;
        cursor: not-allowed;
      }
    }

    &__label {
      margin-bottom: 5px;
      color: #8e8edd;
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

      &:disabled {
        background-color: #cccccc;
      }
    }

    &__status {
      margin-top: 20px;
      font-size: 1rem;
      color: #28a745;
      text-align: center;

      &-emailsend {
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

    &__status-message {
      color: #2c3e50;
      font-size: 0.8em;
      text-align: center;
      transition: all 0.3s ease 0s;
    }
    
    &__password-change {
      margin-top: 20px;
      width: 100%;
      max-width: 600px;
    }
    &__master-password{
      margin-top: 20px;
      width: 100%;
      max-width: 600px;
    }
    &__two-factor{
      margin-top: 20px;
      width: 100%;
      max-width: 600px;
    }
    &__delete-account{
      margin-top: 20px;
      width: 100%;
      max-width: 600px;
    }
  }
</style>
