<template>
    <div class="email-verify">
      <h1 class="email-verify__title">Подтверждение почты</h1>
      <div class="email-verify__status">
        <div v-if="loading" class="email-verify__loading">Проверка подтверждения...</div>
        <div v-else-if="error" class="email-verify__error">{{ error }}</div>
        <div v-else class="email-verify__success">{{ message }}</div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import axios from 'axios'
  import { useAuthStore } from '@/stores/auth.js'
  
  const route = useRoute()
  const router = useRouter()
  const authStore = useAuthStore()
  
  const loading = ref(true)
  const error = ref('')
  const message = ref('')
  
  onMounted(async () => {
    const id = route.query.id
    const hash = route.query.hash
    const expires = route.query.expires
    const signature = route.query.signature
  
    if (!id || !hash || !expires || !signature) {
      error.value = 'Недостаточно данных для подтверждения.'
      loading.value = false
      return
    }
  
    try {
      const response = await axios.get('/email-verify', {
        params: { expires,hash,id,signature },
      })
  
      if (response.status === 200) {
        // Подтверждение успешно
       // await authStore.fetchUser()
        message.value = response.data.message + ' Перенаправляем на страницу профиля...'
        setTimeout(() => {
          router.push({ name: 'UserProfile' })
        }, 1500)
      } 
    } catch (err) {
        console.error(err)
     
        if ( err.response.status === 403 || err.response.status === 500) {
            error.value = 'Попробуйте отправить ссылку еще раз. Перенаправляем на страницу профиля...'
            setTimeout(() => {
            router.push({ name: 'UserProfile' })
            }, 1500)
          
        }
    
    } finally {
      loading.value = false
    }
  })
  </script>
  
  <style scoped lang="scss">
  .email-verify {
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
    &__loading {
      color: #294e74;
    }
  
    &__status {
      font-size: 1.2em;
      text-align: center;
    }
  
    &__error {
      color: red;
    }
  
    &__success {
      color: green;
    }
  }
  </style>
  