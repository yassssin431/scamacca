import { getCurrentUserRole } from './auth'

export const ROLES = {
  ADMIN: 'Admin',
  MANAGER: 'Manager',
  FINANCE: 'Finance',
}

// Frontend RBAC map for read visibility. It mirrors backend route access so
// pages know which sections can be loaded without triggering 401/403 errors.
export const RESOURCE_PERMISSIONS = {
  clients: [ROLES.ADMIN, ROLES.MANAGER],
  projects: [ROLES.ADMIN, ROLES.MANAGER],
  devis: [ROLES.ADMIN, ROLES.MANAGER, ROLES.FINANCE],
  invoices: [ROLES.ADMIN, ROLES.MANAGER, ROLES.FINANCE],
  payments: [ROLES.ADMIN, ROLES.MANAGER, ROLES.FINANCE],
  expenses: [ROLES.ADMIN, ROLES.FINANCE],
  budgets: [ROLES.ADMIN, ROLES.MANAGER, ROLES.FINANCE],
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

// These resources are financial operations. Admin may read some of them for
// supervision, but only Finance should create, edit, delete, convert, or pay.
const FINANCE_OPERATED_RESOURCES = [
  'devis',
  'invoices',
  'payments',
  'expenses',
  'budgets',
  'salaries',
]

export const canCreateResource = (resource, role = getCurrentUserRole()) => {
  if (FINANCE_OPERATED_RESOURCES.includes(resource)) {
    return role === ROLES.FINANCE
  }

  return canAccessResource(resource, role)
}

export const canUpdateResource = (resource, role = getCurrentUserRole()) => {
  if (FINANCE_OPERATED_RESOURCES.includes(resource)) {
    return role === ROLES.FINANCE
  }

  return canAccessResource(resource, role)
}

export const canDeleteResource = (resource, role = getCurrentUserRole()) => {
  if (FINANCE_OPERATED_RESOURCES.includes(resource)) {
    return role === ROLES.FINANCE
  }

  // Master/admin data remains an Admin responsibility.
  if (resource === 'projects' || resource === 'clients' || resource === 'employees' || resource === 'fournisseurs' || resource === 'categories' || resource === 'users') {
    return role === ROLES.ADMIN
  }

  return canAccessResource(resource, role)
}
