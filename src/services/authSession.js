const ACCESS_TOKEN_KEY = import.meta.env.VITE_ACCESS_TOKEN_STORAGE_KEY ?? 'accessToken'
const REFRESH_TOKEN_KEY = import.meta.env.VITE_REFRESH_TOKEN_STORAGE_KEY ?? 'refreshToken'
const USER_KEY = import.meta.env.VITE_AUTH_USER_STORAGE_KEY ?? 'authUser'
const RETURN_TO_KEY = 'authReturnTo'
const OAUTH_STATE_KEY = 'oauthState'

function availableStorages() {
  if (typeof window === 'undefined') return []

  try {
    return [window.sessionStorage, window.localStorage]
  } catch {
    return []
  }
}

function preferredStorage() {
  const [sessionStorage, localStorage] = availableStorages()
  return import.meta.env.VITE_AUTH_STORAGE === 'local' ? localStorage : sessionStorage
}

function readFromStorage(key) {
  for (const storage of availableStorages()) {
    const value = storage.getItem(key)
    if (value) return value.replace(/^"|"$/g, '')
  }

  return ''
}

export function getAccessToken() {
  return readFromStorage(ACCESS_TOKEN_KEY)
}

export function setAuthTokens({ accessToken, refreshToken } = {}) {
  const storage = preferredStorage()
  if (!storage) return

  if (accessToken) storage.setItem(ACCESS_TOKEN_KEY, accessToken)
  if (refreshToken) storage.setItem(REFRESH_TOKEN_KEY, refreshToken)
}

export function clearAuthSession({ preserveOAuthState = false } = {}) {
  for (const storage of availableStorages()) {
    storage.removeItem(ACCESS_TOKEN_KEY)
    storage.removeItem(REFRESH_TOKEN_KEY)
    storage.removeItem(USER_KEY)
    if (!preserveOAuthState) storage.removeItem(OAUTH_STATE_KEY)
  }
}

export function getStoredUser() {
  const value = readFromStorage(USER_KEY)
  if (!value) return null

  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}

export function setStoredUser(user) {
  const storage = preferredStorage()
  if (!storage) return

  if (user) storage.setItem(USER_KEY, JSON.stringify(user))
  else storage.removeItem(USER_KEY)
}

export function setAuthReturnTo(path) {
  const storage = preferredStorage()
  if (storage && isSafeInternalPath(path)) storage.setItem(RETURN_TO_KEY, path)
}

export function createOAuthState() {
  const storage = preferredStorage()
  if (!storage || typeof crypto === 'undefined') return ''

  const state =
    typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : Array.from(crypto.getRandomValues(new Uint8Array(24)), (byte) =>
          byte.toString(16).padStart(2, '0'),
        ).join('')

  storage.setItem(OAUTH_STATE_KEY, state)
  return state
}

export function consumeOAuthState(receivedState) {
  const expectedState = readFromStorage(OAUTH_STATE_KEY)
  for (const storage of availableStorages()) storage.removeItem(OAUTH_STATE_KEY)
  return Boolean(receivedState && expectedState && receivedState === expectedState)
}

export function takeAuthReturnTo(fallback = '/courses') {
  const storage = preferredStorage()
  const path = storage?.getItem(RETURN_TO_KEY) ?? ''
  storage?.removeItem(RETURN_TO_KEY)
  return isSafeInternalPath(path) ? path : fallback
}

export function isSafeInternalPath(path) {
  return typeof path === 'string' && path.startsWith('/') && !path.startsWith('//')
}
