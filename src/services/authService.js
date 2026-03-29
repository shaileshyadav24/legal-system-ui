const USER_STORAGE_KEY = 'authUser'

export const authenticate = async (email, password) => {
  const validEmail = 'abcd@gmail.com'
  const validPassword = '12345'

  await new Promise(resolve => setTimeout(resolve, 250))

  if (email === validEmail && password === validPassword) {
    const user = { email, name: 'Abcd User', userType: 'layman', token: 'fake-jwt-token' }
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
    return user
  }

  throw new Error('Invalid credentials')
}

export const logout = () => {
  localStorage.removeItem(USER_STORAGE_KEY)
}

export const registerUser = async ({ name, userType, email, password }) => {
  if (!name || !email || !password || !userType) {
    throw new Error('All fields are required')
  }
  await new Promise(resolve => setTimeout(resolve, 300))
  const user = { name, userType, email, token: 'fake-jwt-token' }
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
  return user
}

export const getStoredUser = () => {
  if (typeof window === 'undefined') return null
  try {
    const stored = localStorage.getItem(USER_STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
  } catch (error) {
    return null
  }
}

export const sendPasswordResetEmail = async (email) => {
  await new Promise(resolve => setTimeout(resolve, 400))
  if (!email) throw new Error('Email required')
  // Demo only; no real email
  return { success: true, message: 'Password reset link sent if the email exists.' }
}

export const resetPassword = async (token, newPassword) => {
  await new Promise(resolve => setTimeout(resolve, 400))
  if (!token || !newPassword) {
    throw new Error('Token and new password required')
  }
  return { success: true }
}
