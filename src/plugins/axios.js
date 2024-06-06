import router from '@/router'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'

axios.defaults.baseURL = import.meta.env.VITE_API_URL
axios.defaults.withCredentials = true
axios.defaults.withXSRFToken = true
axios.defaults.headers.common['Accept'] = 'application/json'
//axios.defaults.headers.common['Referer'] = import.meta.env.VITE_FRONTEND_URL
axios.defaults.headers.common['Content-Type'] = 'application/json;charset=UTF-8'
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'


axios.interceptors.response.use(
    response => response,
    error => {
      if (error.response) {
        const status = error.response.status;
        const mainStore = useAuthStore(); // Используем хранилище
  
        if ([401, 419, 503].includes(status)) {
          // Вызов экшена Pinia для очистки всех данных
          mainStore.clearAllData();
          router.push({ name: 'Login' }); // Перенаправление на route входа
        }
      }
      // Проброс ошибки для дальнейшей обработки, если нужно
      return Promise.reject(error);
    }
  );
  


export default axios
