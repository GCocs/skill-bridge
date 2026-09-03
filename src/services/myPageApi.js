import api from '@/api/index.js'

const IS_MOCK_PREVIEW =
  import.meta.env.DEV &&
  typeof window !== 'undefined' &&
  window.location.pathname.replace(/\/$/, '') === '/mypage/mock'
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true' || IS_MOCK_PREVIEW
const USER_SERVICE_URL = (import.meta.env.VITE_USER_SERVICE_URL ?? '/api').replace(/\/$/, '')
const RECOMMEND_SERVICE_URL = (import.meta.env.VITE_RECOMMEND_SERVICE_URL ?? '/api').replace(
  /\/$/,
  '',
)

/**
 * @typedef {'STUDENT' | 'INSTRUCTOR'} UserRole
 * @typedef {{ id: number, email: string, name: string, role: UserRole, createdAt: string }} User
 * @typedef {{ success: boolean, message: string, data: User }} UserApiResponse
 * @typedef {'BACKEND'|'FRONTEND'|'DEVOPS'|'DATA_SCIENCE'|'MOBILE'|'SECURITY'|'DATABASE'|'OTHER'} CourseCategory
 * @typedef {{ id: number, title: string, description: string|null, category: CourseCategory, price: number|string, instructorId: number, enrollmentCount: number, status: string, createdAt: string|null }} Course
 * @typedef {{ userId: number, recommendedCourses: Course[], basedOnCategory: CourseCategory|null, message: string }} RecommendResponse
 */

async function getJson(url) {
  const response = await api.get(url)
  if (response.data == null) {
    throw new Error('서버 응답을 확인할 수 없습니다.')
  }
  return response.data
}

/** @returns {Promise<UserApiResponse>} */
export async function getCurrentUser() {
  if (USE_MOCK_API) {
    const { getMockCurrentUser } = await import('@/data/mockApi')
    return getMockCurrentUser()
  }

  return getJson(`${USER_SERVICE_URL}/users/me`)
}

/** @returns {Promise<RecommendResponse>} */
export async function getRecommendations(userId) {
  if (USE_MOCK_API) {
    const { getMockRecommendations } = await import('@/data/mockApi')
    return getMockRecommendations(userId)
  }

  return getJson(`${RECOMMEND_SERVICE_URL}/recommend/${userId}`)
}
