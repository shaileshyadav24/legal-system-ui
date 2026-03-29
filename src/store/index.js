import { configureStore } from '@reduxjs/toolkit'
import userReducer from './slices/userSlice'
import chatsReducer from './slices/chatsSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    chats: chatsReducer
  }
})