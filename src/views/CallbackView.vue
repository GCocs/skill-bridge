<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { authApi } from '@/api/auth.js'
import { useAuthStore } from '@/store/auth.js'
import { consumeOAuthState, isSafeInternalPath, takeAuthReturnTo } from '@/services/authSession.js'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const error = ref('')

function firstString(value) {
  return Array.isArray(value) ? value[0] : value
}

function callbackParameters() {
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''))
  const queryValue = (camelCase, snakeCase) =>
    firstString(route.query[camelCase]) ??
    firstString(route.query[snakeCase]) ??
    hash.get(camelCase) ??
    hash.get(snakeCase)

  return {
    code: firstString(route.query.code) ?? hash.get('code'),
    state: firstString(route.query.state) ?? hash.get('state'),
    accessToken: queryValue('accessToken', 'access_token') ?? firstString(route.query.token),
    refreshToken: queryValue('refreshToken', 'refresh_token'),
    authError: firstString(route.query.error_description) ?? firstString(route.query.error),
  }
}

onMounted(async () => {
  const { code, state, accessToken, refreshToken, authError } = callbackParameters()
  const redirect = firstString(route.query.redirect)

  // 토큰이 주소 표시줄과 브라우저 기록에 남지 않게 즉시 제거한다.
  window.history.replaceState(window.history.state, '', route.path)

  if (authError) {
    error.value = authError
    return
  }

  if (code && !consumeOAuthState(state)) {
    error.value = '로그인 요청의 state 값이 일치하지 않습니다. 로그인부터 다시 시도해 주세요.'
    return
  }

  try {
    let tokens = { accessToken, refreshToken }

    if (!tokens.accessToken && code) {
      const response = await authApi.exchangeCode(code)
      const payload = response.data?.data ?? response.data
      tokens = {
        accessToken: payload?.accessToken ?? payload?.access_token,
        refreshToken: payload?.refreshToken ?? payload?.refresh_token,
      }
    }

    const user = await auth.completeLogin(tokens)
    if (!user) {
      error.value = '로그인 정보는 받았지만 사용자 정보를 확인하지 못했습니다.'
      return
    }

    await router.replace(isSafeInternalPath(redirect) ? redirect : takeAuthReturnTo())
  } catch (requestError) {
    error.value =
      requestError.response?.data?.error_description ??
      requestError.response?.data?.message ??
      requestError.message ??
      '인증 코드를 처리하지 못했습니다.'
  }
})
</script>

<template>
  <main class="callback-page">
    <section v-if="error" class="panel callback-card" role="alert">
      <span class="status-icon status-icon--error">!</span>
      <h1>로그인을 완료하지 못했어요.</h1>
      <p>{{ error }}</p>
      <router-link :to="{ name: 'Login' }" class="primary-button">로그인으로 돌아가기</router-link>
    </section>
    <section v-else class="panel callback-card" aria-live="polite">
      <span class="spinner" aria-hidden="true"></span>
      <h1>로그인을 연결하고 있어요.</h1>
      <p>잠시만 기다려 주세요.</p>
    </section>
  </main>
</template>

<style scoped>
.callback-page {
  display: grid;
  min-height: calc(100vh - 77px);
  padding: 40px 20px;
  place-items: center;
}

.callback-card {
  width: min(100%, 480px);
  text-align: center;
}

.callback-card h1 {
  margin: 18px 0 8px;
  font-size: 25px;
}

.callback-card p {
  margin: 0 0 24px;
  color: var(--muted);
}

.spinner,
.status-icon {
  display: inline-grid;
  width: 42px;
  height: 42px;
  place-items: center;
  border-radius: 50%;
}

.spinner {
  border: 3px solid var(--navy-100);
  border-top-color: var(--teal);
  animation: spin 0.8s linear infinite;
}

.status-icon--error {
  background: var(--alert-soft);
  color: var(--alert);
  font-weight: 800;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
