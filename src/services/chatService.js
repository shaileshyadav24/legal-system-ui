export const loadStoredUserType = () => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('userType') || null
}

export const storeUserType = (type) => {
  if (typeof window === 'undefined') return
  localStorage.setItem('userType', type)
}

export const clearStoredUserType = () => {
  if (typeof window === 'undefined') return
  localStorage.removeItem('userType')
}

export const loadStoredChats = () => {
  if (typeof window === 'undefined') return []
  const storedChats = localStorage.getItem('chats')
  if (!storedChats) return []
  try {
    const parsed = JSON.parse(storedChats)
    return Array.isArray(parsed) ? parsed : []
  } catch (error) {
    console.error('Failed parse stored chats:', error)
    return []
  }
}

export const persistChats = (chats) => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem('chats', JSON.stringify(chats))
  } catch (error) {
    console.error('Failed to persist chats:', error)
  }
}
