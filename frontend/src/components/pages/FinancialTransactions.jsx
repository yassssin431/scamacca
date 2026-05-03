import { useEffect, useState } from 'react'
import API_BASE_URL from '../../services/api'
import './FinancialTransactions.css'
import PageHeader from '../common/PageHeader'
import ConfirmModal from '../common/ConfirmModal'
import Toast from '../common/Toast'
import LoadingState from '../common/LoadingState'
import EmptyState from '../common/EmptyState'
import * as XLSX from 'xlsx'

function FinancialTransactions() {
  const [activeTab, setActiveTab] = useState('revenues')

  const [invoices, setInvoices] = useState([])
  const [expenses, setExpenses] = useState([])
  const [salaries, setSalaries] = useState([])

  const [loadingInvoices, setLoadingInvoices] = useState(true)
  const [loadingExpenses, setLoadingExpenses] = useState(true)
  const [loadingSalaries, setLoadingSalaries] = useState(true)

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
        const response = await fetch(`${API_BASE_URL}/invoices`)
        const result = await response.json()

        if (!response.ok) throw new Error(result.message || 'Failed to fetch invoices')
        setInvoices(result.data || [])
      } catch (err) {
        setErrorInvoices(err.message)
      } finally {
        setLoadingInvoices(false)
      }
    }

    const fetchExpenses = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/expenses`)
        const result = await response.json()

        if (!response.ok) throw new Error(result.message || 'Failed to fetch expenses')
        setExpenses(result.data || [])
      } catch (err) {
        setErrorExpenses(err.message)
      } finally {
        setLoadingExpenses(false)
      }
    }

    const fetchSalaries = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/salaries`)
        const result = await response.json()

        if (!response.ok) throw new Error(result.message || 'Failed to fetch salaries')
        setSalaries(Array.isArray(result) ? result : [])
      } catch (err) {
        setErrorSalaries(err.message)
      } finally {
        setLoadingSalaries(false)
      }
    }

    const fetchProjects = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/projects`)
        const result = await response.json()

        if (!response.ok) throw new Error(result.message || 'Failed to fetch projects')
        setProjects(result.data || [])
      } catch (err) {
        console.error(err.message)
      }
    }

    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/categories`)
        const result = await response.json()

        if (!response.ok) throw new Error(result.message || 'Failed to fetch categories')
        setCategories(Array.isArray(result) ? result : [])
      } catch (err) {
        console.error(err.message)
      }
    }

    const fetchFournisseurs = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/fournisseurs`)
        const result = await response.json()

        if (!response.ok) throw new Error(result.message || 'Failed to fetch suppliers')
        setFournisseurs(Array.isArray(result) ? result : [])
      } catch (err) {
        console.error(err.message)
      }
    }

    const fetchEmployees = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/employees`)
        const result = await response.json()

        if (!response.ok) throw new Error(result.message || 'Failed to fetch employees')
        setEmployees(result.data || [])
      } catch (err) {
        console.error(err.message)
      }
    }

    const fetchClients = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/clients`)
        const result = await response.json()

        if (!response.ok) throw new Error(result.message || 'Failed to fetch clients')
        setClients(result.data || [])
      } catch (err) {
        console.error(err.message)
      }
    }

    fetchInvoices()
    fetchExpenses()
    fetchSalaries()
    fetchProjects()
    fetchCategories()
    fetchFournisseurs()
    fetchEmployees()
    fetchClients()
  }, [])


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
        alert('Please fill amount, issue date, client and project.')
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

      const response = await fetch(`${API_BASE_URL}/invoices`, {
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
        alert('Please fill amount, date, category and project.')
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

      const response = await fetch(`${API_BASE_URL}/expenses`, {
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
        alert('Please fill all required fields.')
        return
      }

      const payload = {
        month: newSalary.month,
        year: Number(newSalary.year),
        amount_paid: Number(newSalary.amount_paid),
        payment_date: newSalary.payment_date,
        EmployeeId: Number(newSalary.EmployeeId),
      }

      const response = await fetch(`${API_BASE_URL}/salaries`, {
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
        alert('Please fill amount, date, category and project.')
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

      const response = await fetch(`${API_BASE_URL}/expenses/${editingExpense.id}`, {
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
    const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
      method: 'DELETE',
    })

    const result = await response.json()
    if (!response.ok) throw new Error(result.message || 'Failed to delete expense')

    setExpenses((prev) => prev.filter((expense) => expense.id !== id))
    showToastMessage('Expense deleted successfully', 'success')
  } catch (err) {
    showToastMessage(err.message || 'Failed to delete expense', 'error')
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
        alert('Please fill all required fields.')
        return
      }

      const payload = {
        month: editSalaryData.month,
        year: Number(editSalaryData.year),
        amount_paid: Number(editSalaryData.amount_paid),
        payment_date: editSalaryData.payment_date,
        EmployeeId: Number(editSalaryData.EmployeeId),
      }

      const response = await fetch(`${API_BASE_URL}/salaries/${editingSalary.id}`, {
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
    const response = await fetch(`${API_BASE_URL}/salaries/${id}`, {
      method: 'DELETE',
    })

    const result = await response.json()
    if (!response.ok) throw new Error(result.message || 'Failed to delete salary')

    setSalaries((prev) => prev.filter((salary) => salary.id !== id))
    showToastMessage('Salary deleted successfully', 'success')
  } catch (err) {
    showToastMessage(err.message || 'Failed to delete salary', 'error')
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
      alert('Please fill amount, issue date, client and project.')
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

    const response = await fetch(`${API_BASE_URL}/invoices/${editingInvoice.id}`, {
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
    const response = await fetch(`${API_BASE_URL}/invoices/${id}`, {
      method: 'DELETE',
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || 'Failed to delete invoice')
    }

    setInvoices((prev) => prev.filter((invoice) => invoice.id !== id))
    showToastMessage('Invoice deleted successfully', 'success')
  } catch (err) {
    showToastMessage(err.message || 'Failed to delete invoice', 'error')
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
      showToastMessage('No data available to export', 'error')
      return
    }

    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
    XLSX.writeFile(workbook, `${filename}.xlsx`)

    showToastMessage('Excel file exported successfully')
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
  showToastMessage('Unsupported file format', 'error')
  return
}

const errors = validateImportRows(rows, importType)

setImportRows(rows)
setImportErrors(errors)

if (errors.length > 0) {
  showToastMessage('File loaded with validation errors', 'error')
} else {
  showToastMessage('File loaded successfully')
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
showToastMessage('Please upload a file first', 'error')
return
  }

  if (importErrors.length > 0) {
showToastMessage('Fix validation errors before importing', 'error')
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
  const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(row),
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || 'Import failed')
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
showToastMessage('Data imported successfully')
  } catch (err) {
showToastMessage(err.message, 'error')
  }
}

  const renderTableControls = (type, data, filename) => (
    <div className="transaction-controls">
      <div className="transaction-filter-field search">
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

      {type === 'revenues' && (
        <div className="transaction-filter-field">
          <label>Status</label>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              setCurrentPage(1)
            }}
          >
            <option value="all">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      )}

      <div className="transaction-filter-field">
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

      <div className="transaction-filter-field">
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

      <div className="transaction-filter-field small">
        <label>Min</label>
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
        <label>Max</label>
        <input
          type="number"
          placeholder="Any"
          value={maxAmount}
          onChange={(e) => {
            setMaxAmount(e.target.value)
            setCurrentPage(1)
          }}
        />
      </div>

      <div className="transaction-control-actions">
        <button className="transaction-secondary-btn" onClick={resetTransactionFilters}>
          Reset
        </button>

        <button
          className="transaction-export-btn"
          onClick={() => exportToExcel(data, filename)}
        >
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
      <div className="transaction-pagination">
        <p>
          Showing {(currentPage - 1) * rowsPerPage + 1}-
          {Math.min(currentPage * rowsPerPage, totalItems)} of {totalItems} records
        </p>

        <div className="transaction-pages">
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

  const renderRevenuesTab = () => {
    if (loadingInvoices) return <LoadingState message="Loading revenue records..." />
    if (errorInvoices) return <EmptyState title="Revenue loading failed" message={errorInvoices} />

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
            <span>All Invoices (Revenue Source)</span>
            <p>{filteredInvoices.length} visible records from {invoices.length} total invoices</p>
          </div>
        </div>

        {renderTableControls('revenues', exportRows, 'revenues')}

        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort('reference')}>Reference {getSortIcon('reference')}</th>
              <th onClick={() => handleSort('client')}>Client {getSortIcon('client')}</th>
              <th onClick={() => handleSort('project')}>Project {getSortIcon('project')}</th>
              <th onClick={() => handleSort('status')}>Status {getSortIcon('status')}</th>
              <th onClick={() => handleSort('displayDate')}>Issue Date {getSortIcon('displayDate')}</th>
              <th onClick={() => handleSort('due_date')}>Due Date {getSortIcon('due_date')}</th>
              <th onClick={() => handleSort('displayAmount')}>Amount {getSortIcon('displayAmount')}</th>
              <th>Actions</th>
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
                      <button className="transaction-action-btn edit" onClick={() => openEditInvoiceModal(invoice)}>
                        Edit
                      </button>
                      <button
                        className="transaction-action-btn delete"
                        onClick={() => {
                          setSelectedId({ id: invoice.id, type: 'invoice' })
                          setShowConfirm(true)
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">
                  <EmptyState
                    title="No invoices found"
                    message="No invoice records match your current filters."
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
    if (loadingExpenses) return <LoadingState message="Loading expense records..." />
    if (errorExpenses) return <EmptyState title="Expense loading failed" message={errorExpenses} />

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
            <span>All Expenses</span>
            <p>{filteredExpenses.length} visible records from {expenses.length} total expenses</p>
          </div>
        </div>

        {renderTableControls('expenses', exportRows, 'expenses')}

        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort('displayDate')}>Date {getSortIcon('displayDate')}</th>
              <th onClick={() => handleSort('description')}>Description {getSortIcon('description')}</th>
              <th onClick={() => handleSort('project')}>Project {getSortIcon('project')}</th>
              <th onClick={() => handleSort('category')}>Category {getSortIcon('category')}</th>
              <th onClick={() => handleSort('supplier')}>Supplier {getSortIcon('supplier')}</th>
              <th onClick={() => handleSort('reference')}>Reference {getSortIcon('reference')}</th>
              <th onClick={() => handleSort('displayAmount')}>Amount {getSortIcon('displayAmount')}</th>
              <th>Actions</th>
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
                      <button className="transaction-action-btn edit" onClick={() => openEditExpenseModal(expense)}>
                        Edit
                      </button>
                      <button
                        className="transaction-action-btn delete"
                        onClick={() => {
                          setSelectedId({ id: expense.id, type: 'expense' })
                          setShowConfirm(true)
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">
                  <EmptyState
                    title="No expenses found"
                    message="No expense records match your current filters."
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
    if (loadingSalaries) return <LoadingState message="Loading salary records..." />
    if (errorSalaries) return <EmptyState title="Salary loading failed" message={errorSalaries} />

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
            <span>All Salaries</span>
            <p>{filteredSalaries.length} visible records from {salaries.length} total salaries</p>
          </div>
        </div>

        {renderTableControls('salaries', exportRows, 'salaries')}

        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort('month')}>Month {getSortIcon('month')}</th>
              <th onClick={() => handleSort('year')}>Year {getSortIcon('year')}</th>
              <th onClick={() => handleSort('displayAmount')}>Amount Paid {getSortIcon('displayAmount')}</th>
              <th onClick={() => handleSort('displayDate')}>Payment Date {getSortIcon('displayDate')}</th>
              <th onClick={() => handleSort('EmployeeId')}>Employee ID {getSortIcon('EmployeeId')}</th>
              <th>Actions</th>
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
                      <button className="transaction-action-btn edit" onClick={() => openEditSalaryModal(salary)}>
                        Edit
                      </button>
                      <button
                        className="transaction-action-btn delete"
                        onClick={() => {
                          setSelectedId({ id: salary.id, type: 'salary' })
                          setShowConfirm(true)
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">
                  <EmptyState
                    title="No salaries found"
                    message="No salary records match your current filters."
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
        <h3>Import Financial Data</h3>
        <p>Upload CSV or Excel files to insert invoices, expenses or salaries.</p>
      </div>
      <span className="import-badge">CSV / Excel</span>
    </div>

    <div className="import-controls">
      <div className="import-field">
        <label>Dataset Type</label>
        <select
          value={importType}
          onChange={(e) => {
            setImportType(e.target.value)
            setImportRows([])
            setImportErrors([])
            setImportFileName('')
          }}
        >
          <option value="invoices">Invoices</option>
          <option value="expenses">Expenses</option>
          <option value="salaries">Salaries</option>
        </select>
      </div>

      <div className="import-field">
        <label>Upload File</label>
        <input type="file" accept=".csv,.xlsx,.xls" onChange={handleImportFile} />
      </div>

      <button className="import-btn" onClick={handleImportData}>
        Import Data
      </button>
    </div>

    <div className="import-requirements">
      <strong>Required columns:</strong>{' '}
      {requiredColumns[importType].join(', ')}
    </div>

    {importFileName && (
      <p className="import-file-name">Selected file: {importFileName}</p>
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
        <h4>Preview</h4>
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
        title: 'Total Revenue',
        value: `$${totalRevenue.toLocaleString()}`,
        subtitle: `${invoices.length} invoice records loaded`,
        source: 'Real data loaded from /api/invoices',
      }
    }

    if (activeTab === 'expenses') {
      return {
        title: 'Total Expenses',
        value: `$${totalExpenses.toLocaleString()}`,
        subtitle: `${expenses.length} expense records loaded`,
        source: 'Real data loaded from /api/expenses',
      }
    }

    if (activeTab === 'salaries') {
      return {
        title: 'Total Salaries',
        value: `$${totalSalaries.toLocaleString()}`,
        subtitle: `${salaries.length} salary records loaded`,
        source: 'Real data loaded from /api/salaries',
      }
    }

    return {
      title: 'Import Workspace',
      value: importRows.length ? `${importRows.length} rows` : 'Ready',
      subtitle: importFileName || 'Upload CSV or Excel data for invoices, expenses or salaries',
      source: 'Local preview with backend insert after validation',
    }
  }

  const kpi = getMainKpi()
  const transactionSubtitle =
  activeTab === 'revenues'
    ? 'Manage invoice-based revenue records'
    : activeTab === 'expenses'
    ? 'Manage operational expense records'
    : activeTab === 'salaries'
    ? 'Manage employee salary records'
    : 'Import and prepare financial data'

  return (
    <div className="transactions-page">
      <PageHeader
  title="Financial Transactions"
  subtitle={transactionSubtitle}
/>
      <div className="transactions-top">
        <div className="tabs">
          <button
            className={activeTab === 'revenues' ? 'tab active' : 'tab'}
            onClick={() => handleTabChange('revenues')}
          >
            Revenues
          </button>

          <button
            className={activeTab === 'expenses' ? 'tab active' : 'tab'}
            onClick={() => handleTabChange('expenses')}
          >
            Expenses
          </button>

          <button
            className={activeTab === 'salaries' ? 'tab active' : 'tab'}
            onClick={() => handleTabChange('salaries')}
          >
            Salaries
          </button>

          <button
            className={activeTab === 'import' ? 'tab active' : 'tab'}
            onClick={() => handleTabChange('import')}
          >
            Import Data
          </button>
        </div>

        {activeTab !== 'import' && (
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
            + Add New {activeTab === 'revenues'
              ? 'Invoice'
              : activeTab === 'expenses'
              ? 'Expense'
              : 'Salary'}
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
          <p>Sync Status</p>
          <h3>Connected</h3>
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
          <h3>Records Loaded</h3>
          <p>
            Revenues: {invoices.length} | Expenses: {expenses.length} | Salaries: {salaries.length}
          </p>
        </div>

        <div className="market">
          <h3>Backend Sources</h3>
          <p>/api/invoices, /api/expenses and /api/salaries connected successfully</p>
        </div>
      </div>

      {showInvoiceModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add Invoice</h3>

            <input
              placeholder="Reference"
              value={newInvoice.reference}
              onChange={(e) => setNewInvoice({ ...newInvoice, reference: e.target.value })}
            />

            <input
              type="number"
              placeholder="Amount"
              value={newInvoice.amount}
              onChange={(e) => setNewInvoice({ ...newInvoice, amount: e.target.value })}
            />

            <select
              value={newInvoice.status}
              onChange={(e) => setNewInvoice({ ...newInvoice, status: e.target.value })}
            >
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Cancelled">Cancelled</option>
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
              <option value="">Select Client</option>
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
              <option value="">Select Project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>

            <div className="modal-actions">
              <button onClick={handleCreateInvoice}>Create</button>
              <button onClick={() => setShowInvoiceModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showSalaryModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add Salary</h3>

            <select
              value={newSalary.month}
              onChange={(e) => setNewSalary({ ...newSalary, month: e.target.value })}
            >
              <option value="">Select Month</option>
              {[
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December',
              ].map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Year"
              value={newSalary.year}
              onChange={(e) => setNewSalary({ ...newSalary, year: e.target.value })}
            />

            <input
              type="number"
              placeholder="Amount Paid"
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
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.first_name} {emp.last_name}
                </option>
              ))}
            </select>

            <div className="modal-actions">
              <button onClick={handleCreateSalary}>Create</button>
              <button onClick={() => setShowSalaryModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showExpenseModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add New Expense</h3>

            <input
              type="number"
              placeholder="Amount"
              value={newExpense.amount}
              onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
            />

            <input
              type="date"
              value={newExpense.date}
              onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
            />

            <input
              placeholder="Description"
              value={newExpense.description}
              onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
            />

            <input
              placeholder="Reference"
              value={newExpense.reference}
              onChange={(e) => setNewExpense({ ...newExpense, reference: e.target.value })}
            />

            <select
              value={newExpense.ProjectId}
              onChange={(e) => setNewExpense({ ...newExpense, ProjectId: e.target.value })}
            >
              <option value="">Select Project</option>
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
              <option value="">Select Category</option>
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
              <option value="">Select Supplier (optional)</option>
              {fournisseurs.map((fournisseur) => (
                <option key={fournisseur.id} value={fournisseur.id}>
                  {fournisseur.name}
                </option>
              ))}
            </select>

            <div className="modal-actions">
              <button onClick={handleCreateExpense}>Create</button>
              <button onClick={() => setShowExpenseModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {editingExpense && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Expense</h3>

            <input
              type="number"
              placeholder="Amount"
              value={editExpenseData.amount}
              onChange={(e) => setEditExpenseData({ ...editExpenseData, amount: e.target.value })}
            />

            <input
              type="date"
              value={editExpenseData.date}
              onChange={(e) => setEditExpenseData({ ...editExpenseData, date: e.target.value })}
            />

            <input
              placeholder="Description"
              value={editExpenseData.description}
              onChange={(e) => setEditExpenseData({ ...editExpenseData, description: e.target.value })}
            />

            <input
              placeholder="Reference"
              value={editExpenseData.reference}
              onChange={(e) => setEditExpenseData({ ...editExpenseData, reference: e.target.value })}
            />

            <select
              value={editExpenseData.ProjectId}
              onChange={(e) => setEditExpenseData({ ...editExpenseData, ProjectId: e.target.value })}
            >
              <option value="">Select Project</option>
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
              <option value="">Select Category</option>
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
              <option value="">Select Supplier (optional)</option>
              {fournisseurs.map((fournisseur) => (
                <option key={fournisseur.id} value={fournisseur.id}>
                  {fournisseur.name}
                </option>
              ))}
            </select>

            <div className="modal-actions">
              <button onClick={handleUpdateExpense}>Save</button>
              <button onClick={() => setEditingExpense(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

{editingInvoice && (
  <div className="modal-overlay">
    <div className="modal">
      <h3>Edit Invoice</h3>

      <input
        placeholder="Reference"
        value={editInvoiceData.reference}
        onChange={(e) => setEditInvoiceData({ ...editInvoiceData, reference: e.target.value })}
      />

      <input
        type="number"
        placeholder="Amount"
        value={editInvoiceData.amount}
        onChange={(e) => setEditInvoiceData({ ...editInvoiceData, amount: e.target.value })}
      />

      <select
        value={editInvoiceData.status}
        onChange={(e) => setEditInvoiceData({ ...editInvoiceData, status: e.target.value })}
      >
        <option value="Pending">Pending</option>
        <option value="Paid">Paid</option>
        <option value="Cancelled">Cancelled</option>
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
        <option value="">Select Client</option>
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
        <option value="">Select Project</option>
        {projects.map((project) => (
          <option key={project.id} value={project.id}>
            {project.name}
          </option>
        ))}
      </select>

      <div className="modal-actions">
        <button onClick={handleUpdateInvoice}>Save</button>
        <button onClick={() => setEditingInvoice(null)}>Cancel</button>
      </div>
    </div>
  </div>
)}
      {editingSalary && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Salary</h3>

            <select
              value={editSalaryData.month}
              onChange={(e) => setEditSalaryData({ ...editSalaryData, month: e.target.value })}
            >
              <option value="">Select Month</option>
              {[
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December',
              ].map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Year"
              value={editSalaryData.year}
              onChange={(e) => setEditSalaryData({ ...editSalaryData, year: e.target.value })}
            />

            <input
              type="number"
              placeholder="Amount Paid"
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
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.first_name} {emp.last_name}
                </option>
              ))}
            </select>

            <div className="modal-actions">
              <button onClick={handleUpdateSalary}>Save</button>
              <button onClick={() => setEditingSalary(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      {showConfirm && selectedId && (
  <ConfirmModal
    title={`Delete ${selectedId.type.charAt(0).toUpperCase() + selectedId.type.slice(1)}`}
    message={`Are you sure you want to delete this ${selectedId.type}? This action cannot be undone.`}
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