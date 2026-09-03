<template>
  <header class="app-header">
    <div class="header-inner">
      <!-- 로고 -->
      <router-link :to="{ name: 'Main' }" class="logo" aria-label="SkillBridge 홈으로 이동">
        <span class="logo-symbol" aria-hidden="true">
          <img :src="logoLockup" alt="" class="logo-mark" />
        </span>
        <span class="logo-name">SkillBridge</span>
      </router-link>

      <!-- 검색 -->
      <form v-if="showCourseSearch" class="search-box" role="search" @submit.prevent="handleSearch">
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
          >강의 목록</router-link
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
import logoLockup from '@/assets/logo-lockup.png'

const auth = useAuthStore()
const courseStore = useCourseStore()
const route = useRoute()
const router = useRouter()
const showCourseSearch = computed(() => route.meta.showCourseSearch === true)

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
.logo-symbol {
  display: block;
  width: 42px;
  height: 40px;
  overflow: hidden;
}
.logo-mark {
  display: block;
  width: 58px;
  height: auto;
  max-width: none;
  transform: translate(-8px, 0);
}
.logo-name {
  color: var(--navy-900);
  font-size: 17px;
  font-weight: 700;
  letter-spacing: -0.025em;
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

  .logo-name {
    display: none;
  }
}

@media (max-width: 640px) {
  .header-inner {
    height: 68px;
    padding: 0 16px;
    gap: 14px;
  }

  .nav-links {
    gap: 14px;
  }

  .header-actions {
    margin-left: 0;
  }

  .user-name {
    display: none;
  }

  .user-chip {
    padding-right: 5px;
  }

  .header-actions .btn-sm {
    padding: 8px 13px;
  }
}

@media (max-width: 480px) {
  .nav-links {
    margin-left: auto;
  }

  .nav-links .nav-link:not(.active) {
    display: none;
  }

  .header-actions {
    gap: 6px;
  }
}
</style>
