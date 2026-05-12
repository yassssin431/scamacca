import { useEffect, useState } from 'react'
import API_BASE_URL from '../../services/api'
import './MasterData.css'
import PageHeader from '../common/PageHeader'
import ConfirmModal from '../common/ConfirmModal'
import Toast from '../common/Toast'
import LoadingState from '../common/LoadingState'
import EmptyState from '../common/EmptyState'
import * as XLSX from 'xlsx'
import { authFetch } from '../../services/authFetch'
import { getCurrentUserRole } from '../../services/auth'
import { canAccessResource, canCreateResource, canDeleteResource, canUpdateResource } from '../../services/permissions'

const translations = {
  English: {
    pageTitle: 'Master Data',
    pageSubtitle: 'Manage core reference entities used across the application',
    entityDirectory: 'Entity Directory',
    entitySubtitle: 'Centralized governance for reference data',
    addNew: '+ Add New',
    clients: 'Clients',
    projects: 'Projects',
    employees: 'Employees',
    suppliers: 'Suppliers',
    categories: 'Categories',
    search: 'Search',
    searchPlaceholder: 'Search records...',
    status: 'Status',
    allStatus: 'All Status',
    active: 'Active',
    completed: 'Completed',
    pending: 'Pending',
    from: 'From',
    to: 'To',
    min: 'Min',
    max: 'Max',
    any: 'Any',
    reset: 'Reset',
    exportExcel: 'Export Excel',
    showing: 'Showing',
    of: 'of',
    records: 'records',
    visibleRecords: 'visible records from',
    totalClients: 'total clients',
    totalProjects: 'total projects',
    totalEmployees: 'total employees',
    totalSuppliers: 'total suppliers',
    totalCategories: 'total categories',
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    company: 'Company',
    address: 'Address',
    actions: 'Actions',
    value: 'Value',
    startDate: 'Start Date',
    endDate: 'End Date',
    firstName: 'First Name',
    lastName: 'Last Name',
    position: 'Position',
    team: 'Team',
    department: 'Department',
    hireDate: 'Hire Date',
    baseSalary: 'Base Salary',
    description: 'Description',
    usedInExpenses: 'Used In Expenses',
    contactPerson: 'Contact Person',
    edit: 'Edit',
    delete: 'Delete',
    create: 'Create',
    save: 'Save',
    cancel: 'Cancel',
    loadingMasterData: 'Loading master data...',
    masterDataFailed: 'Master data loading failed',
    noClients: 'No clients found',
    noClientsMessage: 'No client records match your current filters.',
    noProjects: 'No projects found',
    noProjectsMessage: 'No project records match your current filters.',
    noEmployees: 'No employees found',
    noEmployeesMessage: 'No employee records match your current filters.',
    noCategories: 'No categories found',
    noCategoriesMessage: 'No category records match your current filters.',
    noSuppliers: 'No suppliers found',
    noSuppliersMessage: 'No supplier records match your current filters.',
    tabNotConnected: 'Tab not connected',
    tabNotAvailable: 'This section is not available yet.',
    totalClientsCard: 'Total Clients',
    totalProjectsCard: 'Total Projects',
    totalEmployeesCard: 'Total Employees',
    totalCategoriesCard: 'Total Categories',
    totalSuppliersCard: 'Total Suppliers',
    visibleRecordsCard: 'Visible Records',
    statusCard: 'Status',
    connected: 'Connected',
    addNewClient: 'Add New Client',
    addNewProject: 'Add New Project',
    addNewEmployee: 'Add New Employee',
    addNewSupplier: 'Add New Supplier',
    addNewCategory: 'Add New Category',
    editClient: 'Edit Client',
    editProject: 'Edit Project',
    editEmployee: 'Edit Employee',
    editSupplier: 'Edit Supplier',
    editCategory: 'Edit Category',
    projectName: 'Project Name',
    totalValue: 'Total Value',
    selectClient: 'Select Client',
    selectCategory: 'Select Category',
    selectSupplier: 'Select Supplier',
    fileExported: 'Excel file exported successfully',
    noExportData: 'No data available to export',
    deleteTitle: 'Delete',
    deleteMessage: 'Are you sure you want to delete this item? This action cannot be undone.',
  },
  French: {
    pageTitle: 'Données de base',
    pageSubtitle: 'Gérer les entités de référence utilisées dans l’application',
    entityDirectory: 'Répertoire des entités',
    entitySubtitle: 'Gouvernance centralisée des données de référence',
    addNew: '+ Ajouter',
    clients: 'Clients',
    projects: 'Projets',
    employees: 'Employés',
    suppliers: 'Fournisseurs',
    categories: 'Catégories',
    search: 'Recherche',
    searchPlaceholder: 'Rechercher des enregistrements...',
    status: 'Statut',
    allStatus: 'Tous les statuts',
    active: 'Actif',
    completed: 'Terminé',
    pending: 'En attente',
    from: 'De',
    to: 'À',
    min: 'Min',
    max: 'Max',
    any: 'Tous',
    reset: 'Réinitialiser',
    exportExcel: 'Exporter Excel',
    showing: 'Affichage',
    of: 'sur',
    records: 'enregistrements',
    visibleRecords: 'enregistrements visibles sur',
    totalClients: 'clients au total',
    totalProjects: 'projets au total',
    totalEmployees: 'employés au total',
    totalSuppliers: 'fournisseurs au total',
    totalCategories: 'catégories au total',
    name: 'Nom',
    email: 'Email',
    phone: 'Téléphone',
    company: 'Entreprise',
    address: 'Adresse',
    actions: 'Actions',
    value: 'Valeur',
    startDate: 'Date début',
    endDate: 'Date fin',
    firstName: 'Prénom',
    lastName: 'Nom',
    position: 'Poste',
    team: 'Equipe',
    department: 'Departement',
    hireDate: 'Date embauche',
    baseSalary: 'Salaire de base',
    description: 'Description',
    usedInExpenses: 'Utilisée dans les dépenses',
    contactPerson: 'Personne de contact',
    edit: 'Modifier',
    delete: 'Supprimer',
    create: 'Créer',
    save: 'Enregistrer',
    cancel: 'Annuler',
    loadingMasterData: 'Chargement des données de base...',
    masterDataFailed: 'Échec du chargement des données de base',
    noClients: 'Aucun client trouvé',
    noClientsMessage: 'Aucun client ne correspond aux filtres actuels.',
    noProjects: 'Aucun projet trouvé',
    noProjectsMessage: 'Aucun projet ne correspond aux filtres actuels.',
    noEmployees: 'Aucun employé trouvé',
    noEmployeesMessage: 'Aucun employé ne correspond aux filtres actuels.',
    noCategories: 'Aucune catégorie trouvée',
    noCategoriesMessage: 'Aucune catégorie ne correspond aux filtres actuels.',
    noSuppliers: 'Aucun fournisseur trouvé',
    noSuppliersMessage: 'Aucun fournisseur ne correspond aux filtres actuels.',
    tabNotConnected: 'Onglet non connecté',
    tabNotAvailable: 'Cette section n’est pas encore disponible.',
    totalClientsCard: 'Total clients',
    totalProjectsCard: 'Total projets',
    totalEmployeesCard: 'Total employés',
    totalCategoriesCard: 'Total catégories',
    totalSuppliersCard: 'Total fournisseurs',
    visibleRecordsCard: 'Enregistrements visibles',
    statusCard: 'Statut',
    connected: 'Connecté',
    addNewClient: 'Ajouter un client',
    addNewProject: 'Ajouter un projet',
    addNewEmployee: 'Ajouter un employé',
    addNewSupplier: 'Ajouter un fournisseur',
    addNewCategory: 'Ajouter une catégorie',
    editClient: 'Modifier client',
    editProject: 'Modifier projet',
    editEmployee: 'Modifier employé',
    editSupplier: 'Modifier fournisseur',
    editCategory: 'Modifier catégorie',
    projectName: 'Nom du projet',
    totalValue: 'Valeur totale',
    selectClient: 'Sélectionner client',
    selectCategory: 'Sélectionner catégorie',
    selectSupplier: 'Sélectionner fournisseur',
    fileExported: 'Fichier Excel exporté avec succès',
    noExportData: 'Aucune donnée disponible pour l’export',
    deleteTitle: 'Supprimer',
    deleteMessage: 'Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.',
  },
}

