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

// Chat sessions/messages now live server-side; pinning is a client-only
// preference layered on top, so it's tracked separately by session id.
const PINNED_STORAGE_KEY = 'pinnedChatIds'

export const loadPinnedChatIds = () => {
  if (typeof window === 'undefined') return []
  try {
    const parsed = JSON.parse(localStorage.getItem(PINNED_STORAGE_KEY) || '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch (error) {
    return []
  }
}

export const savePinnedChatIds = (ids) => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(PINNED_STORAGE_KEY, JSON.stringify(ids))
  } catch (error) {
    // ignore write failures (e.g. storage disabled)
  }
}
