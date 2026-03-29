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

export const deleteChat = (chatId) => {
  // Implement chat deletion logic if needed, e.g., send a request to the backend to delete the chat
  console.log('Deleting chat with ID:', chatId)
}

export const startNewChat = async () => {
  const response = await fetch('http://localhost:8000/chat/start', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return await response.json()
}