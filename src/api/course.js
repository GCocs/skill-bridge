import api from './index.js'

export const courseApi = {
  getAll(params) {
    return api.get('/api/courses', { params })
  },
  getById(id) {
    return api.get(`/api/courses/${id}`)
  }
}
