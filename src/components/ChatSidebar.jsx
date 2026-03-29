import Card from './ui/Card'
import Button from './ui/Button'
import './ChatSidebar.scss'

function ChatSidebar({ chats, activeChatId, onSelectChat, onNewChat, userType, userName, onUserTypeChange, onSignOut, onDeleteChat, content }) {
  const title = content?.title || 'Legal System'
  const newChatText = content?.newChat || '+ New Chat'
  const emptyChatsText = content?.emptyChats || 'No chats yet'
  const emptyHint = content?.emptyHint || 'Start a new conversation'
  const profileName = userName || content?.profile?.defaultName || 'Guest User'
  const profileType = userType || content?.profile?.defaultType || 'Unknown'
  const signOutText = content?.signOut || 'Sign Out'
  const deleteIcon = content?.deleteChat || '✕'

  return (
    <div className="chat-sidebar">
      <div className="sidebar-header">
        <h2>{title}</h2>
        <Button onClick={onUserTypeChange} variant="secondary" size="sm">{userType}</Button>
      </div>
      <Button onClick={onNewChat} variant="primary" size="md" className="new-chat-button">
        {newChatText}
      </Button>
      <div className="chats-list">
        {chats.length === 0 ? (
          <div className="empty-chats">
            <p>{emptyChatsText}</p>
            <p className="empty-hint">{emptyHint}</p>
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
                  <span>{chat.title || content?.newChatTitle || 'New Chat'}</span>
                  <Button
                    className="delete-icon"
                    variant="danger"
                    size="sm"
                    onClick={(e) => { e.stopPropagation(); onDeleteChat(chat.id)}}
                  >
                    {deleteIcon}
                  </Button>
                </div>
              </div>
              <div className="chat-item-time">{chat.timestamp || ''}</div>
            </Card>
          ))
        )}
      </div>
      <div className="sidebar-footer">
        <div className="sidebar-profile">
          <div className="profile-icon">👤</div>
          <div>
            <div className="profile-name">{profileName}</div>
            <div className="profile-type">{profileType}</div>
          </div>
        </div>
        <Button onClick={onSignOut} variant="secondary" size="sm" className="signout-button">{signOutText}</Button>
      </div>
    </div>
  )
}

export default ChatSidebar
