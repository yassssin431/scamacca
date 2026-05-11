import { useEffect, useState } from 'react'
import API_BASE_URL from '../../services/api'
import './FinancialTransactions.css'
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
    pageTitle: 'Financial Transactions',
    revenuesSubtitle: 'Manage invoice-based revenue records',
    expensesSubtitle: 'Manage operational expense records',
    salariesSubtitle: 'Manage employee salary records',
    importSubtitle: 'Import and prepare financial data',

    revenues: 'Revenues',
    expenses: 'Expenses',
    salaries: 'Salaries',
    importData: 'Import Data',

    addNew: '+ Add New',
    invoice: 'Invoice',
    expense: 'Expense',
    salary: 'Salary',

    totalRevenue: 'Total Revenue',
    totalExpenses: 'Total Expenses',
    totalSalaries: 'Total Salaries',
    importWorkspace: 'Import Workspace',
    ready: 'Ready',

    syncStatus: 'Sync Status',
    connected: 'Connected',

    search: 'Search',
    searchPlaceholder: 'Search records...',
    status: 'Status',
    allStatus: 'All Status',
    pending: 'Pending',
    paid: 'Paid',
    cancelled: 'Cancelled',
    from: 'From',
    to: 'To',
    min: 'Min',
    max: 'Max',
    any: 'Any',
    reset: 'Reset',
    exportExcel: 'Export Excel',

    edit: 'Edit',
    delete: 'Delete',
    actions: '{t.actions}',
    create: 'Create',
    save: 'Save',
    cancel: 'Cancel',

    allInvoices: 'All Invoices',
    allExpenses: 'All Expenses',
    allSalaries: 'All Salaries',
    visibleRecords: 'visible records from',
    totalInvoicesRecords: 'total invoices',
    totalExpensesRecords: 'total expenses',
    totalSalariesRecords: 'total salaries',

    reference: 'Reference',
    client: 'Client',
    project: 'Project',
    issueDate: 'Issue Date',
    dueDate: 'Due Date',
    amount: 'Amount',
    date: 'Date',
    description: 'Description',
    category: 'Category',
    supplier: 'Supplier',
    month: 'Month',
    year: 'Year',
    amountPaid: 'Amount Paid',
    paymentDate: 'Payment Date',
    employeeId: 'Employee ID',

    noInvoices: 'No invoices found',
    noInvoicesMessage: 'No invoice records match your current filters.',
    noExpenses: 'No expenses found',
    noExpensesMessage: 'No expense records match your current filters.',
    noSalaries: 'No salaries found',
    noSalariesMessage: 'No salary records match your current filters.',

    loadingRevenue: 'Loading revenue records...',
    loadingExpenses: 'Loading expense records...',
    loadingSalaries: 'Loading salary records...',
    revenueFailed: 'Revenue loading failed',
    expenseFailed: 'Expense loading failed',
    salaryFailed: 'Salary loading failed',

    importFinancialData: 'Import Financial Data',
    uploadMessage: 'Upload CSV or Excel files to insert invoices, expenses or salaries.',
    datasetType: 'Dataset Type',
    uploadFile: 'Upload File',
    requiredColumnsText: 'Required columns',
    selectedFile: 'Selected file',
    preview: 'Preview',
    rows: 'rows',

    recordsLoaded: 'Records Loaded',
    backendSources: 'Backend Sources',
    backendConnectedText: '/api/invoices, /api/expenses and /api/salaries connected successfully',

    addInvoice: 'Add Invoice',
    addExpense: 'Add Expense',
    addSalary: 'Add Salary',
    editInvoice: 'Edit Invoice',
    editExpense: 'Edit Expense',
    editSalary: 'Edit Salary',

    selectClient: 'Select Client',
    selectProject: 'Select Project',
    selectCategory: 'Select Category',
    selectSupplier: 'Select Supplier (optional)',
    selectEmployee: 'Select Employee',
    selectMonth: 'Select Month',

    noDataExport: 'No data available to export',
    excelExported: 'Excel file exported successfully',
    unsupportedFormat: 'Unsupported file format',
    fileLoadedErrors: 'File loaded with validation errors',
    fileLoaded: 'File loaded successfully',
    uploadFirst: 'Please upload a file first',
    fixImportErrors: 'Fix validation errors before importing',
    importFailed: 'Import failed',
    dataImported: 'Data imported successfully',

    invoiceDeleted: 'Invoice deleted successfully',
    expenseDeleted: 'Expense deleted successfully',
    salaryDeleted: 'Salary deleted successfully',
    failedDeleteInvoice: 'Failed to delete invoice',
    failedDeleteExpense: 'Failed to delete expense',
    failedDeleteSalary: 'Failed to delete salary',

    deleteConfirmTitle: 'Delete',
    deleteConfirmMessageStart: 'Are you sure you want to delete this',
    deleteConfirmMessageEnd: 'This action cannot be undone.',

    validationInvoice: 'Please fill amount, issue date, client and project.',
    validationExpense: 'Please fill amount, date, category and project.',
    validationRequired: 'Please fill all required fields.',

    sourceInvoices: 'Real data loaded from /api/invoices',
    sourceExpenses: 'Real data loaded from /api/expenses',
    sourceSalaries: 'Real data loaded from /api/salaries',
    sourceImport: 'Local preview with backend insert after validation',
    importHelp: 'Upload CSV or Excel data for invoices, expenses or salaries',
  },

  French: {
    pageTitle: 'Transactions financières',
    revenuesSubtitle: 'Gérer les revenus issus des factures',
    expensesSubtitle: 'Gérer les dépenses opérationnelles',
    salariesSubtitle: 'Gérer les salaires des employés',
    importSubtitle: 'Importer et préparer les données financières',

    revenues: 'Revenus',
    expenses: 'Dépenses',
    salaries: 'Salaires',
    importData: 'Importer des données',

    addNew: '+ Ajouter',
    invoice: 'Facture',
    expense: 'Dépense',
    salary: 'Salaire',

    totalRevenue: 'Revenus totaux',
    totalExpenses: 'Dépenses totales',
    totalSalaries: 'Salaires totaux',
    importWorkspace: 'Espace d’importation',
    ready: 'Prêt',

    syncStatus: 'État de synchronisation',
    connected: 'Connecté',

    search: 'Recherche',
    searchPlaceholder: 'Rechercher des enregistrements...',
    status: 'Statut',
    allStatus: 'Tous les statuts',
    pending: 'En attente',
    paid: 'Payée',
    cancelled: 'Annulée',
    from: 'De',
    to: 'À',
    min: 'Min',
    max: 'Max',
    any: 'Tous',
    reset: 'Réinitialiser',
    exportExcel: 'Exporter Excel',

    edit: 'Modifier',
    delete: 'Supprimer',
    actions: '{t.actions}',
    create: 'Créer',
    save: 'Enregistrer',
    cancel: 'Annuler',

    allInvoices: 'Toutes les factures',
    allExpenses: 'Toutes les dépenses',
    allSalaries: 'Tous les salaires',
    visibleRecords: 'enregistrements visibles sur',
    totalInvoicesRecords: 'factures totales',
    totalExpensesRecords: 'dépenses totales',
    totalSalariesRecords: 'salaires totaux',

    reference: 'Référence',
    client: 'Client',
    project: 'Projet',
    issueDate: 'Date d’émission',
    dueDate: 'Date d’échéance',
    amount: 'Montant',
    date: 'Date',
    description: 'Description',
    category: 'Catégorie',
    supplier: 'Fournisseur',
    month: 'Mois',
    year: 'Année',
    amountPaid: 'Montant payé',
    paymentDate: 'Date de paiement',
    employeeId: 'ID Employé',

    noInvoices: 'Aucune facture trouvée',
    noInvoicesMessage: 'Aucune facture ne correspond aux filtres actuels.',
    noExpenses: 'Aucune dépense trouvée',
    noExpensesMessage: 'Aucune dépense ne correspond aux filtres actuels.',
    noSalaries: 'Aucun salaire trouvé',
    noSalariesMessage: 'Aucun salaire ne correspond aux filtres actuels.',

    loadingRevenue: 'Chargement des revenus...',
    loadingExpenses: 'Chargement des dépenses...',
    loadingSalaries: 'Chargement des salaires...',
    revenueFailed: 'Échec du chargement des revenus',
    expenseFailed: 'Échec du chargement des dépenses',
    salaryFailed: 'Échec du chargement des salaires',

    importFinancialData: 'Importer des données financières',
    uploadMessage: 'Importer des fichiers CSV ou Excel pour insérer des factures, dépenses ou salaires.',
    datasetType: 'Type de données',
    uploadFile: 'Téléverser un fichier',
    requiredColumnsText: 'Colonnes requises',
    selectedFile: 'Fichier sélectionné',
    preview: 'Aperçu',
    rows: 'lignes',

    recordsLoaded: 'Enregistrements chargés',
    backendSources: 'Sources backend',
    backendConnectedText: '/api/invoices, /api/expenses et /api/salaries connectés avec succès',

    addInvoice: 'Ajouter une facture',
    addExpense: 'Ajouter une dépense',
    addSalary: 'Ajouter un salaire',
    editInvoice: 'Modifier la facture',
    editExpense: 'Modifier la dépense',
    editSalary: 'Modifier le salaire',

    selectClient: 'Sélectionner un client',
    selectProject: 'Sélectionner un projet',
    selectCategory: 'Sélectionner une catégorie',
    selectSupplier: 'Sélectionner un fournisseur (optionnel)',
    selectEmployee: 'Sélectionner un employé',
    selectMonth: 'Sélectionner un mois',

    noDataExport: 'Aucune donnée disponible à exporter',
    excelExported: 'Fichier Excel exporté avec succès',
    unsupportedFormat: 'Format de fichier non pris en charge',
    fileLoadedErrors: 'Fichier chargé avec des erreurs de validation',
    fileLoaded: 'Fichier chargé avec succès',
    uploadFirst: 'Veuillez d’abord téléverser un fichier',
    fixImportErrors: 'Corrigez les erreurs de validation avant l’importation',
    importFailed: 'Échec de l’importation',
    dataImported: 'Données importées avec succès',

    invoiceDeleted: 'Facture supprimée avec succès',
    expenseDeleted: 'Dépense supprimée avec succès',
    salaryDeleted: 'Salaire supprimé avec succès',
    failedDeleteInvoice: 'Échec de la suppression de la facture',
    failedDeleteExpense: 'Échec de la suppression de la dépense',
    failedDeleteSalary: 'Échec de la suppression du salaire',

    deleteConfirmTitle: 'Supprimer',
    deleteConfirmMessageStart: 'Voulez-vous vraiment supprimer cette entrée',
    deleteConfirmMessageEnd: 'Cette action est irréversible.',

    validationInvoice: 'Veuillez remplir le montant, la date d’émission, le client et le projet.',
    validationExpense: 'Veuillez remplir le montant, la date, la catégorie et le projet.',
    validationRequired: 'Veuillez remplir tous les champs obligatoires.',

    sourceInvoices: 'Données réelles chargées depuis /api/invoices',
    sourceExpenses: 'Données réelles chargées depuis /api/expenses',
    sourceSalaries: 'Données réelles chargées depuis /api/salaries',
    sourceImport: 'Aperçu local avec insertion backend après validation',
    importHelp: 'Téléversez des données CSV ou Excel pour les factures, dépenses ou salaires',
  },
}

