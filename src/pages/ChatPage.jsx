import { lazy, Suspense, useMemo, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setActiveChat, togglePinChat, deleteChat } from '../store/slices/chatsSlice'
import { usePageContent } from '../hooks/usePageContent'

const ChatSidebar = lazy(() => import('../components/ChatSidebar'))
const Chatbot = lazy(() => import('../components/Chatbot'))

function ChatPage({ onNewChat, onUserTypeChange, onSignOut }) {
  const dispatch = useDispatch()
  const { userType, userName } = useSelector(state => state.user)
  const { chats, activeChatId } = useSelector(state => state.chats)
  const { content, status } = usePageContent('chat')

  const sidebarContent = content?.sidebar || {}
  const chatbotContent = content?.chatbot || {}
  const loadingText = content?.loading?.components || 'Loading chat components...'
  const noChatSelectedText = chatbotContent.noChatSelected || 'Select a chat or start a new one'

  const activeChat = useMemo(() => chats.find(chat => chat.id === activeChatId), [chats, activeChatId])

  const handleSelectChat = useCallback((chatId) => {
    dispatch(setActiveChat(chatId))
  }, [dispatch])

  const handleTogglePinChat = useCallback((chatId) => {
    dispatch(togglePinChat(chatId))
  }, [dispatch])

  const handleDeleteChat = useCallback((chatId) => {
    dispatch(deleteChat(chatId))
  }, [dispatch])

  return (
    <Suspense fallback={<div className="loading">{loadingText}</div>}>
      <div className="app-layout">
        <ChatSidebar
          chats={chats}
          activeChatId={activeChatId}
          onSelectChat={handleSelectChat}
          onNewChat={onNewChat}
          onTogglePinChat={handleTogglePinChat}
          onDeleteChat={handleDeleteChat}
          onUserTypeChange={onUserTypeChange}
          onSignOut={onSignOut}
          userType={userType}
          userName={userName}
          content={sidebarContent}
        />
        <div className="chat-panel">
          {activeChatId ? (
            <Chatbot
              userType={userType}
              chatId={activeChatId}
              chat={activeChat}
              content={chatbotContent}
            />
          ) : (
            <div className="no-chat-selected">
              <h2>{noChatSelectedText}</h2>
            </div>
          )}
        </div>
      </div>
    </Suspense>
  )
}

export default ChatPage