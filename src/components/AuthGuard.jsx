import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

function AuthGuard({ children }) {
  const isAuthenticated = useSelector(state => state.user.isAuthenticated)
  // if (!isAuthenticated) {
  //   return <Navigate to="/login" replace />
  // }
  return children
}

export default AuthGuard