import { getMockCurrentUser, getMockRecommendations } from '@/data/mockApi'

const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== 'false'
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
  const response = await fetch(url, {
    method: 'GET',
    credentials: 'include',
    headers: { Accept: 'application/json' },
  })

  if (!response.ok) {
    throw new Error(`요청을 완료하지 못했습니다. (${response.status})`)
  }

  return response.json()
}

/** @returns {Promise<UserApiResponse>} */
export function getCurrentUser() {
  if (USE_MOCK_API) return getMockCurrentUser()
  return getJson(`${USER_SERVICE_URL}/users/me`)
}

/** @returns {Promise<RecommendResponse>} */
export function getRecommendations(userId) {
  if (USE_MOCK_API) return getMockRecommendations(userId)
  return getJson(`${RECOMMEND_SERVICE_URL}/recommend/${userId}`)
}
