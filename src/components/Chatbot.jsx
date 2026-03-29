import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { addMessage } from '../store/slices/chatsSlice'
import { sendQuery } from '../services/api'
import Button from './ui/Button'
import Input from './ui/Input'
import './Chatbot.scss'

function Chatbot({ userType, chatId, chat }) {
  const dispatch = useDispatch()
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const messages = chat ? chat.messages || [] : []

// Reset messages when chatId changes - no longer needed as messages are in Redux

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const handleSend = useCallback(async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage = {
      text: inputValue,
      sender: 'user'
    }

    dispatch(addMessage({ chatId, message: userMessage }))
    setInputValue('')
    setIsLoading(true)

    const history = messages.filter((m, index) => (m.sender === 'user' || m.sender === 'bot') && index > 0).map(m => ({
      q: m.text,
      sender: m.sender
    }))

    try {
      const response = await sendQuery(inputValue, userType, history)
      let responseText = response.answer || response.text || response.message || 'I received your message.'
      // Remove "Response:" prefix if present
      responseText = responseText.replace(/^Response:\s*/i, '').trim()
      const botMessage = {
        text: responseText,
        urls: response.urls || [],
        sender: 'bot'
      }
      dispatch(addMessage({ chatId, message: botMessage }))
    } catch (error) {
      const errorMessage = {
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot'
      }
      dispatch(addMessage({ chatId, message: errorMessage }))
      console.error('Error sending message:', error)
    } finally {
      setIsLoading(false)
    }
  }, [inputValue, isLoading, dispatch, chatId, messages, userType])

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }, [handleSend])

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h1>Legal Chat</h1>
      </div>
      <div className="messages-container">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
          >
            <div className="message-content">
              {message.text.split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))}

            {message.urls && message.urls.length > 0 && (
              <>
                <ol className="message-urls">
                  <b>Related Links:</b>
                  {message.urls.map((url, idx) => (
                    <li key={idx}>
                      <a href={url} target="_blank" rel="noopener noreferrer" className="message-url">
                       {url.length > 50 ? url.substring(0, 47) + '...' : url}
                      </a>
                    </li>
                  ))}
                </ol>
              </>
            )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message bot-message">
            <div className="message-content loading">
              <div className="loading-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="input-container">
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <Button
          onClick={handleSend}
          disabled={isLoading || !inputValue.trim()}
          variant="primary"
          size="md"
        >
          Send
        </Button>
      </div>
    </div>
  )
}

export default React.memo(Chatbot)
