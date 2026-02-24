const API_URL = 'http://localhost:8000/query/user'
const API_URL_LAWYER = 'http://localhost:8000/query/lawyer'

export const sendQuery = async (query, userType, history = []) => {
  let url = userType.toLowerCase() === 'lawyer' ? API_URL_LAWYER : API_URL
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      user_type: userType,
      history
    })
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return await response.json()
}
