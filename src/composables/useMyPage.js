import { computed, ref } from 'vue'

import { getCurrentUser, getRecommendations } from '@/services/myPageApi'
import { useAuthStore } from '@/store/auth.js'

export function useMyPage() {
  const auth = useAuthStore()
  const isMockPreview = window.location.pathname.replace(/\/$/, '') === '/mypage/mock'
  const user = ref(null)
  const recommendation = ref(null)
  const isProfileLoading = ref(true)
  const isRecommendationLoading = ref(false)
  const profileError = ref('')
  const recommendationError = ref('')

  const isStudent = computed(() => user.value?.role === 'STUDENT')

  async function loadRecommendations() {
    if (!user.value || !isStudent.value) return

    isRecommendationLoading.value = true
    recommendationError.value = ''

    try {
      recommendation.value = await getRecommendations(user.value.id)
    } catch (error) {
      recommendationError.value =
        error instanceof Error ? error.message : '추천 강의를 불러오지 못했습니다.'
    } finally {
      isRecommendationLoading.value = false
    }
  }

  async function loadMyPage() {
    isProfileLoading.value = true
    profileError.value = ''
    recommendation.value = null

    try {
      if (!isMockPreview && auth.user) {
        user.value = auth.user
        await loadRecommendations()
        return
      }

      const response = await getCurrentUser()

      if (!response.success || !response.data) {
        throw new Error(response.message || '내 정보를 불러오지 못했습니다.')
      }

      user.value = response.data
      if (!isMockPreview) {
        auth.setUser(response.data)
      }
      await loadRecommendations()
    } catch (error) {
      profileError.value = error instanceof Error ? error.message : '내 정보를 불러오지 못했습니다.'
    } finally {
      isProfileLoading.value = false
    }
  }

  return {
    user,
    recommendation,
    isStudent,
    isProfileLoading,
    isRecommendationLoading,
    profileError,
    recommendationError,
    loadMyPage,
    loadRecommendations,
  }
}
