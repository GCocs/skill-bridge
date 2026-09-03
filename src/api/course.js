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
}
