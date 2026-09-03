import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')

  return {
    plugins: [vue(), vueDevTools()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      port: 3000,
      strictPort: true,
      proxy: {
        '/api/users': {
          target: env.USER_SERVICE_TARGET || 'http://localhost:8081',
          changeOrigin: true,
        },
        '/api/recommend': {
          target: env.RECOMMEND_SERVICE_TARGET || 'http://localhost:8085',
          changeOrigin: true,
        },
      },
    },
  }
})
