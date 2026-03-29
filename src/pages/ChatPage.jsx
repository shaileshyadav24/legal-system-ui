import { lazy, Suspense, useMemo, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setActiveChat } from '../store/slices/chatsSlice'

const ChatSidebar = lazy(() => import('../components/ChatSidebar'))
const Chatbot = lazy(() => import('../components/Chatbot'))

function ChatPage({ onNewChat, onUserTypeChange, onSignOut }) {
  const dispatch = useDispatch()
  const { userType, userName } = useSelector(state => state.user)
  const { chats, activeChatId } = useSelector(state => state.chats)

  const activeChat = useMemo(() => chats.find(chat => chat.id === activeChatId), [chats, activeChatId])

  const handleSelectChat = useCallback((chatId) => {
    dispatch(setActiveChat(chatId))
  }, [dispatch])

  return (
    <Suspense fallback={<div className="loading">Loading chat components...</div>}>
      <div className="app-layout">
        <ChatSidebar
          chats={chats}
          activeChatId={activeChatId}
          onSelectChat={handleSelectChat}
          onNewChat={onNewChat}
          onUserTypeChange={onUserTypeChange}
          onSignOut={onSignOut}
          userType={userType}
          userName={userName}
        />
        <div className="chat-panel">
          {activeChatId ? (
            <Chatbot
              userType={userType}
              chatId={activeChatId}
              chat={activeChat}
            />
          ) : (
            <div className="no-chat-selected">
              <h2>Select a chat or start a new one</h2>
            </div>
          )}
        </div>
      </div>
    </Suspense>
  )
}

export default ChatPage