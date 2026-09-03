import axios from 'axios'
import { getAccessToken } from '@/services/authSession.js'

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL ?? ''

// 개발 서버에서는 같은 출처의 Vite 프록시를 사용한다. 브라우저가 Gateway와
// 하위 서비스가 각각 추가한 중복 CORS 헤더를 직접 해석하지 않게 하기 위함이다.
// 배포 빌드에서는 환경 변수에 지정된 Gateway 주소를 그대로 사용한다.
const apiBaseUrl = import.meta.env.DEV ? '' : configuredBaseUrl

const api = axios.create({
  baseURL: apiBaseUrl,
  timeout: 10000,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const accessToken = getAccessToken()

  if (accessToken) {
    config.headers.Authorization = /^Bearer\s/i.test(accessToken)
      ? accessToken
      : `Bearer ${accessToken}`
  }

  return config
})

export default api
