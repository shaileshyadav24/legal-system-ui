import { sendQuery } from './api'

export const createUserMessage = (text) => ({ text, sender: 'user' })

export const createBotMessage = (response, defaultResponse) => {
  let responseText = response?.answer || response?.text || response?.message || defaultResponse
  responseText = responseText.replace(/^Response:\s*/i, '').trim()
  return {
    text: responseText,
    urls: response?.urls || [],
    sender: 'bot'
  }
}

export const createErrorMessage = (errorText) => ({ text: errorText, sender: 'bot' })

export const buildChatHistory = (messages) => messages
  .filter(m => m.sender === 'user' || m.sender === 'bot')
  .slice(1)
  .map(m => ({ q: m.text, sender: m.sender }))

export const queryAI = async (inputValue, userType, history) => {
  const response = await sendQuery(inputValue, userType, history)
  return response
}
