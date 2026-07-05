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

// Pairs consecutive user/bot messages into {q, answer} turns, capped to the last 5
export const buildChatHistory = (messages, maxTurns = 5) => {
  const turns = []
  for (let i = 0; i < messages.length - 1; i++) {
    const current = messages[i]
    const next = messages[i + 1]
    if (current.sender === 'user' && next.sender === 'bot') {
      turns.push({ q: current.text, answer: next.text })
    }
  }
  return turns.slice(-maxTurns)
}

export const queryAI = async (inputValue, userType, history, collectionName) =>
  sendQuery(inputValue, userType, history, collectionName)
