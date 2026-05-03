import { useEffect, useState } from 'react'
import API_BASE_URL from '../../services/api'
import './MasterData.css'
import PageHeader from '../common/PageHeader'
import ConfirmModal from '../common/ConfirmModal'
import Toast from '../common/Toast'
import LoadingState from '../common/LoadingState'
import EmptyState from '../common/EmptyState'
import * as XLSX from 'xlsx'

function MasterData() {
  const [activeTab, setActiveTab] = useState('clients')

  const [clients, setClients] = useState([])
  const [projects, setProjects] = useState([])
  const [employees, setEmployees] = useState([])
  const [categories, setCategories] = useState([])
  const [fournisseurs, setFournisseurs] = useState([])
  const [expenses, setExpenses] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [showModal, setShowModal] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [selectedDelete, setSelectedDelete] = useState(null)
  const [toast, setToast] = useState(null)

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [minValue, setMinValue] = useState('')
  const [maxValue, setMaxValue] = useState('')
  const [sortField, setSortField] = useState('localOrder')
  const [sortOrder, setSortOrder] = useState('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 10
  const [highlightedRow, setHighlightedRow] = useState(null)

  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
  })

  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    status: 'Active',
    total_value: '',
    ClientId: '',
  })

  const [newEmployee, setNewEmployee] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    position: '',
    hire_date: '',
    base_salary: '',
  })

  const [newFournisseur, setNewFournisseur] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    contact_person: '',
  })

  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
  })

  const [editingClient, setEditingClient] = useState(null)
  const [editingProject, setEditingProject] = useState(null)
  const [editingEmployee, setEditingEmployee] = useState(null)
  const [editingFournisseur, setEditingFournisseur] = useState(null)
  const [editingCategory, setEditingCategory] = useState(null)

  const [editClientData, setEditClientData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
  })

  const [editProjectData, setEditProjectData] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    status: 'Active',
    total_value: '',
    ClientId: '',
  })

  const [editEmployeeData, setEditEmployeeData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    position: '',
    hire_date: '',
    base_salary: '',
  })

  const [editFournisseurData, setEditFournisseurData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    contact_person: '',
  })

  const [editCategoryData, setEditCategoryData] = useState({
    name: '',
    description: '',
  })

  const showToastMessage = (message, type = 'success') => {
    setToast({ message, type })

    setTimeout(() => {
      setToast(null)
    }, 2500)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          clientsRes,
          projectsRes,
          employeesRes,
          categoriesRes,
          fournisseursRes,
          expensesRes,
        ] = await Promise.all([
          fetch(`${API_BASE_URL}/clients`),
          fetch(`${API_BASE_URL}/projects`),
          fetch(`${API_BASE_URL}/employees`),
          fetch(`${API_BASE_URL}/categories`),
          fetch(`${API_BASE_URL}/fournisseurs`),
          fetch(`${API_BASE_URL}/expenses`),
        ])

        const clientsData = await clientsRes.json()
        const projectsData = await projectsRes.json()
        const employeesData = await employeesRes.json()
        const categoriesData = await categoriesRes.json()
        const fournisseursData = await fournisseursRes.json()
        const expensesData = await expensesRes.json()

        if (
          !clientsRes.ok ||
          !projectsRes.ok ||
          !employeesRes.ok ||
          !categoriesRes.ok ||
          !fournisseursRes.ok ||
          !expensesRes.ok
        ) {
          throw new Error('Failed to fetch master data')
        }

        setClients(clientsData.data || [])
        setProjects(projectsData.data || [])
        setEmployees(employeesData.data || [])
        setCategories(Array.isArray(categoriesData) ? categoriesData : categoriesData.data || [])
        setFournisseurs(Array.isArray(fournisseursData) ? fournisseursData : fournisseursData.data || [])
        setExpenses(expensesData.data || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const resetFilters = () => {
    setSearchTerm('')
    setStatusFilter('all')
    setDateFrom('')
    setDateTo('')
    setMinValue('')
    setMaxValue('')
    setSortField('localOrder')
    setSortOrder('desc')
    setCurrentPage(1)
  }

  const switchTab = (tab) => {
    setActiveTab(tab)
    resetFilters()
  }

  const closeAddModal = () => {
    setShowModal(false)
  }

  const highlightRecord = (type, id) => {
    if (!id) return

    setHighlightedRow({ type, id })

    setTimeout(() => {
      setHighlightedRow(null)
    }, 3500)
  }

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
      setCurrentPage(1)
    } else {
      setSortField(field)
      setSortOrder('asc')
      setCurrentPage(1)
    }
  }

  const getSortIcon = (field) => {
    if (sortField !== field) return '↕'
    return sortOrder === 'asc' ? '↑' : '↓'
  }

  const getCategoryUsageCount = (categoryId) => {
    return expenses.filter((expense) => Number(expense.CategoryId) === Number(categoryId)).length
  }

  const getRecordDate = (item, type) => {
    if (type === 'projects') return item.start_date || item.createdAt
    if (type === 'employees') return item.hire_date || item.createdAt
    return item.createdAt || item.updatedAt
  }

  const getRecordValue = (item, type) => {
    if (type === 'projects') return Number(item.total_value || 0)
    if (type === 'employees') return Number(item.base_salary || 0)
    if (type === 'categories') return getCategoryUsageCount(item.id)
    return 0
  }

  const getSearchableText = (item, type) => {
    if (type === 'clients') {
      return [item.name, item.email, item.phone, item.company, item.address].join(' ')
    }

    if (type === 'projects') {
      return [
        item.name,
        item.description,
        item.status,
        item.total_value,
        item.Client?.name,
        item.start_date,
        item.end_date,
      ].join(' ')
    }

    if (type === 'employees') {
      return [
        item.first_name,
        item.last_name,
        item.email,
        item.phone,
        item.position,
        item.hire_date,
        item.base_salary,
      ].join(' ')
    }

    if (type === 'categories') {
      return [item.name, item.description, getCategoryUsageCount(item.id)].join(' ')
    }

    return [item.name, item.email, item.phone, item.address, item.contact_person].join(' ')
  }

  const processData = (data, type) => {
    return [...data]
      .filter((item) => {
        const searchMatch = getSearchableText(item, type)
          .toLowerCase()
          .includes(searchTerm.toLowerCase())

        const statusMatch =
          type !== 'projects' ||
          statusFilter === 'all' ||
          item.status === statusFilter

        const recordDate = getRecordDate(item, type)
        const recordTime = recordDate ? new Date(recordDate).getTime() : null

        const fromMatch =
          !dateFrom || (recordTime && recordTime >= new Date(dateFrom).getTime())

        const toMatch =
          !dateTo || (recordTime && recordTime <= new Date(dateTo).getTime())

        const value = getRecordValue(item, type)

        const minMatch = !minValue || value >= Number(minValue)
        const maxMatch = !maxValue || value <= Number(maxValue)

        return searchMatch && statusMatch && fromMatch && toMatch && minMatch && maxMatch
      })
      .sort((a, b) => {
        const getValue = (item) => {
          if (sortField === 'localOrder') {
            return item.__localOrder || new Date(item.createdAt || getRecordDate(item, type) || 0).getTime()
          }
          if (sortField === 'displayDate') return getRecordDate(item, type) || ''
          if (sortField === 'displayValue') return getRecordValue(item, type)
          if (sortField === 'client') return item.Client?.name || ''
          if (sortField === 'fullName') {
            return `${item.first_name || ''} ${item.last_name || ''}`.trim()
          }
          if (sortField === 'usage') return getCategoryUsageCount(item.id)
          return item[sortField] || ''
        }

        const valA = getValue(a)
        const valB = getValue(b)

        if (typeof valA === 'number' || typeof valB === 'number') {
          return sortOrder === 'asc'
            ? Number(valA) - Number(valB)
            : Number(valB) - Number(valA)
        }

        return sortOrder === 'asc'
          ? String(valA).localeCompare(String(valB))
          : String(valB).localeCompare(String(valA))
      })
  }

  const exportToExcel = (rows, filename) => {
    if (!rows.length) {
      showToastMessage('No data available to export', 'error')
      return
    }

    const worksheet = XLSX.utils.json_to_sheet(rows)
    const workbook = XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
    XLSX.writeFile(workbook, `${filename}.xlsx`)

    showToastMessage('Excel file exported successfully')
  }


  const renderControls = (type, rows, filename) => (
    <div className="master-controls">
      <div className="master-filter-field search">
        <label>Search</label>
        <input
          type="text"
          placeholder="Search records..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setCurrentPage(1)
          }}
        />
      </div>

      {type === 'projects' && (
        <div className="master-filter-field">
          <label>Status</label>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              setCurrentPage(1)
            }}
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      )}

      <div className="master-filter-field">
        <label>From</label>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => {
            setDateFrom(e.target.value)
            setCurrentPage(1)
          }}
        />
      </div>

      <div className="master-filter-field">
        <label>To</label>
        <input
          type="date"
          value={dateTo}
          onChange={(e) => {
            setDateTo(e.target.value)
            setCurrentPage(1)
          }}
        />
      </div>

      {(type === 'projects' || type === 'employees' || type === 'categories') && (
        <>
          <div className="master-filter-field small">
            <label>Min</label>
            <input
              type="number"
              placeholder="0"
              value={minValue}
              onChange={(e) => {
                setMinValue(e.target.value)
                setCurrentPage(1)
              }}
            />
          </div>

          <div className="master-filter-field small">
            <label>Max</label>
            <input
              type="number"
              placeholder="Any"
              value={maxValue}
              onChange={(e) => {
                setMaxValue(e.target.value)
                setCurrentPage(1)
              }}
            />
          </div>
        </>
      )}

      <div className="master-control-actions">
        <button className="master-secondary-btn" onClick={resetFilters}>
          Reset
        </button>

        <button className="master-export-btn" onClick={() => exportToExcel(rows, filename)}>
          Export Excel
        </button>
      </div>
    </div>
  )

  const getPaginatedData = (data) => {
    const startIndex = (currentPage - 1) * rowsPerPage
    return data.slice(startIndex, startIndex + rowsPerPage)
  }

  const renderPagination = (totalItems) => {
    const totalPages = Math.ceil(totalItems / rowsPerPage)

    if (totalPages <= 1) return null

    return (
      <div className="master-pagination">
        <p>
          Showing {(currentPage - 1) * rowsPerPage + 1}-
          {Math.min(currentPage * rowsPerPage, totalItems)} of {totalItems} records
        </p>

        <div className="master-pages">
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
    )
  }

  const confirmDelete = (id, type) => {
    setSelectedDelete({ id, type })
    setShowConfirm(true)
  }

  const handleCreateClient = async () => {
    try {
      if (!newClient.name) {
        showToastMessage('Client name is required', 'error')
        return
      }

      const response = await fetch(`${API_BASE_URL}/clients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClient),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create client')
      }

      const createdClient = { ...result.data, __localOrder: Date.now() }

      setClients((prev) => [createdClient, ...prev])
      highlightRecord('clients', createdClient.id)
      closeAddModal()
      setNewClient({
        name: '',
        email: '',
        phone: '',
        company: '',
        address: '',
      })
      showToastMessage('Client created successfully')
    } catch (err) {
      showToastMessage(err.message, 'error')
    }
  }

  const openEditClientModal = (client) => {
    setEditingClient(client)
    setEditClientData({
      name: client.name || '',
      email: client.email || '',
      phone: client.phone || '',
      company: client.company || '',
      address: client.address || '',
    })
  }

  const handleUpdateClient = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/clients/${editingClient.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editClientData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update client')
      }

      setClients((prev) =>
        prev.map((client) =>
          client.id === editingClient.id ? result.data : client
        )
      )

      setEditingClient(null)
      showToastMessage('Client updated successfully')
    } catch (err) {
      showToastMessage(err.message, 'error')
    }
  }

  const handleDeleteClient = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to delete client')
      }

      setClients((prev) => prev.filter((client) => client.id !== id))
      showToastMessage('Client deleted successfully')
    } catch (err) {
      showToastMessage(err.message || 'Failed to delete client', 'error')
    } finally {
      setShowConfirm(false)
      setSelectedDelete(null)
    }
  }

  const handleCreateProject = async () => {
    try {
      if (!newProject.name || !newProject.total_value || !newProject.ClientId) {
        showToastMessage('Please fill project name, total value, and client.', 'error')
        return
      }

      const payload = {
        name: newProject.name,
        description: newProject.description || null,
        start_date: newProject.start_date || null,
        end_date: newProject.end_date || null,
        status: newProject.status,
        total_value: parseFloat(newProject.total_value),
        ClientId: parseInt(newProject.ClientId, 10),
      }

      const response = await fetch(`${API_BASE_URL}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create project')
      }

      const createdProject = { ...result.data, __localOrder: Date.now() }

      setProjects((prev) => [createdProject, ...prev])
      highlightRecord('projects', createdProject.id)
      closeAddModal()
      setNewProject({
        name: '',
        description: '',
        start_date: '',
        end_date: '',
        status: 'Active',
        total_value: '',
        ClientId: '',
      })
      showToastMessage('Project created successfully')
    } catch (err) {
      showToastMessage(err.message, 'error')
    }
  }

  const openEditProjectModal = (project) => {
    setEditingProject(project)
    setEditProjectData({
      name: project.name || '',
      description: project.description || '',
      start_date: project.start_date ? project.start_date.slice(0, 10) : '',
      end_date: project.end_date ? project.end_date.slice(0, 10) : '',
      status: project.status || 'Active',
      total_value: project.total_value || '',
      ClientId: project.ClientId || project.Client?.id || '',
    })
  }

  const handleUpdateProject = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${editingProject.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editProjectData,
          total_value: Number(editProjectData.total_value),
          ClientId: Number(editProjectData.ClientId),
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update project')
      }

      setProjects((prev) =>
        prev.map((project) =>
          project.id === editingProject.id ? result.data : project
        )
      )

      setEditingProject(null)
      showToastMessage('Project updated successfully')
    } catch (err) {
      showToastMessage(err.message, 'error')
    }
  }

  const handleDeleteProject = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to delete project')
      }

      setProjects((prev) => prev.filter((project) => project.id !== id))
      showToastMessage('Project deleted successfully')
    } catch (err) {
      showToastMessage(err.message || 'Failed to delete project', 'error')
    } finally {
      setShowConfirm(false)
      setSelectedDelete(null)
    }
  }

  const handleCreateEmployee = async () => {
    try {
      if (!newEmployee.first_name || !newEmployee.base_salary) {
        showToastMessage('First name and base salary are required', 'error')
        return
      }

      const payload = {
        ...newEmployee,
        base_salary: Number(newEmployee.base_salary),
        hire_date: newEmployee.hire_date || null,
      }

      const response = await fetch(`${API_BASE_URL}/employees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create employee')
      }

      const createdEmployee = { ...result.data, __localOrder: Date.now() }

      setEmployees((prev) => [createdEmployee, ...prev])
      highlightRecord('employees', createdEmployee.id)
      closeAddModal()
      setNewEmployee({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        position: '',
        hire_date: '',
        base_salary: '',
      })
      showToastMessage('Employee created successfully')
    } catch (err) {
      showToastMessage(err.message, 'error')
    }
  }

  const openEditEmployeeModal = (employee) => {
    setEditingEmployee(employee)
    setEditEmployeeData({
      first_name: employee.first_name || '',
      last_name: employee.last_name || '',
      email: employee.email || '',
      phone: employee.phone || '',
      position: employee.position || '',
      hire_date: employee.hire_date ? employee.hire_date.slice(0, 10) : '',
      base_salary: employee.base_salary || '',
    })
  }

  const handleUpdateEmployee = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/employees/${editingEmployee.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editEmployeeData,
          base_salary: Number(editEmployeeData.base_salary),
          hire_date: editEmployeeData.hire_date || null,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update employee')
      }

      setEmployees((prev) =>
        prev.map((employee) =>
          employee.id === editingEmployee.id ? result.data : employee
        )
      )

      setEditingEmployee(null)
      showToastMessage('Employee updated successfully')
    } catch (err) {
      showToastMessage(err.message, 'error')
    }
  }

  const handleDeleteEmployee = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to delete employee')
      }

      setEmployees((prev) => prev.filter((employee) => employee.id !== id))
      showToastMessage('Employee deleted successfully')
    } catch (err) {
      showToastMessage(err.message || 'Failed to delete employee', 'error')
    } finally {
      setShowConfirm(false)
      setSelectedDelete(null)
    }
  }

  const handleCreateFournisseur = async () => {
    try {
      if (!newFournisseur.name) {
        showToastMessage('Supplier name is required', 'error')
        return
      }

      const response = await fetch(`${API_BASE_URL}/fournisseurs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFournisseur),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create supplier')
      }

      const createdFournisseur = { ...(result.data || result), __localOrder: Date.now() }

      setFournisseurs((prev) => [createdFournisseur, ...prev])
      highlightRecord('fournisseurs', createdFournisseur.id)
      closeAddModal()
      setNewFournisseur({
        name: '',
        email: '',
        phone: '',
        address: '',
        contact_person: '',
      })
      showToastMessage('Supplier created successfully')
    } catch (err) {
      showToastMessage(err.message, 'error')
    }
  }

  const openEditFournisseurModal = (fournisseur) => {
    setEditingFournisseur(fournisseur)
    setEditFournisseurData({
      name: fournisseur.name || '',
      email: fournisseur.email || '',
      phone: fournisseur.phone || '',
      address: fournisseur.address || '',
      contact_person: fournisseur.contact_person || '',
    })
  }

  const handleUpdateFournisseur = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/fournisseurs/${editingFournisseur.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFournisseurData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update supplier')
      }

      setFournisseurs((prev) =>
        prev.map((f) =>
          f.id === editingFournisseur.id ? result.data || result : f
        )
      )

      setEditingFournisseur(null)
      showToastMessage('Supplier updated successfully')
    } catch (err) {
      showToastMessage(err.message, 'error')
    }
  }

  const handleDeleteFournisseur = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/fournisseurs/${id}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to delete supplier')
      }

      setFournisseurs((prev) => prev.filter((fournisseur) => fournisseur.id !== id))
      showToastMessage('Supplier deleted successfully')
    } catch (err) {
      showToastMessage(err.message || 'Failed to delete supplier', 'error')
    } finally {
      setShowConfirm(false)
      setSelectedDelete(null)
    }
  }

  const handleCreateCategory = async () => {
    try {
      if (!newCategory.name) {
        showToastMessage('Category name is required', 'error')
        return
      }

      const response = await fetch(`${API_BASE_URL}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCategory),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create category')
      }

      const createdCategory = { ...(result.data || result), __localOrder: Date.now() }

      setCategories((prev) => [createdCategory, ...prev])
      highlightRecord('categories', createdCategory.id)
      closeAddModal()
      setNewCategory({
        name: '',
        description: '',
      })
      showToastMessage('Category created successfully')
    } catch (err) {
      showToastMessage(err.message, 'error')
    }
  }

  const openEditCategoryModal = (category) => {
    setEditingCategory(category)
    setEditCategoryData({
      name: category.name || '',
      description: category.description || '',
    })
  }

  const handleUpdateCategory = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${editingCategory.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editCategoryData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update category')
      }

      setCategories((prev) =>
        prev.map((c) =>
          c.id === editingCategory.id ? result.data || { ...c, ...editCategoryData } : c
        )
      )

      setEditingCategory(null)
      showToastMessage('Category updated successfully')
    } catch (err) {
      showToastMessage(err.message, 'error')
    }
  }

  const handleDeleteCategory = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to delete category')
      }

      setCategories((prev) => prev.filter((category) => category.id !== id))
      showToastMessage('Category deleted successfully')
    } catch (err) {
      showToastMessage(err.message || 'Failed to delete category', 'error')
    } finally {
      setShowConfirm(false)
      setSelectedDelete(null)
    }
  }

  const handleConfirmDelete = () => {
    if (!selectedDelete) return

    if (selectedDelete.type === 'client') handleDeleteClient(selectedDelete.id)
    if (selectedDelete.type === 'project') handleDeleteProject(selectedDelete.id)
    if (selectedDelete.type === 'employee') handleDeleteEmployee(selectedDelete.id)
    if (selectedDelete.type === 'fournisseur') handleDeleteFournisseur(selectedDelete.id)
    if (selectedDelete.type === 'category') handleDeleteCategory(selectedDelete.id)
  }

  const getCurrentData = () => {
    if (activeTab === 'clients') return clients
    if (activeTab === 'projects') return projects
    if (activeTab === 'employees') return employees
    if (activeTab === 'categories') return categories
    return fournisseurs
  }

  const currentData = getCurrentData()
  const filteredCurrentData = processData(currentData, activeTab)

  const renderActions = (item, type) => (
    <div className="master-row-actions">
      <button
        className="master-action-btn edit"
        onClick={() => {
          if (type === 'client') openEditClientModal(item)
          if (type === 'project') openEditProjectModal(item)
          if (type === 'employee') openEditEmployeeModal(item)
          if (type === 'fournisseur') openEditFournisseurModal(item)
          if (type === 'category') openEditCategoryModal(item)
        }}
      >
        Edit
      </button>

      <button
        className="master-action-btn delete"
        onClick={() => confirmDelete(item.id, type)}
      >
        Delete
      </button>
    </div>
  )

  const renderClientsTable = () => {
    const rows = filteredCurrentData.map((c) => ({
      Name: c.name || '-',
      Email: c.email || '-',
      Phone: c.phone || '-',
      Company: c.company || '-',
      Address: c.address || '-',
    }))

    return (
      <>
        <div className="master-table-top">
          <div>
            <h4>Clients</h4>
            <p>{filteredCurrentData.length} visible records from {clients.length} total clients</p>
          </div>
        </div>

        {renderControls('clients', rows, 'clients')}

        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort('name')}>Name {getSortIcon('name')}</th>
              <th onClick={() => handleSort('email')}>Email {getSortIcon('email')}</th>
              <th onClick={() => handleSort('phone')}>Phone {getSortIcon('phone')}</th>
              <th onClick={() => handleSort('company')}>Company {getSortIcon('company')}</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredCurrentData.length > 0 ? (
              getPaginatedData(filteredCurrentData).map((c) => (
                <tr
                  key={c.id}
                  className={highlightedRow?.type === 'clients' && highlightedRow?.id === c.id ? 'master-row-highlight' : ''}
                >
                  <td>{c.name || '-'}</td>
                  <td>{c.email || '-'}</td>
                  <td>{c.phone || '-'}</td>
                  <td>{c.company || '-'}</td>
                  <td>{c.address || '-'}</td>
                  <td>{renderActions(c, 'client')}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">
                  <EmptyState title="No clients found" message="No client records match your current filters." />
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {renderPagination(filteredCurrentData.length)}
      </>
    )
  }

  const renderProjectsTable = () => {
    const rows = filteredCurrentData.map((p) => ({
      Name: p.name || '-',
      Status: p.status || '-',
      'Start Date': p.start_date ? p.start_date.slice(0, 10) : '-',
      'End Date': p.end_date ? p.end_date.slice(0, 10) : '-',
      Value: Number(p.total_value || 0),
      Client: p.Client?.name || '-',
    }))

    return (
      <>
        <div className="master-table-top">
          <div>
            <h4>Projects</h4>
            <p>{filteredCurrentData.length} visible records from {projects.length} total projects</p>
          </div>
        </div>

        {renderControls('projects', rows, 'projects')}

        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort('name')}>Name {getSortIcon('name')}</th>
              <th onClick={() => handleSort('status')}>Status {getSortIcon('status')}</th>
              <th onClick={() => handleSort('displayDate')}>Start Date {getSortIcon('displayDate')}</th>
              <th onClick={() => handleSort('end_date')}>End Date {getSortIcon('end_date')}</th>
              <th onClick={() => handleSort('displayValue')}>Value {getSortIcon('displayValue')}</th>
              <th onClick={() => handleSort('client')}>Client {getSortIcon('client')}</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredCurrentData.length > 0 ? (
              getPaginatedData(filteredCurrentData).map((p) => (
                <tr
                  key={p.id}
                  className={highlightedRow?.type === 'projects' && highlightedRow?.id === p.id ? 'master-row-highlight' : ''}
                >
                  <td>{p.name || '-'}</td>
                  <td>{p.status || '-'}</td>
                  <td>{p.start_date ? p.start_date.slice(0, 10) : '-'}</td>
                  <td>{p.end_date ? p.end_date.slice(0, 10) : '-'}</td>
                  <td>${Number(p.total_value || 0).toLocaleString()}</td>
                  <td>{p.Client?.name || '-'}</td>
                  <td>{renderActions(p, 'project')}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">
                  <EmptyState title="No projects found" message="No project records match your current filters." />
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {renderPagination(filteredCurrentData.length)}
      </>
    )
  }

  const renderEmployeesTable = () => {
    const rows = filteredCurrentData.map((e) => ({
      'First Name': e.first_name || '-',
      'Last Name': e.last_name || '-',
      Email: e.email || '-',
      Phone: e.phone || '-',
      Position: e.position || '-',
      'Hire Date': e.hire_date ? e.hire_date.slice(0, 10) : '-',
      'Base Salary': Number(e.base_salary || 0),
    }))

    return (
      <>
        <div className="master-table-top">
          <div>
            <h4>Employees</h4>
            <p>{filteredCurrentData.length} visible records from {employees.length} total employees</p>
          </div>
        </div>

        {renderControls('employees', rows, 'employees')}

        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort('first_name')}>First Name {getSortIcon('first_name')}</th>
              <th onClick={() => handleSort('last_name')}>Last Name {getSortIcon('last_name')}</th>
              <th onClick={() => handleSort('email')}>Email {getSortIcon('email')}</th>
              <th onClick={() => handleSort('position')}>Position {getSortIcon('position')}</th>
              <th onClick={() => handleSort('displayDate')}>Hire Date {getSortIcon('displayDate')}</th>
              <th onClick={() => handleSort('displayValue')}>Base Salary {getSortIcon('displayValue')}</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredCurrentData.length > 0 ? (
              getPaginatedData(filteredCurrentData).map((e) => (
                <tr
                  key={e.id}
                  className={highlightedRow?.type === 'employees' && highlightedRow?.id === e.id ? 'master-row-highlight' : ''}
                >
                  <td>{e.first_name || '-'}</td>
                  <td>{e.last_name || '-'}</td>
                  <td>{e.email || '-'}</td>
                  <td>{e.position || '-'}</td>
                  <td>{e.hire_date ? e.hire_date.slice(0, 10) : '-'}</td>
                  <td>${Number(e.base_salary || 0).toLocaleString()}</td>
                  <td>{renderActions(e, 'employee')}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">
                  <EmptyState title="No employees found" message="No employee records match your current filters." />
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {renderPagination(filteredCurrentData.length)}
      </>
    )
  }

  const renderCategoriesTable = () => {
    const rows = filteredCurrentData.map((c) => ({
      Name: c.name || '-',
      Description: c.description || '-',
      'Used In Expenses': getCategoryUsageCount(c.id),
    }))

    return (
      <>
        <div className="master-table-top">
          <div>
            <h4>Categories</h4>
            <p>{filteredCurrentData.length} visible records from {categories.length} total categories</p>
          </div>
        </div>

        {renderControls('categories', rows, 'categories')}

        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort('name')}>Name {getSortIcon('name')}</th>
              <th>Description</th>
              <th onClick={() => handleSort('usage')}>Used In Expenses {getSortIcon('usage')}</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredCurrentData.length > 0 ? (
              getPaginatedData(filteredCurrentData).map((c) => (
                <tr
                  key={c.id}
                  className={highlightedRow?.type === 'categories' && highlightedRow?.id === c.id ? 'master-row-highlight' : ''}
                >
                  <td>{c.name || '-'}</td>
                  <td>{c.description || '-'}</td>
                  <td>{getCategoryUsageCount(c.id)}</td>
                  <td>{renderActions(c, 'category')}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">
                  <EmptyState title="No categories found" message="No category records match your current filters." />
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {renderPagination(filteredCurrentData.length)}
      </>
    )
  }

  const renderFournisseursTable = () => {
    const rows = filteredCurrentData.map((f) => ({
      Name: f.name || '-',
      Email: f.email || '-',
      Phone: f.phone || '-',
      Address: f.address || '-',
      'Contact Person': f.contact_person || '-',
    }))

    return (
      <>
        <div className="master-table-top">
          <div>
            <h4>Suppliers</h4>
            <p>{filteredCurrentData.length} visible records from {fournisseurs.length} total suppliers</p>
          </div>
        </div>

        {renderControls('fournisseurs', rows, 'suppliers')}

        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort('name')}>Name {getSortIcon('name')}</th>
              <th onClick={() => handleSort('email')}>Email {getSortIcon('email')}</th>
              <th onClick={() => handleSort('phone')}>Phone {getSortIcon('phone')}</th>
              <th>Address</th>
              <th onClick={() => handleSort('contact_person')}>Contact Person {getSortIcon('contact_person')}</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredCurrentData.length > 0 ? (
              getPaginatedData(filteredCurrentData).map((f) => (
                <tr
                  key={f.id}
                  className={highlightedRow?.type === 'fournisseurs' && highlightedRow?.id === f.id ? 'master-row-highlight' : ''}
                >
                  <td>{f.name || '-'}</td>
                  <td>{f.email || '-'}</td>
                  <td>{f.phone || '-'}</td>
                  <td>{f.address || '-'}</td>
                  <td>{f.contact_person || '-'}</td>
                  <td>{renderActions(f, 'fournisseur')}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">
                  <EmptyState title="No suppliers found" message="No supplier records match your current filters." />
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {renderPagination(filteredCurrentData.length)}
      </>
    )
  }

  const renderActiveTable = () => {
    if (activeTab === 'clients') return renderClientsTable()
    if (activeTab === 'projects') return renderProjectsTable()
    if (activeTab === 'employees') return renderEmployeesTable()
    if (activeTab === 'categories') return renderCategoriesTable()
    if (activeTab === 'fournisseurs') return renderFournisseursTable()

    return <EmptyState title="Tab not connected" message="This section is not available yet." />
  }

  const getBottomCards = () => {
    if (activeTab === 'clients') {
      return [
        { title: 'Total Clients', value: clients.length },
        { title: 'Visible Records', value: filteredCurrentData.length },
        { title: 'Status', value: 'Connected', dark: true },
      ]
    }

    if (activeTab === 'projects') {
      return [
        { title: 'Total Projects', value: projects.length },
        { title: 'Visible Records', value: filteredCurrentData.length },
        { title: 'Status', value: 'Connected', dark: true },
      ]
    }

    if (activeTab === 'employees') {
      return [
        { title: 'Total Employees', value: employees.length },
        { title: 'Visible Records', value: filteredCurrentData.length },
        { title: 'Status', value: 'Connected', dark: true },
      ]
    }

    if (activeTab === 'categories') {
      return [
        { title: 'Total Categories', value: categories.length },
        { title: 'Visible Records', value: filteredCurrentData.length },
        { title: 'Status', value: 'Connected', dark: true },
      ]
    }

    return [
      { title: 'Total Suppliers', value: fournisseurs.length },
      { title: 'Visible Records', value: filteredCurrentData.length },
      { title: 'Status', value: 'Connected', dark: true },
    ]
  }

  const bottomCards = getBottomCards()

  return (
    <div className="master-page">
      <PageHeader
        title="Master Data"
        subtitle="Manage core reference entities used across the application"
      />

      <div className="master-header">
        <div>
          <h2>Entity Directory</h2>
          <p>Centralized governance for reference data</p>
        </div>

        <button className="add-btn" onClick={() => setShowModal(true)}>
          + Add New
        </button>
      </div>

      <div className="master-tabs">
        <button className={activeTab === 'clients' ? 'active' : ''} onClick={() => switchTab('clients')}>
          Clients
        </button>

        <button className={activeTab === 'projects' ? 'active' : ''} onClick={() => switchTab('projects')}>
          Projects
        </button>

        <button className={activeTab === 'employees' ? 'active' : ''} onClick={() => switchTab('employees')}>
          Employees
        </button>

        <button className={activeTab === 'fournisseurs' ? 'active' : ''} onClick={() => switchTab('fournisseurs')}>
          Suppliers
        </button>

        <button className={activeTab === 'categories' ? 'active' : ''} onClick={() => switchTab('categories')}>
          Categories
        </button>
      </div>

      <div className="table-card">
        {loading ? (
          <LoadingState message="Loading master data..." />
        ) : error ? (
          <EmptyState title="Master data loading failed" message={error} />
        ) : (
          renderActiveTable()
        )}
      </div>

      <div className="master-bottom">
        {bottomCards.map((card, index) => (
          <div key={index} className={card.dark ? 'card dark' : 'card'}>
            <h4>{card.title}</h4>
            <h3>{card.value}</h3>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            {activeTab === 'clients' && (
              <>
                <h3>Add New Client</h3>

                <input placeholder="Name" value={newClient.name} onChange={(e) => setNewClient({ ...newClient, name: e.target.value })} />
                <input placeholder="Email" value={newClient.email} onChange={(e) => setNewClient({ ...newClient, email: e.target.value })} />
                <input placeholder="Phone" value={newClient.phone} onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })} />
                <input placeholder="Company" value={newClient.company} onChange={(e) => setNewClient({ ...newClient, company: e.target.value })} />
                <input placeholder="Address" value={newClient.address} onChange={(e) => setNewClient({ ...newClient, address: e.target.value })} />

                <div className="modal-actions">
                  <button onClick={handleCreateClient}>Create</button>
                  <button onClick={closeAddModal}>Cancel</button>
                </div>
              </>
            )}

            {activeTab === 'projects' && (
              <>
                <h3>Add New Project</h3>

                <input placeholder="Project Name" value={newProject.name} onChange={(e) => setNewProject({ ...newProject, name: e.target.value })} />
                <input placeholder="Description" value={newProject.description} onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} />
                <input type="date" value={newProject.start_date} onChange={(e) => setNewProject({ ...newProject, start_date: e.target.value })} />
                <input type="date" value={newProject.end_date} onChange={(e) => setNewProject({ ...newProject, end_date: e.target.value })} />
                <input type="number" placeholder="Total Value" value={newProject.total_value} onChange={(e) => setNewProject({ ...newProject, total_value: e.target.value })} />

                <select value={newProject.status} onChange={(e) => setNewProject({ ...newProject, status: e.target.value })}>
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                  <option value="Pending">Pending</option>
                </select>

                <select value={newProject.ClientId} onChange={(e) => setNewProject({ ...newProject, ClientId: e.target.value })}>
                  <option value="">Select Client</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>{client.name}</option>
                  ))}
                </select>

                <div className="modal-actions">
                  <button onClick={handleCreateProject}>Create</button>
                  <button onClick={closeAddModal}>Cancel</button>
                </div>
              </>
            )}

            {activeTab === 'employees' && (
              <>
                <h3>Add New Employee</h3>

                <input placeholder="First Name" value={newEmployee.first_name} onChange={(e) => setNewEmployee({ ...newEmployee, first_name: e.target.value })} />
                <input placeholder="Last Name" value={newEmployee.last_name} onChange={(e) => setNewEmployee({ ...newEmployee, last_name: e.target.value })} />
                <input placeholder="Email" value={newEmployee.email} onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })} />
                <input placeholder="Phone" value={newEmployee.phone} onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })} />
                <input placeholder="Position" value={newEmployee.position} onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })} />
                <input type="date" value={newEmployee.hire_date} onChange={(e) => setNewEmployee({ ...newEmployee, hire_date: e.target.value })} />
                <input type="number" placeholder="Base Salary" value={newEmployee.base_salary} onChange={(e) => setNewEmployee({ ...newEmployee, base_salary: e.target.value })} />

                <div className="modal-actions">
                  <button onClick={handleCreateEmployee}>Create</button>
                  <button onClick={closeAddModal}>Cancel</button>
                </div>
              </>
            )}

            {activeTab === 'fournisseurs' && (
              <>
                <h3>Add New Supplier</h3>

                <input placeholder="Name" value={newFournisseur.name} onChange={(e) => setNewFournisseur({ ...newFournisseur, name: e.target.value })} />
                <input placeholder="Email" value={newFournisseur.email} onChange={(e) => setNewFournisseur({ ...newFournisseur, email: e.target.value })} />
                <input placeholder="Phone" value={newFournisseur.phone} onChange={(e) => setNewFournisseur({ ...newFournisseur, phone: e.target.value })} />
                <input placeholder="Address" value={newFournisseur.address} onChange={(e) => setNewFournisseur({ ...newFournisseur, address: e.target.value })} />
                <input placeholder="Contact Person" value={newFournisseur.contact_person} onChange={(e) => setNewFournisseur({ ...newFournisseur, contact_person: e.target.value })} />

                <div className="modal-actions">
                  <button onClick={handleCreateFournisseur}>Create</button>
                  <button onClick={closeAddModal}>Cancel</button>
                </div>
              </>
            )}

            {activeTab === 'categories' && (
              <>
                <h3>Add New Category</h3>

                <input placeholder="Name" value={newCategory.name} onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })} />
                <input placeholder="Description" value={newCategory.description} onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })} />

                <div className="modal-actions">
                  <button onClick={handleCreateCategory}>Create</button>
                  <button onClick={closeAddModal}>Cancel</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {editingClient && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Client</h3>

            <input placeholder="Name" value={editClientData.name} onChange={(e) => setEditClientData({ ...editClientData, name: e.target.value })} />
            <input placeholder="Email" value={editClientData.email} onChange={(e) => setEditClientData({ ...editClientData, email: e.target.value })} />
            <input placeholder="Phone" value={editClientData.phone} onChange={(e) => setEditClientData({ ...editClientData, phone: e.target.value })} />
            <input placeholder="Company" value={editClientData.company} onChange={(e) => setEditClientData({ ...editClientData, company: e.target.value })} />
            <input placeholder="Address" value={editClientData.address} onChange={(e) => setEditClientData({ ...editClientData, address: e.target.value })} />

            <div className="modal-actions">
              <button onClick={handleUpdateClient}>Save</button>
              <button onClick={() => setEditingClient(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {editingProject && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Project</h3>

            <input placeholder="Project Name" value={editProjectData.name} onChange={(e) => setEditProjectData({ ...editProjectData, name: e.target.value })} />
            <input placeholder="Description" value={editProjectData.description} onChange={(e) => setEditProjectData({ ...editProjectData, description: e.target.value })} />
            <input type="date" value={editProjectData.start_date} onChange={(e) => setEditProjectData({ ...editProjectData, start_date: e.target.value })} />
            <input type="date" value={editProjectData.end_date} onChange={(e) => setEditProjectData({ ...editProjectData, end_date: e.target.value })} />
            <input type="number" placeholder="Total Value" value={editProjectData.total_value} onChange={(e) => setEditProjectData({ ...editProjectData, total_value: e.target.value })} />

            <select value={editProjectData.status} onChange={(e) => setEditProjectData({ ...editProjectData, status: e.target.value })}>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
            </select>

            <select value={editProjectData.ClientId} onChange={(e) => setEditProjectData({ ...editProjectData, ClientId: e.target.value })}>
              <option value="">Select Client</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>{client.name}</option>
              ))}
            </select>

            <div className="modal-actions">
              <button onClick={handleUpdateProject}>Save</button>
              <button onClick={() => setEditingProject(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {editingEmployee && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Employee</h3>

            <input placeholder="First Name" value={editEmployeeData.first_name} onChange={(e) => setEditEmployeeData({ ...editEmployeeData, first_name: e.target.value })} />
            <input placeholder="Last Name" value={editEmployeeData.last_name} onChange={(e) => setEditEmployeeData({ ...editEmployeeData, last_name: e.target.value })} />
            <input placeholder="Email" value={editEmployeeData.email} onChange={(e) => setEditEmployeeData({ ...editEmployeeData, email: e.target.value })} />
            <input placeholder="Phone" value={editEmployeeData.phone} onChange={(e) => setEditEmployeeData({ ...editEmployeeData, phone: e.target.value })} />
            <input placeholder="Position" value={editEmployeeData.position} onChange={(e) => setEditEmployeeData({ ...editEmployeeData, position: e.target.value })} />
            <input type="date" value={editEmployeeData.hire_date} onChange={(e) => setEditEmployeeData({ ...editEmployeeData, hire_date: e.target.value })} />
            <input type="number" placeholder="Base Salary" value={editEmployeeData.base_salary} onChange={(e) => setEditEmployeeData({ ...editEmployeeData, base_salary: e.target.value })} />

            <div className="modal-actions">
              <button onClick={handleUpdateEmployee}>Save</button>
              <button onClick={() => setEditingEmployee(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {editingFournisseur && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Supplier</h3>

            <input placeholder="Name" value={editFournisseurData.name} onChange={(e) => setEditFournisseurData({ ...editFournisseurData, name: e.target.value })} />
            <input placeholder="Email" value={editFournisseurData.email} onChange={(e) => setEditFournisseurData({ ...editFournisseurData, email: e.target.value })} />
            <input placeholder="Phone" value={editFournisseurData.phone} onChange={(e) => setEditFournisseurData({ ...editFournisseurData, phone: e.target.value })} />
            <input placeholder="Address" value={editFournisseurData.address} onChange={(e) => setEditFournisseurData({ ...editFournisseurData, address: e.target.value })} />
            <input placeholder="Contact Person" value={editFournisseurData.contact_person} onChange={(e) => setEditFournisseurData({ ...editFournisseurData, contact_person: e.target.value })} />

            <div className="modal-actions">
              <button onClick={handleUpdateFournisseur}>Save</button>
              <button onClick={() => setEditingFournisseur(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {editingCategory && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Category</h3>

            <input placeholder="Name" value={editCategoryData.name} onChange={(e) => setEditCategoryData({ ...editCategoryData, name: e.target.value })} />
            <input placeholder="Description" value={editCategoryData.description} onChange={(e) => setEditCategoryData({ ...editCategoryData, description: e.target.value })} />

            <div className="modal-actions">
              <button onClick={handleUpdateCategory}>Save</button>
              <button onClick={() => setEditingCategory(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showConfirm && selectedDelete && (
        <ConfirmModal
          title={`Delete ${selectedDelete.type.charAt(0).toUpperCase() + selectedDelete.type.slice(1)}`}
          message={`Are you sure you want to delete this ${selectedDelete.type}? This action cannot be undone.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            setShowConfirm(false)
            setSelectedDelete(null)
          }}
        />
      )}

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  )
}

export default MasterData
