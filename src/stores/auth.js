import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    twoFactorRequired: false
  }),
  getters: {
    isAuthenticated: (state) => !!state.user
  },

  actions: {
    async clearAllData() {
      this.user = null
      this.twoFactorRequired = false
    },
    async fetchCsrfToken() {
      await axios.get('/sanctum/csrf-cookie')
    },
    async fetchUser() {
      try {
        const response = await axios.get('/user')
        this.user = response.data
      } catch (error) {
        this.user = null
        console.log('Fetch user error', error)
      }
    },
    async login(credentials) {
      try {
        const response = await axios.post('/login', credentials)
        this.twoFactorRequired = response.data.two_factor
        if (!this.twoFactorRequired) {
          await this.fetchUser()
        }
        return response
      } catch (error) {
        console.log('Login error', error)
        throw error
      }
    },
    async register(credentials) {
      try {
        const response = await axios.post('/register', credentials)
        this.user = response.data.user
        // await this.fetchUser();
        return response
      } catch (error) {
        this.user = null
        console.log('Register error', error)
        throw error
      }
    },
    async verifyTwoFactorCode(credentials) {
      try {
       const response =  await axios.post('/two-factor-challenge', credentials)       
        this.twoFactorRequired = false
        await this.fetchUser()
        
       return response
      } catch (error) {
        console.log('Verify two factor code error', error)
        throw error;
      } 
    },
   
  
    logout() {
      axios.post('/logout').then(() => {
       
          this.user = null
          this.twoFactorRequired = false
      }).catch((error) => {
        console.log('Logout error', error)
      })
          
        
      
    }
  }
})
