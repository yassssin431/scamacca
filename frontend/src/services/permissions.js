import { getCurrentUserRole } from './auth'

export const ROLES = {
  ADMIN: 'Admin',
  MANAGER: 'Manager',
  FINANCE: 'Finance',
}

export const RESOURCE_PERMISSIONS = {
  clients: [ROLES.ADMIN, ROLES.MANAGER],
  projects: [ROLES.ADMIN, ROLES.MANAGER],
  devis: [ROLES.ADMIN, ROLES.MANAGER],
  invoices: [ROLES.ADMIN, ROLES.FINANCE],
  payments: [ROLES.ADMIN, ROLES.FINANCE],
  expenses: [ROLES.FINANCE],
  budgets: [ROLES.FINANCE],
  salaries: [ROLES.ADMIN, ROLES.FINANCE],
  employees: [ROLES.ADMIN, ROLES.FINANCE],
  fournisseurs: [ROLES.ADMIN, ROLES.FINANCE],
  categories: [ROLES.ADMIN],
  users: [ROLES.ADMIN],
  ai: [ROLES.ADMIN, ROLES.MANAGER, ROLES.FINANCE],
  powerbi: [ROLES.ADMIN, ROLES.MANAGER, ROLES.FINANCE],
}

export const hasRole = (allowedRoles, role = getCurrentUserRole()) => {
  return Boolean(role && allowedRoles.includes(role))
}

export const canAccessResource = (resource, role = getCurrentUserRole()) => {
  return hasRole(RESOURCE_PERMISSIONS[resource] || [], role)
}

export const canCreateResource = canAccessResource
export const canUpdateResource = canAccessResource

export const canDeleteResource = (resource, role = getCurrentUserRole()) => {
  if (resource === 'invoices' || resource === 'salaries') {
    return role === ROLES.ADMIN
  }

  if (resource === 'projects' || resource === 'clients' || resource === 'employees' || resource === 'fournisseurs' || resource === 'categories' || resource === 'users') {
    return role === ROLES.ADMIN
  }

  return canAccessResource(resource, role)
}
