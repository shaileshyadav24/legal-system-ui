import Card from './ui/Card'
import Button from './ui/Button'
import ChatSidebarItem from './ChatSidebarItem'
import './ChatSidebar.scss'

function ChatSidebar({ chats, activeChatId, onSelectChat, onNewChat, userType, userName, onUserTypeChange, onSignOut, onDeleteChat, onTogglePinChat, content, isCollapsed, onToggleCollapse }) {
  const title = content?.title || 'Legal System'
  const newChatText = content?.newChat || '+ New Chat'
  const emptyChatsText = content?.emptyChats || 'No chats yet'
  const emptyHint = content?.emptyHint || 'Start a new conversation'
  const profileName = userName || content?.profile?.defaultName || 'Guest User'
  const profileType = userType || content?.profile?.defaultType || 'Unknown'
  const signOutText = content?.signOut || 'Sign Out'
  const deleteIcon = content?.deleteChat || '✕'

  return (
    <div className={`chat-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <h2>{title}</h2>
        <div className="header-actions">
          <Button onClick={onToggleCollapse} variant="secondary" size="sm" className="toggle-button" title={isCollapsed ? 'Expand' : 'Collapse'}>
            {isCollapsed ? '→' : '←'}
          </Button>
        </div>
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
          <>
            {chats.filter(chat => chat.isPinned).length > 0 && (
              <section className="sidebar-section">
                <h3>Pinned chats</h3>
                {chats.filter(chat => chat.isPinned).map((chat) => (
                  <ChatSidebarItem
                    key={chat.id}
                    chat={chat}
                    isActive={activeChatId === chat.id}
                    onSelect={onSelectChat}
                    onTogglePin={onTogglePinChat}
                    onDelete={onDeleteChat}
                    content={content}
                    showDelete={false}
                  />
                ))}
              </section>
            )}

            <section className="sidebar-section">
              <h3>History</h3>
              {chats.filter(chat => !chat.isPinned).map((chat) => (
                <ChatSidebarItem
                  key={chat.id}
                  chat={chat}
                  isActive={activeChatId === chat.id}
                  onSelect={onSelectChat}
                  onTogglePin={onTogglePinChat}
                  onDelete={onDeleteChat}
                  content={content}
                  showDelete
                />
              ))}
            </section>
          </>
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
