import { useEffect, useState } from 'react'
import './UserManagement.css'
import PageHeader from '../common/PageHeader'
import API_BASE_URL from '../../services/api'
import LoadingState from '../common/LoadingState'
import EmptyState from '../common/EmptyState'
import Toast from '../common/Toast'
import { authFetch } from '../../services/authFetch'

const roleMap = {
  1: 'Admin',
  2: 'Manager',
  3: 'Finance',
}


const translations = {
  English: {
    pageTitle: 'User Management',
    pageSubtitle: 'Manage application users, roles and access control',
    addUser: '{t.addUser}',

    totalUsers: 'Total Users',
    registeredAccounts: 'Registered accounts',
    activeUsers: 'Active Users',
    allowedAccess: 'Allowed access',
    admins: 'Admins',
    fullPermissions: 'Full permissions',
    financeManagers: 'Finance / Managers',
    businessRoles: 'Business roles',

    systemUsers: 'System Users',
    usersLoaded: 'Users loaded from backend API /api/users',
    refresh: 'Refresh',

    search: 'Search',
    searchPlaceholder: 'Username or email...',
    role: 'Role',
    allRoles: 'All Roles',
    status: 'Status',
    allStatus: 'All Status',
    active: 'Active',
    inactive: 'Inactive',
    actions: 'Actions',
    resetFilters: 'Reset Filters',

    loadingUsers: 'Loading users...',
    usersLoadingFailed: 'Users loading failed',
    noUsersFound: 'No users found',
    noUsersMessage: 'Create user accounts to manage application access.',

    user: 'User',
    email: 'Email',
    edit: 'Edit',
    deactivate: 'Deactivate',
    activate: 'Activate',
    showing: 'Showing',
    of: 'of',
    users: 'users',
    id: 'ID',

    securityTitle: 'Security & Authorization',
    securityText:
      'User access is structured around JWT authentication and role-based navigation. The administrator can manage accounts and assign roles according to responsibilities.',

    roleDistribution: 'Role Distribution',
    roleDistributionSubtitle: 'Current users grouped by access level',
    live: 'Live',
    managers: 'Managers',
    finance: 'Finance',

    recentActivity: 'Recent Activity',
    recentActivitySubtitle: 'Backend audit trail for critical operations',
    noActivity: 'No activity recorded yet.',
    exportActivity: 'Export Activity Log',
    refreshActivity: 'Refresh Log',
    activitySource: 'Linked to /api/activity',
    activityExported: 'Activity journal exported',
    activityLoadFailed: 'Unable to load activity log',
    administratorStory:
      'As an administrator, you can export the activity journal to preserve a trace of critical operations.',
    auditOverview: 'Audit Overview',
    auditSearch: 'Search audit',
    auditSearchPlaceholder: 'Action, entity, details or actor...',
    allEntities: 'All entities',
    allActions: 'All actions',
    allSeverity: 'All severity',
    critical: 'Critical',
    normal: 'Normal',
    filteredLogs: 'Filtered logs',
    criticalLogs: 'Critical logs',
    lastOperation: 'Last operation',
    noFilteredActivity: 'No activity matches the selected filters.',
    actor: 'Actor',
    entity: 'Entity',
    details: 'Details',
    date: 'Date',

    editUser: 'Edit User',
    addNewUser: 'Add New User',
    username: 'Username',
    usernamePlaceholder: 'Enter username',
    usernameHelp: '{t.usernameHelp}',
    emailPlaceholder: 'name@company.com',
    emailHelp: '{t.emailHelp}',
    password: 'Password',
    passwordEditPlaceholder: 'Leave empty to keep current password',
    passwordCreatePlaceholder: 'Create a password',
    passwordEditHelp: 'Only fill this field if you want to reset the password.',
    passwordCreateHelp: 'Required when creating a new user account.',
    roleHelp: '{t.roleHelp}',
    accountStatus: 'Account Status',
    statusHelp: '{t.statusHelp}',
    saveChanges: 'Save Changes',
    createUser: 'Create User',
    cancel: 'Cancel',

    requiredUsernameEmail: 'Username and email are required',
    requiredPassword: 'Password is required for new users',
    operationFailed: 'User operation failed',
    updatedSuccessfully: 'User updated successfully',
    createdSuccessfully: 'User created successfully',
    failedFetchUsers: 'Failed to fetch users',
    failedStatus: 'Failed to update status',
    userUpdated: 'User updated',
    userCreated: 'User created',
    userDeactivated: 'User deactivated',
    userActivated: 'User activated',
    system: 'System',
  },

  French: {
    pageTitle: 'Gestion des utilisateurs',
    pageSubtitle: 'Gérer les utilisateurs, les rôles et les accès',
    addUser: '+ Ajouter utilisateur',

    totalUsers: 'Utilisateurs totaux',
    registeredAccounts: 'Comptes enregistrés',
    activeUsers: 'Utilisateurs actifs',
    allowedAccess: 'Accès autorisé',
    admins: 'Admins',
    fullPermissions: 'Permissions complètes',
    financeManagers: 'Finance / Managers',
    businessRoles: 'Rôles métier',

    systemUsers: 'Utilisateurs du système',
    usersLoaded: 'Utilisateurs chargés depuis l’API backend /api/users',
    refresh: 'Actualiser',

    search: 'Recherche',
    searchPlaceholder: 'Nom utilisateur ou email...',
    role: 'Rôle',
    allRoles: 'Tous les rôles',
    status: 'Statut',
    allStatus: 'Tous les statuts',
    active: 'Actif',
    inactive: 'Inactif',
    actions: 'Actions',
    resetFilters: 'Réinitialiser',

    loadingUsers: 'Chargement des utilisateurs...',
    usersLoadingFailed: 'Échec du chargement des utilisateurs',
    noUsersFound: 'Aucun utilisateur trouvé',
    noUsersMessage: 'Créez des comptes utilisateurs pour gérer les accès.',

    user: 'Utilisateur',
    email: 'Email',
    edit: 'Modifier',
    deactivate: 'Désactiver',
    activate: 'Activer',
    showing: 'Affichage',
    of: 'sur',
    users: 'utilisateurs',
    id: 'ID',

    securityTitle: 'Sécurité & Autorisation',
    securityText:
      'L’accès utilisateur est structuré autour de l’authentification JWT et de la navigation basée sur les rôles. L’administrateur peut gérer les comptes et attribuer les rôles selon les responsabilités.',

    roleDistribution: 'Répartition des rôles',
    roleDistributionSubtitle: 'Utilisateurs actuels regroupés par niveau d’accès',
    live: 'En direct',
    managers: 'Managers',
    finance: 'Finance',

    recentActivity: 'Activité récente',
    recentActivitySubtitle: 'Journal d’audit backend des opérations critiques',
    noActivity: 'Aucune activité enregistrée.',
    exportActivity: 'Exporter le journal',
    refreshActivity: 'Actualiser le journal',
    activitySource: 'Connecté à /api/activity',
    activityExported: 'Journal d’activité exporté',
    activityLoadFailed: 'Impossible de charger le journal d’activité',
    administratorStory:
      'En tant qu’administrateur, je peux exporter le journal d’activité afin de conserver une trace des opérations critiques.',
    auditOverview: 'Vue d’ensemble audit',
    auditSearch: 'Recherche audit',
    auditSearchPlaceholder: 'Action, entité, détails ou acteur...',
    allEntities: 'Toutes les entités',
    allActions: 'Toutes les actions',
    allSeverity: 'Toutes les criticités',
    critical: 'Critique',
    normal: 'Normal',
    filteredLogs: 'Logs filtrés',
    criticalLogs: 'Logs critiques',
    lastOperation: 'Dernière opération',
    noFilteredActivity: 'Aucune activité ne correspond aux filtres.',
    actor: 'Acteur',
    entity: 'Entité',
    details: 'Détails',
    date: 'Date',

    editUser: 'Modifier utilisateur',
    addNewUser: 'Ajouter utilisateur',
    username: 'Nom utilisateur',
    usernamePlaceholder: 'Entrer le nom utilisateur',
    usernameHelp: 'Utilisé comme nom d’affichage dans le système.',
    emailPlaceholder: 'nom@entreprise.com',
    emailHelp: 'Utilisé pour l’authentification et l’identification.',
    password: 'Mot de passe',
    passwordEditPlaceholder: 'Laisser vide pour conserver le mot de passe actuel',
    passwordCreatePlaceholder: 'Créer un mot de passe',
    passwordEditHelp: 'Remplissez ce champ uniquement pour réinitialiser le mot de passe.',
    passwordCreateHelp: 'Obligatoire lors de la création d’un nouveau compte.',
    roleHelp: 'Contrôle l’accès aux modules de l’application.',
    accountStatus: 'Statut du compte',
    statusHelp: 'Les utilisateurs inactifs ne peuvent pas accéder aux modules protégés.',
    saveChanges: 'Enregistrer',
    createUser: 'Créer utilisateur',
    cancel: 'Annuler',

    requiredUsernameEmail: 'Le nom utilisateur et l’email sont obligatoires',
    requiredPassword: 'Le mot de passe est obligatoire pour les nouveaux utilisateurs',
    operationFailed: 'Opération utilisateur échouée',
    updatedSuccessfully: 'Utilisateur mis à jour avec succès',
    createdSuccessfully: 'Utilisateur créé avec succès',
    failedFetchUsers: 'Impossible de charger les utilisateurs',
    failedStatus: 'Impossible de mettre à jour le statut',
    userUpdated: 'Utilisateur mis à jour',
    userCreated: 'Utilisateur créé',
    userDeactivated: 'Utilisateur désactivé',
    userActivated: 'Utilisateur activé',
    system: 'Système',
  },
}


