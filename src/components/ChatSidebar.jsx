import Card from './ui/Card'
import Button from './ui/Button'
import './ChatSidebar.scss'

function ChatSidebar({ chats, activeChatId, onSelectChat, onNewChat, userType, userName, onUserTypeChange, onSignOut, onDeleteChat }) {
  return (
    <div className="chat-sidebar">
      <div className="sidebar-header">
        <h2>Legal System</h2>
        <Button onClick={onUserTypeChange} variant="secondary" size="sm">{userType}</Button>
      </div>
      <Button onClick={onNewChat} variant="primary" size="md" className="new-chat-button">
        + New Chat
      </Button>
      <div className="sidebar-footer">
        <div className="sidebar-profile">
          <div className="profile-icon">👤</div>
          <div>
            <div className="profile-name">{userName || 'Guest User'}</div>
            <div className="profile-type">{userType || 'Unknown'}</div>
          </div>
        </div>
        <Button onClick={onSignOut} variant="secondary" size="sm" className="signout-button">Sign Out</Button>
      </div>
      <div className="chats-list">
        {chats.length === 0 ? (
          <div className="empty-chats">
            <p>No chats yet</p>
            <p className="empty-hint">Start a new conversation</p>
          </div>
        ) : (
          chats.map((chat) => (
            <Card
              key={chat.id}
              className={`chat-item ${activeChatId === chat.id ? 'active' : ''}`}
              onClick={() => onSelectChat(chat.id)}
            >
              <div className="chat-item-preview">
                <div className="chat-item-title">
                  <span>{chat.title || 'New Chat'}</span>
                  <Button
                    className="delete-icon"
                    variant="danger"
                    size="sm"
                    onClick={(e) => { e.stopPropagation(); onDeleteChat(chat.id)}}
                  >
                    ✕
                  </Button>
                </div>
              </div>
              <div className="chat-item-time">{chat.timestamp || ''}</div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

export default ChatSidebar
