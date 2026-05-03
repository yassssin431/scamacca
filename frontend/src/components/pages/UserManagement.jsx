import { useEffect, useState } from 'react'
import './UserManagement.css'
import PageHeader from '../common/PageHeader'
import API_BASE_URL from '../../services/api'
import LoadingState from '../common/LoadingState'
import EmptyState from '../common/EmptyState'
import Toast from '../common/Toast'

const roleMap = {
  1: 'Admin',
  2: 'Manager',
  3: 'Finance',
}

function UserManagement() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [toast, setToast] = useState(null)
  const [activities, setActivities] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('activities') || '[]')
    } catch {
      return []
    }
  })

  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)

  const usersPerPage = 5

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

  const logActivity = (action, user) => {
    const existing = JSON.parse(localStorage.getItem('activities') || '[]')

    const newActivity = {
      id: Date.now(),
      action,
      username: user?.username || 'System',
      role: user?.role || user?.RoleId || '',
      time: new Date().toLocaleString(),
    }

    const updated = [newActivity, ...existing].slice(0, 10)
    localStorage.setItem('activities', JSON.stringify(updated))
    setActivities(updated)
  }

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await fetch(`${API_BASE_URL}/users`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch users')
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
    await fetchUsers()
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
        showToast('Username and email are required', 'error')
        return
      }

      if (!editingUser && !formData.password) {
        showToast('Password is required for new users', 'error')
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

      const response = await fetch(url, {
        method: editingUser ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'User operation failed')
      }

      showToast(editingUser ? 'User updated successfully' : 'User created successfully')
      logActivity(editingUser ? 'User updated' : 'User created', {
        username: formData.username,
        RoleId: formData.RoleId,
      })

      closeModal()
      fetchUsers()
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  const handleToggleStatus = async (user) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isActive: user.isActive === false,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update status')
      }

      const action = user.isActive !== false ? 'User deactivated' : 'User activated'
      showToast(action)
      logActivity(action, user)
      fetchUsers()
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

  return (
    <div className="um-page">
      <PageHeader
        title="User Management"
        subtitle="Manage application users, roles and access control"
        right={
          <button className="primary-btn" onClick={openCreateModal}>
            + Add User
          </button>
        }
      />

      <section className="um-stats">
        <div className="um-stat-card">
          <p>Total Users</p>
          <h3>{users.length}</h3>
          <span className="neutral">Registered accounts</span>
        </div>

        <div className="um-stat-card">
          <p>Active Users</p>
          <h3>{activeUsers}</h3>
          <span className="positive">Allowed access</span>
        </div>

        <div className="um-stat-card">
          <p>Admins</p>
          <h3>{totalAdmins}</h3>
          <span className="neutral">Full permissions</span>
        </div>

        <div className="um-stat-card">
          <p>Finance / Managers</p>
          <h3>{totalFinance + totalManagers}</h3>
          <span className="neutral">Business roles</span>
        </div>
      </section>

      <section className="um-table-card">
        <div className="um-table-top">
          <div>
            <h4>System Users</h4>
            <p>Users loaded from backend API /api/users</p>
          </div>

          <div className="um-actions">
            <button className="secondary-btn" onClick={fetchUsers}>
              Refresh
            </button>
          </div>
        </div>

        <div className="um-filter-bar">
          <div className="um-filter-field">
            <label>Search</label>
            <input
              type="text"
              placeholder="Username or email..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
            />
          </div>

          <div className="um-filter-field">
            <label>Role</label>
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value)
                setCurrentPage(1)
              }}
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="finance">Finance</option>
            </select>
          </div>

          <div className="um-filter-field">
            <label>Status</label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setCurrentPage(1)
              }}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="um-filter-field um-filter-reset">
            <label>Actions</label>
            <button className="secondary-btn" onClick={resetFilters}>
              Reset Filters
            </button>
          </div>
        </div>

        {loading ? (
          <LoadingState message="Loading users..." />
        ) : error ? (
          <EmptyState title="Users loading failed" message={error} />
        ) : filteredUsers.length === 0 ? (
          <EmptyState
            title="No users found"
            message="Create user accounts to manage application access."
          />
        ) : (
          <>
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
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
                            <span>ID: {user.id}</span>
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
                          {user.isActive !== false ? 'Active' : 'Inactive'}
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
                            {user.isActive !== false ? 'Deactivate' : 'Activate'}
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
                  Showing {(currentPage - 1) * usersPerPage + 1}-
                  {Math.min(currentPage * usersPerPage, filteredUsers.length)} of{' '}
                  {filteredUsers.length} users
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
          <h4>Security & Authorization</h4>
          <p>
            User access is structured around JWT authentication and role-based navigation.
            The administrator can manage accounts and assign roles according to responsibilities.
          </p>
        </div>

        <div className="sessions-card">
          <div className="sessions-top">
            <div>
              <h4>Role Distribution</h4>
              <p>Current users grouped by access level</p>
            </div>
            <span className="live-pill">Live</span>
          </div>

          <div className="sessions-grid">
            <div>
              <p>Admins</p>
              <h5>{totalAdmins}</h5>
            </div>
            <div>
              <p>Managers</p>
              <h5>{totalManagers}</h5>
            </div>
            <div>
              <p>Finance</p>
              <h5>{totalFinance}</h5>
            </div>
          </div>
        </div>

        <div className="activity-card">
          <div className="activity-head">
            <div>
              <h4>Recent Activity</h4>
              <span>Last account actions</span>
            </div>
          </div>

          {activities.length === 0 ? (
            <p className="activity-empty">No activity recorded yet.</p>
          ) : (
            <div className="activity-list">
              {activities.map((act) => (
                <div key={act.id} className="activity-item">
                  <div>
                    <strong>{act.action}</strong>
                    <p>{act.username}</p>
                  </div>
                  <span>{act.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editingUser ? 'Edit User' : 'Add New User'}</h3>

            <div className="form-row">
              <div className="form-group">
                <label>Username</label>
                <input
                  placeholder="Enter username"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                />
                <small>Used as the display name inside the system.</small>
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
                <small>Used for authentication and identification.</small>
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder={editingUser ? 'Leave empty to keep current password' : 'Create a password'}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <small>
                {editingUser
                  ? 'Only fill this field if you want to reset the password.'
                  : 'Required when creating a new user account.'}
              </small>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Role</label>
                <select
                  value={formData.RoleId}
                  onChange={(e) =>
                    setFormData({ ...formData, RoleId: Number(e.target.value) })
                  }
                >
                  <option value={1}>Admin</option>
                  <option value={2}>Manager</option>
                  <option value={3}>Finance</option>
                </select>
                <small>Controls access to application modules.</small>
              </div>

              <div className="form-group">
                <label>Account Status</label>
                <select
                  value={formData.isActive ? 'active' : 'inactive'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      isActive: e.target.value === 'active',
                    })
                  }
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <small>Inactive users cannot access protected modules.</small>
              </div>
            </div>

            <div className="modal-actions">
              <button onClick={handleSubmit}>
                {editingUser ? 'Save Changes' : 'Create User'}
              </button>
              <button onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  )
}

export default UserManagement