function UserManagement() {
  const language = localStorage.getItem('language') || 'English'
  const t = translations[language] || translations.English

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [toast, setToast] = useState(null)
  const [activities, setActivities] = useState([])
  const [activityLoading, setActivityLoading] = useState(false)
  const [activityError, setActivityError] = useState('')
  const [activitySearch, setActivitySearch] = useState('')
  const [activityEntityFilter, setActivityEntityFilter] = useState('all')
  const [activityActionFilter, setActivityActionFilter] = useState('all')
  const [activitySeverityFilter, setActivitySeverityFilter] = useState('all')
  const [activityPage, setActivityPage] = useState(1)

  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)

  const usersPerPage = 5
  const activitiesPerPage = 8

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    RoleId: 1,
    isActive: true,
  })

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 2500)
  }

  const normalizeActivity = (rows) => {
    const source = Array.isArray(rows) ? rows : rows?.data || []

    return source.map((item) => ({
      id: item.id,
      action: item.action || 'UNKNOWN_ACTION',
      entity: item.entity || '-',
      details: item.details || '-',
      userId: item.userId || item.UserId || '-',
      timestamp: item.timestamp || item.createdAt || item.updatedAt,
    }))
  }

  const getActivityVerb = (action) => {
    return String(action || '').split('_')[0].toLowerCase()
  }

  const isCriticalActivity = (activity) => {
    const verb = getActivityVerb(activity.action)
    return verb === 'delete' || activity.entity === 'User' || activity.entity === 'Budget'
  }

  const formatActivityAction = (action) => {
    return String(action || '')
      .toLowerCase()
      .split('_')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ')
  }

  const formatActivityDate = (value) => {
    if (!value) return '-'
    return new Date(value).toLocaleString()
  }

  const fetchActivities = async () => {
    try {
      setActivityLoading(true)
      setActivityError('')

      const response = await authFetch(`${API_BASE_URL}/activity`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result?.message || t.activityLoadFailed)
      }

      setActivities(normalizeActivity(result))
    } catch (err) {
      setActivityError(err.message || t.activityLoadFailed)
    } finally {
      setActivityLoading(false)
    }
  }

  const escapeCsv = (value) => {
    const text = String(value ?? '')
    return `"${text.replace(/"/g, '""')}"`
  }

  const exportActivities = () => {
    const headers = ['id', 'userId', 'action', 'entity', 'details', 'timestamp']
    const csv = [
      headers.join(','),
      ...filteredActivities.map((activity) =>
        headers.map((key) => escapeCsv(activity[key])).join(',')
      ),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `tradrly-activity-log-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
    showToast(t.activityExported)
  }

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await authFetch(`${API_BASE_URL}/users`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || t.failedFetchUsers)
      }

      setUsers(result.data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
  const loadUsers = async () => {
    await Promise.all([fetchUsers(), fetchActivities()])
  }

  loadUsers()
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [])

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      RoleId: 1,
      isActive: true,
    })
  }

  const openCreateModal = () => {
    setEditingUser(null)
    resetForm()
    setShowModal(true)
  }

  const openEditModal = (user) => {
    setEditingUser(user)
    setFormData({
      username: user.username || '',
      email: user.email || '',
      password: '',
      RoleId: user.RoleId || 1,
      isActive: user.isActive ?? true,
    })
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingUser(null)
    resetForm()
  }

  const handleSubmit = async () => {
    try {
      if (!formData.username || !formData.email) {
        showToast(t.requiredUsernameEmail, 'error')
        return
      }

      if (!editingUser && !formData.password) {
        showToast(t.requiredPassword, 'error')
        return
      }

      const payload = {
        username: formData.username,
        email: formData.email,
        RoleId: Number(formData.RoleId),
        isActive: formData.isActive,
      }

      if (formData.password) {
        payload.password = formData.password
      }

      const url = editingUser
        ? `${API_BASE_URL}/users/${editingUser.id}`
        : `${API_BASE_URL}/users`

      const response = await authFetch(url, {
        method: editingUser ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || t.operationFailed)
      }

      showToast(editingUser ? t.updatedSuccessfully : t.createdSuccessfully)

      closeModal()
      fetchUsers()
      fetchActivities()
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  const handleToggleStatus = async (user) => {
    try {
      const response = await authFetch(`${API_BASE_URL}/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isActive: user.isActive === false,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || t.failedStatus)
      }

      const action = user.isActive !== false ? t.userDeactivated : t.userActivated
      showToast(action)
      fetchUsers()
      fetchActivities()
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  const resetFilters = () => {
    setSearchTerm('')
    setRoleFilter('all')
    setStatusFilter('all')
    setCurrentPage(1)
  }

  const resetActivityFilters = () => {
    setActivitySearch('')
    setActivityEntityFilter('all')
    setActivityActionFilter('all')
    setActivitySeverityFilter('all')
    setActivityPage(1)
  }

  const totalAdmins = users.filter((u) => Number(u.RoleId) === 1).length
  const totalManagers = users.filter((u) => Number(u.RoleId) === 2).length
  const totalFinance = users.filter((u) => Number(u.RoleId) === 3).length
  const activeUsers = users.filter((u) => u.isActive !== false).length

  const filteredUsers = users.filter((user) => {
    const roleName = roleMap[user.RoleId] || `Role ${user.RoleId}`
    const status = user.isActive !== false ? 'active' : 'inactive'

    const matchesSearch =
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRole =
      roleFilter === 'all' || roleName.toLowerCase() === roleFilter

    const matchesStatus =
      statusFilter === 'all' || status === statusFilter

    return matchesSearch && matchesRole && matchesStatus
  })

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  )

  const activityEntities = [...new Set(activities.map((activity) => activity.entity).filter(Boolean))].sort()
  const activityActions = [...new Set(activities.map((activity) => getActivityVerb(activity.action)).filter(Boolean))].sort()

  const filteredActivities = activities.filter((activity) => {
    const search = activitySearch.toLowerCase()
    const verb = getActivityVerb(activity.action)
    const critical = isCriticalActivity(activity)

    const matchesSearch =
      !search ||
      activity.action.toLowerCase().includes(search) ||
      activity.entity.toLowerCase().includes(search) ||
      String(activity.details).toLowerCase().includes(search) ||
      String(activity.userId).toLowerCase().includes(search)

    const matchesEntity =
      activityEntityFilter === 'all' || activity.entity === activityEntityFilter

    const matchesAction =
      activityActionFilter === 'all' || verb === activityActionFilter

    const matchesSeverity =
      activitySeverityFilter === 'all' ||
      (activitySeverityFilter === 'critical' && critical) ||
      (activitySeverityFilter === 'normal' && !critical)

    return matchesSearch && matchesEntity && matchesAction && matchesSeverity
  })

  const totalActivityPages = Math.max(1, Math.ceil(filteredActivities.length / activitiesPerPage))
  const paginatedActivities = filteredActivities.slice(
    (activityPage - 1) * activitiesPerPage,
    activityPage * activitiesPerPage
  )
  const criticalActivityCount = activities.filter(isCriticalActivity).length
  const lastActivity = activities[0]

  return (
    <div className="um-page">
      <PageHeader
        title={t.pageTitle}
        subtitle={t.pageSubtitle}
        right={
          <button className="primary-btn" onClick={openCreateModal}>
            {t.addUser}
          </button>
        }
      />

      <section className="um-stats">
        <div className="um-stat-card">
          <p>{t.totalUsers}</p>
          <h3>{users.length}</h3>
          <span className="neutral">{t.registeredAccounts}</span>
        </div>

        <div className="um-stat-card">
          <p>{t.activeUsers}</p>
          <h3>{activeUsers}</h3>
          <span className="positive">{t.allowedAccess}</span>
        </div>

        <div className="um-stat-card">
          <p>{t.admins}</p>
          <h3>{totalAdmins}</h3>
          <span className="neutral">{t.fullPermissions}</span>
        </div>

        <div className="um-stat-card">
          <p>{t.financeManagers}</p>
          <h3>{totalFinance + totalManagers}</h3>
          <span className="neutral">{t.businessRoles}</span>
        </div>
      </section>

      <section className="um-table-card">
        <div className="um-table-top">
          <div>
            <h4>{t.systemUsers}</h4>
            <p>{t.usersLoaded}</p>
          </div>

          <div className="um-actions">
            <button className="secondary-btn" onClick={fetchUsers}>
              Refresh
            </button>
          </div>
        </div>

        <div className="um-filter-bar">
          <div className="um-filter-field">
            <label>{t.search}</label>
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
            />
          </div>

          <div className="um-filter-field">
            <label>{t.role}</label>
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value)
                setCurrentPage(1)
              }}
            >
              <option value="all">{t.allRoles}</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="finance">{t.finance}</option>
            </select>
          </div>

          <div className="um-filter-field">
            <label>{t.status}</label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setCurrentPage(1)
              }}
            >
              <option value="all">{t.allStatus}</option>
              <option value="active">{t.active}</option>
              <option value="inactive">{t.inactive}</option>
            </select>
          </div>

          <div className="um-filter-field um-filter-reset">
            <label>{t.actions}</label>
            <button className="secondary-btn" onClick={resetFilters}>
              Reset Filters
            </button>
          </div>
        </div>

        {loading ? (
          <LoadingState message={t.loadingUsers} />
        ) : error ? (
          <EmptyState title={t.usersLoadingFailed} message={error} />
        ) : filteredUsers.length === 0 ? (
          <EmptyState
            title={t.noUsersFound}
            message={t.noUsersMessage}
          />
        ) : (
          <>
            <table>
              <thead>
                <tr>
                  <th>{t.user}</th>
                  <th>{t.email}</th>
                  <th>{t.role}</th>
                  <th>{t.status}</th>
                  <th>{t.actions}</th>
                </tr>
              </thead>

              <tbody>
                {paginatedUsers.map((user) => {
                  const roleName = roleMap[user.RoleId] || `Role ${user.RoleId}`

                  return (
                    <tr key={user.id}>
                      <td>
                        <div className="um-user-cell">
                          <div className={`avatar ${roleName.toLowerCase()}`}>
                            {(user.username || 'U').slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <strong>{user.username}</strong>
                            <span>{t.id}: {user.id}</span>
                          </div>
                        </div>
                      </td>

                      <td>{user.email}</td>

                      <td>
                        <span className={`role ${roleName.toLowerCase()}`}>
                          {roleName}
                        </span>
                      </td>

                      <td>
                        <span
                          className={
                            user.isActive !== false
                              ? 'status active'
                              : 'status inactive'
                          }
                        >
                          {user.isActive !== false ? t.active : t.inactive}
                        </span>
                      </td>

                      <td>
                        <div className="um-row-actions">
                          <button
                            className="um-action-btn edit"
                            onClick={() => openEditModal(user)}
                          >
                            Edit
                          </button>

                          <button
                            className={
                              user.isActive !== false
                                ? 'um-action-btn deactivate'
                                : 'um-action-btn activate'
                            }
                            onClick={() => handleToggleStatus(user)}
                          >
                            {user.isActive !== false ? t.deactivate : t.activate}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {filteredUsers.length > usersPerPage && (
              <div className="um-pagination">
                <p>
                  {t.showing} {(currentPage - 1) * usersPerPage + 1}-
                  {Math.min(currentPage * usersPerPage, filteredUsers.length)} {t.of}{' '}
                  {filteredUsers.length} {t.users}
                </p>

                <div className="pages">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                  >
                    ‹
                  </button>

                  {Array.from({ length: totalPages }, (_, index) => (
                    <button
                      key={index + 1}
                      className={currentPage === index + 1 ? 'active' : ''}
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                  >
                    ›
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </section>

      <section className="um-bottom-grid">
        <div className="security-card">
          <h4>{t.securityTitle}</h4>
          <p>
            {t.securityText}
          </p>
        </div>

        <div className="sessions-card">
          <div className="sessions-top">
            <div>
              <h4>{t.roleDistribution}</h4>
              <p>{t.roleDistributionSubtitle}</p>
            </div>
            <span className="live-pill">{t.live}</span>
          </div>

          <div className="sessions-grid">
            <div>
              <p>{t.admins}</p>
              <h5>{totalAdmins}</h5>
            </div>
            <div>
              <p>{t.managers}</p>
              <h5>{totalManagers}</h5>
            </div>
            <div>
              <p>{t.finance}</p>
              <h5>{totalFinance}</h5>
            </div>
          </div>
        </div>

      </section>

      <section className="activity-card activity-card-full">
        <div className="activity-head">
          <div>
            <h4>{t.recentActivity}</h4>
            <span>{t.recentActivitySubtitle}</span>
          </div>

          <div className="activity-actions">
            <span className="activity-source">{t.activitySource}</span>
            <button className="secondary-btn" onClick={fetchActivities}>
              {t.refreshActivity}
            </button>
            <button
              className="primary-btn"
              onClick={exportActivities}
              disabled={filteredActivities.length === 0}
            >
              {t.exportActivity}
            </button>
          </div>
        </div>

        <div className="activity-story">
          <span className="material-symbols-outlined">history_edu</span>
          <p>{t.administratorStory}</p>
        </div>

        <div className="activity-overview-grid">
          <div className="activity-overview-card">
            <span>{t.auditOverview}</span>
            <strong>{activities.length}</strong>
            <p>{t.activitySource}</p>
          </div>
          <div className="activity-overview-card">
            <span>{t.filteredLogs}</span>
            <strong>{filteredActivities.length}</strong>
            <p>{t.auditSearch}</p>
          </div>
          <div className="activity-overview-card critical">
            <span>{t.criticalLogs}</span>
            <strong>{criticalActivityCount}</strong>
            <p>{t.critical}</p>
          </div>
          <div className="activity-overview-card">
            <span>{t.lastOperation}</span>
            <strong>{lastActivity ? formatActivityAction(lastActivity.action) : '-'}</strong>
            <p>{lastActivity ? formatActivityDate(lastActivity.timestamp) : '-'}</p>
          </div>
        </div>

        <div className="activity-filter-bar">
          <div className="um-filter-field activity-search-field">
            <label>{t.auditSearch}</label>
            <input
              type="text"
              placeholder={t.auditSearchPlaceholder}
              value={activitySearch}
              onChange={(e) => {
                setActivitySearch(e.target.value)
                setActivityPage(1)
              }}
            />
          </div>

          <div className="um-filter-field">
            <label>{t.entity}</label>
            <select
              value={activityEntityFilter}
              onChange={(e) => {
                setActivityEntityFilter(e.target.value)
                setActivityPage(1)
              }}
            >
              <option value="all">{t.allEntities}</option>
              {activityEntities.map((entity) => (
                <option key={entity} value={entity}>{entity}</option>
              ))}
            </select>
          </div>

          <div className="um-filter-field">
            <label>{t.actions}</label>
            <select
              value={activityActionFilter}
              onChange={(e) => {
                setActivityActionFilter(e.target.value)
                setActivityPage(1)
              }}
            >
              <option value="all">{t.allActions}</option>
              {activityActions.map((action) => (
                <option key={action} value={action}>{formatActivityAction(action)}</option>
              ))}
            </select>
          </div>

          <div className="um-filter-field">
            <label>{t.critical}</label>
            <select
              value={activitySeverityFilter}
              onChange={(e) => {
                setActivitySeverityFilter(e.target.value)
                setActivityPage(1)
              }}
            >
              <option value="all">{t.allSeverity}</option>
              <option value="critical">{t.critical}</option>
              <option value="normal">{t.normal}</option>
            </select>
          </div>

          <div className="um-filter-field um-filter-reset">
            <label>{t.actions}</label>
            <button className="secondary-btn" onClick={resetActivityFilters}>
              {t.resetFilters}
            </button>
          </div>
        </div>

        {activityLoading ? (
          <LoadingState message={t.refreshActivity} />
        ) : activityError ? (
          <EmptyState title={t.activityLoadFailed} message={activityError} />
        ) : activities.length === 0 ? (
          <p className="activity-empty">{t.noActivity}</p>
        ) : filteredActivities.length === 0 ? (
          <p className="activity-empty">{t.noFilteredActivity}</p>
        ) : (
          <>
            <div className="activity-table-wrap">
              <table className="activity-table">
                <thead>
                  <tr>
                    <th>{t.actions}</th>
                    <th>{t.entity}</th>
                    <th>{t.actor}</th>
                    <th>{t.details}</th>
                    <th>{t.date}</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedActivities.map((act) => (
                    <tr key={act.id} className={isCriticalActivity(act) ? 'critical-row' : ''}>
                      <td>
                        <span className={`activity-action ${getActivityVerb(act.action)}`}>
                          {formatActivityAction(act.action)}
                        </span>
                      </td>
                      <td>
                        <span className="activity-entity">{act.entity}</span>
                      </td>
                      <td>#{act.userId}</td>
                      <td>{act.details}</td>
                      <td>{formatActivityDate(act.timestamp)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredActivities.length > activitiesPerPage && (
              <div className="um-pagination">
                <p>
                  {t.showing} {(activityPage - 1) * activitiesPerPage + 1}-
                  {Math.min(activityPage * activitiesPerPage, filteredActivities.length)} {t.of}{' '}
                  {filteredActivities.length}
                </p>

                <div className="pages">
                  <button
                    disabled={activityPage === 1}
                    onClick={() => setActivityPage((prev) => Math.max(prev - 1, 1))}
                  >
                    ‹
                  </button>

                  {Array.from({ length: totalActivityPages }, (_, index) => (
                    <button
                      key={index + 1}
                      className={activityPage === index + 1 ? 'active' : ''}
                      onClick={() => setActivityPage(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))}

                  <button
                    disabled={activityPage === totalActivityPages}
                    onClick={() => setActivityPage((prev) => Math.min(prev + 1, totalActivityPages))}
                  >
                    ›
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </section>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editingUser ? t.editUser : t.addNewUser}</h3>

            <div className="form-row">
              <div className="form-group">
                <label>{t.username}</label>
                <input
                  placeholder={t.usernamePlaceholder}
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                />
                <small>{t.usernameHelp}</small>
              </div>

              <div className="form-group">
                <label>{t.email}</label>
                <input
                  type="email"
                  placeholder={t.emailPlaceholder}
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
                <small>{t.emailHelp}</small>
              </div>
            </div>

            <div className="form-group">
              <label>{t.password}</label>
              <input
                type="password"
                placeholder={editingUser ? t.passwordEditPlaceholder : t.passwordCreatePlaceholder}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <small>
                {editingUser
                  ? t.passwordEditHelp
                  : t.passwordCreateHelp}
              </small>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>{t.role}</label>
                <select
                  value={formData.RoleId}
                  onChange={(e) =>
                    setFormData({ ...formData, RoleId: Number(e.target.value) })
                  }
                >
                  <option value={1}>Admin</option>
                  <option value={2}>Manager</option>
                  <option value={3}>{t.finance}</option>
                </select>
                <small>{t.roleHelp}</small>
              </div>

              <div className="form-group">
                <label>{t.accountStatus}</label>
                <select
                  value={formData.isActive ? 'active' : 'inactive'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      isActive: e.target.value === 'active',
                    })
                  }
                >
                  <option value="active">{t.active}</option>
                  <option value="inactive">{t.inactive}</option>
                </select>
                <small>{t.statusHelp}</small>
              </div>
            </div>

            <div className="modal-actions">
              <button onClick={handleSubmit}>
                {editingUser ? t.saveChanges : t.createUser}
              </button>
              <button onClick={closeModal}>{t.cancel}</button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  )
}

export default UserManagement

