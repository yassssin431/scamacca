import { Navigate } from 'react-router-dom'
import { getCurrentUserRole, isAuthenticated } from '../services/auth'

function RoleProtectedRoute({ children, allowedRoles }) {
  const role = getCurrentUserRole()

  // Authentication is checked here too because users can land directly on a URL.
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />
  }

  // Route-level RBAC keeps users away from whole pages they should not operate.
  // Page-level permissions still handle partial sections and action buttons.
  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default RoleProtectedRoute
