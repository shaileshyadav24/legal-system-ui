import { configureStore } from '@reduxjs/toolkit'
import userReducer from './slices/userSlice'
import chatsReducer from './slices/chatsSlice'
import contentReducer from './slices/contentSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    chats: chatsReducer,
    content: contentReducer
  }
})