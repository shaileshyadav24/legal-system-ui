import { useState } from 'react'
import { Link } from 'react-router-dom'
import { sendPasswordResetEmail } from '../services/authService'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

function ForgotPasswordPage() {
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

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Forgot Password</h2>
        <form onSubmit={onSubmit}>
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Button type="submit" disabled={loading} variant="primary" size="md">{loading ? 'Sending...' : 'Send reset link'}</Button>
        </form>
        {status && <p className="auth-success">{status}</p>}
        {error && <p className="auth-error">{error}</p>}
        <div className="auth-links">
          <Link to="/login">Back to Login</Link>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage