import { useEffect, useState } from 'react'
import './Settings.css'
import PageHeader from '../common/PageHeader'
import { getCurrentUser, getCurrentUserRole } from '../../services/auth'
import Toast from '../common/Toast'

const getStoredPreference = (key, fallback) => {
  try {
    return localStorage.getItem(key) || fallback
  } catch {
    return fallback
  }
}

function Settings() {
  const role = getCurrentUserRole()
  const user = getCurrentUser()
  const [toast, setToast] = useState(null)

  const isAdmin = role === 'Admin'
  const isFinance = role === 'Finance'
  const isManager = role === 'Manager'

  const [settings, setSettings] = useState({
    username: user?.username || 'Current User',
    email: user?.email || 'user@tradrly.local',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    defaultPage: getStoredPreference(
      'defaultPage',
      isFinance ? 'financial-transactions' : 'dashboard'
    ),
    density: getStoredPreference('density', 'comfortable'),
    language: getStoredPreference('language', 'English'),
    appearance: getStoredPreference('appearance', 'light'),
    sessionTimeout: Number(getStoredPreference('sessionTimeout', '45')),
    refreshMode: getStoredPreference('refreshMode', 'manual'),
    reportView: getStoredPreference(
      'reportView',
      isFinance ? 'Financial Reports' : 'Executive Overview'
    ),
  })

  useEffect(() => {
    document.body.classList.toggle('dark-mode', settings.appearance === 'dark')
    document.documentElement.setAttribute(
      'data-density',
      settings.density === 'compact' ? 'compact' : 'comfortable'
    )
  }, [settings.appearance, settings.density])

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 2500)
  }

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSavePreferences = () => {
    localStorage.setItem('defaultPage', settings.defaultPage)
    localStorage.setItem('density', settings.density)
    localStorage.setItem('language', settings.language)
    localStorage.setItem('appearance', settings.appearance)
    localStorage.setItem('sessionTimeout', String(settings.sessionTimeout))
    localStorage.setItem('refreshMode', settings.refreshMode)
    localStorage.setItem('reportView', settings.reportView)

    showToast('Preferences saved successfully')
  }

  const handleChangePassword = () => {
    if (!settings.currentPassword || !settings.newPassword || !settings.confirmPassword) {
      showToast('Please fill all password fields', 'error')
      return
    }

    if (settings.newPassword !== settings.confirmPassword) {
      showToast('New passwords do not match', 'error')
      return
    }

    showToast('Password change prepared. Backend endpoint can be connected later.')
    updateSetting('currentPassword', '')
    updateSetting('newPassword', '')
    updateSetting('confirmPassword', '')
  }

  const pageText = {
    title: settings.language === 'French' ? 'Paramètres' : 'Settings',
    subtitle:
      settings.language === 'French'
        ? `Compte, préférences et configuration selon le rôle ${role || 'Utilisateur'}`
        : `Account, preferences and role-based configuration for ${role || 'User'}`,
    save: settings.language === 'French' ? 'Enregistrer' : 'Save Preferences',
  }

  return (
    <div className="settings-page">
      <PageHeader
        title={pageText.title}
        subtitle={pageText.subtitle}
        right={
          <button className="primary-btn" onClick={handleSavePreferences}>
            {pageText.save}
          </button>
        }
      />

      <section className="settings-profile-card">
        <div className="settings-profile-left">
          <div className="settings-profile-avatar">
            {(settings.username || 'U').slice(0, 2).toUpperCase()}
          </div>

          <div>
            <h3>{settings.username}</h3>
            <p>{settings.email}</p>
          </div>
        </div>

        <div className="settings-profile-meta">
          <span>Current Role</span>
          <strong>{role || 'Unknown'}</strong>
        </div>
      </section>

      <div className="settings-note">
        Role-based configuration is applied dynamically based on your system privileges.
      </div>

      <section className="settings-overview">
        <div className="settings-overview-card">
          <p>Language</p>
          <h3>{settings.language}</h3>
          <span>Interface preference stored locally</span>
        </div>

        <div className="settings-overview-card">
          <p>Appearance</p>
          <h3>{settings.appearance === 'dark' ? 'Dark' : 'Light'}</h3>
          <span>Applies globally to the workspace</span>
        </div>

        <div className="settings-overview-card">
          <p>Density</p>
          <h3>{settings.density}</h3>
          <span>Controls table and layout spacing</span>
        </div>
      </section>

      <div className="settings-grid-top">
        <section className="general-card">
          <div className="section-head">
            <h4>Account Information</h4>
            <p>Basic identity information used inside the application.</p>
          </div>

          <div className="two-cols">
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                value={settings.username}
                onChange={(e) => updateSetting('username', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => updateSetting('email', e.target.value)}
              />
            </div>
          </div>

          <div className="settings-note">
            Account updates are currently stored locally in the interface. Backend profile update can be connected later.
          </div>
        </section>

        {isAdmin ? (
          <section className="security-access-card">
            <div className="section-head">
              <h4>Security Administration</h4>
              <p>Authentication and access-control settings reserved for administrators.</p>
            </div>

            <div className="toggle-row">
              <div>
                <strong>JWT Authentication</strong>
                <p>Secure token-based login is enabled.</p>
              </div>
              <div className="toggle on">
                <div></div>
              </div>
            </div>

            <div className="toggle-row">
              <div>
                <strong>Role-Based Access</strong>
                <p>Navigation is filtered by user role.</p>
              </div>
              <div className="toggle on">
                <div></div>
              </div>
            </div>

            <div className="slider-box">
              <label>Session Timeout</label>
              <div className="slider-row">
                <input
                  type="range"
                  min="15"
                  max="120"
                  value={settings.sessionTimeout}
                  onChange={(e) => updateSetting('sessionTimeout', Number(e.target.value))}
                />
                <span>{settings.sessionTimeout}m</span>
              </div>
            </div>
          </section>
        ) : (
          <section className="alerts-card-settings">
            <div className="section-head">
              <h4>Access Summary</h4>
              <p>Your role determines which settings and modules are available.</p>
            </div>

            <div className="settings-status-list">
              <div className="settings-status-item">
                <span>Security Parameters</span>
                <strong>Read-only</strong>
              </div>
              <div className="settings-status-item">
                <span>Managed By</span>
                <strong>Administrator</strong>
              </div>
              <div className="settings-status-item">
                <span>Current Access</span>
                <strong>{isFinance ? 'Financial Operations' : 'Decision Dashboards'}</strong>
              </div>
            </div>
          </section>
        )}
      </div>

      <div className="settings-grid-mid">
        <section className="general-card">
          <div className="section-head">
            <h4>Change Password</h4>
            <p>Update your access credentials.</p>
          </div>

          <div className="form-group">
            <label>Current Password</label>
            <input
              type="password"
              value={settings.currentPassword}
              onChange={(e) => updateSetting('currentPassword', e.target.value)}
              placeholder="Enter current password"
            />
          </div>

          <div className="two-cols">
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                value={settings.newPassword}
                onChange={(e) => updateSetting('newPassword', e.target.value)}
                placeholder="Enter new password"
              />
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                value={settings.confirmPassword}
                onChange={(e) => updateSetting('confirmPassword', e.target.value)}
                placeholder="Confirm new password"
              />
            </div>
          </div>

          <button className="secondary-btn" onClick={handleChangePassword}>
            Update Password
          </button>
        </section>

        <section className="alerts-card-settings">
          <div className="section-head">
            <h4>{isFinance ? 'Financial Preferences' : 'Display Preferences'}</h4>
            <p>Customize how the cockpit opens and displays information.</p>
          </div>

          <div className="form-group">
            <label>Default Landing Page</label>
            <select
              value={settings.defaultPage}
              onChange={(e) => updateSetting('defaultPage', e.target.value)}
            >
              {(isAdmin || isManager) && <option value="dashboard">Dashboard</option>}
              {(isAdmin || isFinance) && <option value="financial-transactions">Financial Transactions</option>}
              {(isAdmin || isFinance) && <option value="master-data">Master Data</option>}
              {(isAdmin || isManager || isFinance) && <option value="financial-analysis">Financial Analysis</option>}
              {(isAdmin || isManager || isFinance) && <option value="powerbi">Power BI</option>}
              {isAdmin && <option value="user-management">User Management</option>}
            </select>
          </div>

          <div className="form-group">
            <label>Dashboard Density</label>
            <select
              value={settings.density}
              onChange={(e) => updateSetting('density', e.target.value)}
            >
              <option value="comfortable">Comfortable</option>
              <option value="compact">Compact</option>
            </select>
          </div>

          <div className="form-group">
            <label>Language</label>
            <select
              value={settings.language}
              onChange={(e) => updateSetting('language', e.target.value)}
            >
              <option value="English">English</option>
              <option value="French">French</option>
            </select>
          </div>

          <div className="form-group">
            <label>Appearance</label>
            <select
              value={settings.appearance}
              onChange={(e) => updateSetting('appearance', e.target.value)}
            >
              <option value="light">Light Mode</option>
              <option value="dark">Dark Mode</option>
            </select>
          </div>
        </section>
      </div>

      <div className="settings-grid-mid">
        {(isAdmin || isFinance) && (
          <section className="integration-card">
            <div className="section-head">
              <h4>Data & Reports</h4>
              <p>Connection status for backend services and reporting layer.</p>
            </div>

            <div className="settings-status-list">
              <div className="settings-status-item">
                <span>Backend API</span>
                <strong className="status-ok">Connected</strong>
              </div>

              <div className="settings-status-item">
                <span>Database</span>
                <strong className="status-ok">PostgreSQL</strong>
              </div>

              <div className="settings-status-item">
                <span>Power BI Reports</span>
                <strong className={isAdmin ? 'status-ok' : 'status-pending'}>
                  {isAdmin ? 'Configured' : 'Read-only'}
                </strong>
              </div>
            </div>

            <div className="integration-panel">
              <p>Report Refresh Mode</p>

              <div className="freq-buttons">
                <button
                  className={settings.refreshMode === 'manual' ? 'active' : ''}
                  onClick={() => updateSetting('refreshMode', 'manual')}
                >
                  Manual
                </button>

                <button
                  className={settings.refreshMode === 'on-demand' ? 'active' : ''}
                  onClick={() => updateSetting('refreshMode', 'on-demand')}
                >
                  On Demand
                </button>

                <button disabled>
                  Scheduled Later
                </button>
              </div>
            </div>
          </section>
        )}

        {isManager && (
          <section className="integration-card">
            <div className="section-head">
              <h4>Manager Report Preferences</h4>
              <p>Decision-oriented reporting preferences for dashboard consumption.</p>
            </div>

            <div className="form-group">
              <label>Preferred Report View</label>
              <select
                value={settings.reportView}
                onChange={(e) => updateSetting('reportView', e.target.value)}
              >
                <option value="Executive Overview">Executive Overview</option>
                <option value="Financial Analysis">Financial Analysis</option>
                <option value="Project Profitability">Project Profitability</option>
              </select>
            </div>

            <div className="settings-status-list">
              <div className="settings-status-item">
                <span>Power BI Access</span>
                <strong className="status-pending">Read-only</strong>
              </div>
              <div className="settings-status-item">
                <span>Data Editing</span>
                <strong>Restricted</strong>
              </div>
            </div>
          </section>
        )}

        <section className="alerts-card-settings">
          <div className="section-head">
            <h4>About Application</h4>
            <p>Technical information about the current workspace.</p>
          </div>

          <div className="settings-about-list">
            <div>
              <span>Application</span>
              <strong>Tradrly</strong>
            </div>
            <div>
              <span>Version</span>
              <strong>1.0.0</strong>
            </div>
            <div>
              <span>Environment</span>
              <strong>Desktop-ready / Web dev</strong>
            </div>
            <div>
              <span>Frontend</span>
              <strong>React + Vite</strong>
            </div>
          </div>
        </section>
      </div>

      <section className="changes-card">
        <div className="changes-head">
          <h4>Role Settings Scope</h4>
        </div>

        <table>
          <thead>
            <tr>
              <th>Settings Area</th>
              <th>Admin</th>
              <th>Finance</th>
              <th>Manager</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Account Preferences</td>
              <td>Editable</td>
              <td>Editable</td>
              <td>Editable</td>
            </tr>
            <tr>
              <td>Security Parameters</td>
              <td>Editable</td>
              <td>Read-only</td>
              <td>Read-only</td>
            </tr>
            <tr>
              <td>Data & Reports</td>
              <td>Editable</td>
              <td>Editable</td>
              <td>Read-only</td>
            </tr>
            <tr>
              <td>User Management Access</td>
              <td>Allowed</td>
              <td>Restricted</td>
              <td>Restricted</td>
            </tr>
          </tbody>
        </table>
      </section>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  )
}

export default Settings
