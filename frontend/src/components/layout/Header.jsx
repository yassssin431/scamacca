import { getCurrentUserRole } from '../../services/auth'
import './Header.css'

function Header() {
  const role = getCurrentUserRole()

  return (
    <header className="app-header">
      <div className="app-header-left">
        <h1>Financial Decision Support System</h1>
        <p>Operational management, analytics and business intelligence workspace</p>
      </div>

      <div className="app-header-right">
        <div className="header-badge">
          <span className="header-badge-dot"></span>
          {role || 'Unknown Role'}
        </div>
      </div>
    </header>
  )
}

export default Header