import { Navigate } from 'react-router-dom'
import { getCurrentUserRole, isAuthenticated } from '../services/auth'

function RoleProtectedRoute({ children, allowedRoles = [] }) {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />
  }

  const role = getCurrentUserRole()

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default RoleProtectedRoute