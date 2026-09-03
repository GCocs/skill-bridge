import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router/index.js'
import { useAuthStore } from './store/auth.js'
import './assets/base.css'
import '@/assets/styles/global.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

app.mount('#app')

// 공개 화면에서도 헤더의 로그인 상태가 복원되도록 앱 시작 시 세션을 확인한다.
// OAuth 콜백에서는 CallbackView가 토큰 저장 후 직접 초기화해야 하므로 건너뛴다.
router.isReady().then(() => {
  if (router.currentRoute.value.name !== 'Callback') {
    useAuthStore(pinia).initialize()
  }
})
