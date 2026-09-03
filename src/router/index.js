import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/mypage',
      name: 'mypage',
      component: () => import('@/views/MyPageView.vue'),
    },
    {
      path: '/mypage/mock',
      name: 'mypage-mock',
      component: () => import('@/views/MyPageView.vue'),
      beforeEnter: () => (import.meta.env.DEV ? true : { name: 'mypage' }),
    },
  ],
})

export default router
