const API_BASE_URL = 'http://localhost:8000'
export const AUTH_STORAGE_KEY = 'authUser'

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

const getStoredToken = () => {
  if (typeof window === 'undefined') return null
  try {
    const stored = JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY) || 'null')
    return stored?.token || null
  } catch (error) {
    return null
  }
}

// FastAPI/pydantic 422s return `detail` as an array of {msg, loc, type}; other
// errors return it as a plain string.
const extractErrorDetail = (body) => {
  const detail = body?.detail
  if (Array.isArray(detail)) {
    return detail.map((item) => item?.msg).filter(Boolean).join('; ')
  }
  return typeof detail === 'string' ? detail : undefined
}

export const apiRequest = async (path, { method = 'GET', body, auth = true } = {}) => {
  const headers = { 'Content-Type': 'application/json' }
  if (auth) {
    const token = getStoredToken()
    if (token) headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined
  })

  // 204: success with nothing to return (logout, delete, reset-password) or,
  // for /query/*, "no relevant context found" — callers tell these apart.
  if (response.status === 204) {
    return null
  }

  if (!response.ok) {
    let errorBody
    try {
      errorBody = await response.json()
    } catch (error) {
      // no JSON body to parse
    }
    throw new ApiError(extractErrorDetail(errorBody) || `Request failed with status ${response.status}`, response.status)
  }

  return response.json()
}

export const sendQuery = async (query, userType, { collectionName, sessionId } = {}) => {
  const path = userType?.toLowerCase() === 'lawyer' ? '/query/lawyer' : '/query/user'
  const body = { query, collection_name: collectionName || null, session_id: sessionId || null }

  const data = await apiRequest(path, { method: 'POST', body })

  if (data === null) {
    return { answer: null, urls: [], sessionId: null, noContext: true }
  }

  return { answer: data.answer, urls: data.urls || [], sessionId: data.session_id }
}
