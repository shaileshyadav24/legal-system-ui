import { useEffect, useCallback } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useUserStore } from './stores/useUserStore'
import { useChatsStore } from './stores/useChatsStore'
import './App.scss'
import { getStoredUser, fetchCurrentUser, logout as logoutRequest } from './services/authService'
import { AUTH_STORAGE_KEY } from './services/api'
import ChatPage from './pages/ChatPage'
import AuthGuard from './components/AuthGuard'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import ThemeToggle from './components/ThemeToggle'

function App() {
  const navigate = useNavigate()
  const isAuthenticated = useUserStore((state) => state.isAuthenticated)
  const userType = useUserStore((state) => state.userType)
  const logout = useUserStore((state) => state.logout)
  const resetUser = useUserStore((state) => state.resetUser)
  const addDraftChat = useChatsStore((state) => state.addDraftChat)

  useEffect(() => {
    // useUserStore already hydrates isAuthenticated synchronously from
    // localStorage (see stores/useUserStore.js), so a refresh never flashes
    // a logged-out state. This just confirms the cached token is still
    // valid — it may have been revoked from another tab — and drops the
    // session if not.
    const storedUser = getStoredUser()
    if (!storedUser?.token) return

    fetchCurrentUser().catch((error) => {
      if (error?.status === 401) {
        localStorage.removeItem(AUTH_STORAGE_KEY)
        logout()
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleNewChat = useCallback(() => {
    addDraftChat(userType || 'layman')
  }, [addDraftChat, userType])

  const handleSignOut = useCallback(async () => {
    await logoutRequest()
    logout()
    navigate('/login')
  }, [logout, navigate])

  return (
    <>
      <ThemeToggle />
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
              <ChatPage onNewChat={handleNewChat} onUserTypeChange={() => resetUser()} onSignOut={handleSignOut} />
            </AuthGuard>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App
