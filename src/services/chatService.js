import { startNewChat } from './api'

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

export const createChatPayload = (userType) => ({
  id: Date.now().toString(),
  title: 'New Chat',
  lastMessage: '',
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  messages: [],
  userType
})

export const startChatSession = async (userType) => {
  const payload = createChatPayload(userType)

  try {
    const data = await startNewChat()
    if (data?.session_id) {
      payload.id = data.session_id
    }
  } catch (error) {
    console.error('Failed to start new chat:', error)
    throw error
  }

  return payload
}
