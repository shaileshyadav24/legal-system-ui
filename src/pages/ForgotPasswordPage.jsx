import { useState } from 'react'
import { Link } from 'react-router-dom'
import { sendPasswordResetEmail } from '../services/authService'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import { usePageContent } from '../hooks/usePageContent'

function ForgotPasswordPage() {
  const { content, status: contentStatus } = usePageContent('forgot-password')
  const brand = content?.brand ?? { logo: '⚖️', title: 'Review contracts', subtitle: 'with AI Lawyer' }
  const fieldLabel = content?.fields?.email ?? 'Email'
  const submitLabel = content?.submitButton ?? 'Send reset link'
  const backLinkLabel = content?.subLinks?.backLogin ?? 'Back to Login'
  const sendingText = content?.statusMessages?.sending ?? 'Sending...'
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setStatus('')
    setLoading(true)
    try {
      const result = await sendPasswordResetEmail(email)
      setStatus(result.message)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (contentStatus === 'loading' && !content) {
    return <div className="auth-page">Loading...</div>
  }

  return (
    <div className="auth-page">
      <div className="auth-card auth-brand-card">
        <div className="brand-top">
          <div className="brand-logo">{brand.logo}</div>
          <h1>{brand.title}</h1>
          <p className="brand-subtitle">{brand.subtitle}</p>
        </div>

        <h2>{content?.heading ?? 'Forgot Password'}</h2>
        <form onSubmit={onSubmit} className="auth-form">
          <Input label={fieldLabel} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Button type="submit" disabled={loading} variant="primary" size="md">{loading ? sendingText : submitLabel}</Button>
        </form>
        {status && <p className="auth-success">{status}</p>}
        {error && <p className="auth-error">{error}</p>}
        <div className="auth-links">
          <Link to="/login">{backLinkLabel}</Link>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage