import { useEffect, useMemo, useState } from 'react'
import API_BASE_URL from '../../services/api'
import './FinancialAnalysis.css'
import PageHeader from '../common/PageHeader'
import * as XLSX from 'xlsx'

function FinancialAnalysis() {
  const [invoices, setInvoices] = useState([])
  const [expenses, setExpenses] = useState([])
  const [salaries, setSalaries] = useState([])
  const [projects, setProjects] = useState([])
  const [importType, setImportType] = useState('invoices')
const [importRows, setImportRows] = useState([])
const [importFileName, setImportFileName] = useState('')
const [importErrors, setImportErrors] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [inv, exp, sal, proj] = await Promise.all([
          fetch(`${API_BASE_URL}/invoices`),
          fetch(`${API_BASE_URL}/expenses`),
          fetch(`${API_BASE_URL}/salaries`),
          fetch(`${API_BASE_URL}/projects`),
        ])

        const invData = await inv.json()
        const expData = await exp.json()
        const salData = await sal.json()
        const projData = await proj.json()

        if (!inv.ok || !exp.ok || !sal.ok || !proj.ok) {
          throw new Error('Failed to load financial analysis data')
        }

        setInvoices(invData.data || [])
        setExpenses(expData.data || [])
        setSalaries(Array.isArray(salData) ? salData : [])
        setProjects(projData.data || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const totalRevenue = useMemo(
    () => invoices.reduce((sum, i) => sum + Number(i.amount || 0), 0),
    [invoices]
  )

  const totalExpenses = useMemo(
    () => expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0),
    [expenses]
  )

  const totalSalaries = useMemo(
    () => salaries.reduce((sum, s) => sum + Number(s.amount_paid || 0), 0),
    [salaries]
  )

  const netProfit = totalRevenue - totalExpenses - totalSalaries

  const margin = totalRevenue > 0
    ? ((netProfit / totalRevenue) * 100).toFixed(1)
    : '0.0'

  const burnRate = ((totalExpenses + totalSalaries) / 12).toFixed(0)

  const paidInvoices = invoices.filter((i) => i.status === 'Paid').length
  const pendingInvoices = invoices.filter((i) => i.status === 'Pending').length
  const cancelledInvoices = invoices.filter((i) => i.status === 'Cancelled').length

  const categoryBreakdown = useMemo(() => {
    return Object.entries(
      expenses.reduce((acc, exp) => {
        const key = exp.Category?.name || 'Other'
        acc[key] = (acc[key] || 0) + Number(exp.amount || 0)
        return acc
      }, {})
    )
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
  }, [expenses])

  const topProjects = useMemo(() => {
    return [...projects]
      .sort((a, b) => Number(b.total_value || 0) - Number(a.total_value || 0))
      .slice(0, 5)
  }, [projects])

  const currentDate = new Date().toLocaleDateString()

  if (loading) {
    return (
      <div className="fa-page">
        <PageHeader
  title="Financial Analysis"
  subtitle={`Operational analysis generated on ${currentDate}`}
/>
      </div>
    )
  }

  if (error) {
    return (
      <div className="fa-page">
       <PageHeader
  title="Financial Analysis"
  subtitle="Loading financial insights..."
/>
      </div>
    )
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

    if (importType === 'invoices') {
      setInvoices((prev) => [...createdItems.reverse(), ...prev])
    } else if (importType === 'expenses') {
      setExpenses((prev) => [...createdItems.reverse(), ...prev])
    } else {
      setSalaries((prev) => [...createdItems.reverse(), ...prev])
    }

    setImportRows([])
    setImportFileName('')
    setImportErrors([])
    showToastMessage('Data imported successfully')
  } catch (err) {
    showToastMessage(err.message, 'error')
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

  return (
    <div className="fa-page">
      <PageHeader
  title="Financial Analysis"
  subtitle={error}
/>

      <section className="fa-kpis">
        <div className="fa-kpi-card">
          <p>Return on Investment</p>
          <h3>{margin}%</h3>
          <span className={netProfit >= 0 ? 'positive' : 'negative'}>
            {netProfit >= 0 ? 'Profitable position' : 'Negative position'}
          </span>
          <div className="progress">
            <div
              className="fill green"
              style={{ width: `${Math.min(Math.max(Number(margin), 0), 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="fa-kpi-card">
          <p>Operating Margin</p>
          <h3>{margin}%</h3>
          <span className="neutral">Revenue vs cost performance</span>
          <div className="mini-bars">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div className="active"></div>
          </div>
        </div>

        <div className="fa-kpi-card">
          <p>Burn Rate / Mo</p>
          <h3>${Number(burnRate).toLocaleString()}</h3>
          <span className="negative">Expenses + salaries monthly average</span>
          <div className="progress">
            <div className="fill red" style={{ width: '80%' }}></div>
          </div>
        </div>
      </section>

      <section className="fa-variance">
        <div className="fa-section-top">
          <div>
            <span className="tag">Expense Breakdown</span>
            <h4>Category Spend Analysis</h4>
          </div>
          <button className="export-btn">Live Data</button>
        </div>

        <div className="variance-list">
          {categoryBreakdown.length > 0 ? (
            categoryBreakdown.slice(0, 6).map((item) => (
              <div className="variance-row" key={item.name}>
                <span>{item.name}</span>
                <div className="variance-bars">
                  <div className="budget" style={{ width: '100%' }}></div>
                  <div
                    className="actual"
                    style={{
                      width: `${Math.min((item.value / Math.max(categoryBreakdown[0].value, 1)) * 100, 100)}%`,
                    }}
                  ></div>
                </div>
                <span className="neutral">${item.value.toLocaleString()}</span>
              </div>
            ))
          ) : (
            <p>No expense category data available.</p>
          )}
        </div>
      </section>

      <div className="fa-mid-grid">
        <section className="trend-card">
          <div className="fa-section-top simple">
            <div>
              <h4>Invoice Status Overview</h4>
              <p>Distribution of current invoice states</p>
            </div>
          </div>

          <div className="trend-bars">
            <div className="trend-col">
              <div className="bar fa-bar-paid"></div>
              <span>Paid ({paidInvoices})</span>
            </div>
            <div className="trend-col">
              <div className="bar fa-bar-pending"></div>
              <span>Pending ({pendingInvoices})</span>
            </div>
            <div className="trend-col">
              <div className="bar fa-bar-cancelled"></div>
              <span>Cancelled ({cancelledInvoices})</span>
            </div>
          </div>
        </section>

        <section className="forecast-card-analysis">
          <span className="tag light">Real-Time Summary</span>
          <h4>Net Financial Position</h4>
          <p>
            Total revenue currently stands at ${totalRevenue.toLocaleString()}, while total
            expenses and salaries amount to ${(totalExpenses + totalSalaries).toLocaleString()}.
          </p>

          <div className="forecast-stats-box">
            <div>
              <span>Total Revenue</span>
              <strong>${totalRevenue.toLocaleString()}</strong>
            </div>
            <div>
              <span>Net Result</span>
              <strong>${netProfit.toLocaleString()}</strong>
            </div>
          </div>

          <button className="white-btn">Open Power BI for Deep Analysis</button>
        </section>
      </div>

      <section className="fa-table-card">
        <div className="fa-section-top simple">
          <h4>Top Projects by Value</h4>
          <button className="text-link">Using backend data</button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Project</th>
              <th>Client</th>
              <th>Total Value</th>
              <th>Displayed Value</th>
              <th>Trend</th>
            </tr>
          </thead>
          <tbody>
            {topProjects.length > 0 ? (
              topProjects.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.Client?.name || '-'}</td>
                  <td>${Number(p.total_value || 0).toLocaleString()}</td>
                  <td>${Number(p.total_value || 0).toLocaleString()}</td>
                  <td>▲</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No project data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  )
}

export default FinancialAnalysis