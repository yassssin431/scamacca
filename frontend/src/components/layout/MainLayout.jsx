import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import './MainLayout.css'

function MainLayout() {
  return (
    <div className="app-shell">
      <Sidebar />

      <div className="app-content-area">
        <Header />
        <main className="app-main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default MainLayout