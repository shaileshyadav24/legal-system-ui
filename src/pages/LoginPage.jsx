import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { loginSuccess } from '../store/slices/userSlice'
import { authenticate } from '../services/authService'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import { usePageContent } from '../hooks/usePageContent'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { content, status } = usePageContent('login')

  const brand = content?.brand ?? { logo: '⚖️', title: 'Review contracts', subtitle: 'with AI Lawyer' }
  const fields = content?.fields ?? { email: 'Email', password: 'Password' }
  const submitLabel = content?.submitButton ?? 'Log in'
  const links = content?.subLinks ?? { forgotPassword: 'Forgot password?', createAccount: 'Create account' }

  const onSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const user = await authenticate(email, password)
      dispatch(loginSuccess({ email: user.email, name: user.name, userType: user.userType }))
      navigate('/chat')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' && !content) {
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

        <form onSubmit={onSubmit} className="auth-form">
          <Input label={fields.email} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label={fields.password} type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {error && <p className="auth-error">{error}</p>}
          <Button type="submit" disabled={loading} variant="primary" size="lg">{loading ? 'Signing in...' : submitLabel}</Button>
        </form>

        <div className="auth-links">
          <Link to="/forgot-password">{links.forgotPassword}</Link>
          <Link to="/register">{links.createAccount}</Link>
        </div>
      </div>
    </div>
  )
}

export default LoginPage