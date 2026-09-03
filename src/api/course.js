import api from './index.js'

export const courseApi = {
  getAll(params) {
    return api.get('/api/courses', { params })
  },
  getById(id) {
    return api.get(`/api/courses/${id}`)
  },
  create(course) {
    return api.post('/api/courses', course)
  },
  // 유저플로우 문서 API 매핑 기준 카테고리 전용 엔드포인트.
  // 프록시/백엔드 라우팅 확정 전까지는 store에서 아직 안 씀 (기존 클라이언트 필터 유지).
  getByCategory(category) {
    return api.get(`/api/courses/category/${category}`)
  }
}
