import { saveToken } from '../../services/auth'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API_BASE_URL from '../../services/api'
import './Login.css'

function Login() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.email || !formData.password) {
      setError('Please enter your email and password.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const contentType = response.headers.get('content-type') || ''
      const data = contentType.includes('application/json')
        ? await response.json()
        : { message: await response.text() }

      if (!response.ok) {
        throw new Error(data.message || 'Login failed')
      }

      saveToken(data.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Unable to sign in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-screen">
      <div className="security-pattern"></div>

      <main className="login-shell">
        <div className="login-branding">
          <div className="login-brand-icon">
            <span className="material-symbols-outlined filled">analytics</span>
          </div>

          <h1 className="login-brand-title">Tradrly</h1>

          <div className="login-brand-pills">
            <span>Financial Monitoring</span>
            <span>BI Workspace</span>
            <span>Secure Access</span>
          </div>
        </div>

        <div className="login-card">
          <div className="login-card-rail" aria-hidden="true">
            <span>01</span>
            <span>JWT</span>
            <span>RBAC</span>
          </div>

          <div className="login-card-header">
            <span className="login-card-kicker">Welcome back</span>
            <h2>Secure Sign In</h2>
            <p>Access your financial decision support workspace.</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>

              <div className="input-wrapper input-wrapper-icon-right">
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your professional email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
                <span className="material-symbols-outlined input-icon">mail</span>
              </div>
            </div>

            <div className="form-group">
              <div className="form-label-row">
                <label htmlFor="password">Password</label>
                <span className="secure-note">Protected access</span>
              </div>

              <div className="input-wrapper input-wrapper-password">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />

                <span className="material-symbols-outlined input-icon password-lock">
                  lock
                </span>

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label="Toggle password visibility"
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {error && <p className="login-error">{error}</p>}

            <div className="security-row">
              <div className="security-bar">
                <div className="security-bar-fill"></div>
              </div>
              <span className="security-label">Encrypted session</span>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              <span>{loading ? 'Signing in...' : 'Sign In'}</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </form>

          <div className="login-trust-row">
            <span><i /> Token protected</span>
            <span><i /> Role-aware workspace</span>
          </div>
        </div>

        <div className="login-footer">
            <span>© 2026 Tradrly</span>
          </div>
      </main>
    </div>
  )
}

export default Login
