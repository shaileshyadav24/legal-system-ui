const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
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

  let response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined
    })
  } catch (error) {
    // fetch() rejects (rather than resolving with a non-ok response) on
    // network-level failures — server down, CORS, offline — with an opaque
    // browser message like "Failed to fetch". Surface something actionable.
    throw new ApiError('Unable to reach the server. Check your connection and try again.', 0)
  }

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
