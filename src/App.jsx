import { useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { loginSuccess, resetUser, logout } from './store/slices/userSlice'
import { setChats, addChat } from './store/slices/chatsSlice'
import './App.scss'
import { startChatSession, loadStoredChats, persistChats } from './services/chatService'
import { getStoredUser } from './services/authService'
import ChatPage from './pages/ChatPage'
import AuthGuard from './components/AuthGuard'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'

function App() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isAuthenticated } = useSelector(state => state.user)
  const { chats } = useSelector(state => state.chats)

  useEffect(() => {
    const storedUser = getStoredUser()
    if (storedUser) {
      dispatch(loginSuccess({ name: storedUser.name, email: storedUser.email, userType: storedUser.userType }))
    }

    const storedChats = loadStoredChats()
    if (storedChats.length) {
      dispatch(setChats(storedChats))
    }
  }, [dispatch])

  useEffect(() => {
    persistChats(chats)
  }, [chats])

  const handleNewChat = useCallback(async () => {
    dispatch(addChat({ userType: 'layman', title: 'New Chat', id: Math.random() }))
    // const state = JSON.parse(localStorage.getItem('authUser') || '{}')
    // const userType = state?.userType || 'layman'
    // try {
    //   const newChat = await startChatSession(userType)
    //   dispatch(addChat(newChat))
    // } catch (error) {
    //   console.error('Failed to start new chat:', error)
    // }
  }, [dispatch])

  const handleSignOut = useCallback(() => {
    dispatch(logout())
    localStorage.removeItem('authUser')
    navigate('/login')
  }, [dispatch, navigate])

  return (
      <Routes>
        <Route path="/" element={<Navigate to={isAuthenticated ? '/chat' : '/login'} replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        <Route
          path="/chat"
          element={
            <AuthGuard>
              <ChatPage onNewChat={handleNewChat} onUserTypeChange={() => dispatch(resetUser())} onSignOut={handleSignOut} />
            </AuthGuard>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
  )
}

export default App
