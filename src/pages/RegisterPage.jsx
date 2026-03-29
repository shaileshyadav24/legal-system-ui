import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setUserProfile, loginSuccess } from '../store/slices/userSlice'
import { registerUser } from '../services/authService'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

function RegisterPage() {
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

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Register</h2>
        <form onSubmit={onSubmit}>
          <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <label>User Type</label>
          <select value={userType} onChange={(e) => setUserType(e.target.value)}>
            <option value="layman">Layman</option>
            <option value="lawyer">Lawyer</option>
          </select>
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Input label="Re-enter Password" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
          {error && <p className="auth-error">{error}</p>}
          <Button type="submit" disabled={loading} variant="primary" size="md">{loading ? 'Registering...' : 'Register'}</Button>
        </form>
        <div className="auth-links">
          <Link to="/login">Already have account? Login</Link>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage