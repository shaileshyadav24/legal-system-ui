import './ChatSidebar.css'

function ChatSidebar({ chats, activeChatId, onSelectChat, onNewChat, userType, onUserTypeChange }) {
  return (
    <div className="chat-sidebar">
      <div className="sidebar-header">
        <h2>Legal System</h2>
        <button onClick={onUserTypeChange} className="user-type-badge">{userType}</button>
      </div>
      <button className="new-chat-button" onClick={onNewChat}>
        + New Chat
      </button>
      <div className="chats-list">
        {chats.length === 0 ? (
          <div className="empty-chats">
            <p>No chats yet</p>
            <p className="empty-hint">Start a new conversation</p>
          </div>
        ) : (
          chats.map((chat) => (
            <div
              key={chat.id}
              className={`chat-item ${activeChatId === chat.id ? 'active' : ''}`}
              onClick={() => onSelectChat(chat.id)}
            >
              <div className="chat-item-preview">
                <div className="chat-item-title">
                  {chat.title || 'New Chat'}
                </div>
                <div className="chat-item-preview-text">
                  {chat.lastMessage || ''}
                </div>
              </div>
              <div className="chat-item-time">
                {chat.timestamp || ''}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default ChatSidebar
