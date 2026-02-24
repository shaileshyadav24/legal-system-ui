import { useState, useRef, useEffect } from 'react'
import { sendQuery } from '../services/api'
import './Chatbot.scss'

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
      // Only update if messages are different
      const isDifferent =
        chat.messages.length !== messages.length ||
        chat.messages.some((m, i) => m.text !== messages[i]?.text || m.sender !== messages[i]?.sender)
      if (isDifferent) {
        setMessages(chat.messages)
      }
    } else {
      if (
        messages.length !== 1 ||
        messages[0].sender !== 'bot' ||
        messages[0].text !== `Hello! You are logged in as a ${userType}. How can I help you today?`
      ) {
        setMessages([
          {
            text: `Hello! You are logged in as a ${userType}. How can I help you today?`,
            sender: 'bot'
          }
        ])
      }
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
