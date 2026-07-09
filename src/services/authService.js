import { apiRequest, AUTH_STORAGE_KEY } from './api'

const persistSession = (data) => {
  const session = { token: data.access_token, ...data.user }
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))
  return session
}

export const registerUser = async ({ name, email, password }) => {
  const data = await apiRequest('/auth/register', {
    method: 'POST',
    auth: false,
    body: { email, password, full_name: name }
  })
  return persistSession(data)
}

export const authenticate = async (email, password) => {
  const data = await apiRequest('/auth/login', {
    method: 'POST',
    auth: false,
    body: { email, password }
  })
  return persistSession(data)
}

export const fetchCurrentUser = () => apiRequest('/auth/me', { method: 'GET' })

export const logout = async () => {
  try {
    await apiRequest('/auth/logout', { method: 'POST' })
  } catch (error) {
    // token may already be invalid/expired/revoked — discard locally regardless
  } finally {
    localStorage.removeItem(AUTH_STORAGE_KEY)
  }
}

export const getStoredUser = () => {
  if (typeof window === 'undefined') return null
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
  } catch (error) {
    return null
  }
}

export const sendPasswordResetEmail = async (email) => {
  const data = await apiRequest('/auth/forgot-password', {
    method: 'POST',
    auth: false,
    body: { email }
  })
  if (data?.reset_token) {
    // Dev-only: no email delivery is wired up server-side yet, so the token
    // is surfaced here for local testing. Never render this in the UI.
    console.info('[dev] password reset token:', data.reset_token)
  }
  return data
}

export const resetPassword = async (token, newPassword) => {
  await apiRequest('/auth/reset-password', {
    method: 'POST',
    auth: false,
    body: { token, new_password: newPassword }
  })
  return { success: true }
}
