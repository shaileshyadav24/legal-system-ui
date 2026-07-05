const API_BASE_URL = 'http://localhost:8000'
const API_URL_USER = `${API_BASE_URL}/query/user`
const API_URL_LAWYER = `${API_BASE_URL}/query/lawyer`

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export const sendQuery = async (query, userType, history = [], collectionName) => {
  const url = userType?.toLowerCase() === 'lawyer' ? API_URL_LAWYER : API_URL_USER
  const body = { query, history }
  if (collectionName) body.collection_name = collectionName

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body)
  })

  // 204: query understood but no relevant context was found in the collection(s)
  if (response.status === 204) {
    return { answer: null, urls: [], noContext: true }
  }

  if (!response.ok) {
    let detail
    try {
      const errorBody = await response.json()
      detail = errorBody?.detail
    } catch (error) {
      // no JSON body to parse
    }

    if (response.status === 404) {
      throw new ApiError(detail || `Unknown collection: ${collectionName}`, 404)
    }
    if (response.status === 500) {
      throw new ApiError(detail || 'The AI model failed to generate a response.', 500)
    }
    throw new ApiError(detail || `Request failed with status ${response.status}`, response.status)
  }

  return await response.json()
}
