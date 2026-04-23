import { useEffect, useMemo, useState } from 'react'
import API_BASE_URL from '../../services/api'
import './FinancialAnalysis.css'
import PageHeader from '../common/PageHeader'

function FinancialAnalysis() {
  const [invoices, setInvoices] = useState([])
  const [expenses, setExpenses] = useState([])
  const [salaries, setSalaries] = useState([])
  const [projects, setProjects] = useState([])

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