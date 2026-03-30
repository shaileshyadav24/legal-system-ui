import Button from './ui/Button'
import Card from './ui/Card'

function ChatSidebarItem({ chat, isActive, onSelect, onTogglePin, onDelete, content, showDelete = true }) {
  return (
    <Card
      className={`chat-item ${isActive ? 'active' : ''}`}
      onClick={() => onSelect(chat.id)}
    >
      <div className="chat-item-title">
        <span>{chat.title || content?.newChatTitle || 'New Chat'}</span>
        <div className="chat-item-actions">
          <Button
            onClick={(e) => { e.stopPropagation(); onTogglePin(chat.id) }}
            variant="secondary"
            size="xs"
            className="pin-icon"
            title={chat.isPinned ? 'Unpin chat' : 'Pin chat'}
          >
            {chat.isPinned ? '📌' : '📍'}
          </Button>
          {showDelete && (
            <Button
              className="delete-icon"
              variant="danger"
              size="sm"
              onClick={(e) => { e.stopPropagation(); onDelete(chat.id) }}
              title="Delete chat"
            >
              ✕
            </Button>
          )}
        </div>
      </div>
      <div className="chat-item-time">{chat.timestamp || ''}</div>
    </Card>
  )
}

export default ChatSidebarItem
