<template>
  <div class="login-page">
    <!-- 좌측 배경 블록 -->
    <div class="bg-left"></div>

    <!-- 우측 배경 블록 + 브랜드 소개 -->
    <div class="bg-right">
      <div class="pattern-overlay"></div>
      <div class="right-content">
        <div class="org-logo-badge">
          <img src="@/assets/images/logo/logo-transparent.png" alt="SkillBridge" class="org-logo" />
        </div>

        <h1 class="right-heading">디지털 역량 강화 학습 플랫폼</h1>
        <div class="right-divider"></div>
        <p class="right-desc">
          SkillBridge에 오신 것을 환영합니다.<br />
          나에게 맞는 강의로 새로운 역량을 키워보세요.
        </p>

        <div class="right-badges">
          <div class="badge-item">
            <div class="badge-circle">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M4 5c3-1.5 6-1.5 8 0v14c-2-1.5-5-1.5-8 0V5Z" />
                <path d="M20 5c-3-1.5-6-1.5-8 0v14c2-1.5 5-1.5 8 0V5Z" />
              </svg>
            </div>
            <span>맞춤 강의추천</span>
          </div>
          <div class="badge-item">
            <div class="badge-circle">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <rect x="5" y="4" width="14" height="17" rx="2" />
                <path d="M9 3.5h6a1 1 0 0 1 1 1V6H8V4.5a1 1 0 0 1 1-1Z" />
                <path d="m9 13 2 2 4-4" />
              </svg>
            </div>
            <span>간편한 수강신청</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 플로팅 로그인 카드 -->
    <div class="login-card" :class="{ 'login-card--wide': showRegister }">
      <transition name="fade-slide" mode="out-in">
        <!-- 로그인 영역 -->
        <div v-if="!showRegister" key="login" class="card-section">
          <h2 class="card-title">Login</h2>

          <div class="switch-link switch-link--left">
            <button type="button" class="text-btn" @click="showRegister = true">회원가입</button>
          </div>

          <button type="button" class="btn btn-primary btn-pill btn-full" @click="handleOAuth">
            로그인
          </button>
        </div>

        <!-- 회원가입 영역 -->
        <div v-else key="register" class="card-section">
          <span class="eyebrow eyebrow--accent">JOIN SKILLBRIDGE</span>
          <h3 class="section-title">회원가입</h3>
          <p class="section-desc">1분이면 시작할 수 있어요.</p>

          <form @submit.prevent="handleRegister" class="form form-grid">
            <div class="form-group">
              <label class="form-label">이름</label>
              <input
                v-model="registerForm.name"
                type="text"
                class="form-input"
                placeholder="홍길동"
                required
              />
            </div>
            <div class="form-group">
              <label class="form-label">이메일</label>
              <input
                v-model="registerForm.email"
                type="email"
                class="form-input"
                placeholder="user@example.com"
                required
              />
            </div>
            <div class="form-group">
              <label class="form-label">비밀번호</label>
              <input
                v-model="registerForm.password"
                type="password"
                class="form-input"
                placeholder="8자 이상"
                minlength="8"
                required
              />
            </div>
            <div class="form-group">
              <label class="form-label">역할</label>
              <select v-model="registerForm.role" class="form-input">
                <option value="STUDENT">학생</option>
                <option value="INSTRUCTOR">강사</option>
              </select>
            </div>
            <div v-if="error" class="error-msg form-span">{{ error }}</div>
            <div v-if="success" class="success-msg form-span">{{ success }}</div>
            <button type="submit" class="btn btn-primary btn-full form-span" :disabled="loading">
              <span v-if="loading">가입 중...</span>
              <span v-else>회원가입</span>
            </button>
          </form>
          <div class="switch-link">
            이미 계정이 있으신가요?
            <button class="text-btn" @click="showRegister = false">로그인</button>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/store/auth.js'
import { authApi } from '@/api/auth.js'
import { isSafeInternalPath } from '@/services/authSession.js'

const auth = useAuthStore()
const route = useRoute()

const showRegister = ref(route.query.mode === 'register')
const loading = ref(false)
const error = ref('')
const success = ref('')

const registerForm = ref({ name: '', email: '', password: '', role: 'STUDENT' })

function handleOAuth() {
  const redirect = isSafeInternalPath(route.query.redirect) ? route.query.redirect : '/courses'
  auth.redirectToLogin(redirect)
}

onMounted(() => {
  if (route.query.oauth === '1') handleOAuth()
})

watch(
  () => route.query.mode,
  (mode) => {
    showRegister.value = mode === 'register'
  },
)

