import { Navigate } from 'react-router-dom'
import { isAuthenticated } from '../services/auth'

function ProtectedRoute({ children }) {
  // First gate: only users with a JWT can enter the application shell.
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute
