import React, { useMemo } from 'react'
import './Chatbot.scss'

function ChatbotMessageList({ messages, messagesEndRef, relatedLinksLabel, isLoading }) {
  const computedMessages = useMemo(() => messages, [messages])

  return (
    <div className="messages-container">
      {computedMessages.map((message, index) => (
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
                  <b>{relatedLinksLabel}</b>
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
  )
}

export default React.memo(ChatbotMessageList)
