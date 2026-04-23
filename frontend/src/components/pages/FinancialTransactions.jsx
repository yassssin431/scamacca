import { useEffect, useState } from 'react'
import API_BASE_URL from '../../services/api'
import './FinancialTransactions.css'
import PageHeader from '../common/PageHeader'
import ConfirmModal from '../common/ConfirmModal'
import Toast from '../common/Toast'
import LoadingState from '../common/LoadingState'
import EmptyState from '../common/EmptyState'

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

      setInvoices((prev) => [...prev, result.data])
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

      setExpenses((prev) => [...prev, result.data])
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

      setSalaries((prev) => [...prev, result])
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

  const renderRevenuesTab = () => {
    if (loadingInvoices) return <LoadingState message="Loading revenue records..." />
if (errorInvoices) return <EmptyState title="Revenue loading failed" message={errorInvoices} />
    return (
      <>
        <div className="table-header">
          <span>All Invoices (Revenue Source)</span>
          <div>
            <button>Filter</button>
            <button>Export</button>
          </div>
        </div>

        <table>
  <thead>
    <tr>
      <th>Reference</th>
      <th>Client</th>
      <th>Project</th>
      <th>Status</th>
      <th>Issue Date</th>
      <th>Due Date</th>
      <th>Amount</th>
      <th>Actions</th>
    </tr>
  </thead>

  <tbody>
    {invoices.length > 0 ? (
      invoices.map((invoice) => (
        <tr key={invoice.id}>
          <td>{invoice.reference || '-'}</td>
          <td>{invoice.Client?.name || '-'}</td>
          <td>{invoice.Project?.name || '-'}</td>
          <td>{invoice.status || '-'}</td>
          <td>{invoice.issue_date ? invoice.issue_date.slice(0, 10) : '-'}</td>
          <td>{invoice.due_date ? invoice.due_date.slice(0, 10) : '-'}</td>
          <td>${Number(invoice.amount || 0).toLocaleString()}</td>
          <td>
            <button onClick={() => openEditInvoiceModal(invoice)}>Edit</button>{' '}
           <button
  onClick={() => {
    setSelectedId({ id: invoice.id, type: 'invoice' })
    setShowConfirm(true)
  }}
>
  Delete
</button>
          </td>
        </tr>
      ))
    ) : (
    <tr>
  <td colSpan="8">
    <EmptyState
      title="No invoices found"
      message="Create invoice records to populate the revenue table."
    />
  </td>
</tr>
    )}
  </tbody>
</table>
      </>
    )
  }

  const renderExpensesTab = () => {
    if (loadingExpenses) return <LoadingState message="Loading expense records..." />
if (errorExpenses) return <EmptyState title="Expense loading failed" message={errorExpenses} />
    return (
      <>
        <div className="table-header">
          <span>All Expenses</span>
          <div>
            <button>Filter</button>
            <button>Export</button>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Project</th>
              <th>Category</th>
              <th>Supplier</th>
              <th>Reference</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {expenses.length > 0 ? (
              expenses.map((expense) => (
                <tr key={expense.id}>
                  <td>{expense.date ? expense.date.slice(0, 10) : '-'}</td>
                  <td>{expense.description || '-'}</td>
                  <td>{expense.Project?.name || '-'}</td>
                  <td>{expense.Category?.name || '-'}</td>
                  <td>{expense.Fournisseur?.name || '-'}</td>
                  <td>{expense.reference || '-'}</td>
                  <td>${Number(expense.amount || 0).toLocaleString()}</td>
                  <td>
                    <button onClick={() => openEditExpenseModal(expense)}>Edit</button>{' '}
                    <button
  onClick={() => {
    setSelectedId({ id: expense.id, type: 'expense' })
    setShowConfirm(true)
  }}
>
  Delete
</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
  <td colSpan="8">
    <EmptyState
      title="No expenses found"
      message="Create expense records to populate the expense table."
    />
  </td>
</tr>
            )}
          </tbody>
        </table>
      </>
    )
  }

  const renderSalariesTab = () => {
   if (loadingSalaries) return <LoadingState message="Loading salary records..." />
if (errorSalaries) return <EmptyState title="Salary loading failed" message={errorSalaries} />
    return (
      <>
        <div className="table-header">
          <span>All Salaries</span>
          <div>
            <button>Filter</button>
            <button>Export</button>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Month</th>
              <th>Year</th>
              <th>Amount Paid</th>
              <th>Payment Date</th>
              <th>Employee ID</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {salaries.length > 0 ? (
              salaries.map((salary) => (
                <tr key={salary.id}>
                  <td>{salary.month}</td>
                  <td>{salary.year}</td>
                  <td>${Number(salary.amount_paid || 0).toLocaleString()}</td>
                  <td>{salary.payment_date ? salary.payment_date.slice(0, 10) : '-'}</td>
                  <td>{salary.EmployeeId || '-'}</td>
                  <td>
                    <button onClick={() => openEditSalaryModal(salary)}>Edit</button>{' '}
                    <button
  onClick={() => {
    setSelectedId({ id: salary.id, type: 'salary' })
    setShowConfirm(true)
  }}
>
  Delete
</button>
                  </td>
                </tr>
              ))
            ) : (
             <tr>
  <td colSpan="6">
    <EmptyState
      title="No salaries found"
      message="Create salary records to populate the salary table."
    />
  </td>
</tr>
            )}
          </tbody>
        </table>
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

    return {
      title: 'Total Salaries',
      value: `$${totalSalaries.toLocaleString()}`,
      subtitle: `${salaries.length} salary records loaded`,
      source: 'Real data loaded from /api/salaries',
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
            onClick={() => setActiveTab('revenues')}
          >
            Revenues
          </button>

          <button
            className={activeTab === 'expenses' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('expenses')}
          >
            Expenses
          </button>

          <button
            className={activeTab === 'salaries' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('salaries')}
          >
            Salaries
          </button>

          <button
            className={activeTab === 'import' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('import')}
          >
            Import Data
          </button>
        </div>

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
            : activeTab === 'salaries'
            ? 'Salary'
            : 'Record'}
        </button>
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
          <div className="placeholder-block">
            <h3>Import Data</h3>
            <p>This tab will later connect to import/ETL functionality.</p>
          </div>
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