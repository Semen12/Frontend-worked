import { fileURLToPath, URL } from 'node:url'

import { createServer, defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), VueDevTools({ launchEditor: 'code' })],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: "",
      }
    }
  },
  server: {
    host: true,
    port: 8080,
    //https: true
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
