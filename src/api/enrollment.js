import api from './index.js'
import { getStoredUser } from '@/services/authSession.js'

export const enrollmentApi = {
  getMine() {
    return api.get('/api/enrollments/my')
  },
  create(courseId) {
    if (getStoredUser()?.role !== 'STUDENT') {
      throw new Error('강사 계정은 수강 신청을 할 수 없습니다.')
    }
    return api.post('/api/enrollments', { courseId })
  },
}
