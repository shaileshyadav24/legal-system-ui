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
  const brand = content?.brand ?? { logo: '⚖️', title: 'Review contracts', subtitle: 'with AI Lawyer' }
  const newPasswordLabel = content?.fields?.newPassword ?? 'New Password'
  const confirmPasswordLabel = content?.fields?.confirmPassword ?? 'Confirm Password'
  const submitLabel = content?.submitButton ?? 'Reset Password'
  const backLinkLabel = content?.subLinks?.backLogin ?? 'Back to Login'
  const updatingText = content?.statusMessages?.updating ?? 'Updating...'
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
          <div className="brand-logo">{brand.logo}</div>
          <h1>{brand.title}</h1>
          <p className="brand-subtitle">{brand.subtitle}</p>
        </div>

        <h2>{content?.heading ?? 'Reset Password'}</h2>
        <form onSubmit={onSubmit} className="auth-form">
          <Input label={newPasswordLabel} type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Input label={confirmPasswordLabel} type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
          <Button type="submit" disabled={loading} variant="primary" size="md">{loading ? updatingText : submitLabel}</Button>
        </form>
        {success && <p className="auth-success">{success}</p>}
        {error && <p className="auth-error">{error}</p>}
        <div className="auth-links">
          <Link to="/login">{backLinkLabel}</Link>
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordPage