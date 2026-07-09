import { apiRequest } from './api'

export const fetchSessions = () => apiRequest('/chat/sessions', { method: 'GET' })

export const fetchSessionMessages = (sessionId) =>
  apiRequest(`/chat/sessions/${sessionId}/messages`, { method: 'GET' })

export const deleteSession = (sessionId) =>
  apiRequest(`/chat/sessions/${sessionId}`, { method: 'DELETE' })
