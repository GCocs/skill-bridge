import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/api/auth.js'
import {
  clearAuthSession,
  createOAuthState,
  getAccessToken,
  getStoredUser,
  isSafeInternalPath,
  setAuthReturnTo,
  setAuthTokens,
  setStoredUser,
} from '@/services/authSession.js'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(getStoredUser())
  const initialized = ref(false)
  const loading = ref(false)
  let initializePromise = null
  let initializeVersion = 0

  const isAuthenticated = computed(() => !!user.value)

  function setUser(nextUser, { persist = true } = {}) {
    user.value = nextUser ?? null
    if (persist) setStoredUser(user.value)
  }

  async function initialize({ force = false, throwOnError = false } = {}) {
    if (initialized.value && !force) return user.value
    if (initializePromise && !force) return initializePromise

    const requestVersion = ++initializeVersion
    loading.value = true
    initializePromise = (async () => {
      try {
        const response = await authApi.getMe()
        const payload = response.data?.data ?? response.data
        if (requestVersion === initializeVersion) setUser(payload)
      } catch (error) {
        if (requestVersion === initializeVersion) {
          setUser(null, { persist: false })
          // OAuth 콜백과 앱 초기화 요청이 겹칠 수 있으므로, 인증 실패 시에도
          // 진행 중인 로그인 요청의 state 값은 보존한다.
          if ([401, 403].includes(error.response?.status)) {
            clearAuthSession({ preserveOAuthState: true })
          }
        }
        if (throwOnError) throw error
      } finally {
        if (requestVersion === initializeVersion) {
          initialized.value = true
          loading.value = false
          initializePromise = null
        }
      }

      return user.value
    })()

    return initializePromise
  }

  async function completeLogin(tokens = {}) {
    setAuthTokens(tokens)
    initialized.value = false
    return initialize({ force: true, throwOnError: true })
  }

  function beginLogin(returnTo) {
    const redirectUri = new URL(authApi.getRedirectUri(), window.location.origin)

    // sessionStorage는 origin별로 분리된다. 현재 프런트 origin과 OAuth 콜백
    // origin이 다르면 state를 저장하기 전에 등록된 origin으로 먼저 이동한다.
    if (window.location.origin !== redirectUri.origin) {
      const canonicalLoginUrl = new URL('/login', redirectUri.origin)
      canonicalLoginUrl.searchParams.set('oauth', '1')
      if (isSafeInternalPath(returnTo)) {
        canonicalLoginUrl.searchParams.set('redirect', returnTo)
      }
      window.location.assign(canonicalLoginUrl)
      return
    }

    setAuthReturnTo(returnTo)
    window.location.assign(authApi.getLoginUrl(createOAuthState()))
  }

  function redirectToLogin(returnTo = '/courses') {
    beginLogin(returnTo)
  }

  async function logout() {
    initializeVersion += 1
    initializePromise = null
    const logoutUrl = import.meta.env.VITE_AUTH_LOGOUT_URL

    if (logoutUrl) {
      try {
        await fetch(logoutUrl, {
          method: 'POST',
          credentials: 'include',
          headers: getAccessToken()
            ? {
                Authorization: /^Bearer\s/i.test(getAccessToken())
                  ? getAccessToken()
                  : `Bearer ${getAccessToken()}`,
              }
            : {},
        })
      } catch {
        // 로컬 세션은 서버 로그아웃 성공 여부와 무관하게 제거한다.
      }
    }

    clearAuthSession()
    user.value = null
    initialized.value = true
    loading.value = false
  }

  return {
    user,
    isAuthenticated,
    initialized,
    loading,
    setUser,
    initialize,
    completeLogin,
    beginLogin,
    redirectToLogin,
    logout,
  }
})
