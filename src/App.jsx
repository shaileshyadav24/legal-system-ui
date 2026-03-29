import { useState, useEffect, useMemo, useCallback, lazy, Suspense } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setUserType, resetUser } from './store/slices/userSlice'
import { setChats, addChat, setActiveChat, deleteChat } from './store/slices/chatsSlice'
import './App.scss'
import { startNewChat } from './services/api'

// Lazy load components
const UserTypeModal = lazy(() => import('./components/UserTypeModal'))
const Chatbot = lazy(() => import('./components/Chatbot'))
const ChatSidebar = lazy(() => import('./components/ChatSidebar'))
function App() {
  const dispatch = useDispatch()
  const { userType, showModal } = useSelector(state => state.user)
  const { chats, activeChatId } = useSelector(state => state.chats)

  useEffect(() => {
    // Check if user type is already stored in localStorage
    const storedUserType = localStorage.getItem('userType')
    if (storedUserType) {
      dispatch(setUserType(storedUserType))
    }
  }, [dispatch])

  useEffect(() => {
    // Save chats to localStorage whenever chats change
    localStorage.setItem('chats', JSON.stringify(chats))
  }, [chats])

  const handleUserTypeSelect = useCallback((type) => {
    dispatch(setUserType(type))
    localStorage.setItem('userType', type)
  }, [dispatch])

  const handleNewChat = useCallback(async () => {
    const newChat = {
      id: Date.now().toString(),
      title: 'New Chat',
      lastMessage: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      messages: []
    }
    await startNewChat().then(data => {
      newChat.id = data.session_id
      dispatch(addChat({ ...newChat, userType }))
    }).catch(error => {
      console.error('Failed to start new chat:', error)
    })
  }, [dispatch, userType])

  const handleSelectChat = useCallback((chatId) => {
    dispatch(setActiveChat(chatId))
  }, [dispatch])

  const changeUserType = useCallback(() => {
    localStorage.removeItem('userType')
    dispatch(resetUser())
  }, [dispatch])

  const deleteChat = useCallback((chatId) => {
    dispatch(deleteChat(chatId))
  }, [dispatch])

  const activeChat = useMemo(() => chats.find(chat => chat.id === activeChatId), [chats, activeChatId])

  return (
    <div className="app">
      {showModal && (
        <Suspense fallback={<div className="loading">Loading...</div>}>
          <UserTypeModal onSelect={handleUserTypeSelect} />
        </Suspense>
      )}
      {!showModal && userType && (
        <Suspense fallback={<div className="loading">Loading chat...</div>}>
          <div className="app-layout">
            <ChatSidebar
              chats={chats}
              activeChatId={activeChatId}
              onSelectChat={handleSelectChat}
              onNewChat={handleNewChat}
              onUserTypeChange={changeUserType}
              userType={userType}
              onDeleteChat={deleteChat}
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
      )}
    </div>
  )
}

export default App