async function handleRegister() {
  error.value = ''
  success.value = ''
  loading.value = true
  try {
    await authApi.register(registerForm.value)
    success.value = '회원가입 완료! 로그인 페이지로 이동합니다.'
    registerForm.value = { name: '', email: '', password: '', role: 'STUDENT' }
    setTimeout(() => {
      showRegister.value = false
      success.value = ''
    }, 2000)
  } catch (e) {
    error.value = e.response?.data?.message || '회원가입에 실패했습니다.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background: #0f2942;
}

/* 좌측 배경 블록 */
.bg-left {
  position: absolute;
  inset: 0;
  width: 42%;
  background: linear-gradient(160deg, #14345a 0%, #1d4671 100%);
}

/* 우측 배경 블록 (패턴 + 브랜드 소개) */
.bg-right {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 58%;
  background: linear-gradient(135deg, #0f2942 0%, #1e3a5f 55%, #2c5282 100%);
  overflow: hidden;
}
.pattern-overlay {
  position: absolute;
  inset: 0;
  background-image: repeating-linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.04) 0px,
    rgba(255, 255, 255, 0.04) 2px,
    transparent 2px,
    transparent 46px
  );
  pointer-events: none;
}

.right-content {
  position: relative;
  z-index: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 64px 90px 64px 140px;
  color: #fff;
}

.org-logo-badge {
  display: inline-flex;
  align-items: center;
  background: #fff;
  border-radius: 12px;
  padding: 10px 16px;
  margin-bottom: 40px;
  width: fit-content;
}
.org-logo {
  height: 40px;
  width: auto;
  display: block;
}

.right-heading {
  font-size: 30px;
  font-weight: 700;
  margin-bottom: 20px;
}
.right-divider {
  width: 44px;
  height: 3px;
  background: rgba(255, 255, 255, 0.6);
  margin-bottom: 20px;
}
.right-desc {
  font-size: 15px;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 56px;
}

.right-badges {
  display: flex;
  gap: 28px;
}
.badge-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
.badge-circle {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}
.badge-circle svg {
  width: 26px;
  height: 26px;
}
.badge-item span {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.9);
}

/* 플로팅 로그인 카드 */
.login-card {
  position: absolute;
  top: 50%;
  left: calc(21% - 170px);
  transform: translateY(-50%);
  z-index: 2;
  width: 340px;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 40px 70px rgba(15, 41, 66, 0.35);
  padding: 40px 34px;
  transition:
    width 0.25s ease,
    left 0.25s ease;
}
.login-card--wide {
  left: calc(21% - 230px);
  width: 460px;
  padding: 40px 40px;
}

.card-section {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.card-title {
  font-size: 30px;
  font-weight: 800;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.switch-link--left {
  text-align: left;
  margin: 12px 0 8px;
}

.btn-pill {
  border-radius: 999px;
}

.eyebrow {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.5px;
  color: #6b8caf;
  margin-bottom: -6px;
}
.eyebrow--accent {
  color: #2c5282;
}

.section-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 4px;
}
.section-desc {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin-bottom: 4px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px 14px;
}
.form-span {
  grid-column: 1 / -1;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}
.form-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-secondary);
}
.form-input {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  padding: 10px 14px;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: 14px;
  font-family: var(--font-sans);
  color: var(--color-text-primary);
  background: var(--color-bg-primary);
  transition: var(--transition);
  outline: none;
}
.form-input:focus {
  border-color: #1e3a5f;
  box-shadow: 0 0 0 3px rgba(30, 58, 95, 0.15);
}

.btn-full {
  width: 100%;
  padding: 13px;
  font-size: 14px;
  justify-content: center;
  margin-top: 4px;
}
.btn-primary {
  background: #1e3a5f;
  border: 1px solid #1e3a5f;
  color: #fff;
  font-weight: 600;
}
.btn-primary:hover {
  background: #15395c;
}
.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.switch-link {
  text-align: center;
  font-size: 13px;
  color: var(--color-text-secondary);
  margin-top: 4px;
}
.text-btn {
  background: none;
  border: none;
  color: #1e3a5f;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  padding: 0 2px;
  text-decoration: underline;
}

.error-msg {
  padding: 10px 14px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: var(--radius-md);
  font-size: 13px;
  color: #dc2626;
}
.success-msg {
  padding: 10px 14px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: var(--radius-md);
  font-size: 13px;
  color: #16a34a;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

@media (max-width: 520px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}

/* 모바일: 오버랩 레이아웃 대신 카드 중앙 정렬로 폴백 */
@media (max-width: 900px) {
  .bg-left,
  .bg-right,
  .right-content {
    display: none;
  }
  .login-page {
    background: linear-gradient(135deg, #0f2942, #1e3a5f, #2c5282);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
  }
  .login-card {
    position: static;
    transform: none;
    width: 100%;
    max-width: 420px;
  }
  .login-card--wide {
    width: 100%;
    max-width: 480px;
  }
}
</style>
