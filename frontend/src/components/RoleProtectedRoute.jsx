import { Navigate } from 'react-router-dom'
import { getCurrentUserRole, isAuthenticated } from '../services/auth'

function RoleProtectedRoute({ children, allowedRoles }) {
  const role = getCurrentUserRole()

  if (!isAuthenticated()) {
    return <Navigate to="/" replace />
  }

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default RoleProtectedRoute