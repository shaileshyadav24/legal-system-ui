import React from 'react'
import './Chatbot.scss'

function ChatbotHeader({ title, editableTitle, onTitleChange, onTitleSave, onTogglePin, onSave, onSettings }) {
  return (
    <div className="chatbot-header">
      <div className="chatbot-title-group">
        <input
          className="chat-title-input"
          value={editableTitle}
          onChange={(e) => onTitleChange(e.target.value)}
          onBlur={onTitleSave}
          onKeyDown={(e) => e.key === 'Enter' && onTitleSave()}
          aria-label="Chat title"
        />
        <span className="chat-title-desc">Tap pencil to edit</span>
      </div>
      <div className="chatbot-actions">
        <button type="button" className="action-btn" onClick={onSave} title="Save title">💾</button>
        <button type="button" className="action-btn" onClick={onTogglePin} title="Pin/Unpin chat">📌</button>
        <button type="button" className="action-btn" onClick={onSettings} title="Settings">⚙️</button>
      </div>
    </div>
  )
}

export default React.memo(ChatbotHeader)
