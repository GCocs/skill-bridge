import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// 임시 스텁 — signIn 브랜치의 실제 인증 스토어로 교체될 예정.
// AppHeader.vue가 요구하는 인터페이스(isAuthenticated/user/logout)만 우선 맞춰둠.
export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isAuthenticated = computed(() => !!user.value)

  function logout() {
    user.value = null
  }

  return {
    user,
    isAuthenticated,
    logout
  }
})
