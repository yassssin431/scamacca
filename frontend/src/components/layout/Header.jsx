import { useNavigate } from 'react-router-dom'
import { getCurrentUserRole } from '../../services/auth'
import './Header.css'

function Header() {
  const navigate = useNavigate()
  const role = getCurrentUserRole()

  return (
    <header className="app-header">
      <div className="app-header-left">
        <h1>Espace Tradrly</h1>
        <p>Pilotage financier et aide à la décision</p>
      </div>

      <div className="app-header-right">
        <button className="header-icon-btn" type="button" onClick={() => navigate('/settings')} aria-label="Settings">
          <span className="material-symbols-outlined">settings</span>
        </button>

        <button className="header-icon-btn" type="button" aria-label="Notifications">
          <span className="material-symbols-outlined">notifications</span>
        </button>

        <div className="connected-pill">
          <span></span>
          {role || 'Unknown Role'}
        </div>
      </div>
    </header>
  )
}

export default Header
