import './assets/main.css'
import '@/plugins/axios.js'
import { createApp } from 'vue'
//import { createPinia } from 'pinia'
import vSelect from 'vs-vue3-select'
import App from './App.vue'
import router from './router'
import pinia from '@/stores/index.js'

const app = createApp(App)

app.use(pinia)
app.use(router)

app.component('v-select', vSelect).mount('#app')
