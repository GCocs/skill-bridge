<template>
  <header class="app-header">
    <div class="header-inner">
      <!-- 로고 -->
      <router-link :to="{ name: 'Main' }" class="logo">
        <img src="/skill-bridge-logo.png" alt="SkillBridge" class="logo-mark" />
      </router-link>

      <!-- 검색 -->
      <form class="search-box" role="search" @submit.prevent="handleSearch">
        <span class="search-icon">⌕</span>
        <input
          v-model="searchQuery"
          type="search"
          aria-label="강의 검색"
          placeholder="강의를 검색하세요"
        />
      </form>

      <!-- 네비게이션 -->
      <nav class="nav-links" v-if="auth.isAuthenticated">
        <router-link
          :to="{ name: 'CourseList' }"
          class="nav-link"
          :class="{ active: route.path.startsWith('/courses') }"
          >학습경로</router-link
        >
        <router-link
          v-if="auth.user?.role === 'STUDENT'"
          :to="{ name: 'Enrollment' }"
          class="nav-link"
          :class="{ active: route.path === '/enrollments' }"
          >내 성장현황</router-link
        >
      </nav>

      <!-- 우측 액션 -->
      <div class="header-actions">
        <template v-if="auth.isAuthenticated">
          <router-link :to="{ name: 'MyPage' }" class="user-chip">
            <span class="user-avatar">{{ auth.user?.name?.charAt(0) || '?' }}</span>
            <span class="user-name">{{ auth.user?.name }}</span>
          </router-link>
          <button class="btn btn-ghost btn-sm" @click="handleLogout">로그아웃</button>
        </template>
        <template v-else>
          <router-link
            :to="{ name: 'Login', query: { mode: 'register' } }"
            class="btn btn-outline btn-sm"
            >Register</router-link
          >
          <router-link :to="{ name: 'Login' }" class="btn btn-dark btn-sm">Login</router-link>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useAuthStore } from '@/store/auth.js'
import { useCourseStore } from '@/store/course.js'
import { useRoute, useRouter } from 'vue-router'

const auth = useAuthStore()
const courseStore = useCourseStore()
const route = useRoute()
const router = useRouter()

const searchQuery = computed({
  get: () => courseStore.searchQuery,
  set: (value) => courseStore.setSearchQuery(value),
})

function handleSearch() {
  const query = searchQuery.value.trim()
  router.push({ name: 'CourseList', query: query ? { q: query } : {} })
}

async function handleLogout() {
  await auth.logout()
  router.push({ name: 'Main' })
}

watch(
  () => route.query.q,
  (query) => {
    if (route.name === 'CourseList')
      courseStore.setSearchQuery(typeof query === 'string' ? query : '')
  },
  { immediate: true },
)
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
  height: 38px;
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
  color: #11345a;
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
  border-color: #11345a;
  color: #11345a;
}
.btn-dark {
  background: #11345a;
  color: #fff;
  border: 1.5px solid #11345a;
}
.btn-dark:hover {
  background: #1f5f92;
  border-color: #1f5f92;
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
  background: #edf2f7;
  transition: var(--transition);
}
.user-chip:hover {
  background: #c9d6e4;
}
.user-avatar {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #c9d6e4;
  color: #11345a;
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
@media (max-width: 900px) {
  .search-box {
    display: none;
  }
}
</style>
