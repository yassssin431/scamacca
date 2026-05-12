export const saveToken = (token) => {
  localStorage.setItem('token', token)
}

export const getToken = () => {
  return localStorage.getItem('token')
}

export const removeToken = () => {
  localStorage.removeItem('token')
}

export const isAuthenticated = () => {
  return !!getToken()
}

export const parseJwt = (token) => {
  try {
    const base64Payload = token.split('.')[1]
    const payload = atob(base64Payload)
    return JSON.parse(payload)
  } catch {
    return null
  }
}

export const getCurrentUser = () => {
  const token = getToken()
  if (!token) return null
  return parseJwt(token)
}

const roleIdMap = {
  1: 'Admin',
  2: 'Manager',
  3: 'Finance',
}

// Tokens may contain either numeric backend role IDs or role names depending on
// the endpoint/version. Normalize both formats before applying frontend RBAC.
export const normalizeRole = (role) => {
  if (role == null) return null

  if (typeof role === 'number') {
    return roleIdMap[role] || null
  }

  const roleText = String(role).trim()
  return roleIdMap[roleText] || roleText || null
}

export const getCurrentUserRole = () => {
  const user = getCurrentUser()

  // Support several token payload shapes so auth keeps working if the backend
  // names the role field slightly differently.
  return normalizeRole(
    user?.role ||
    user?.Role?.name ||
    user?.roleName ||
    user?.RoleName ||
    user?.RoleId ||
    user?.roleId ||
    null
  )
}
