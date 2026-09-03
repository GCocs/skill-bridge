import axios from 'axios'

// 로그인(signIn 브랜치) merge 전까지는 인증 헤더 없이 호출.
// 이후 Authorization 헤더 자동 부착 interceptor는 auth store와 함께 추가 예정.
const api = axios.create({
  baseURL: '',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
})

export default api
