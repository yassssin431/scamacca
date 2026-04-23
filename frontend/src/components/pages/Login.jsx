import { saveToken } from '../../services/auth'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API_BASE_URL from '../../services/api'
import './Login.css'

function Login() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

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
      <div className="login-glow login-glow-top"></div>
      <div className="login-glow login-glow-bottom"></div>

      <div className="side-illustration" aria-hidden="true">
        <div className="illustration-stack">
          <div className="illus-box big"></div>
          <div className="illus-box small"></div>
          <div className="illus-box small right"></div>
          <div className="illus-box medium"></div>
          <div className="illus-box thin right"></div>
          <div className="illus-box tall"></div>
        </div>
      </div>

      <main className="login-shell">
        <div className="login-branding">
          <div className="login-brand-icon">
            <span className="material-symbols-outlined filled">analytics</span>
          </div>

          <h1 className="login-brand-title">Tradrly</h1>
          <p className="login-brand-subtitle">
            Financial Decision Support System
          </p>

          <div className="login-brand-pills">
            <span>ETL Ready</span>
            <span>Data Warehouse</span>
            <span>Power BI Layer</span>
          </div>
        </div>

        <div className="login-card">
          <div className="login-card-header">
            <h2>Secure Sign In</h2>
            <p>
              Access the operational, analytical and BI workspace of the platform.
            </p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div className="input-wrapper">
                <span className="material-symbols-outlined input-icon">mail</span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your professional email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-group">
              <div className="form-label-row">
                <label htmlFor="password">Password</label>
                <span className="forgot-link disabled-link">Protected Access</span>
              </div>

              <div className="input-wrapper input-wrapper-password">
                <span className="material-symbols-outlined input-icon">lock</span>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
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
              <span className="security-label">Encrypted Session</span>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              <span>{loading ? 'Signing In...' : 'Sign In'}</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </form>

          <div className="login-secondary">
            <div className="secondary-link">
              <span>Authorized roles</span>
              <strong>Admin • Manager • Finance</strong>
            </div>
          </div>
        </div>

        <div className="login-footer">
          <div className="footer-badges">
            <div className="footer-badge">
              <span className="material-symbols-outlined">shield_lock</span>
              <span>JWT Security</span>
            </div>
            <div className="footer-badge">
              <span className="material-symbols-outlined">database</span>
              <span>PostgreSQL</span>
            </div>
            <div className="footer-badge">
              <span className="material-symbols-outlined">bar_chart</span>
              <span>BI Ready</span>
            </div>
          </div>

          <p className="footer-text">
            Centralized financial monitoring, transaction management, AI preparation
            and future Power BI integration in a desktop-oriented architecture.
          </p>
        </div>
      </main>
    </div>
  )
}

export default Login