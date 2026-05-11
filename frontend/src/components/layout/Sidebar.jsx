import { removeToken, getCurrentUserRole } from '../../services/auth'
import { NavLink, useNavigate } from 'react-router-dom'
import './Sidebar.css'

const translations = {
  English: {
    subtitle: 'Financial Support System',
    dashboard: 'Dashboard',
    transactions: 'Financial Transactions',
    commercialCycle: 'Commercial Cycle',
    masterData: 'Master Data',
    powerbi: 'Power BI',
    financialAnalysis: 'Financial Analysis',
    aiAnalysis: 'AI Analysis',
    userManagement: 'User Management',
    settings: 'Settings',
    logout: 'Logout',
  },
  French: {
    subtitle: 'Système d’aide financière',
    dashboard: 'Tableau de bord',
    transactions: 'Transactions financières',
    masterData: 'Données de base',
    powerbi: 'Power BI',
    financialAnalysis: 'Analyse financière',
    aiAnalysis: 'Analyse IA',
    userManagement: 'Gestion des utilisateurs',
    settings: 'Paramètres',
    logout: 'Déconnexion',
  },
}

function Sidebar() {
  const navigate = useNavigate()
  const role = getCurrentUserRole()
  const language = localStorage.getItem('language') || 'English'
  const t = translations[language] || translations.English

  const handleLogout = () => {
    removeToken()
    navigate('/')
  }

  const links = [
    {
      to: '/dashboard',
      label: t.dashboard,
      icon: 'space_dashboard',
      roles: ['Admin', 'Manager', 'Finance'],
    },
    {
      to: '/financial-transactions',
      label: t.transactions,
      icon: 'receipt_long',
      roles: ['Admin', 'Finance'],
    },
    {
      to: '/commercial-cycle',
      label: t.commercialCycle || 'Cycle commercial',
      icon: 'sync_alt',
      roles: ['Admin', 'Manager', 'Finance'],
    },
    {
      to: '/master-data',
      label: t.masterData,
      icon: 'database',
      roles: ['Admin', 'Manager', 'Finance'],
    },
    {
      to: '/powerbi',
      label: t.powerbi,
      icon: 'bar_chart',
      roles: ['Admin', 'Manager', 'Finance'],
    },
    {
      to: '/financial-analysis',
      label: t.financialAnalysis,
      icon: 'query_stats',
      roles: ['Admin', 'Manager', 'Finance'],
    },
    {
      to: '/ai-analysis',
      label: t.aiAnalysis,
      icon: 'psychology',
      roles: ['Admin', 'Manager', 'Finance'],
    },
    {
      to: '/user-management',
      label: t.userManagement,
      icon: 'manage_accounts',
      roles: ['Admin'],
    },
    {
      to: '/settings',
      label: t.settings,
      icon: 'settings',
      roles: ['Admin', 'Manager', 'Finance'],
    },
  ]

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo">
          <span className="material-symbols-outlined">analytics</span>
          <h2>Tradrly</h2>
        </div>
        <p>{t.subtitle}</p>
      </div>

      <nav className="sidebar-nav">
        {links
          .filter((link) => link.roles.includes(role))
          .map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                isActive ? 'sidebar-link active' : 'sidebar-link'
              }
            >
              <span className="material-symbols-outlined">{link.icon}</span>
              <span>{link.label}</span>
            </NavLink>
          ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-role">
          <span className="sidebar-role-dot" />
          <span>{role}</span>
        </div>
        <button className="sidebar-logout" onClick={handleLogout}>
          <span className="material-symbols-outlined">logout</span>
          {t.logout}
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
