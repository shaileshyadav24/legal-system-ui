import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setUserProfile, loginSuccess } from '../store/slices/userSlice'
import { registerUser } from '../services/authService'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import { usePageContent } from '../hooks/usePageContent'

function RegisterPage() {
  const { content, status } = usePageContent('register')

  const [name, setName] = useState('')
  const [userType, setUserType] = useState('layman')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      const user = await registerUser({ name, userType, email, password })
      dispatch(setUserProfile({ name: user.name, email: user.email, userType: user.userType }))
      dispatch(loginSuccess({ name: user.name, email: user.email, userType: user.userType }))
      navigate('/chat')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' && !content) {
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

        <form onSubmit={onSubmit} className="auth-form">
          <Input label={content?.fields?.name} value={name} onChange={(e) => setName(e.target.value)} required />
          <div className="ui-input-wrapper">
            <label className="ui-input-label">{content?.fields?.userType}</label>
            <select className="ui-input" value={userType} onChange={(e) => setUserType(e.target.value)}>
              {content?.userTypeOptions?.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <Input label={content?.fields?.email} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label={content?.fields?.password} type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Input label={content?.fields?.confirm} type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
          {error && <p className="auth-error">{error}</p>}
          <Button type="submit" disabled={loading} variant="primary" size="lg">{loading ? 'Creating account...' : content?.submitButton}</Button>
        </form>
        <div className="auth-links">
          <Link to="/login">{content?.subLinks?.haveAccount}</Link>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage