import { removeToken, getCurrentUserRole } from '../../services/auth'
import { NavLink, useNavigate } from 'react-router-dom'
import './Sidebar.css'

function Sidebar() {
  const navigate = useNavigate()
  const role = getCurrentUserRole()

  const handleLogout = () => {
    removeToken()
    navigate('/')
  }

  const links = [
    {
      to: '/dashboard',
      label: 'Dashboard',
      roles: ['Admin', 'Manager', 'Finance'],
    },
    {
      to: '/financial-transactions',
      label: 'Financial Transactions',
      roles: ['Admin', 'Finance'],
    },
    {
      to: '/master-data',
      label: 'Master Data',
      roles: ['Admin', 'Finance'],
    },
    {
      to: '/powerbi',
      label: 'Power BI',
      roles: ['Admin', 'Manager', 'Finance'],
    },
    {
      to: '/financial-analysis',
      label: 'Financial Analysis',
      roles: ['Admin', 'Manager', 'Finance'],
    },
    {
      to: '/ai-analysis',
      label: 'AI Analysis',
      roles: ['Admin', 'Manager'],
    },
    {
      to: '/user-management',
      label: 'User Management',
      roles: ['Admin'],
    },
    {
      to: '/settings',
      label: 'Settings',
      roles: ['Admin'],
    },
  ]

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <h2>Tradrly</h2>
        <p>Financial Support System</p>
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
              {link.label}
            </NavLink>
          ))}
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </aside>
  )
}

export default Sidebar