import { useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { resetPassword } from '../services/authService'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

function useQuery() {
  return new URLSearchParams(useLocation().search)
}

function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const query = useQuery()
  const token = query.get('token') || 'demo-token'
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }

    setError('')
    setLoading(true)
    try {
      await resetPassword(token, password)
      setSuccess('Password updated. Please login.')
      setTimeout(() => navigate('/login'), 1200)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Reset Password</h2>
        <form onSubmit={onSubmit}>
          <Input label="New Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Input label="Confirm Password" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
          <Button type="submit" disabled={loading} variant="primary" size="md">{loading ? 'Updating...' : 'Reset Password'}</Button>
        </form>
        {success && <p className="auth-success">{success}</p>}
        {error && <p className="auth-error">{error}</p>}
        <div className="auth-links">
          <Link to="/login">Back to Login</Link>
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordPage