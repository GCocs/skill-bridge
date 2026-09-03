import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/store/auth.js'

const routes = [
  {
    path: '/',
    name: 'Main',
    component: () => import('@/views/MainView.vue'),
    meta: { title: '홈' },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: { guestOnly: true, hideHeader: true, title: '로그인' },
  },
  {
    path: '/callback',
    name: 'Callback',
    component: () => import('@/views/CallbackView.vue'),
    meta: { publicOnly: true, hideHeader: true, title: '로그인 처리' },
  },
  {
    path: '/courses',
    name: 'CourseList',
    component: () => import('@/views/CourseListView.vue'),
    meta: { requiresAuth: true, title: '강의 목록' },
  },
  {
    path: '/courses/new',
    name: 'CourseCreate',
    component: () => import('@/views/CourseCreateView.vue'),
    meta: { requiresAuth: true, instructorOnly: true, title: '강의 등록' },
  },
  {
    path: '/courses/:id(\\d+)',
    name: 'CourseDetail',
    component: () => import('@/views/CourseDetailView.vue'),
    meta: { requiresAuth: true, title: '강의 상세' },
  },
  {
    path: '/enrollments',
    name: 'Enrollment',
    component: () => import('@/views/EnrollmentView.vue'),
    meta: { requiresAuth: true, studentOnly: true, title: '내 성장 현황' },
  },
  {
    path: '/mypage',
    name: 'MyPage',
    component: () => import('@/views/MyPageView.vue'),
    meta: { requiresAuth: true, title: '마이페이지' },
  },
  {
    path: '/mypage/mock',
    name: 'MyPageMock',
    component: () => import('@/views/MyPageView.vue'),
    meta: { mockOnly: true, title: '마이페이지 미리보기' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { title: '페이지를 찾을 수 없음' },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

// 인증/권한 가드
router.beforeEach(async (to) => {
  const auth = useAuthStore()

  if (to.meta.mockOnly) {
    return import.meta.env.DEV ? true : { name: 'MyPage' }
  }

  if ((to.meta.requiresAuth || to.meta.guestOnly) && !auth.initialized) {
    await auth.initialize()
  }

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'Login', query: { redirect: to.fullPath } }
  }

  if (to.meta.guestOnly && auth.isAuthenticated) {
    return { name: 'CourseList' }
  }

  if (to.meta.instructorOnly && auth.user?.role !== 'INSTRUCTOR') {
    return { name: 'CourseList' }
  }

  if (to.meta.studentOnly && auth.user?.role !== 'STUDENT') {
    return { name: 'CourseList' }
  }

  return true
})

router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} | Skill Bridge` : 'Skill Bridge'
})

export default router
