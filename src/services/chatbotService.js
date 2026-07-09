import { sendQuery } from './api'

export const createUserMessage = (text) => ({ text, sender: 'user' })

export const createBotMessage = (response, defaultResponse) => {
  if (response?.noContext) {
    return {
      text: defaultResponse || 'No relevant information was found for that question.',
      urls: [],
      sender: 'bot'
    }
  }

  return {
    text: response?.answer || defaultResponse,
    urls: response?.urls || [],
    sender: 'bot'
  }
}

export const createErrorMessage = (error, defaultErrorText) => ({
  text: error?.status === 404
    ? 'That legal collection could not be found.'
    : error?.message || defaultErrorText,
  sender: 'bot'
})

// Converts a backend session history entry into the two chat bubbles it represents.
export const messageFromHistoryEntry = (entry) => ([
  { text: entry.query, sender: 'user' },
  { text: entry.answer, urls: entry.urls || [], sender: 'bot' }
])

// The server now owns conversation history (keyed by session_id); it no
// longer accepts client-supplied history.
export const queryAI = async (inputValue, userType, { sessionId, collectionName } = {}) =>
  sendQuery(inputValue, userType, { sessionId, collectionName })
