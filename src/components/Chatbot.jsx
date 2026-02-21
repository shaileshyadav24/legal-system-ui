import { useState, useRef, useEffect } from 'react'
import { sendQuery } from '../services/api'
import './Chatbot.css'

function Chatbot({ userType, chatId, chat, onUpdateChat }) {
  const [messages, setMessages] = useState([
    {
      text: `Hello! You are logged in as a ${userType}. How can I help you today?`,
      sender: 'bot'
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  // Reset messages when chatId changes
  useEffect(() => {
    if (chat && chat.messages && chat.messages.length > 0) {
      setMessages(chat.messages)
    } else {
      setMessages([
        {
          text: `Hello! You are logged in as a ${userType}. How can I help you today?`,
          sender: 'bot'
        }
      ])
    }
  }, [chatId, userType, chat])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Update chat title and save messages when messages change
    if (messages.length > 1 && onUpdateChat) {
      const firstUserMessage = messages.find(m => m.sender === 'user')
      if (firstUserMessage) {
        const title = firstUserMessage.text.substring(0, 50)
        onUpdateChat(chatId, {
          title: title.length < firstUserMessage.text.length ? title + '...' : title,
          lastMessage: messages[messages.length - 1].text.substring(0, 60),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          messages: messages
        })
      }
    }
  }, [messages, chatId, onUpdateChat])

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage = {
      text: inputValue,
      sender: 'user'
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      const response = await sendQuery(inputValue, userType)
      let responseText = response.answer || response.text || response.message || 'I received your message.'
      // Remove "Response:" prefix if present
      responseText = responseText.replace(/^Response:\s*/i, '').trim()
      const botMessage = {
        text: responseText,
        sender: 'bot'
      }
      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      const errorMessage = {
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot'
      }
      setMessages(prev => [...prev, errorMessage])
      console.error('Error sending message:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

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
              {message.text}
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
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          disabled={isLoading}
          className="message-input"
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !inputValue.trim()}
          className="send-button"
        >
          Send
        </button>
      </div>
    </div>
  )
}

export default Chatbot
