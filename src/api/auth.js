import api from './index.js'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
const AUTH_SERVER_URL = import.meta.env.VITE_AUTH_SERVER_URL || API_BASE_URL
const AUTHORIZATION_URL =
  import.meta.env.VITE_AUTH_LOGIN_URL || `${AUTH_SERVER_URL}/oauth2/authorize`
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID || 'web-client'
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI || 'http://localhost:3000/callback'
const OAUTH_SCOPE = import.meta.env.VITE_OAUTH_SCOPE || 'openid read write'

export const authApi = {
  getRedirectUri() {
    return REDIRECT_URI
  },

  getLoginUrl(state) {
    const url = new URL(AUTHORIZATION_URL, window.location.origin)
    url.searchParams.set('response_type', 'code')
    url.searchParams.set('client_id', CLIENT_ID)
    url.searchParams.set('redirect_uri', REDIRECT_URI)
    url.searchParams.set('scope', OAUTH_SCOPE)
    if (state) url.searchParams.set('state', state)
    return url.toString()
  },

  // OAuth2 Authorization Code -> Access Token 교환
  // CLIENT_SECRET_BASIC: Authorization 헤더에 client_id:client_secret을 Base64로 인코딩
  exchangeCode(code) {
    const clientId = CLIENT_ID
    const clientSecret = import.meta.env.VITE_CLIENT_SECRET
    const redirectUri = REDIRECT_URI

    if (!clientSecret) {
      throw new Error('VITE_CLIENT_SECRET이 설정되지 않았습니다.')
    }

    const credentials = btoa(`${clientId}:${clientSecret}`)

    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
    })

    return axios.post(`${AUTH_SERVER_URL}/oauth2/token`, body.toString(), {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${credentials}`,
      },
    })
  },

  // 내 정보 조회
  getMe() {
    return api.get('/api/users/me')
  },

  // 회원가입
  register(data) {
    return api.post('/api/users/register', data)
  },
}
