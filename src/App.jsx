import { useState, useEffect } from 'react'
import UserTypeModal from './components/UserTypeModal'
import Chatbot from './components/Chatbot'
import ChatSidebar from './components/ChatSidebar'
import './App.css'

function App() {
  const [userType, setUserType] = useState(null)
  const [showModal, setShowModal] = useState(true)
  const [chats, setChats] = useState([])
  const [activeChatId, setActiveChatId] = useState(null)

  useEffect(() => {
    // Check if user type is already stored in localStorage
    const storedUserType = localStorage.getItem('userType')
    if (storedUserType) {
      setUserType(storedUserType)
      setShowModal(false)
    }
    // Load chats from localStorage
    const storedChats = localStorage.getItem('chats')
    if (storedChats) {
      const parsedChats = JSON.parse(storedChats)
      setChats(parsedChats)
      if (parsedChats.length > 0) {
        setActiveChatId(parsedChats[0].id)
      }
    }
  }, [])

  const handleUserTypeSelect = (type) => {
    setUserType(type)
    setShowModal(false)
    localStorage.setItem('userType', type)
  }

  const handleNewChat = () => {
    const newChat = {
      id: Date.now().toString(),
      title: 'New Chat',
      lastMessage: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      messages: []
    }
    const updatedChats = [newChat, ...chats]
    setChats(updatedChats)
    setActiveChatId(newChat.id)
    localStorage.setItem('chats', JSON.stringify(updatedChats))
  }

  const handleSelectChat = (chatId) => {
    setActiveChatId(chatId)
  }

  const handleUpdateChat = (chatId, updates) => {
    const updatedChats = chats.map(chat => 
      chat.id === chatId ? { ...chat, ...updates } : chat
    )
    setChats(updatedChats)
    localStorage.setItem('chats', JSON.stringify(updatedChats))
  }

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
            userType={userType}
          />
          <div className="chat-panel">
            {activeChatId ? (
              <Chatbot 
                userType={userType}
                chatId={activeChatId}
                chat={chats.find(c => c.id === activeChatId)}
                onUpdateChat={handleUpdateChat}
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
