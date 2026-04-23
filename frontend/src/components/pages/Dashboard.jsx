import { useEffect, useMemo, useState } from 'react'
import API_BASE_URL from '../../services/api'
import './Dashboard.css'
import PageHeader from '../common/PageHeader'

function Dashboard() {
  const [clients, setClients] = useState([])
  const [projects, setProjects] = useState([])
  const [invoices, setInvoices] = useState([])
  const [expenses, setExpenses] = useState([])
  const [salaries, setSalaries] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [
          clientsRes,
          projectsRes,
          invoicesRes,
          expensesRes,
          salariesRes,
        ] = await Promise.all([
          fetch(`${API_BASE_URL}/clients`),
          fetch(`${API_BASE_URL}/projects`),
          fetch(`${API_BASE_URL}/invoices`),
          fetch(`${API_BASE_URL}/expenses`),
          fetch(`${API_BASE_URL}/salaries`),
        ])

        const clientsData = await clientsRes.json()
        const projectsData = await projectsRes.json()
        const invoicesData = await invoicesRes.json()
        const expensesData = await expensesRes.json()
        const salariesData = await salariesRes.json()

        if (
          !clientsRes.ok ||
          !projectsRes.ok ||
          !invoicesRes.ok ||
          !expensesRes.ok ||
          !salariesRes.ok
        ) {
          throw new Error('Failed to load dashboard data')
        }

        setClients(clientsData.data || [])
        setProjects(projectsData.data || [])
        setInvoices(invoicesData.data || [])
        setExpenses(expensesData.data || [])
        setSalaries(Array.isArray(salariesData) ? salariesData : [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const totalRevenue = useMemo(
    () => invoices.reduce((sum, item) => sum + Number(item.amount || 0), 0),
    [invoices]
  )

  const totalExpenses = useMemo(
    () => expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0),
    [expenses]
  )

  const totalSalaries = useMemo(
    () => salaries.reduce((sum, item) => sum + Number(item.amount_paid || 0), 0),
    [salaries]
  )

  const netProfit = totalRevenue - totalExpenses - totalSalaries

  const profitMargin =
    totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : '0.0'

  const topProjects = useMemo(() => {
    return [...projects]
      .sort((a, b) => Number(b.total_value || 0) - Number(a.total_value || 0))
      .slice(0, 4)
  }, [projects])

  const expenseByCategory = useMemo(() => {
    const grouped = {}

    expenses.forEach((expense) => {
      const key = expense.Category?.name || 'Uncategorized'
      grouped[key] = (grouped[key] || 0) + Number(expense.amount || 0)
    })

    return Object.entries(grouped)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 4)
  }, [expenses])

  const recentInvoices = useMemo(() => {
    return [...invoices]
      .sort((a, b) => new Date(b.issue_date || 0) - new Date(a.issue_date || 0))
      .slice(0, 3)
  }, [invoices])

  const currentDate = new Date().toLocaleDateString()

  if (loading) {
    return (
      <div className="dashboard-page">
      <PageHeader
  title="Executive Dashboard"
  subtitle={`Operational overview as of ${currentDate}`}
/>
      </div>
    )
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-heading">
          <h2>Executive Dashboard</h2>
          <p style={{ color: 'red' }}>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-heading">
        <h2>Executive Dashboard</h2>
        <p>Operational overview as of {currentDate}</p>
      </div>

      <section className="quick-actions">
        <button className="primary-action">
          <span className="material-symbols-outlined">upload_file</span>
          Import Data
        </button>

        <button className="secondary-action">
          <span className="material-symbols-outlined">storage</span>
          Manage Master Data
        </button>

        <button className="secondary-action">
          <span className="material-symbols-outlined">analytics</span>
          Open Power BI
        </button>
      </section>

      <section className="kpi-grid">
        <div className="kpi-card highlighted">
          <p>Total Revenue</p>
          <h3>${totalRevenue.toLocaleString()}</h3>
          <span className="positive">{invoices.length} invoice records</span>
        </div>

        <div className="kpi-card">
          <p>Total Expenses</p>
          <h3>${totalExpenses.toLocaleString()}</h3>
          <span className="negative">{expenses.length} expense records</span>
        </div>

        <div className="kpi-card highlighted">
          <p>Total Salaries</p>
          <h3>${totalSalaries.toLocaleString()}</h3>
          <span className="positive">{salaries.length} salary records</span>
        </div>

        <div className="kpi-card">
          <p>Net Result</p>
          <h3>${netProfit.toLocaleString()}</h3>
          <div className="mini-progress">
            <div
              className="mini-progress-fill"
              style={{ width: `${Math.min(Math.max(Number(profitMargin), 0), 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="kpi-card dark-card">
          <p>Profit Margin</p>
          <h3>{profitMargin}%</h3>
          <span>{clients.length} clients • {projects.length} projects</span>
        </div>
      </section>

      <section className="analytics-row">
        <div className="chart-card">
          <div className="section-header">
            <div>
              <h4>Operational Snapshot</h4>
              <p>Current core totals from backend data</p>
            </div>
          </div>

          <div className="dashboard-stats-grid">
            <div className="dashboard-stat-box">
              <span>Clients</span>
              <strong>{clients.length}</strong>
            </div>

            <div className="dashboard-stat-box">
              <span>Projects</span>
              <strong>{projects.length}</strong>
            </div>

            <div className="dashboard-stat-box">
              <span>Invoices</span>
              <strong>{invoices.length}</strong>
            </div>

            <div className="dashboard-stat-box">
              <span>Expenses</span>
              <strong>{expenses.length}</strong>
            </div>

            <div className="dashboard-stat-box">
              <span>Salaries</span>
              <strong>{salaries.length}</strong>
            </div>

            <div className="dashboard-stat-box">
              <span>Power BI Role</span>
              <strong>Analytics</strong>
            </div>
          </div>
        </div>

        <div className="alerts-card">
          <div className="alerts-title">
            <span className="material-symbols-outlined alert-icon">notifications_active</span>
            <h4>System Highlights</h4>
          </div>

          <div className="alerts-list">
            <div className="alert-item">
              <div>
                <strong>{clients.length} registered clients</strong>
                <p>All client records loaded from backend.</p>
              </div>
            </div>

            <div className="alert-item">
              <div>
                <strong>{projects.length} active project records</strong>
                <p>Project portfolio available for operational tracking.</p>
              </div>
            </div>

            <div className={`alert-item ${netProfit < 0 ? 'danger' : ''}`}>
              <div>
                <strong>Net result: ${netProfit.toLocaleString()}</strong>
                <p>Calculated from revenue - expenses - salaries.</p>
              </div>
            </div>
          </div>

          <button className="link-button">View Detailed BI Reports</button>
        </div>
      </section>

      <section className="secondary-row">
        <div className="profit-card">
          <h4>Top Projects by Value</h4>

          {topProjects.length > 0 ? (
            topProjects.map((item) => {
              const maxValue = topProjects[0]?.total_value || 1
              const width = `${(Number(item.total_value || 0) / Number(maxValue)) * 100}%`

              return (
                <div className="profit-item" key={item.id}>
                  <div className="profit-header">
                    <span>{item.name}</span>
                    <span>${Number(item.total_value || 0).toLocaleString()}</span>
                  </div>
                  <div className="profit-bar">
                    <div className="profit-bar-fill" style={{ width }}></div>
                  </div>
                </div>
              )
            })
          ) : (
            <p>No projects available.</p>
          )}
        </div>

        <div className="simulation-card">
          <div className="simulation-overlay">
            <h4>Power BI Ready</h4>
            <p>
              The desktop application now uses real backend KPIs for quick overview,
              while advanced analytics and visual reporting will remain centralized in Power BI.
            </p>
            <div className="simulation-actions">
              <button>Open Power BI Workspace</button>
              <span>Backend connected successfully</span>
            </div>
          </div>
        </div>
      </section>

      <section className="shortcuts-section">
        <h4>Expense by Category</h4>

        <div className="shortcuts-grid">
          {expenseByCategory.length > 0 ? (
            expenseByCategory.map((item) => (
              <div className="shortcut-card" key={item.name}>
                <div className="shortcut-icon green">
                  <span className="material-symbols-outlined">category</span>
                </div>
                <h5>{item.name}</h5>
                <p>${Number(item.amount || 0).toLocaleString()}</p>
              </div>
            ))
          ) : (
            <div className="shortcut-card">
              <div className="shortcut-icon gray">
                <span className="material-symbols-outlined">info</span>
              </div>
              <h5>No category data</h5>
              <p>Add expense records to see breakdown.</p>
            </div>
          )}
        </div>
      </section>

      <section className="shortcuts-section">
        <h4>Recent Invoices</h4>

        <div className="shortcuts-grid">
          {recentInvoices.length > 0 ? (
            recentInvoices.map((invoice) => (
              <div className="shortcut-card" key={invoice.id}>
                <div className="shortcut-icon navy">
                  <span className="material-symbols-outlined">receipt_long</span>
                </div>
                <h5>{invoice.reference || `Invoice #${invoice.id}`}</h5>
                <p>
                  {invoice.Client?.name || 'No client'} • ${Number(invoice.amount || 0).toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <div className="shortcut-card">
              <div className="shortcut-icon gray">
                <span className="material-symbols-outlined">info</span>
              </div>
              <h5>No invoices found</h5>
              <p>Create invoices to populate this section.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Dashboard