function FinancialTransactions() {
  const [activeTab, setActiveTab] = useState('revenues')
  const language = localStorage.getItem('language') || 'English'
const t = translations[language] || translations.English
  const role = getCurrentUserRole()
  const canViewInvoices = canAccessResource('invoices', role)
  const canViewExpenses = canAccessResource('expenses', role)
  const canViewSalaries = canAccessResource('salaries', role)
  const canViewProjects = canAccessResource('projects', role)
  const canViewCategories = canAccessResource('categories', role)
  const canViewSuppliers = canAccessResource('fournisseurs', role)
  const canViewEmployees = canAccessResource('employees', role)
  const canViewClients = canAccessResource('clients', role)

  const [invoices, setInvoices] = useState([])
  const [expenses, setExpenses] = useState([])
  const [salaries, setSalaries] = useState([])

  const [loadingInvoices, setLoadingInvoices] = useState(canViewInvoices)
  const [loadingExpenses, setLoadingExpenses] = useState(canViewExpenses)
  const [loadingSalaries, setLoadingSalaries] = useState(canViewSalaries)

  const [errorInvoices, setErrorInvoices] = useState('')
  const [errorExpenses, setErrorExpenses] = useState('')
  const [errorSalaries, setErrorSalaries] = useState('')

  const [showInvoiceModal, setShowInvoiceModal] = useState(false)
  const [showExpenseModal, setShowExpenseModal] = useState(false)
  const [showSalaryModal, setShowSalaryModal] = useState(false)

  const [editingExpense, setEditingExpense] = useState(null)
  const [editingSalary, setEditingSalary] = useState(null)

  const [projects, setProjects] = useState([])
  const [categories, setCategories] = useState([])
  const [fournisseurs, setFournisseurs] = useState([])
  const [employees, setEmployees] = useState([])
  const [clients, setClients] = useState([])
  const [showConfirm, setShowConfirm] = useState(false)
const [selectedId, setSelectedId] = useState(null)
const [toast, setToast] = useState(null)
const showToastMessage = (message, type = 'success') => {
  setToast({ message, type })

  setTimeout(() => {
    setToast(null)
  }, 2500)
}
const [searchTerm, setSearchTerm] = useState('')
const [statusFilter, setStatusFilter] = useState('all')
const [dateFrom, setDateFrom] = useState('')
const [dateTo, setDateTo] = useState('')
const [minAmount, setMinAmount] = useState('')
const [maxAmount, setMaxAmount] = useState('')
const [sortField, setSortField] = useState('localOrder')
const [sortOrder, setSortOrder] = useState('desc')
const [importType, setImportType] = useState('invoices')
const [importRows, setImportRows] = useState([])
const [importFileName, setImportFileName] = useState('')
const [importErrors, setImportErrors] = useState([])
const [currentPage, setCurrentPage] = useState(1)
const rowsPerPage = 10
const [highlightedRow, setHighlightedRow] = useState(null)

  const [newInvoice, setNewInvoice] = useState({
    reference: '',
    amount: '',
    status: 'Pending',
    issue_date: '',
    due_date: '',
    ClientId: '',
    ProjectId: '',
  })

  const [newExpense, setNewExpense] = useState({
    amount: '',
    date: '',
    description: '',
    reference: '',
    CategoryId: '',
    ProjectId: '',
    FournisseurId: '',
  })

  const [newSalary, setNewSalary] = useState({
    month: '',
    year: '',
    amount_paid: '',
    payment_date: '',
    EmployeeId: '',
  })

  const [editExpenseData, setEditExpenseData] = useState({
    amount: '',
    date: '',
    description: '',
    reference: '',
    CategoryId: '',
    ProjectId: '',
    FournisseurId: '',
  })

  const [editSalaryData, setEditSalaryData] = useState({
    month: '',
    year: '',
    amount_paid: '',
    payment_date: '',
    EmployeeId: '',
  })
  const [editingInvoice, setEditingInvoice] = useState(null)

const [editInvoiceData, setEditInvoiceData] = useState({
  reference: '',
  amount: '',
  status: 'Pending',
  issue_date: '',
  due_date: '',
  ClientId: '',
  ProjectId: '',
})

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await authFetch(`${API_BASE_URL}/invoices`)
        const result = await response.json()

        if (!response.ok) throw new Error(result.message || t.revenueFailed)
        setInvoices(Array.isArray(result) ? result : result?.data || [])
      } catch (err) {
        setErrorInvoices(err.message)
      } finally {
        setLoadingInvoices(false)
      }
    }

    const fetchExpenses = async () => {
      try {
        const response = await authFetch(`${API_BASE_URL}/expenses`)
        const result = await response.json()

        if (!response.ok) throw new Error(result.message || t.expenseFailed)
        setExpenses(Array.isArray(result) ? result : result?.data || [])
      } catch (err) {
        setErrorExpenses(err.message)
      } finally {
        setLoadingExpenses(false)
      }
    }

    const fetchSalaries = async () => {
      try {
        const response = await authFetch(`${API_BASE_URL}/salaries`)
        const result = await response.json()

        if (!response.ok) throw new Error(result.message || t.salaryFailed)
        setSalaries(Array.isArray(result) ? result : result?.data || [])
      } catch (err) {
        setErrorSalaries(err.message)
      } finally {
        setLoadingSalaries(false)
      }
    }

    const fetchProjects = async () => {
      try {
        const response = await authFetch(`${API_BASE_URL}/projects`)
        const result = await response.json()

        if (!response.ok) throw new Error(result.message || 'Failed to fetch projects')
        setProjects(Array.isArray(result) ? result : result?.data || [])
      } catch (err) {
        console.error(err.message)
      }
    }

    const fetchCategories = async () => {
      try {
        const response = await authFetch(`${API_BASE_URL}/categories`)
        const result = await response.json()

        if (!response.ok) throw new Error(result.message || 'Failed to fetch categories')
        setCategories(Array.isArray(result) ? result : result?.data || [])
      } catch (err) {
        console.error(err.message)
      }
    }

    const fetchFournisseurs = async () => {
      try {
        const response = await authFetch(`${API_BASE_URL}/fournisseurs`)
        const result = await response.json()

        if (!response.ok) throw new Error(result.message || 'Failed to fetch suppliers')
        setFournisseurs(Array.isArray(result) ? result : result?.data || [])
      } catch (err) {
        console.error(err.message)
      }
    }

    const fetchEmployees = async () => {
      try {
        const response = await authFetch(`${API_BASE_URL}/employees`)
        const result = await response.json()

        if (!response.ok) throw new Error(result.message || 'Failed to fetch employees')
        setEmployees(Array.isArray(result) ? result : result?.data || [])
      } catch (err) {
        console.error(err.message)
      }
    }

    const fetchClients = async () => {
      try {
        const response = await authFetch(`${API_BASE_URL}/clients`)
        const result = await response.json()

        if (!response.ok) throw new Error(result.message || 'Failed to fetch clients')
        setClients(Array.isArray(result) ? result : result?.data || [])
      } catch (err) {
        console.error(err.message)
      }
    }

    if (canViewInvoices) fetchInvoices()
    if (canViewExpenses) fetchExpenses()
    if (canViewSalaries) fetchSalaries()

    if (canViewProjects) fetchProjects()
    if (canViewCategories) fetchCategories()
    if (canViewSuppliers) fetchFournisseurs()
    if (canViewEmployees) fetchEmployees()
    if (canViewClients) fetchClients()
  }, [canViewInvoices, canViewExpenses, canViewSalaries, canViewProjects, canViewCategories, canViewSuppliers, canViewEmployees, canViewClients, t.revenueFailed, t.expenseFailed, t.salaryFailed])


  const highlightRecord = (type, id) => {
    if (!id) return

    setHighlightedRow({ type, id })

    setTimeout(() => {
      setHighlightedRow(null)
    }, 3500)
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setCurrentPage(1)
  }

  const totalRevenue = invoices.reduce((sum, item) => sum + Number(item.amount || 0), 0)
  const totalExpenses = expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0)
  const totalSalaries = salaries.reduce((sum, item) => sum + Number(item.amount_paid || 0), 0)

  const handleCreateInvoice = async () => {
    try {
      if (!newInvoice.amount || !newInvoice.issue_date || !newInvoice.ClientId || !newInvoice.ProjectId) {
        alert(t.validationInvoice)
        return
      }

      const payload = {
        reference: newInvoice.reference || '',
        amount: Number(newInvoice.amount),
        status: newInvoice.status,
        issue_date: newInvoice.issue_date,
        due_date: newInvoice.due_date || null,
        ClientId: Number(newInvoice.ClientId),
        ProjectId: Number(newInvoice.ProjectId),
      }

      const response = await authFetch(`${API_BASE_URL}/invoices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const result = await response.json()
      if (!response.ok) throw new Error(result.message || 'Failed to create invoice')

      const createdInvoice = { ...result.data, __localOrder: Date.now() }

      setInvoices((prev) => [createdInvoice, ...prev])
      highlightRecord('revenues', createdInvoice.id)
      setShowInvoiceModal(false)

      setNewInvoice({
        reference: '',
        amount: '',
        status: 'Pending',
        issue_date: '',
        due_date: '',
        ClientId: '',
        ProjectId: '',
      })
    } catch (err) {
      alert(err.message)
    }
  }

  const handleCreateExpense = async () => {
    try {
      if (!newExpense.amount || !newExpense.date || !newExpense.CategoryId || !newExpense.ProjectId) {
        alert(t.validationExpense)
        return
      }

      const payload = {
        amount: Number(newExpense.amount),
        date: newExpense.date,
        description: newExpense.description || '',
        reference: newExpense.reference || '',
        CategoryId: Number(newExpense.CategoryId),
        ProjectId: Number(newExpense.ProjectId),
        ...(newExpense.FournisseurId ? { FournisseurId: Number(newExpense.FournisseurId) } : {}),
      }

      const response = await authFetch(`${API_BASE_URL}/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const result = await response.json()
      if (!response.ok) throw new Error(result.message || 'Failed to create expense')

      const createdExpense = { ...result.data, __localOrder: Date.now() }

      setExpenses((prev) => [createdExpense, ...prev])
      highlightRecord('expenses', createdExpense.id)
      setShowExpenseModal(false)

      setNewExpense({
        amount: '',
        date: '',
        description: '',
        reference: '',
        CategoryId: '',
        ProjectId: '',
        FournisseurId: '',
      })
    } catch (err) {
      alert(err.message)
    }
  }

  const handleCreateSalary = async () => {
    try {
      if (!newSalary.month || !newSalary.year || !newSalary.amount_paid || !newSalary.payment_date || !newSalary.EmployeeId) {
        alert(t.validationRequired)
        return
      }

      const payload = {
        month: newSalary.month,
        year: Number(newSalary.year),
        amount_paid: Number(newSalary.amount_paid),
        payment_date: newSalary.payment_date,
        EmployeeId: Number(newSalary.EmployeeId),
      }

      const response = await authFetch(`${API_BASE_URL}/salaries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const result = await response.json()
      if (!response.ok) throw new Error(result.message || 'Failed to create salary')

      const createdSalary = { ...result.data, __localOrder: Date.now() }

      setSalaries((prev) => [createdSalary, ...prev])
      highlightRecord('salaries', createdSalary.id)
      setShowSalaryModal(false)

      setNewSalary({
        month: '',
        year: '',
        amount_paid: '',
        payment_date: '',
        EmployeeId: '',
      })
    } catch (err) {
      alert(err.message)
    }
  }

  const openEditExpenseModal = (expense) => {
    setShowInvoiceModal(false)
    setShowExpenseModal(false)
    setShowSalaryModal(false)
    setEditingSalary(null)
    setEditingInvoice(null)

    setEditingExpense(expense)
    setEditExpenseData({
      amount: expense.amount || '',
      date: expense.date ? expense.date.slice(0, 10) : '',
      description: expense.description || '',
      reference: expense.reference || '',
      CategoryId: expense.CategoryId || expense.Category?.id || '',
      ProjectId: expense.ProjectId || expense.Project?.id || '',
      FournisseurId: expense.FournisseurId || expense.Fournisseur?.id || '',
    })
  }

  const handleUpdateExpense = async () => {
    try {
      if (!editExpenseData.amount || !editExpenseData.date || !editExpenseData.CategoryId || !editExpenseData.ProjectId) {
        alert(t.validationExpense)
        return
      }

      const payload = {
        amount: Number(editExpenseData.amount),
        date: editExpenseData.date,
        description: editExpenseData.description || '',
        reference: editExpenseData.reference || '',
        CategoryId: Number(editExpenseData.CategoryId),
        ProjectId: Number(editExpenseData.ProjectId),
        ...(editExpenseData.FournisseurId ? { FournisseurId: Number(editExpenseData.FournisseurId) } : {}),
      }

      const response = await authFetch(`${API_BASE_URL}/expenses/${editingExpense.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const result = await response.json()
      if (!response.ok) throw new Error(result.message || 'Failed to update expense')

      setExpenses((prev) =>
        prev.map((expense) => (expense.id === editingExpense.id ? result.data : expense))
      )

      setEditingExpense(null)
    } catch (err) {
      alert(err.message)
    }
  }

  const handleDeleteExpense = async (id) => {
  try {
    const response = await authFetch(`${API_BASE_URL}/expenses/${id}`, {
      method: 'DELETE',
    })

    const result = await response.json()
    if (!response.ok) throw new Error(result.message || 'Failed to delete expense')

    setExpenses((prev) => prev.filter((expense) => expense.id !== id))
    showToastMessage(t.expenseDeleted, 'success')
  } catch (err) {
    showToastMessage(err.message || t.failedDeleteExpense, 'error')
  } finally {
    setShowConfirm(false)
    setSelectedId(null)
  }
}

  const openEditSalaryModal = (salary) => {
    setShowInvoiceModal(false)
    setShowExpenseModal(false)
    setShowSalaryModal(false)
    setEditingExpense(null)
    setEditingInvoice(null)

    setEditingSalary(salary)
    setEditSalaryData({
      month: salary.month || '',
      year: salary.year || '',
      amount_paid: salary.amount_paid || '',
      payment_date: salary.payment_date ? salary.payment_date.slice(0, 10) : '',
      EmployeeId: salary.EmployeeId || '',
    })
  }

  const handleUpdateSalary = async () => {
    try {
      if (!editSalaryData.month || !editSalaryData.year || !editSalaryData.amount_paid || !editSalaryData.payment_date || !editSalaryData.EmployeeId) {
        alert(t.validationRequired)
        return
      }

      const payload = {
        month: editSalaryData.month,
        year: Number(editSalaryData.year),
        amount_paid: Number(editSalaryData.amount_paid),
        payment_date: editSalaryData.payment_date,
        EmployeeId: Number(editSalaryData.EmployeeId),
      }

      const response = await authFetch(`${API_BASE_URL}/salaries/${editingSalary.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const result = await response.json()
      if (!response.ok) throw new Error(result.message || 'Failed to update salary')

      setSalaries((prev) =>
        prev.map((salary) => (salary.id === editingSalary.id ? result : salary))
      )

      setEditingSalary(null)
    } catch (err) {
      alert(err.message)
    }
  }

 const handleDeleteSalary = async (id) => {
  try {
    const response = await authFetch(`${API_BASE_URL}/salaries/${id}`, {
      method: 'DELETE',
    })

    const result = await response.json()
    if (!response.ok) throw new Error(result.message || 'Failed to delete salary')

    setSalaries((prev) => prev.filter((salary) => salary.id !== id))
    showToastMessage(t.salaryDeleted, 'success')
  } catch (err) {
    showToastMessage(err.message || t.failedDeleteSalary, 'error')
  } finally {
    setShowConfirm(false)
    setSelectedId(null)
  }
}
  const openEditInvoiceModal = (invoice) => {
  setShowInvoiceModal(false)
  setShowExpenseModal(false)
  setShowSalaryModal(false)
  setEditingExpense(null)
  setEditingSalary(null)

  setEditingInvoice(invoice)
  setEditInvoiceData({
    reference: invoice.reference || '',
    amount: invoice.amount || '',
    status: invoice.status || 'Pending',
    issue_date: invoice.issue_date ? invoice.issue_date.slice(0, 10) : '',
    due_date: invoice.due_date ? invoice.due_date.slice(0, 10) : '',
    ClientId: invoice.ClientId || invoice.Client?.id || '',
    ProjectId: invoice.ProjectId || invoice.Project?.id || '',
  })
}

const handleUpdateInvoice = async () => {
  try {
    if (
      !editInvoiceData.amount ||
      !editInvoiceData.issue_date ||
      !editInvoiceData.ClientId ||
      !editInvoiceData.ProjectId
    ) {
      alert(t.validationInvoice)
      return
    }

    const payload = {
      reference: editInvoiceData.reference || '',
      amount: Number(editInvoiceData.amount),
      status: editInvoiceData.status,
      issue_date: editInvoiceData.issue_date,
      due_date: editInvoiceData.due_date || null,
      ClientId: Number(editInvoiceData.ClientId),
      ProjectId: Number(editInvoiceData.ProjectId),
    }

    const response = await authFetch(`${API_BASE_URL}/invoices/${editingInvoice.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || 'Failed to update invoice')
    }

    setInvoices((prev) =>
      prev.map((invoice) =>
        invoice.id === editingInvoice.id ? result.data : invoice
      )
    )

    setEditingInvoice(null)
  } catch (err) {
    alert(err.message)
  }
}

const handleDeleteInvoice = async (id) => {
  try {
    const response = await authFetch(`${API_BASE_URL}/invoices/${id}`, {
      method: 'DELETE',
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || 'Failed to delete invoice')
    }

    setInvoices((prev) => prev.filter((invoice) => invoice.id !== id))
    showToastMessage(t.invoiceDeleted, 'success')
  } catch (err) {
    showToastMessage(err.message || t.failedDeleteInvoice, 'error')
  } finally {
    setShowConfirm(false)
    setSelectedId(null)
  }
}

  const getRecordDate = (item, type) => {
    if (type === 'revenues') return item.issue_date || item.createdAt
    if (type === 'expenses') return item.date || item.createdAt
    return item.payment_date || item.createdAt
  }

  const getRecordAmount = (item, type) => {
    if (type === 'salaries') return Number(item.amount_paid || 0)
    return Number(item.amount || 0)
  }

  const getSearchableText = (item, type) => {
    if (type === 'revenues') {
      return [
        item.reference,
        item.status,
        item.Client?.name,
        item.Project?.name,
        item.amount,
        item.issue_date,
        item.due_date,
      ].join(' ')
    }

    if (type === 'expenses') {
      return [
        item.description,
        item.reference,
        item.Project?.name,
        item.Category?.name,
        item.Fournisseur?.name,
        item.amount,
        item.date,
      ].join(' ')
    }

    return [
      item.month,
      item.year,
      item.amount_paid,
      item.payment_date,
      item.EmployeeId,
      item.Employee?.first_name,
      item.Employee?.last_name,
    ].join(' ')
  }

  const processData = (data, type) => {
    return [...data]
      .filter((item) => {
        const searchMatch = getSearchableText(item, type)
          .toLowerCase()
          .includes(searchTerm.toLowerCase())

        const statusMatch =
          type !== 'revenues' ||
          statusFilter === 'all' ||
          item.status === statusFilter

        const recordDate = getRecordDate(item, type)
        const recordTime = recordDate ? new Date(recordDate).getTime() : null

        const fromMatch =
          !dateFrom || (recordTime && recordTime >= new Date(dateFrom).getTime())

        const toMatch =
          !dateTo || (recordTime && recordTime <= new Date(dateTo).getTime())

        const amount = getRecordAmount(item, type)

        const minMatch = !minAmount || amount >= Number(minAmount)
        const maxMatch = !maxAmount || amount <= Number(maxAmount)

        return searchMatch && statusMatch && fromMatch && toMatch && minMatch && maxMatch
      })
      .sort((a, b) => {
        const getValue = (item) => {
          if (sortField === 'localOrder') {
            return item.__localOrder || new Date(item.createdAt || getRecordDate(item, type) || 0).getTime()
          }
          if (sortField === 'displayDate') return getRecordDate(item, type)
          if (sortField === 'displayAmount') return getRecordAmount(item, type)
          if (sortField === 'client') return item.Client?.name || ''
          if (sortField === 'project') return item.Project?.name || ''
          if (sortField === 'category') return item.Category?.name || ''
          if (sortField === 'supplier') return item.Fournisseur?.name || ''
          if (sortField === 'employee') {
            return `${item.Employee?.first_name || ''} ${item.Employee?.last_name || ''}`.trim()
          }
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

  const resetTransactionFilters = () => {
    setSearchTerm('')
    setStatusFilter('all')
    setDateFrom('')
    setDateTo('')
    setMinAmount('')
    setMaxAmount('')
    setSortField('localOrder')
    setSortOrder('desc')
    setCurrentPage(1)
  }

  const exportToExcel = (data, filename) => {
    if (!data.length) {
      showToastMessage(t.noDataExport, 'error')
      return
    }

    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
    XLSX.writeFile(workbook, `${filename}.xlsx`)

    showToastMessage(t.excelExported)
  }

const requiredColumns = {
  invoices: ['amount', 'issue_date', 'ClientId', 'ProjectId'],
  expenses: ['amount', 'date', 'CategoryId', 'ProjectId'],
  salaries: ['month', 'year', 'amount_paid', 'payment_date', 'EmployeeId'],
}

const parseCsv = (text) => {
  const lines = text.trim().split('\n')
  const headers = lines[0].split(',').map((h) => h.trim())

  return lines.slice(1).map((line) => {
const values = line.split(',').map((v) => v.trim())
return headers.reduce((obj, header, index) => {
  obj[header] = values[index] || ''
  return obj
}, {})
  })
}

const validateImportRows = (rows, type) => {
  const required = requiredColumns[type]
  const errors = []

  rows.forEach((row, index) => {
required.forEach((col) => {
  if (!row[col]) {
    errors.push(`Row ${index + 1}: Missing ${col}`)
  }
})
  })

  return errors
}

const handleImportFile = (e) => {
  const file = e.target.files[0]
  if (!file) return

  setImportFileName(file.name)
  setImportRows([])
  setImportErrors([])

  const extension = file.name.split('.').pop().toLowerCase()
  const reader = new FileReader()

  reader.onload = (event) => {
let rows = []

if (extension === 'csv') {
  rows = parseCsv(event.target.result)
} else if (extension === 'xlsx' || extension === 'xls') {
  const workbook = XLSX.read(event.target.result, { type: 'array' })
  const sheetName = workbook.SheetNames[0]
  const sheet = workbook.Sheets[sheetName]
  rows = XLSX.utils.sheet_to_json(sheet)
} else {
  showToastMessage(t.unsupportedFormat, 'error')
  return
}

const errors = validateImportRows(rows, importType)

setImportRows(rows)
setImportErrors(errors)

if (errors.length > 0) {
  showToastMessage(t.fileLoadedErrors, 'error')
} else {
  showToastMessage(t.fileLoaded)
}
  }

  if (extension === 'csv') {
reader.readAsText(file)
  } else {
reader.readAsArrayBuffer(file)
  }
}

const handleImportData = async () => {
  if (!importRows.length) {
showToastMessage(t.uploadFirst, 'error')
return
  }

  if (importErrors.length > 0) {
showToastMessage(t.fixImportErrors, 'error')
return
  }

  try {
const endpoint =
  importType === 'invoices'
    ? 'invoices'
    : importType === 'expenses'
    ? 'expenses'
    : 'salaries'

const createdItems = []

for (const row of importRows) {
  const response = await authFetch(`${API_BASE_URL}/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(row),
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || t.importFailed)
  }

  createdItems.push(result.data || result)
}

const importedItems = [...createdItems]
  .reverse()
  .map((item, index) => ({ ...item, __localOrder: Date.now() + index }))

if (importType === 'invoices') {
  setInvoices((prev) => [...importedItems, ...prev])
  highlightRecord('revenues', importedItems[0]?.id)
} else if (importType === 'expenses') {
  setExpenses((prev) => [...importedItems, ...prev])
  highlightRecord('expenses', importedItems[0]?.id)
} else {
  setSalaries((prev) => [...importedItems, ...prev])
  highlightRecord('salaries', importedItems[0]?.id)
}

setImportRows([])
setImportFileName('')
setImportErrors([])
showToastMessage(t.dataImported)
  } catch (err) {
showToastMessage(err.message, 'error')
  }
}

  const renderTableControls = (type, data, filename) => (
    <div className="transaction-controls">
      <div className="transaction-filter-field search">
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

      {type === 'revenues' && (
        <div className="transaction-filter-field">
          <label>{t.status}</label>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              setCurrentPage(1)
            }}
          >
            <option value="all">{t.allStatus}</option>
<option value="Pending">{t.pending}</option>
<option value="Paid">{t.paid}</option>
<option value="Cancelled">{t.cancelled}</option>
          </select>
        </div>
      )}

      <div className="transaction-filter-field">
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

      <div className="transaction-filter-field">
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

      <div className="transaction-filter-field small">
        <label>{t.min}</label>
        <input
          type="number"
          placeholder="0"
          value={minAmount}
          onChange={(e) => {
            setMinAmount(e.target.value)
            setCurrentPage(1)
          }}
        />
      </div>

      <div className="transaction-filter-field small">
        <label>{t.max}</label>
        <input
          type="number"
          placeholder={t.any}
          value={maxAmount}
          onChange={(e) => {
            setMaxAmount(e.target.value)
            setCurrentPage(1)
          }}
        />
      </div>

      <div className="transaction-control-actions">
        <button className="transaction-secondary-btn" onClick={resetTransactionFilters}>
          {t.reset}
        </button>

        <button
          className="transaction-export-btn"
          onClick={() => exportToExcel(data, filename)}
        >
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
      <div className="transaction-pagination">
        <p>
          {t.visibleRecords}: {(currentPage - 1) * rowsPerPage + 1}-
          {Math.min(currentPage * rowsPerPage, totalItems)} / {totalItems}
        </p>

        <div className="transaction-pages">
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

  const renderRevenuesTab = () => {
    if (loadingInvoices) return <LoadingState message={t.loadingRevenue} />
    if (errorInvoices) return <EmptyState title={t.revenueFailed} message={errorInvoices} />
    const canEditInvoices = canUpdateResource('invoices', role)
    const canRemoveInvoices = canDeleteResource('invoices', role)

    const filteredInvoices = processData(invoices, 'revenues')
    const paginatedInvoices = getPaginatedData(filteredInvoices)

    const exportRows = filteredInvoices.map((invoice) => ({
      Reference: invoice.reference || '-',
      Client: invoice.Client?.name || '-',
      Project: invoice.Project?.name || '-',
      Status: invoice.status || '-',
      'Issue Date': invoice.issue_date ? invoice.issue_date.slice(0, 10) : '-',
      'Due Date': invoice.due_date ? invoice.due_date.slice(0, 10) : '-',
      Amount: Number(invoice.amount || 0),
    }))
    return (
      <>
        <div className="table-header">
          <div>
            <span>{t.allInvoices}</span>
            <p>{filteredInvoices.length} {t.visibleRecords} {invoices.length} {t.totalInvoicesRecords}</p>
          </div>
        </div>

        {renderTableControls('revenues', exportRows, 'revenues')}

        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort('reference')}>{t.reference} {getSortIcon('reference')}</th>
              <th onClick={() => handleSort('client')}>{t.client} {getSortIcon('client')}</th>
              <th onClick={() => handleSort('project')}>{t.project} {getSortIcon('project')}</th>
              <th onClick={() => handleSort('status')}>{t.status} {getSortIcon('status')}</th>
              <th onClick={() => handleSort('displayDate')}>{t.issueDate} {getSortIcon('displayDate')}</th>
              <th onClick={() => handleSort('due_date')}>{t.dueDate} {getSortIcon('due_date')}</th>
              <th onClick={() => handleSort('displayAmount')}>{t.amount} {getSortIcon('displayAmount')}</th>
              <th>{t.actions}</th>
            </tr>
          </thead>

          <tbody>
            {filteredInvoices.length > 0 ? (
              paginatedInvoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className={highlightedRow?.type === 'revenues' && highlightedRow?.id === invoice.id ? 'transaction-row-highlight' : ''}
                >
                  <td>{invoice.reference || '-'}</td>
                  <td>{invoice.Client?.name || '-'}</td>
                  <td>{invoice.Project?.name || '-'}</td>
                  <td>{invoice.status || '-'}</td>
                  <td>{invoice.issue_date ? invoice.issue_date.slice(0, 10) : '-'}</td>
                  <td>{invoice.due_date ? invoice.due_date.slice(0, 10) : '-'}</td>
                  <td>${Number(invoice.amount || 0).toLocaleString()}</td>
                  <td>
                    <div className="transaction-row-actions">
                      {canEditInvoices && (
                        <button className="transaction-action-btn edit" onClick={() => openEditInvoiceModal(invoice)}>
                          {t.edit}
                        </button>
                      )}
                      {canRemoveInvoices && (
                        <button
                          className="transaction-action-btn delete"
                          onClick={() => {
                            setSelectedId({ id: invoice.id, type: 'invoice' })
                            setShowConfirm(true)
                          }}
                        >
                          {t.delete}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">
                  <EmptyState
                    title={t.noInvoices}
                    message={t.noInvoicesMessage}
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {renderPagination(filteredInvoices.length)}
      </>
    )
  }

  const renderExpensesTab = () => {
    if (loadingExpenses) return <LoadingState message={t.loadingExpenses} />
    if (errorExpenses) return <EmptyState title={t.expenseFailed} message={errorExpenses} />
    const canEditExpenses = canUpdateResource('expenses', role)
    const canRemoveExpenses = canDeleteResource('expenses', role)

    const filteredExpenses = processData(expenses, 'expenses')
    const paginatedExpenses = getPaginatedData(filteredExpenses)

    const exportRows = filteredExpenses.map((expense) => ({
      Date: expense.date ? expense.date.slice(0, 10) : '-',
      Description: expense.description || '-',
      Project: expense.Project?.name || '-',
      Category: expense.Category?.name || '-',
      Supplier: expense.Fournisseur?.name || '-',
      Reference: expense.reference || '-',
      Amount: Number(expense.amount || 0),
    }))

    return (
      <>
        <div className="table-header">
          <div>
            <span>{t.allExpenses}</span>
            <p>{filteredExpenses.length} {t.visibleRecords} {expenses.length} {t.totalExpensesRecords}</p>
          </div>
        </div>

        {renderTableControls('expenses', exportRows, 'expenses')}

        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort('displayDate')}>{t.date} {getSortIcon('displayDate')}</th>
              <th onClick={() => handleSort('description')}>{t.description} {getSortIcon('description')}</th>
              <th onClick={() => handleSort('project')}>{t.project} {getSortIcon('project')}</th>
              <th onClick={() => handleSort('category')}>{t.category} {getSortIcon('category')}</th>
              <th onClick={() => handleSort('supplier')}>{t.supplier} {getSortIcon('supplier')}</th>
              <th onClick={() => handleSort('reference')}>{t.reference} {getSortIcon('reference')}</th>
              <th onClick={() => handleSort('displayAmount')}>{t.amount} {getSortIcon('displayAmount')}</th>
              <th>{t.actions}</th>
            </tr>
          </thead>

          <tbody>
            {filteredExpenses.length > 0 ? (
              paginatedExpenses.map((expense) => (
                <tr
                  key={expense.id}
                  className={highlightedRow?.type === 'expenses' && highlightedRow?.id === expense.id ? 'transaction-row-highlight' : ''}
                >
                  <td>{expense.date ? expense.date.slice(0, 10) : '-'}</td>
                  <td>{expense.description || '-'}</td>
                  <td>{expense.Project?.name || '-'}</td>
                  <td>{expense.Category?.name || '-'}</td>
                  <td>{expense.Fournisseur?.name || '-'}</td>
                  <td>{expense.reference || '-'}</td>
                  <td>${Number(expense.amount || 0).toLocaleString()}</td>
                  <td>
                    <div className="transaction-row-actions">
                      {canEditExpenses && (
                        <button className="transaction-action-btn edit" onClick={() => openEditExpenseModal(expense)}>
                          {t.edit}
                        </button>
                      )}
                      {canRemoveExpenses && (
                        <button
                          className="transaction-action-btn delete"
                          onClick={() => {
                            setSelectedId({ id: expense.id, type: 'expense' })
                            setShowConfirm(true)
                          }}
                        >
                          {t.delete}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">
                  <EmptyState
                    title={t.noExpenses}
                    message={t.noExpensesMessage}
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {renderPagination(filteredExpenses.length)}
      </>
    )
  }

  const renderSalariesTab = () => {
    if (loadingSalaries) return <LoadingState message={t.loadingSalaries} />
    if (errorSalaries) return <EmptyState title={t.salaryFailed} message={errorSalaries} />
    const canEditSalaries = canUpdateResource('salaries', role)
    const canRemoveSalaries = canDeleteResource('salaries', role)

    const filteredSalaries = processData(salaries, 'salaries')
    const paginatedSalaries = getPaginatedData(filteredSalaries)

    const exportRows = filteredSalaries.map((salary) => ({
      Month: salary.month || '-',
      Year: salary.year || '-',
      'Amount Paid': Number(salary.amount_paid || 0),
      'Payment Date': salary.payment_date ? salary.payment_date.slice(0, 10) : '-',
      'Employee ID': salary.EmployeeId || '-',
    }))

    return (
      <>
        <div className="table-header">
          <div>
            <span>{t.allSalaries}</span>
            <p>{filteredSalaries.length} {t.visibleRecords} {salaries.length} {t.totalSalariesRecords}</p>
          </div>
        </div>

        {renderTableControls('salaries', exportRows, 'salaries')}

        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort('month')}>{t.month} {getSortIcon('month')}</th>
              <th onClick={() => handleSort('year')}>{t.year} {getSortIcon('year')}</th>
              <th onClick={() => handleSort('displayAmount')}>{t.amountPaid} {getSortIcon('displayAmount')}</th>
              <th onClick={() => handleSort('displayDate')}>{t.paymentDate} {getSortIcon('displayDate')}</th>
              <th onClick={() => handleSort('EmployeeId')}>{t.employeeId} {getSortIcon('EmployeeId')}</th>
              <th>{t.actions}</th>
            </tr>
          </thead>

          <tbody>
            {filteredSalaries.length > 0 ? (
              paginatedSalaries.map((salary) => (
                <tr
                  key={salary.id}
                  className={highlightedRow?.type === 'salaries' && highlightedRow?.id === salary.id ? 'transaction-row-highlight' : ''}
                >
                  <td>{salary.month || '-'}</td>
                  <td>{salary.year || '-'}</td>
                  <td>${Number(salary.amount_paid || 0).toLocaleString()}</td>
                  <td>{salary.payment_date ? salary.payment_date.slice(0, 10) : '-'}</td>
                  <td>{salary.EmployeeId || '-'}</td>
                  <td>
                    <div className="transaction-row-actions">
                      {canEditSalaries && (
                        <button className="transaction-action-btn edit" onClick={() => openEditSalaryModal(salary)}>
                          {t.edit}
                        </button>
                      )}
                      {canRemoveSalaries && (
                        <button
                          className="transaction-action-btn delete"
                          onClick={() => {
                            setSelectedId({ id: salary.id, type: 'salary' })
                            setShowConfirm(true)
                          }}
                        >
                          {t.delete}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">
                  <EmptyState
                    title={t.noSalaries}
                    message={t.noSalariesMessage}
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {renderPagination(filteredSalaries.length)}
      </>
    )
  }
  const handleConfirmDelete = () => {
  if (!selectedId) return

  if (selectedId.type === 'expense') {
    handleDeleteExpense(selectedId.id)
  } else if (selectedId.type === 'salary') {
    handleDeleteSalary(selectedId.id)
  } else if (selectedId.type === 'invoice') {
    handleDeleteInvoice(selectedId.id)
  }
}

const renderImportTab = () => (
  <div className="import-panel">
    <div className="import-header">
      <div>
        <h3>{t.importFinancialData}</h3>
        <p>{t.uploadMessage}</p>
      </div>
      <span className="import-badge">CSV / Excel</span>
    </div>

    <div className="import-controls">
      <div className="import-field">
        <label>{t.datasetType}</label>
        <select
          value={importType}
          onChange={(e) => {
            setImportType(e.target.value)
            setImportRows([])
            setImportErrors([])
            setImportFileName('')
          }}
        >
          <option value="invoices">{t.invoice}</option>
          <option value="expenses">{t.expense}</option>
          <option value="salaries">{t.salary}</option>
        </select>
      </div>

      <div className="import-field">
        <label>{t.uploadFile}</label>
        <input type="file" accept=".csv,.xlsx,.xls" onChange={handleImportFile} />
      </div>

      <button className="import-btn" onClick={handleImportData}>
        {t.importData}
      </button>
    </div>

    <div className="import-requirements">
      <strong>{t.requiredColumnsText}:</strong>{' '}
      {requiredColumns[importType].join(', ')}
    </div>

    {importFileName && (
      <p className="import-file-name">{t.selectedFile}: {importFileName}</p>
    )}

    {importErrors.length > 0 && (
      <div className="import-errors">
        {importErrors.slice(0, 5).map((err, index) => (
          <p key={index}>{err}</p>
        ))}
      </div>
    )}

    {importRows.length > 0 && (
      <div className="import-preview">
        <h4>{t.preview}</h4>
        <table>
          <thead>
            <tr>
              {Object.keys(importRows[0]).map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {importRows.slice(0, 10).map((row, index) => (
              <tr key={index}>
                {Object.keys(importRows[0]).map((key) => (
                  <td key={key}>{row[key] || '-'}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
)

  const getMainKpi = () => {
    if (activeTab === 'revenues') {
      return {
        title: t.totalRevenue,
        value: `$${totalRevenue.toLocaleString()}`,
        subtitle: `${invoices.length} ${t.invoiceRecords} loaded`,
        source: t.sourceInvoices,
      }
    }

    if (activeTab === 'expenses') {
      return {
        title: t.totalExpenses,
        value: `$${totalExpenses.toLocaleString()}`,
        subtitle: `${expenses.length} ${t.expenseRecords} loaded`,
        source: t.sourceExpenses,
      }
    }

    if (activeTab === 'salaries') {
      return {
        title: t.totalSalaries,
        value: `$${totalSalaries.toLocaleString()}`,
        subtitle: `${salaries.length} ${t.salaryRecords} loaded`,
        source: t.sourceSalaries,
      }
    }

    return {
      title: t.importWorkspace,
      value: importRows.length ? `${importRows.length} ${t.rows}` : t.ready,
      subtitle: importFileName || t.importHelp,
      source: t.sourceImport,
    }
  }

  const kpi = getMainKpi()
  const activeResource =
    activeTab === 'revenues'
      ? 'invoices'
      : activeTab === 'expenses'
      ? 'expenses'
      : activeTab === 'salaries'
      ? 'salaries'
      : null
  const canCreateActive = activeResource ? canCreateResource(activeResource, role) : true
  const visibleTabs = [
    canViewInvoices && { id: 'revenues', label: t.revenues },
    canViewExpenses && { id: 'expenses', label: t.expenses },
    canViewSalaries && { id: 'salaries', label: t.salaries },
    { id: 'import', label: t.importData },
  ].filter(Boolean)
  const transactionSubtitle =
  activeTab === 'revenues'
    ? t.revenuesSubtitle
    : activeTab === 'expenses'
    ? t.expensesSubtitle
    : activeTab === 'salaries'
    ? t.salariesSubtitle
    : t.importSubtitle





  return (
    <div className="transactions-page">
      <PageHeader
  title={t.pageTitle}
  subtitle={transactionSubtitle}
/>
      <div className="transactions-top">
        <div className="tabs">
          {visibleTabs.map((tab) => (
            <button
              key={tab.id}
              className={activeTab === tab.id ? 'tab active' : 'tab'}
              onClick={() => handleTabChange(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab !== 'import' && canCreateActive && (
          <button
            className="add-btn"
            onClick={() => {
              setEditingInvoice(null)
              setEditingExpense(null)
              setEditingSalary(null)
              setShowInvoiceModal(false)
              setShowExpenseModal(false)
              setShowSalaryModal(false)

              if (activeTab === 'revenues') {
                setShowInvoiceModal(true)
              } else if (activeTab === 'expenses') {
                setShowExpenseModal(true)
              } else if (activeTab === 'salaries') {
                setShowSalaryModal(true)
              }
            }}
          >
            {t.addNew} {activeTab === 'revenues'
              ? t.invoice
              : activeTab === 'expenses'
              ? t.expense
              : t.salary}
          </button>
        )}
      </div>

      <div className="kpi-row">
        <div className="kpi-big">
          <p>{kpi.title}</p>
          <h2>{kpi.value}</h2>
          <span>{kpi.subtitle}</span>
        </div>

        <div className="kpi-alert">
          <p>{t.syncStatus}</p>
          <h3>{t.connected}</h3>
          <span>{kpi.source}</span>
        </div>
      </div>

      <div className="table-card">
  {activeTab === 'revenues' ? (
    renderRevenuesTab()
  ) : activeTab === 'expenses' ? (
    renderExpensesTab()
  ) : activeTab === 'salaries' ? (
    renderSalariesTab()
  ) : (
    renderImportTab()
  )}
</div>

      <div className="bottom-grid">
        <div className="distribution">
          <h3>{t.recordsLoaded}</h3>
          <p>
            {t.revenues}: {invoices.length} | {t.expenses}: {expenses.length} | {t.salaries}: {salaries.length}
          </p>
        </div>

        <div className="market">
          <h3>{t.backendSources}</h3>
          <p>{t.backendConnectedText}</p>
        </div>
      </div>

      {showInvoiceModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{t.addInvoice}</h3>

            <input
              placeholder={t.reference}
              value={newInvoice.reference}
              onChange={(e) => setNewInvoice({ ...newInvoice, reference: e.target.value })}
            />

            <input
              type="number"
              placeholder={t.amount}
              value={newInvoice.amount}
              onChange={(e) => setNewInvoice({ ...newInvoice, amount: e.target.value })}
            />

            <select
              value={newInvoice.status}
              onChange={(e) => setNewInvoice({ ...newInvoice, status: e.target.value })}
            >
              <option value="Pending">{t.pending}</option>
              <option value="Paid">{t.paid}</option>
              <option value="Cancelled">{t.cancelled}</option>
            </select>

            <input
              type="date"
              value={newInvoice.issue_date}
              onChange={(e) => setNewInvoice({ ...newInvoice, issue_date: e.target.value })}
            />

            <input
              type="date"
              value={newInvoice.due_date}
              onChange={(e) => setNewInvoice({ ...newInvoice, due_date: e.target.value })}
            />

            <select
              value={newInvoice.ClientId}
              onChange={(e) => setNewInvoice({ ...newInvoice, ClientId: e.target.value })}
            >
              <option value="">{t.selectClient}</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>

            <select
              value={newInvoice.ProjectId}
              onChange={(e) => setNewInvoice({ ...newInvoice, ProjectId: e.target.value })}
            >
              <option value="">{t.selectProject}</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>

            <div className="modal-actions">
              <button onClick={handleCreateInvoice}>{t.create}</button>
              <button onClick={() => setShowInvoiceModal(false)}>{t.cancel}</button>
            </div>
          </div>
        </div>
      )}

      {showSalaryModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{t.addSalary}</h3>

            <select
              value={newSalary.month}
              onChange={(e) => setNewSalary({ ...newSalary, month: e.target.value })}
            >
              <option value="">{t.selectMonth}</option>
              {[
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December',
              ].map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>

            <input
              type="number"
              placeholder={t.year}
              value={newSalary.year}
              onChange={(e) => setNewSalary({ ...newSalary, year: e.target.value })}
            />

            <input
              type="number"
              placeholder={t.amountPaid}
              value={newSalary.amount_paid}
              onChange={(e) => setNewSalary({ ...newSalary, amount_paid: e.target.value })}
            />

            <input
              type="date"
              value={newSalary.payment_date}
              onChange={(e) => setNewSalary({ ...newSalary, payment_date: e.target.value })}
            />

            <select
              value={newSalary.EmployeeId}
              onChange={(e) => setNewSalary({ ...newSalary, EmployeeId: e.target.value })}
            >
              <option value="">{t.selectEmployee}</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.first_name} {emp.last_name}
                </option>
              ))}
            </select>

            <div className="modal-actions">
              <button onClick={handleCreateSalary}>{t.create}</button>
              <button onClick={() => setShowSalaryModal(false)}>{t.cancel}</button>
            </div>
          </div>
        </div>
      )}

      {showExpenseModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{t.addExpense}</h3>

            <input
              type="number"
              placeholder={t.amount}
              value={newExpense.amount}
              onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
            />

            <input
              type="date"
              value={newExpense.date}
              onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
            />

            <input
              placeholder={t.description}
              value={newExpense.description}
              onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
            />

            <input
              placeholder={t.reference}
              value={newExpense.reference}
              onChange={(e) => setNewExpense({ ...newExpense, reference: e.target.value })}
            />

            <select
              value={newExpense.ProjectId}
              onChange={(e) => setNewExpense({ ...newExpense, ProjectId: e.target.value })}
            >
              <option value="">{t.selectProject}</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>

            <select
              value={newExpense.CategoryId}
              onChange={(e) => setNewExpense({ ...newExpense, CategoryId: e.target.value })}
            >
              <option value="">{t.selectCategory}</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <select
              value={newExpense.FournisseurId}
              onChange={(e) => setNewExpense({ ...newExpense, FournisseurId: e.target.value })}
            >
              <option value="">{t.selectSupplier}</option>
              {fournisseurs.map((fournisseur) => (
                <option key={fournisseur.id} value={fournisseur.id}>
                  {fournisseur.name}
                </option>
              ))}
            </select>

            <div className="modal-actions">
              <button onClick={handleCreateExpense}>{t.create}</button>
              <button onClick={() => setShowExpenseModal(false)}>{t.cancel}</button>
            </div>
          </div>
        </div>
      )}

      {editingExpense && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{t.editExpense}</h3>

            <input
              type="number"
              placeholder={t.amount}
              value={editExpenseData.amount}
              onChange={(e) => setEditExpenseData({ ...editExpenseData, amount: e.target.value })}
            />

            <input
              type="date"
              value={editExpenseData.date}
              onChange={(e) => setEditExpenseData({ ...editExpenseData, date: e.target.value })}
            />

            <input
              placeholder={t.description}
              value={editExpenseData.description}
              onChange={(e) => setEditExpenseData({ ...editExpenseData, description: e.target.value })}
            />

            <input
              placeholder={t.reference}
              value={editExpenseData.reference}
              onChange={(e) => setEditExpenseData({ ...editExpenseData, reference: e.target.value })}
            />

            <select
              value={editExpenseData.ProjectId}
              onChange={(e) => setEditExpenseData({ ...editExpenseData, ProjectId: e.target.value })}
            >
              <option value="">{t.selectProject}</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>

            <select
              value={editExpenseData.CategoryId}
              onChange={(e) => setEditExpenseData({ ...editExpenseData, CategoryId: e.target.value })}
            >
              <option value="">{t.selectCategory}</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <select
              value={editExpenseData.FournisseurId}
              onChange={(e) => setEditExpenseData({ ...editExpenseData, FournisseurId: e.target.value })}
            >
              <option value="">{t.selectSupplier}</option>
              {fournisseurs.map((fournisseur) => (
                <option key={fournisseur.id} value={fournisseur.id}>
                  {fournisseur.name}
                </option>
              ))}
            </select>

            <div className="modal-actions">
              <button onClick={handleUpdateExpense}>{t.save}</button>
              <button onClick={() => setEditingExpense(null)}>{t.cancel}</button>
            </div>
          </div>
        </div>
      )}

{editingInvoice && (
  <div className="modal-overlay">
    <div className="modal">
      <h3>{t.editInvoice}</h3>

      <input
        placeholder={t.reference}
        value={editInvoiceData.reference}
        onChange={(e) => setEditInvoiceData({ ...editInvoiceData, reference: e.target.value })}
      />

      <input
        type="number"
        placeholder={t.amount}
        value={editInvoiceData.amount}
        onChange={(e) => setEditInvoiceData({ ...editInvoiceData, amount: e.target.value })}
      />

      <select
        value={editInvoiceData.status}
        onChange={(e) => setEditInvoiceData({ ...editInvoiceData, status: e.target.value })}
      >
        <option value="Pending">{t.pending}</option>
        <option value="Paid">{t.paid}</option>
        <option value="Cancelled">{t.cancelled}</option>
      </select>

      <input
        type="date"
        value={editInvoiceData.issue_date}
        onChange={(e) => setEditInvoiceData({ ...editInvoiceData, issue_date: e.target.value })}
      />

      <input
        type="date"
        value={editInvoiceData.due_date}
        onChange={(e) => setEditInvoiceData({ ...editInvoiceData, due_date: e.target.value })}
      />

      <select
        value={editInvoiceData.ClientId}
        onChange={(e) => setEditInvoiceData({ ...editInvoiceData, ClientId: e.target.value })}
      >
        <option value="">{t.selectClient}</option>
        {clients.map((client) => (
          <option key={client.id} value={client.id}>
            {client.name}
          </option>
        ))}
      </select>

      <select
        value={editInvoiceData.ProjectId}
        onChange={(e) => setEditInvoiceData({ ...editInvoiceData, ProjectId: e.target.value })}
      >
        <option value="">{t.selectProject}</option>
        {projects.map((project) => (
          <option key={project.id} value={project.id}>
            {project.name}
          </option>
        ))}
      </select>

      <div className="modal-actions">
        <button onClick={handleUpdateInvoice}>{t.save}</button>
        <button onClick={() => setEditingInvoice(null)}>{t.cancel}</button>
      </div>
    </div>
  </div>
)}
      {editingSalary && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{t.editSalary}</h3>

            <select
              value={editSalaryData.month}
              onChange={(e) => setEditSalaryData({ ...editSalaryData, month: e.target.value })}
            >
              <option value="">{t.selectMonth}</option>
              {[
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December',
              ].map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>

            <input
              type="number"
              placeholder={t.year}
              value={editSalaryData.year}
              onChange={(e) => setEditSalaryData({ ...editSalaryData, year: e.target.value })}
            />

            <input
              type="number"
              placeholder={t.amountPaid}
              value={editSalaryData.amount_paid}
              onChange={(e) => setEditSalaryData({ ...editSalaryData, amount_paid: e.target.value })}
            />

            <input
              type="date"
              value={editSalaryData.payment_date}
              onChange={(e) => setEditSalaryData({ ...editSalaryData, payment_date: e.target.value })}
            />

            <select
              value={editSalaryData.EmployeeId}
              onChange={(e) => setEditSalaryData({ ...editSalaryData, EmployeeId: e.target.value })}
            >
              <option value="">{t.selectEmployee}</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.first_name} {emp.last_name}
                </option>
              ))}
            </select>

            <div className="modal-actions">
              <button onClick={handleUpdateSalary}>{t.save}</button>
              <button onClick={() => setEditingSalary(null)}>{t.cancel}</button>
            </div>
          </div>
        </div>
      )}
      {showConfirm && selectedId && (
  <ConfirmModal
    title={`${t.deleteConfirmTitle} ${selectedId.type}`}
    message={`${t.deleteConfirmMessageStart} ${selectedId.type}. ${t.deleteConfirmMessageEnd}`}
    onConfirm={handleConfirmDelete}
    onCancel={() => {
      setShowConfirm(false)
      setSelectedId(null)
    }}
  />
)}

{toast && (
  <Toast message={toast.message} type={toast.type} />
)}
    </div>
  )
}

export default FinancialTransactions
