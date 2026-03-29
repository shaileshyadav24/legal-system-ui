import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setUserType, resetUser } from './store/slices/userSlice'
import { setChats, addChat, setActiveChat, deleteChat } from './store/slices/chatsSlice'
import UserTypeModal from './components/UserTypeModal'
import Chatbot from './components/Chatbot'
import ChatSidebar from './components/ChatSidebar'
import './App.scss'
import { startNewChat } from './services/api'
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

  const handleUserTypeSelect = (type) => {
    dispatch(setUserType(type))
    localStorage.setItem('userType', type)
  }

  const handleNewChat = async () => {
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
  }

  const handleSelectChat = (chatId) => {
    dispatch(setActiveChat(chatId))
  }

  const changeUserType = () => {
    localStorage.removeItem('userType')
    dispatch(resetUser())
  }

  const deleteChat = (chatId) => {
    dispatch(deleteChat(chatId))
  }

  const activeChat = chats.find(chat => chat.id === activeChatId)

  return (
    <div className="app">
      {showModal && (
        <UserTypeModal onSelect={handleUserTypeSelect} />
      )}
      {!showModal && userType && (
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
      )}
    </div>
  )
}

export default App