function MasterData() {
  const language = localStorage.getItem('language') || 'English'
  const t = translations[language] || translations.English
  const role = getCurrentUserRole()

  // Master data uses the same RBAC helpers as the rest of the app so tabs,
  // fetches, and action buttons stay aligned with protected backend routes.
  const canViewClients = canAccessResource('clients', role)
  const canViewProjects = canAccessResource('projects', role)
  const canViewEmployees = canAccessResource('employees', role)
  const canViewCategories = canAccessResource('categories', role)
  const canViewSuppliers = canAccessResource('fournisseurs', role)
  const canViewExpenses = canAccessResource('expenses', role)

  const defaultTab = canViewClients
    ? 'clients'
    : canViewProjects
    ? 'projects'
    : canViewEmployees
    ? 'employees'
    : canViewSuppliers
    ? 'fournisseurs'
    : canViewCategories
    ? 'categories'
    : 'clients'

  const [activeTab, setActiveTab] = useState(defaultTab)

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
    team: '',
    department: '',
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
    team: '',
    department: '',
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

  const visibleTabs = [
    // Hide tabs the user cannot load instead of showing empty unauthorized pages.
    canViewClients && { id: 'clients', label: t.clients },
    canViewProjects && { id: 'projects', label: t.projects },
    canViewEmployees && { id: 'employees', label: t.employees },
    canViewSuppliers && { id: 'fournisseurs', label: t.suppliers },
    canViewCategories && { id: 'categories', label: t.categories },
  ].filter(Boolean)

  const activeResource =
    activeTab === 'clients'
      ? 'clients'
      : activeTab === 'projects'
      ? 'projects'
      : activeTab === 'employees'
      ? 'employees'
      : activeTab === 'categories'
      ? 'categories'
      : 'fournisseurs'
  const canCreateActive = canCreateResource(activeResource, role)

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
          // Skipped resources resolve as empty successful responses. This keeps
          // Promise.all stable even when a role only sees part of master data.
          canViewClients ? authFetch(`${API_BASE_URL}/clients`) : Promise.resolve({ ok: true, json: async () => [] }),
          canViewProjects ? authFetch(`${API_BASE_URL}/projects`) : Promise.resolve({ ok: true, json: async () => [] }),
          canViewEmployees ? authFetch(`${API_BASE_URL}/employees`) : Promise.resolve({ ok: true, json: async () => [] }),
          canViewCategories ? authFetch(`${API_BASE_URL}/categories`) : Promise.resolve({ ok: true, json: async () => [] }),
          canViewSuppliers ? authFetch(`${API_BASE_URL}/fournisseurs`) : Promise.resolve({ ok: true, json: async () => [] }),
          canViewExpenses ? authFetch(`${API_BASE_URL}/expenses`) : Promise.resolve({ ok: true, json: async () => [] }),
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
          throw new Error(t.masterDataFailed)
        }

        setClients(Array.isArray(clientsData) ? clientsData : clientsData?.data || [])
        setProjects(Array.isArray(projectsData) ? projectsData : projectsData?.data || [])
        setEmployees(Array.isArray(employeesData) ? employeesData : employeesData?.data || [])
        setCategories(Array.isArray(categoriesData) ? categoriesData : categoriesData?.data || [])
        setFournisseurs(Array.isArray(fournisseursData) ? fournisseursData : fournisseursData?.data || [])
        setExpenses(Array.isArray(expensesData) ? expensesData : expensesData?.data || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [canViewClients, canViewProjects, canViewEmployees, canViewCategories, canViewSuppliers, canViewExpenses, t.masterDataFailed])

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
      showToastMessage(t.noExportData, 'error')
      return
    }

    const worksheet = XLSX.utils.json_to_sheet(rows)
    const workbook = XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
    XLSX.writeFile(workbook, `${filename}.xlsx`)

    showToastMessage(t.fileExported)
  }


  const renderControls = (type, rows, filename) => (
    <div className="master-controls">
      <div className="master-filter-field search">
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

      {type === 'projects' && (
        <div className="master-filter-field">
          <label>{t.status}</label>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              setCurrentPage(1)
            }}
          >
            <option value="all">{t.allStatus}</option>
            <option value="Active">{t.active}</option>
            <option value="Completed">{t.completed}</option>
            <option value="Pending">{t.pending}</option>
          </select>
        </div>
      )}

      <div className="master-filter-field">
        <label>{t.from}</label>
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
        <label>{t.to}</label>
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
            <label>{t.min}</label>
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
            <label>{t.max}</label>
            <input
              type="number"
              placeholder={t.any}
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
          {t.reset}
        </button>

        <button className="master-export-btn" onClick={() => exportToExcel(rows, filename)}>
          {t.exportExcel}
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

    const getVisiblePages = () => {
      const pages = new Set([1, totalPages, currentPage - 1, currentPage, currentPage + 1])

      return Array.from(pages)
        .filter((page) => page >= 1 && page <= totalPages)
        .sort((a, b) => a - b)
        .reduce((items, page, index, pagesList) => {
          if (index > 0 && page - pagesList[index - 1] > 1) items.push('ellipsis-' + page)
          items.push(page)
          return items
        }, [])
    }

    return (
      <div className="master-pagination">
        <p>
          {t.showing} {(currentPage - 1) * rowsPerPage + 1}-
          {Math.min(currentPage * rowsPerPage, totalItems)} {t.of} {totalItems} {t.records}
        </p>

        <div className="master-pages">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            ‹
          </button>

          {getVisiblePages().map((page) =>
            typeof page === 'string' ? (
              <span key={page} className="pagination-ellipsis">...</span>
            ) : (
              <button
                key={page}
                className={currentPage === page ? 'active' : ''}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            )
          )}

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

      const response = await authFetch(`${API_BASE_URL}/clients`, {
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
      const response = await authFetch(`${API_BASE_URL}/clients/${editingClient.id}`, {
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
      const response = await authFetch(`${API_BASE_URL}/clients/${id}`, {
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

      const response = await authFetch(`${API_BASE_URL}/projects`, {
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
      const response = await authFetch(`${API_BASE_URL}/projects/${editingProject.id}`, {
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
      const response = await authFetch(`${API_BASE_URL}/projects/${id}`, {
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
      if (!newEmployee.first_name || !newEmployee.last_name || !newEmployee.email || !newEmployee.position || !newEmployee.team || !newEmployee.department || !newEmployee.hire_date || !newEmployee.base_salary) {
        showToastMessage('All employee fields are required', 'error')
        return
      }

      const payload = {
        ...newEmployee,
        base_salary: Number(newEmployee.base_salary),
        hire_date: newEmployee.hire_date || null,
      }

      const response = await authFetch(`${API_BASE_URL}/employees`, {
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
        team: '',
        department: '',
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
      team: employee.team || '',
      department: employee.department || '',
      hire_date: employee.hire_date ? employee.hire_date.slice(0, 10) : '',
      base_salary: employee.base_salary || '',
    })
  }

  const handleUpdateEmployee = async () => {
    try {
      const response = await authFetch(`${API_BASE_URL}/employees/${editingEmployee.id}`, {
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
      const response = await authFetch(`${API_BASE_URL}/employees/${id}`, {
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

      const response = await authFetch(`${API_BASE_URL}/fournisseurs`, {
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
      const response = await authFetch(`${API_BASE_URL}/fournisseurs/${editingFournisseur.id}`, {
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
      const response = await authFetch(`${API_BASE_URL}/fournisseurs/${id}`, {
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

      const response = await authFetch(`${API_BASE_URL}/categories`, {
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
      const response = await authFetch(`${API_BASE_URL}/categories/${editingCategory.id}`, {
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
      const response = await authFetch(`${API_BASE_URL}/categories/${id}`, {
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

  const renderActions = (item, type) => {
    const resource = type === 'client' ? 'clients' : type === 'project' ? 'projects' : type === 'employee' ? 'employees' : type === 'category' ? 'categories' : 'fournisseurs'
    const canEdit = canUpdateResource(resource, role)
    const canRemove = canDeleteResource(resource, role)

    return (
      <div className="master-row-actions">
        {canEdit && (
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
            {t.edit}
          </button>
        )}

        {canRemove && (
          <button
            className="master-action-btn delete"
            onClick={() => confirmDelete(item.id, type)}
          >
            {t.delete}
          </button>
        )}
      </div>
    )
  }

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
            <h4>{t.clients}</h4>
            <p>{filteredCurrentData.length} {t.visibleRecords} {clients.length} {t.totalClients}</p>
          </div>
        </div>

        {renderControls('clients', rows, 'clients')}

        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort('name')}>{t.name} {getSortIcon('name')}</th>
              <th onClick={() => handleSort('email')}>{t.email} {getSortIcon('email')}</th>
              <th onClick={() => handleSort('phone')}>{t.phone} {getSortIcon('phone')}</th>
              <th onClick={() => handleSort('company')}>{t.company} {getSortIcon('company')}</th>
              <th>{t.address}</th>
              <th>{t.actions}</th>
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
                  <EmptyState title={t.noClients} message={t.noClientsMessage} />
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
            <h4>{t.projects}</h4>
            <p>{filteredCurrentData.length} {t.visibleRecords} {projects.length} {t.totalProjects}</p>
          </div>
        </div>

        {renderControls('projects', rows, 'projects')}

        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort('name')}>{t.name} {getSortIcon('name')}</th>
              <th onClick={() => handleSort('status')}>{t.status} {getSortIcon('status')}</th>
              <th onClick={() => handleSort('displayDate')}>{t.startDate} {getSortIcon('displayDate')}</th>
              <th onClick={() => handleSort('end_date')}>{t.endDate} {getSortIcon('end_date')}</th>
              <th onClick={() => handleSort('displayValue')}>{t.value} {getSortIcon('displayValue')}</th>
              <th onClick={() => handleSort('client')}>{t.clients.slice(0, -1)} {getSortIcon('client')}</th>
              <th>{t.actions}</th>
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
                  <EmptyState title={t.noProjects} message={t.noProjectsMessage} />
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
      Team: e.team || '-',
      Department: e.department || '-',
      'Hire Date': e.hire_date ? e.hire_date.slice(0, 10) : '-',
      'Base Salary': Number(e.base_salary || 0),
    }))

    return (
      <>
        <div className="master-table-top">
          <div>
            <h4>{t.employees}</h4>
            <p>{filteredCurrentData.length} {t.visibleRecords} {employees.length} {t.totalEmployees}</p>
          </div>
        </div>

        {renderControls('employees', rows, 'employees')}

        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort('first_name')}>{t.firstName} {getSortIcon('first_name')}</th>
              <th onClick={() => handleSort('last_name')}>{t.lastName} {getSortIcon('last_name')}</th>
              <th onClick={() => handleSort('email')}>{t.email} {getSortIcon('email')}</th>
              <th onClick={() => handleSort('position')}>{t.position} {getSortIcon('position')}</th>
              <th onClick={() => handleSort('team')}>{t.team} {getSortIcon('team')}</th>
              <th onClick={() => handleSort('department')}>{t.department} {getSortIcon('department')}</th>
              <th onClick={() => handleSort('displayDate')}>{t.hireDate} {getSortIcon('displayDate')}</th>
              <th onClick={() => handleSort('displayValue')}>{t.baseSalary} {getSortIcon('displayValue')}</th>
              <th>{t.actions}</th>
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
                  <td>{e.team || '-'}</td>
                  <td>{e.department || '-'}</td>
                  <td>{e.hire_date ? e.hire_date.slice(0, 10) : '-'}</td>
                  <td>${Number(e.base_salary || 0).toLocaleString()}</td>
                  <td>{renderActions(e, 'employee')}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9">
                  <EmptyState title={t.noEmployees} message={t.noEmployeesMessage} />
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
            <h4>{t.categories}</h4>
            <p>{filteredCurrentData.length} {t.visibleRecords} {categories.length} {t.totalCategories}</p>
          </div>
        </div>

        {renderControls('categories', rows, 'categories')}

        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort('name')}>{t.name} {getSortIcon('name')}</th>
              <th>{t.description}</th>
              <th onClick={() => handleSort('usage')}>{t.usedInExpenses} {getSortIcon('usage')}</th>
              <th>{t.actions}</th>
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
                  <EmptyState title={t.noCategories} message={t.noCategoriesMessage} />
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
            <h4>{t.suppliers}</h4>
            <p>{filteredCurrentData.length} {t.visibleRecords} {fournisseurs.length} {t.totalSuppliers}</p>
          </div>
        </div>

        {renderControls('fournisseurs', rows, 'suppliers')}

        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort('name')}>{t.name} {getSortIcon('name')}</th>
              <th onClick={() => handleSort('email')}>{t.email} {getSortIcon('email')}</th>
              <th onClick={() => handleSort('phone')}>{t.phone} {getSortIcon('phone')}</th>
              <th>{t.address}</th>
              <th onClick={() => handleSort('contact_person')}>{t.contactPerson} {getSortIcon('contact_person')}</th>
              <th>{t.actions}</th>
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
                  <EmptyState title={t.noSuppliers} message={t.noSuppliersMessage} />
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

    return <EmptyState title={t.tabNotConnected} message={t.tabNotAvailable} />
  }

  const getBottomCards = () => {
    if (activeTab === 'clients') {
      return [
        { title: t.totalClientsCard, value: clients.length },
        { title: t.visibleRecordsCard, value: filteredCurrentData.length },
        { title: t.statusCard, value: t.connected, dark: true },
      ]
    }

    if (activeTab === 'projects') {
      return [
        { title: t.totalProjectsCard, value: projects.length },
        { title: t.visibleRecordsCard, value: filteredCurrentData.length },
        { title: t.statusCard, value: t.connected, dark: true },
      ]
    }

    if (activeTab === 'employees') {
      return [
        { title: t.totalEmployeesCard, value: employees.length },
        { title: t.visibleRecordsCard, value: filteredCurrentData.length },
        { title: t.statusCard, value: t.connected, dark: true },
      ]
    }

    if (activeTab === 'categories') {
      return [
        { title: t.totalCategoriesCard, value: categories.length },
        { title: t.visibleRecordsCard, value: filteredCurrentData.length },
        { title: t.statusCard, value: t.connected, dark: true },
      ]
    }

    return [
      { title: t.totalSuppliersCard, value: fournisseurs.length },
      { title: t.visibleRecordsCard, value: filteredCurrentData.length },
      { title: t.statusCard, value: t.connected, dark: true },
    ]
  }

  const bottomCards = getBottomCards()

  return (
    <div className="master-page">
      <PageHeader
        title={t.pageTitle}
        subtitle={t.pageSubtitle}
      />

      <div className="master-header">
        <div>
          <h2>{t.entityDirectory}</h2>
          <p>{t.entitySubtitle}</p>
        </div>

        {canCreateActive && (
          <button className="add-btn" onClick={() => setShowModal(true)}>
            {t.addNew}
          </button>
        )}
      </div>

      <div className="master-tabs">
        {visibleTabs.map((tab) => (
          <button key={tab.id} className={activeTab === tab.id ? 'active' : ''} onClick={() => switchTab(tab.id)}>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="table-card">
        {loading ? (
          <LoadingState message={t.loadingMasterData} />
        ) : error ? (
          <EmptyState title={t.masterDataFailed} message={error} />
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
                <h3>{t.addNewClient}</h3>

                <input placeholder={t.name} value={newClient.name} onChange={(e) => setNewClient({ ...newClient, name: e.target.value })} />
                <input placeholder={t.email} value={newClient.email} onChange={(e) => setNewClient({ ...newClient, email: e.target.value })} />
                <input placeholder={t.phone} value={newClient.phone} onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })} />
                <input placeholder={t.company} value={newClient.company} onChange={(e) => setNewClient({ ...newClient, company: e.target.value })} />
                <input placeholder={t.address} value={newClient.address} onChange={(e) => setNewClient({ ...newClient, address: e.target.value })} />

                <div className="modal-actions">
                  <button onClick={handleCreateClient}>{t.create}</button>
                  <button onClick={closeAddModal}>{t.cancel}</button>
                </div>
              </>
            )}

            {activeTab === 'projects' && (
              <>
                <h3>{t.addNewProject}</h3>

                <input placeholder={t.projectName} value={newProject.name} onChange={(e) => setNewProject({ ...newProject, name: e.target.value })} />
                <input placeholder={t.description} value={newProject.description} onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} />
                <input type="date" value={newProject.start_date} onChange={(e) => setNewProject({ ...newProject, start_date: e.target.value })} />
                <input type="date" value={newProject.end_date} onChange={(e) => setNewProject({ ...newProject, end_date: e.target.value })} />
                <input type="number" placeholder={t.totalValue} value={newProject.total_value} onChange={(e) => setNewProject({ ...newProject, total_value: e.target.value })} />

                <select value={newProject.status} onChange={(e) => setNewProject({ ...newProject, status: e.target.value })}>
                  <option value="Active">{t.active}</option>
                  <option value="Completed">{t.completed}</option>
                  <option value="Pending">{t.pending}</option>
                </select>

                <select value={newProject.ClientId} onChange={(e) => setNewProject({ ...newProject, ClientId: e.target.value })}>
                  <option value="">{t.selectClient}</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>{client.name}</option>
                  ))}
                </select>

                <div className="modal-actions">
                  <button onClick={handleCreateProject}>{t.create}</button>
                  <button onClick={closeAddModal}>{t.cancel}</button>
                </div>
              </>
            )}

            {activeTab === 'employees' && (
              <>
                <h3>{t.addNewEmployee}</h3>

                <input placeholder={t.firstName} value={newEmployee.first_name} onChange={(e) => setNewEmployee({ ...newEmployee, first_name: e.target.value })} />
                <input placeholder={t.lastName} value={newEmployee.last_name} onChange={(e) => setNewEmployee({ ...newEmployee, last_name: e.target.value })} />
                <input placeholder={t.email} value={newEmployee.email} onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })} />
                <input placeholder={t.phone} value={newEmployee.phone} onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })} />
                <input placeholder={t.position} value={newEmployee.position} onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })} />
                <input placeholder={t.team} value={newEmployee.team} onChange={(e) => setNewEmployee({ ...newEmployee, team: e.target.value })} />
                <input placeholder={t.department} value={newEmployee.department} onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })} />
                <input type="date" value={newEmployee.hire_date} onChange={(e) => setNewEmployee({ ...newEmployee, hire_date: e.target.value })} />
                <input type="number" placeholder={t.baseSalary} value={newEmployee.base_salary} onChange={(e) => setNewEmployee({ ...newEmployee, base_salary: e.target.value })} />

                <div className="modal-actions">
                  <button onClick={handleCreateEmployee}>{t.create}</button>
                  <button onClick={closeAddModal}>{t.cancel}</button>
                </div>
              </>
            )}

            {activeTab === 'fournisseurs' && (
              <>
                <h3>{t.addNewSupplier}</h3>

                <input placeholder={t.name} value={newFournisseur.name} onChange={(e) => setNewFournisseur({ ...newFournisseur, name: e.target.value })} />
                <input placeholder={t.email} value={newFournisseur.email} onChange={(e) => setNewFournisseur({ ...newFournisseur, email: e.target.value })} />
                <input placeholder={t.phone} value={newFournisseur.phone} onChange={(e) => setNewFournisseur({ ...newFournisseur, phone: e.target.value })} />
                <input placeholder={t.address} value={newFournisseur.address} onChange={(e) => setNewFournisseur({ ...newFournisseur, address: e.target.value })} />
                <input placeholder={t.contactPerson} value={newFournisseur.contact_person} onChange={(e) => setNewFournisseur({ ...newFournisseur, contact_person: e.target.value })} />

                <div className="modal-actions">
                  <button onClick={handleCreateFournisseur}>{t.create}</button>
                  <button onClick={closeAddModal}>{t.cancel}</button>
                </div>
              </>
            )}

            {activeTab === 'categories' && (
              <>
                <h3>{t.addNewCategory}</h3>

                <input placeholder={t.name} value={newCategory.name} onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })} />
                <input placeholder={t.description} value={newCategory.description} onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })} />

                <div className="modal-actions">
                  <button onClick={handleCreateCategory}>{t.create}</button>
                  <button onClick={closeAddModal}>{t.cancel}</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {editingClient && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{t.editClient}</h3>

            <input placeholder={t.name} value={editClientData.name} onChange={(e) => setEditClientData({ ...editClientData, name: e.target.value })} />
            <input placeholder={t.email} value={editClientData.email} onChange={(e) => setEditClientData({ ...editClientData, email: e.target.value })} />
            <input placeholder={t.phone} value={editClientData.phone} onChange={(e) => setEditClientData({ ...editClientData, phone: e.target.value })} />
            <input placeholder={t.company} value={editClientData.company} onChange={(e) => setEditClientData({ ...editClientData, company: e.target.value })} />
            <input placeholder={t.address} value={editClientData.address} onChange={(e) => setEditClientData({ ...editClientData, address: e.target.value })} />

            <div className="modal-actions">
              <button onClick={handleUpdateClient}>{t.save}</button>
              <button onClick={() => setEditingClient(null)}>{t.cancel}</button>
            </div>
          </div>
        </div>
      )}

      {editingProject && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{t.editProject}</h3>

            <input placeholder={t.projectName} value={editProjectData.name} onChange={(e) => setEditProjectData({ ...editProjectData, name: e.target.value })} />
            <input placeholder={t.description} value={editProjectData.description} onChange={(e) => setEditProjectData({ ...editProjectData, description: e.target.value })} />
            <input type="date" value={editProjectData.start_date} onChange={(e) => setEditProjectData({ ...editProjectData, start_date: e.target.value })} />
            <input type="date" value={editProjectData.end_date} onChange={(e) => setEditProjectData({ ...editProjectData, end_date: e.target.value })} />
            <input type="number" placeholder={t.totalValue} value={editProjectData.total_value} onChange={(e) => setEditProjectData({ ...editProjectData, total_value: e.target.value })} />

            <select value={editProjectData.status} onChange={(e) => setEditProjectData({ ...editProjectData, status: e.target.value })}>
              <option value="Active">{t.active}</option>
              <option value="Completed">{t.completed}</option>
              <option value="Pending">{t.pending}</option>
            </select>

            <select value={editProjectData.ClientId} onChange={(e) => setEditProjectData({ ...editProjectData, ClientId: e.target.value })}>
              <option value="">{t.selectClient}</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>{client.name}</option>
              ))}
            </select>

            <div className="modal-actions">
              <button onClick={handleUpdateProject}>{t.save}</button>
              <button onClick={() => setEditingProject(null)}>{t.cancel}</button>
            </div>
          </div>
        </div>
      )}

      {editingEmployee && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{t.editEmployee}</h3>

            <input placeholder={t.firstName} value={editEmployeeData.first_name} onChange={(e) => setEditEmployeeData({ ...editEmployeeData, first_name: e.target.value })} />
            <input placeholder={t.lastName} value={editEmployeeData.last_name} onChange={(e) => setEditEmployeeData({ ...editEmployeeData, last_name: e.target.value })} />
            <input placeholder={t.email} value={editEmployeeData.email} onChange={(e) => setEditEmployeeData({ ...editEmployeeData, email: e.target.value })} />
            <input placeholder={t.phone} value={editEmployeeData.phone} onChange={(e) => setEditEmployeeData({ ...editEmployeeData, phone: e.target.value })} />
            <input placeholder={t.position} value={editEmployeeData.position} onChange={(e) => setEditEmployeeData({ ...editEmployeeData, position: e.target.value })} />
            <input placeholder={t.team} value={editEmployeeData.team} onChange={(e) => setEditEmployeeData({ ...editEmployeeData, team: e.target.value })} />
            <input placeholder={t.department} value={editEmployeeData.department} onChange={(e) => setEditEmployeeData({ ...editEmployeeData, department: e.target.value })} />
            <input type="date" value={editEmployeeData.hire_date} onChange={(e) => setEditEmployeeData({ ...editEmployeeData, hire_date: e.target.value })} />
            <input type="number" placeholder={t.baseSalary} value={editEmployeeData.base_salary} onChange={(e) => setEditEmployeeData({ ...editEmployeeData, base_salary: e.target.value })} />

            <div className="modal-actions">
              <button onClick={handleUpdateEmployee}>{t.save}</button>
              <button onClick={() => setEditingEmployee(null)}>{t.cancel}</button>
            </div>
          </div>
        </div>
      )}

      {editingFournisseur && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{t.editSupplier}</h3>

            <input placeholder={t.name} value={editFournisseurData.name} onChange={(e) => setEditFournisseurData({ ...editFournisseurData, name: e.target.value })} />
            <input placeholder={t.email} value={editFournisseurData.email} onChange={(e) => setEditFournisseurData({ ...editFournisseurData, email: e.target.value })} />
            <input placeholder={t.phone} value={editFournisseurData.phone} onChange={(e) => setEditFournisseurData({ ...editFournisseurData, phone: e.target.value })} />
            <input placeholder={t.address} value={editFournisseurData.address} onChange={(e) => setEditFournisseurData({ ...editFournisseurData, address: e.target.value })} />
            <input placeholder={t.contactPerson} value={editFournisseurData.contact_person} onChange={(e) => setEditFournisseurData({ ...editFournisseurData, contact_person: e.target.value })} />

            <div className="modal-actions">
              <button onClick={handleUpdateFournisseur}>{t.save}</button>
              <button onClick={() => setEditingFournisseur(null)}>{t.cancel}</button>
            </div>
          </div>
        </div>
      )}

      {editingCategory && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{t.editCategory}</h3>

            <input placeholder={t.name} value={editCategoryData.name} onChange={(e) => setEditCategoryData({ ...editCategoryData, name: e.target.value })} />
            <input placeholder={t.description} value={editCategoryData.description} onChange={(e) => setEditCategoryData({ ...editCategoryData, description: e.target.value })} />

            <div className="modal-actions">
              <button onClick={handleUpdateCategory}>{t.save}</button>
              <button onClick={() => setEditingCategory(null)}>{t.cancel}</button>
            </div>
          </div>
        </div>
      )}

      {showConfirm && selectedDelete && (
        <ConfirmModal
          title={t.deleteTitle}
          message={t.deleteMessage}
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

