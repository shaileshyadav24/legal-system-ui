import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  chats: [],
  activeChatId: null
}

const chatsSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    setChats: (state, action) => {
      state.chats = action.payload
      if (state.chats.length > 0 && !state.activeChatId) {
        state.activeChatId = state.chats[0].id
      }
    },
    addChat: (state, action) => {
      const { userType, ...chatData } = action.payload
      const initialMessage = {
        text: `Hello! You are logged in as a ${userType}. How can I help you today?`,
        sender: 'bot'
      }
      const newChat = { ...chatData, messages: [initialMessage], isPinned: false }
      state.chats.unshift(newChat)
      state.activeChatId = newChat.id
    },
    togglePinChat: (state, action) => {
      const chatId = action.payload
      const chat = state.chats.find(item => item.id === chatId)
      if (chat) {
        chat.isPinned = !chat.isPinned
      }
    },
    setActiveChat: (state, action) => {
      state.activeChatId = action.payload
    },
    updateChat: (state, action) => {
      const { chatId, updates } = action.payload
      const chatIndex = state.chats.findIndex(chat => chat.id === chatId)
      if (chatIndex !== -1) {
        state.chats[chatIndex] = { ...state.chats[chatIndex], ...updates }
      }
    },
    deleteChat: (state, action) => {
      const chatId = action.payload
      state.chats = state.chats.filter(chat => chat.id !== chatId)
      if (state.activeChatId === chatId) {
        state.activeChatId = state.chats.length > 0 ? state.chats[0].id : null
      }
    },
    addMessage: (state, action) => {
      const { chatId, message } = action.payload
      const chat = state.chats.find(chat => chat.id === chatId)
      if (chat) {
        if (!chat.messages) chat.messages = []
        chat.messages.push(message)
        // Update lastMessage and timestamp
        chat.lastMessage = message.text.substring(0, 60)
        chat.timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        // Update title if first user message
        if (message.sender === 'user' && chat.messages.filter(m => m.sender === 'user').length === 1) {
          chat.title = message.text.substring(0, 50) + (message.text.length > 50 ? '...' : '')
        }
      }
    }
  }
})

export const { setChats, addChat, togglePinChat, setActiveChat, updateChat, deleteChat, addMessage } = chatsSlice.actions
export default chatsSlice.reducer