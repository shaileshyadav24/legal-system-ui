import { useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { resetPassword } from '../services/authService'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import { usePageContent } from '../hooks/usePageContent'

function useQuery() {
  return new URLSearchParams(useLocation().search)
}

function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const { content, status: contentStatus } = usePageContent('reset-password')

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

  if (contentStatus === 'loading' && !content) {
    return <div className="auth-page auth-page--loading">Loading...</div>
  }

  return (
    <div className="auth-page">
      <div className="auth-card auth-brand-card">
        <div className="brand-top">
          <div className="brand-logo">{content?.brand?.logo}</div>
          <h1>{content?.brand?.title}</h1>
          <p className="brand-subtitle">{content?.brand?.subtitle}</p>
        </div>

        <h2>{content?.heading ?? 'Reset Password'}</h2>
        <form onSubmit={onSubmit} className="auth-form">
          <Input label={content?.fields?.newPassword} type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Input label={content?.fields?.confirmPassword} type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
          <Button type="submit" disabled={loading} variant="primary" size="md">{loading ? content?.statusMessages?.updating : content?.submitButton}</Button>
        </form>
        {success && <p className="auth-success">{success}</p>}
        {error && <p className="auth-error">{error}</p>}
        <div className="auth-links">
          <Link to="/login">{content?.subLinks?.backLogin}</Link>
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordPage