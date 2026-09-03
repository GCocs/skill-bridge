<template>
  <header class="app-header">
    <div class="header-inner">
      <!-- 로고 -->
      <router-link to="/" class="logo">
        <img src="@/assets/images/logo/logo-transparent.png" alt="SkillBridge" class="logo-mark" />
      </router-link>

      <!-- 검색 -->
      <div class="search-box">
        <span class="search-icon">⌕</span>
        <input type="text" placeholder="Search Your course" />
      </div>

      <!-- 네비게이션 -->
      <nav class="nav-links" v-if="auth.isAuthenticated">
        <router-link to="/courses" class="nav-link" :class="{ active: $route.path.startsWith('/courses') }">학습경로</router-link>
        <router-link to="/enrollments" class="nav-link" :class="{ active: $route.path === '/enrollments' }">내 성장현황</router-link>
      </nav>

      <!-- 우측 액션 -->
      <div class="header-actions">
        <template v-if="auth.isAuthenticated">
          <router-link to="/mypage" class="user-chip">
            <span class="user-avatar">{{ auth.user?.name?.charAt(0) || '?' }}</span>
            <span class="user-name">{{ auth.user?.name }}</span>
            <span class="chevron">⌄</span>
          </router-link>
          <button class="btn btn-ghost btn-sm" @click="handleLogout">로그아웃</button>
        </template>
        <template v-else>
          <router-link to="/login" class="btn btn-outline btn-sm">Register</router-link>
          <router-link to="/login" class="btn btn-dark btn-sm">Login</router-link>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useAuthStore } from '@/store/auth.js'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

function handleLogout() {
  auth.logout()
  router.push('/')
}
</script>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: #fff;
  border-bottom: 1px solid var(--color-border);
}
.header-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
  height: 76px;
  display: flex;
  align-items: center;
  gap: 28px;
}
.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}
.logo-mark {
  height: 54px;
  width: auto;
  object-fit: contain;
  flex-shrink: 0;
}

.search-box {
  flex: 1;
  max-width: 340px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 16px;
  border: 1px solid var(--color-border);
  border-radius: 24px;
  color: var(--color-text-muted);
}
.search-icon {
  font-size: 15px;
}
.search-box input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 13px;
  font-family: var(--font-sans);
  background: transparent;
  color: var(--color-text-primary);
}
.search-box input::placeholder {
  color: var(--color-text-muted);
}

.nav-links {
  display: flex;
  gap: 20px;
  margin-left: auto;
}
.nav-link {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-secondary);
  transition: var(--transition);
}
.nav-link:hover,
.nav-link.active {
  color: #11345A;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: 24px;
  flex-shrink: 0;
}
.btn-sm {
  padding: 8px 18px;
  font-size: 13px;
  border-radius: 20px;
}
.btn-outline {
  background: transparent;
  color: var(--color-text-primary);
  border: 1.5px solid var(--color-border);
}
.btn-outline:hover {
  border-color: #11345A;
  color: #11345A;
}
.btn-dark {
  background: #11345A;
  color: #fff;
  border: 1.5px solid #11345A;
}
.btn-dark:hover {
  background: #1F5F92;
  border-color: #1F5F92;
}
.header-actions .btn-ghost {
  color: var(--color-text-secondary);
}
.header-actions .btn-ghost:hover {
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
}

.user-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 14px 5px 5px;
  border-radius: 20px;
  background: #EDF2F7;
  transition: var(--transition);
}
.user-chip:hover {
  background: #C9D6E4;
}
.user-avatar {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #C9D6E4;
  color: #11345A;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.user-name {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-primary);
}
.chevron {
  font-size: 12px;
  color: var(--color-text-muted);
}

@media (max-width: 900px) {
  .search-box {
    display: none;
  }
}
</style>
