import { Navigate } from 'react-router-dom'
import { useUserStore } from '../stores/useUserStore'

function AuthGuard({ children }) {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated)
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  return children
}

export default AuthGuard
