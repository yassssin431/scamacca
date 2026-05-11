import { useEffect, useMemo, useState } from 'react'
import './Settings.css'
import PageHeader from '../common/PageHeader'
import Toast from '../common/Toast'
import { getCurrentUser, getCurrentUserRole } from '../../services/auth'
import { canAccessResource, ROLES } from '../../services/permissions'

const STORAGE_KEY = 'tradrly.settings.v2'

const DEFAULT_SETTINGS = {
  language: 'fr',
  appearance: 'light',
  density: 'comfortable',
  defaultPage: 'dashboard',
  sessionTimeout: 45,
  notifications: true,
  emailDigest: false,
  powerBiMode: 'embedded',
  refreshMode: 'manual',
  currency: 'USD',
  fiscalYear: 'calendar',
  financeApprovalThreshold: 25000,
  managerReportView: 'executive',
  simulationBias: 'balanced',
  auditRetention: '90',
  requireStrongPasswords: true,
}

const roleLandingPages = {
  [ROLES.ADMIN]: [
    ['dashboard', 'Tableau de bord'],
    ['user-management', 'Gestion des utilisateurs'],
    ['master-data', 'Donnees de base'],
    ['powerbi', 'Power BI'],
  ],
  [ROLES.FINANCE]: [
    ['dashboard', 'Tableau de bord'],
    ['financial-transactions', 'Transactions financieres'],
    ['financial-analysis', 'Analyse financiere'],
    ['master-data', 'Donnees de base'],
  ],
  [ROLES.MANAGER]: [
    ['dashboard', 'Tableau de bord'],
    ['powerbi', 'Power BI'],
    ['ai-analysis', 'Analyse IA'],
    ['financial-analysis', 'Analyse financiere'],
  ],
}

const roleProfiles = {
  [ROLES.ADMIN]: {
    icon: 'admin_panel_settings',
    label: 'Administration systeme',
    description: 'Controle de la securite, des utilisateurs et de la gouvernance.',
    accent: 'admin',
  },
  [ROLES.FINANCE]: {
    icon: 'account_balance_wallet',
    label: 'Operations financieres',
    description: 'Parametres comptables, rapports financiers et preferences de controle.',
    accent: 'finance',
  },
  [ROLES.MANAGER]: {
    icon: 'query_stats',
    label: 'Pilotage decisionnel',
    description: 'Preferences de lecture, BI, simulations et indicateurs executifs.',
    accent: 'manager',
  },
}

const modules = [
  ['clients', 'Clients'],
  ['projects', 'Projets'],
  ['invoices', 'Factures'],
  ['expenses', 'Depenses'],
  ['salaries', 'Salaires'],
  ['users', 'Utilisateurs'],
  ['powerbi', 'Power BI'],
  ['ai', 'Analyse IA'],
]

const readStoredSettings = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    const legacyLanguage = localStorage.getItem('language')
    const settings = { ...DEFAULT_SETTINGS, ...stored }
    const language = settings.language || legacyLanguage

    return {
      ...settings,
      language: language === 'English' || language === 'en' ? 'en' : 'fr',
    }
  } catch {
    return DEFAULT_SETTINGS
  }
}

const persistSettings = (settings) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  localStorage.setItem('language', settings.language === 'fr' ? 'French' : 'English')
  localStorage.setItem('appearance', settings.appearance)
  localStorage.setItem('density', settings.density)
  localStorage.setItem('defaultPage', settings.defaultPage)
  localStorage.setItem('sessionTimeout', String(settings.sessionTimeout))
  localStorage.setItem('refreshMode', settings.refreshMode)
  localStorage.setItem('reportView', settings.managerReportView)
}

function Settings() {
  const role = getCurrentUserRole() || ROLES.MANAGER
  const user = getCurrentUser()
  const [settings, setSettings] = useState(readStoredSettings)
  const [toast, setToast] = useState(null)

  const profile = roleProfiles[role] || roleProfiles[ROLES.MANAGER]
  const isAdmin = role === ROLES.ADMIN
  const isFinance = role === ROLES.FINANCE
  const isManager = role === ROLES.MANAGER
  const isFrench = settings.language === 'fr' || settings.language === 'French'

  const landingPages = roleLandingPages[role] || roleLandingPages[ROLES.MANAGER]
  const defaultPageValue = landingPages.some(([value]) => value === settings.defaultPage)
    ? settings.defaultPage
    : landingPages[0]?.[0] || 'dashboard'

  const accessRows = useMemo(() => {
    return modules.map(([resource, label]) => ({
      resource,
      label,
      allowed: canAccessResource(resource, role),
    }))
  }, [role])

  const allowedCount = accessRows.filter((item) => item.allowed).length

  useEffect(() => {
    document.body.classList.toggle('dark-mode', settings.appearance === 'dark')
    document.documentElement.setAttribute(
      'data-density',
      settings.density === 'compact' ? 'compact' : 'comfortable'
    )
  }, [settings.appearance, settings.density])

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 2600)
  }

  const handleSave = () => {
    persistSettings(settings)
    showToast(isFrench ? 'Parametres enregistres' : 'Settings saved')
  }

  const handleReset = () => {
    const resetSettings = {
      ...DEFAULT_SETTINGS,
      defaultPage: landingPages[0]?.[0] || 'dashboard',
      language: isFrench ? 'fr' : 'en',
    }

    setSettings(resetSettings)
    persistSettings(resetSettings)
    showToast(isFrench ? 'Preferences reinitialisees' : 'Preferences reset')
  }

  const handleExport = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      role,
      user: {
        username: user?.username,
        email: user?.email,
      },
      settings,
      access: accessRows,
    }

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `tradrly-settings-${role.toLowerCase()}.json`
    link.click()
    URL.revokeObjectURL(url)
    showToast(isFrench ? 'Export des parametres pret' : 'Settings export ready')
  }

  const copy = {
    title: isFrench ? 'Parametres' : 'Settings',
    subtitle: isFrench
      ? `Preferences de l'espace Tradrly adaptees au role ${role}`
      : `Tradrly workspace preferences adapted to the ${role} role`,
    save: isFrench ? 'Enregistrer' : 'Save',
    reset: isFrench ? 'Reinitialiser' : 'Reset',
    export: isFrench ? 'Exporter' : 'Export',
  }

  return (
    <div className="settings-page">
      <PageHeader
        kicker={isFrench ? 'Espace de controle' : 'Control Space'}
        title={copy.title}
        subtitle={copy.subtitle}
        right={
          <div className="settings-actions">
            <button className="settings-ghost-btn" onClick={handleReset}>
              <span className="material-symbols-outlined">restart_alt</span>
              {copy.reset}
            </button>
            <button className="settings-secondary-btn" onClick={handleExport}>
              <span className="material-symbols-outlined">download</span>
              {copy.export}
            </button>
            <button className="settings-primary-btn" onClick={handleSave}>
              <span className="material-symbols-outlined">check</span>
              {copy.save}
            </button>
          </div>
        }
      />

      <section className={`settings-hero settings-hero-${profile.accent}`}>
        <div className="settings-hero-main">
          <div className="settings-role-icon">
            <span className="material-symbols-outlined">{profile.icon}</span>
          </div>
          <div>
            <span className="settings-eyebrow">{role}</span>
            <h3>{profile.label}</h3>
            <p>{profile.description}</p>
          </div>
        </div>

        <div className="settings-hero-user">
          <span>{user?.email || 'session@tradrly.local'}</span>
          <strong>{user?.username || user?.name || 'Utilisateur Tradrly'}</strong>
        </div>
      </section>

      <section className="settings-kpi-grid">
        <div className="settings-kpi-card">
          <span className="material-symbols-outlined">verified_user</span>
          <div>
            <p>{isFrench ? 'Modules autorises' : 'Allowed modules'}</p>
            <strong>{allowedCount}/{modules.length}</strong>
          </div>
        </div>

        <div className="settings-kpi-card">
          <span className="material-symbols-outlined">schedule</span>
          <div>
            <p>{isFrench ? 'Session' : 'Session'}</p>
            <strong>{settings.sessionTimeout} min</strong>
          </div>
        </div>

        <div className="settings-kpi-card">
          <span className="material-symbols-outlined">language</span>
          <div>
            <p>{isFrench ? 'Langue' : 'Language'}</p>
            <strong>{isFrench ? 'Francais' : 'English'}</strong>
          </div>
        </div>

        <div className="settings-kpi-card">
          <span className="material-symbols-outlined">dashboard_customize</span>
          <div>
            <p>{isFrench ? 'Page initiale' : 'Landing page'}</p>
            <strong>{landingPages.find(([value]) => value === defaultPageValue)?.[1] || 'Dashboard'}</strong>
          </div>
        </div>
      </section>

      <div className="settings-main-grid">
        <section className="settings-panel settings-panel-wide">
          <div className="settings-section-head">
            <span className="material-symbols-outlined">tune</span>
            <div>
              <h4>{isFrench ? 'Preferences de l’interface' : 'Interface Preferences'}</h4>
              <p>{isFrench ? 'Ces options restent locales a votre poste.' : 'These options are stored locally on this workstation.'}</p>
            </div>
          </div>

          <div className="settings-form-grid">
            <label className="settings-field">
              <span>{isFrench ? 'Langue' : 'Language'}</span>
              <select value={settings.language} onChange={(e) => updateSetting('language', e.target.value)}>
                <option value="fr">Francais</option>
                <option value="en">English</option>
              </select>
            </label>

            <label className="settings-field">
              <span>{isFrench ? 'Theme' : 'Theme'}</span>
              <select value={settings.appearance} onChange={(e) => updateSetting('appearance', e.target.value)}>
                <option value="light">{isFrench ? 'Clair' : 'Light'}</option>
                <option value="dark">{isFrench ? 'Sombre' : 'Dark'}</option>
              </select>
            </label>

            <label className="settings-field">
              <span>{isFrench ? 'Densite' : 'Density'}</span>
              <select value={settings.density} onChange={(e) => updateSetting('density', e.target.value)}>
                <option value="comfortable">{isFrench ? 'Confortable' : 'Comfortable'}</option>
                <option value="compact">{isFrench ? 'Compacte' : 'Compact'}</option>
              </select>
            </label>

            <label className="settings-field">
              <span>{isFrench ? 'Page par defaut' : 'Default page'}</span>
              <select value={defaultPageValue} onChange={(e) => updateSetting('defaultPage', e.target.value)}>
                {landingPages.map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </label>
          </div>
        </section>

        <section className="settings-panel">
          <div className="settings-section-head">
            <span className="material-symbols-outlined">notifications</span>
            <div>
              <h4>{isFrench ? 'Notifications' : 'Notifications'}</h4>
              <p>{isFrench ? 'Alertes visibles dans votre espace.' : 'Alerts shown in your workspace.'}</p>
            </div>
          </div>

          <div className="settings-toggle-list">
            <button
              className={`settings-toggle-row ${settings.notifications ? 'is-on' : ''}`}
              onClick={() => updateSetting('notifications', !settings.notifications)}
            >
              <span>{isFrench ? 'Alertes applicatives' : 'In-app alerts'}</span>
              <i />
            </button>
            <button
              className={`settings-toggle-row ${settings.emailDigest ? 'is-on' : ''}`}
              onClick={() => updateSetting('emailDigest', !settings.emailDigest)}
            >
              <span>{isFrench ? 'Resume email' : 'Email digest'}</span>
              <i />
            </button>
          </div>
        </section>
      </div>

      <div className="settings-main-grid">
        {isAdmin && (
          <section className="settings-panel settings-panel-dark">
            <div className="settings-section-head">
              <span className="material-symbols-outlined">shield_lock</span>
              <div>
                <h4>{isFrench ? 'Gouvernance administrateur' : 'Administrator Governance'}</h4>
                <p>{isFrench ? 'Regles visibles seulement pour les administrateurs.' : 'Controls visible only to administrators.'}</p>
              </div>
            </div>

            <label className="settings-field">
              <span>{isFrench ? 'Expiration de session' : 'Session timeout'}</span>
              <input
                type="range"
                min="15"
                max="120"
                step="15"
                value={settings.sessionTimeout}
                onChange={(e) => updateSetting('sessionTimeout', Number(e.target.value))}
              />
              <strong>{settings.sessionTimeout} min</strong>
            </label>

            <label className="settings-field">
              <span>{isFrench ? 'Conservation audit' : 'Audit retention'}</span>
              <select value={settings.auditRetention} onChange={(e) => updateSetting('auditRetention', e.target.value)}>
                <option value="30">30 jours</option>
                <option value="90">90 jours</option>
                <option value="180">180 jours</option>
              </select>
            </label>

            <button
              className={`settings-toggle-row ${settings.requireStrongPasswords ? 'is-on' : ''}`}
              onClick={() => updateSetting('requireStrongPasswords', !settings.requireStrongPasswords)}
            >
              <span>{isFrench ? 'Mots de passe renforces' : 'Strong password policy'}</span>
              <i />
            </button>
          </section>
        )}

        {isFinance && (
          <section className="settings-panel settings-panel-dark">
            <div className="settings-section-head">
              <span className="material-symbols-outlined">payments</span>
              <div>
                <h4>{isFrench ? 'Parametres finance' : 'Finance Settings'}</h4>
                <p>{isFrench ? 'Preferences reservees aux operations financieres.' : 'Preferences reserved for financial operations.'}</p>
              </div>
            </div>

            <div className="settings-form-grid single">
              <label className="settings-field">
                <span>{isFrench ? 'Devise de reference' : 'Reference currency'}</span>
                <select value={settings.currency} onChange={(e) => updateSetting('currency', e.target.value)}>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="MAD">MAD</option>
                  <option value="TND">TND</option>
                </select>
              </label>

              <label className="settings-field">
                <span>{isFrench ? 'Exercice fiscal' : 'Fiscal year'}</span>
                <select value={settings.fiscalYear} onChange={(e) => updateSetting('fiscalYear', e.target.value)}>
                  <option value="calendar">{isFrench ? 'Annee civile' : 'Calendar year'}</option>
                  <option value="custom">{isFrench ? 'Exercice personnalise' : 'Custom fiscal year'}</option>
                </select>
              </label>

              <label className="settings-field">
                <span>{isFrench ? 'Seuil de revue' : 'Review threshold'}</span>
                <input
                  type="number"
                  min="0"
                  value={settings.financeApprovalThreshold}
                  onChange={(e) => updateSetting('financeApprovalThreshold', Number(e.target.value))}
                />
              </label>
            </div>
          </section>
        )}

        {isManager && (
          <section className="settings-panel settings-panel-dark">
            <div className="settings-section-head">
              <span className="material-symbols-outlined">monitoring</span>
              <div>
                <h4>{isFrench ? 'Pilotage manager' : 'Manager Cockpit'}</h4>
                <p>{isFrench ? 'Reglages pour la lecture executive et les simulations.' : 'Settings for executive reading and simulations.'}</p>
              </div>
            </div>

            <label className="settings-field">
              <span>{isFrench ? 'Vue de rapport' : 'Report view'}</span>
              <select value={settings.managerReportView} onChange={(e) => updateSetting('managerReportView', e.target.value)}>
                <option value="executive">{isFrench ? 'Synthese executive' : 'Executive overview'}</option>
                <option value="projects">{isFrench ? 'Rentabilite projets' : 'Project profitability'}</option>
                <option value="risk">{isFrench ? 'Risques et ecarts' : 'Risks and gaps'}</option>
              </select>
            </label>

            <label className="settings-field">
              <span>{isFrench ? 'Mode simulation' : 'Simulation mode'}</span>
              <select value={settings.simulationBias} onChange={(e) => updateSetting('simulationBias', e.target.value)}>
                <option value="balanced">{isFrench ? 'Equilibre' : 'Balanced'}</option>
                <option value="conservative">{isFrench ? 'Conservateur' : 'Conservative'}</option>
                <option value="growth">{isFrench ? 'Croissance' : 'Growth'}</option>
              </select>
            </label>
          </section>
        )}

        <section className="settings-panel">
          <div className="settings-section-head">
            <span className="material-symbols-outlined">analytics</span>
            <div>
              <h4>{isFrench ? 'Rapports et BI' : 'Reports and BI'}</h4>
              <p>{isFrench ? 'Ces options respectent les droits backend.' : 'These options respect backend permissions.'}</p>
            </div>
          </div>

          <div className="settings-segmented">
            {['manual', 'on-demand', 'scheduled'].map((mode) => (
              <button
                key={mode}
                className={settings.refreshMode === mode ? 'active' : ''}
                disabled={mode === 'scheduled' && !isAdmin}
                onClick={() => updateSetting('refreshMode', mode)}
              >
                {mode === 'manual' && (isFrench ? 'Manuel' : 'Manual')}
                {mode === 'on-demand' && (isFrench ? 'A la demande' : 'On demand')}
                {mode === 'scheduled' && (isFrench ? 'Planifie' : 'Scheduled')}
              </button>
            ))}
          </div>

          <label className="settings-field">
            <span>Power BI</span>
            <select value={settings.powerBiMode} onChange={(e) => updateSetting('powerBiMode', e.target.value)}>
              <option value="embedded">{isFrench ? 'Integre' : 'Embedded'}</option>
              <option value="external">{isFrench ? 'Ouvrir externe' : 'Open externally'}</option>
            </select>
          </label>
        </section>
      </div>

      <section className="settings-panel">
        <div className="settings-section-head">
          <span className="material-symbols-outlined">key</span>
          <div>
            <h4>{isFrench ? 'Acces par module' : 'Module Access'}</h4>
            <p>{isFrench ? 'Lecture basee sur les permissions backend actuelles.' : 'Readout based on current backend permissions.'}</p>
          </div>
        </div>

        <div className="settings-access-grid">
          {accessRows.map((item) => (
            <div key={item.resource} className={`settings-access-item ${item.allowed ? 'allowed' : 'restricted'}`}>
              <span className="material-symbols-outlined">
                {item.allowed ? 'check_circle' : 'lock'}
              </span>
              <div>
                <strong>{item.label}</strong>
                <p>{item.allowed ? (isFrench ? 'Autorise' : 'Allowed') : (isFrench ? 'Restreint par role' : 'Restricted by role')}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  )
}

export default Settings
