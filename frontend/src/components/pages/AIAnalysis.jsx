import { useEffect, useMemo, useState } from 'react'
import './AIAnalysis.css'
import PageHeader from '../common/PageHeader'
import API_BASE_URL from '../../services/api'
import { readOptionalData } from '../../services/authFetch'
import { getCurrentUserRole } from '../../services/auth'

const fallbackForecast = [
  { period: 'Jan', actual: 82000, linear: 83500, arima: 81200, lstm: 84600 },
  { period: 'Feb', actual: 91000, linear: 90200, arima: 92700, lstm: 93600 },
  { period: 'Mar', actual: 88000, linear: 94500, arima: 91200, lstm: 95700 },
  { period: 'Apr', actual: 102000, linear: 100800, arima: 104500, lstm: 106200 },
  { period: 'May', actual: 109000, linear: 107400, arima: 111800, lstm: 114300 },
  { period: 'Jun', actual: null, linear: 113600, arima: 116900, lstm: 121200 },
]

const fallbackAnomalies = [
  { id: 1, label: 'Supplier invoice spike', project: 'ERP Migration', category: 'External Services', amount: 18400, score: 0.94, severity: 'High' },
  { id: 2, label: 'Travel expense outlier', project: 'Field Audit', category: 'Travel', amount: 6200, score: 0.82, severity: 'Medium' },
  { id: 3, label: 'Repeated payment pattern', project: 'Operations', category: 'Maintenance', amount: 3900, score: 0.71, severity: 'Medium' },
]

const unwrap = (value, fallback = []) => {
  if (Array.isArray(value)) return value
  if (Array.isArray(value?.data)) return value.data
  if (Array.isArray(value?.forecast)) return value.forecast
  if (Array.isArray(value?.predictions)) return value.predictions
  if (Array.isArray(value?.results)) return value.results
  if (Array.isArray(value?.anomalies)) return value.anomalies
  return fallback
}

const numberValue = (value, fallback = 0) => {
  const number = Number(value)
  return Number.isFinite(number) ? number : fallback
}

const normalizeForecastRows = (linearRows, arimaRows, lstmRows) => {
  const source = linearRows.length ? linearRows : fallbackForecast

  return source.map((row, index) => {
    const arima = arimaRows[index] || {}
    const lstm = lstmRows[index] || {}

    return {
      period: row.period || row.month || row.date || `P${index + 1}`,
      actual: row.actual ?? row.revenue ?? row.real ?? null,
      linear: row.linear ?? row.forecast ?? row.predicted ?? row.value ?? fallbackForecast[index]?.linear,
      arima: arima.arima ?? arima.forecast ?? arima.predicted ?? arima.value ?? row.arima ?? fallbackForecast[index]?.arima,
      lstm: lstm.lstm ?? lstm.forecast ?? lstm.predicted ?? lstm.value ?? row.lstm ?? fallbackForecast[index]?.lstm,
    }
  })
}

const normalizeAnomalies = (rows) => {
  const source = rows.length ? rows : fallbackAnomalies

  return source.map((row, index) => ({
    id: row.id || row._id || index + 1,
    label: row.label || row.description || row.reason || `Anomaly ${index + 1}`,
    project: row.project || row.projectName || row.Project?.name || '-',
    category: row.category || row.categoryName || row.Category?.name || '-',
    amount: numberValue(row.amount || row.value || row.total, fallbackAnomalies[index]?.amount || 0),
    score: numberValue(row.score || row.anomalyScore || row.confidence, fallbackAnomalies[index]?.score || 0),
    severity: row.severity || (numberValue(row.score || row.anomalyScore) > 0.9 ? 'High' : 'Medium'),
  }))
}

const formatMoney = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(numberValue(value))
}

function LineChart({ data }) {
  const width = 760
  const height = 280
  const padding = 34
  const keys = ['actual', 'linear', 'arima', 'lstm']
  const values = data.flatMap((item) => keys.map((key) => item[key]).filter((value) => value != null)).map(Number)
  const min = Math.min(...values) * 0.94
  const max = Math.max(...values) * 1.04

  const point = (row, index, key) => {
    const x = padding + (index * (width - padding * 2)) / Math.max(data.length - 1, 1)
    const y = height - padding - ((numberValue(row[key]) - min) / Math.max(max - min, 1)) * (height - padding * 2)
    return `${x},${y}`
  }

  const polyline = (key) => data.filter((row) => row[key] != null).map((row, index) => point(row, index, key)).join(' ')

  return (
    <div className="ai-chart-shell">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Forecast versus actual chart">
        {[0, 1, 2, 3].map((tick) => (
          <line
            key={tick}
            x1={padding}
            x2={width - padding}
            y1={padding + tick * 62}
            y2={padding + tick * 62}
            className="ai-grid-line"
          />
        ))}
        <polyline points={polyline('actual')} className="line-actual" />
        <polyline points={polyline('linear')} className="line-linear" />
        <polyline points={polyline('arima')} className="line-arima" />
        <polyline points={polyline('lstm')} className="line-lstm" />
      </svg>
      <div className="ai-chart-labels">
        {data.map((row) => <span key={row.period}>{row.period}</span>)}
      </div>
    </div>
  )
}

function BarTrend({ data }) {
  const max = Math.max(...data.map((item) => item.score), 1)

  return (
    <div className="anomaly-bars">
      {data.map((item) => (
        <div key={item.id} className="anomaly-bar-row">
          <span>{item.category}</span>
          <div>
            <i style={{ width: `${(item.score / max) * 100}%` }} />
          </div>
          <strong>{Math.round(item.score * 100)}%</strong>
        </div>
      ))}
    </div>
  )
}

function SimulationBars({ revenue, expenses, salaries, profit }) {
  const max = Math.max(revenue, expenses, salaries, Math.abs(profit), 1)
  const items = [
    { label: 'Revenue', value: revenue, className: 'revenue' },
    { label: 'Expenses', value: expenses, className: 'expense' },
    { label: 'Salaries', value: salaries, className: 'salary' },
    { label: 'Profit', value: profit, className: profit >= 0 ? 'profit' : 'loss' },
  ]

  return (
    <div className="simulation-bars" aria-label="What-if simulation visualization">
      {items.map((item) => (
        <div className="simulation-bar" key={item.label}>
          <div className="simulation-bar-track">
            <i className={item.className} style={{ height: `${Math.max((Math.abs(item.value) / max) * 100, 4)}%` }} />
          </div>
          <span>{item.label}</span>
          <strong>{formatMoney(item.value)}</strong>
        </div>
      ))}
    </div>
  )
}

function AIAnalysis() {
  const role = getCurrentUserRole()
  const [loading, setLoading] = useState(true)
  const [serviceStatus, setServiceStatus] = useState('pending')
  const [forecastRows, setForecastRows] = useState(fallbackForecast)
  const [anomalies, setAnomalies] = useState(fallbackAnomalies)
  const [expenseGrowth, setExpenseGrowth] = useState(10)
  const [revenueGrowth, setRevenueGrowth] = useState(15)

  useEffect(() => {
    let mounted = true

    const loadAiData = async () => {
      setLoading(true)

      try {
        const [linear, arima, lstm, anomalyRows] = await Promise.all([
          readOptionalData(`${API_BASE_URL}/ai/forecast`, []),
          readOptionalData(`${API_BASE_URL}/ai/arima`, []),
          readOptionalData(`${API_BASE_URL}/ai/lstm`, []),
          readOptionalData(`${API_BASE_URL}/ai/anomalies`, []),
        ])

        if (!mounted) return

        const normalizedForecast = normalizeForecastRows(unwrap(linear), unwrap(arima), unwrap(lstm))
        const normalizedAnomalies = normalizeAnomalies(unwrap(anomalyRows))

        setForecastRows(normalizedForecast)
        setAnomalies(normalizedAnomalies)
        setServiceStatus(unwrap(linear).length || unwrap(arima).length || unwrap(lstm).length || unwrap(anomalyRows).length ? 'connected' : 'fallback')
      } catch {
        if (!mounted) return
        setForecastRows(fallbackForecast)
        setAnomalies(fallbackAnomalies)
        setServiceStatus('fallback')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadAiData()

    return () => {
      mounted = false
    }
  }, [])

  const latest = forecastRows[forecastRows.length - 1] || fallbackForecast.at(-1)
  const previousActual = [...forecastRows].reverse().find((row) => row.actual != null)?.actual || 0
  const averageForecast = (numberValue(latest.linear) + numberValue(latest.arima) + numberValue(latest.lstm)) / 3
  const adjustedRevenue = averageForecast * (1 + revenueGrowth / 100)
  const adjustedExpenses = previousActual * 0.58 * (1 + expenseGrowth / 100)
  const adjustedSalaries = previousActual * 0.18
  const adjustedProfit = adjustedRevenue - adjustedExpenses - adjustedSalaries

  const highAlerts = anomalies.filter((item) => item.severity.toLowerCase() === 'high')

  const modelCards = useMemo(() => [
    { label: 'Linear Regression', value: latest.linear, confidence: 'Baseline trend', icon: 'show_chart' },
    { label: 'ARIMA', value: latest.arima, confidence: 'Time-series signal', icon: 'timeline' },
    { label: 'LSTM', value: latest.lstm, confidence: 'Deep sequence model', icon: 'network_node' },
  ], [latest])

  return (
    <div className="ai-page">
      <PageHeader
        kicker="AI Decision Layer"
        title="AI Analysis & What-If Simulation"
        subtitle="Forecasting, anomaly detection, alerts and interactive decision simulation"
        right={<span className={`ai-status-pill ${serviceStatus}`}>{loading ? 'Loading AI' : serviceStatus === 'connected' ? 'AI API connected' : 'Using safe fallback'}</span>}
      />

      <section className="ai-command-center">
        <div>
          <span className="ai-eyebrow">Role-aware intelligence</span>
          <h3>Predictive cockpit for {role || 'enterprise'} decisions</h3>
          <p>
            The page reads from the Node AI API when available and keeps the interface stable with fallback analytics when the AI service is offline.
          </p>
        </div>
        <div className="ai-command-metrics">
          <div><span>Models</span><strong>3</strong></div>
          <div><span>Anomalies</span><strong>{anomalies.length}</strong></div>
          <div><span>High alerts</span><strong>{highAlerts.length}</strong></div>
        </div>
      </section>

      <section className="ai-workflow-grid">
        <div>
          <span className="material-symbols-outlined">model_training</span>
          <strong>Forecast engine</strong>
          <p>Linear, ARIMA and LSTM outputs are compared against actual revenue.</p>
        </div>
        <div>
          <span className="material-symbols-outlined">warning</span>
          <strong>Anomaly watch</strong>
          <p>Suspicious expenses are scored by project, category and severity.</p>
        </div>
        <div>
          <span className="material-symbols-outlined">notifications_active</span>
          <strong>Alert queue</strong>
          <p>High-risk findings are isolated for admin and finance follow-up.</p>
        </div>
        <div>
          <span className="material-symbols-outlined">tune</span>
          <strong>What-if control</strong>
          <p>Managers can simulate revenue and expense changes before Power BI.</p>
        </div>
      </section>

      <section className="ai-model-grid">
        {modelCards.map((card) => (
          <div className="ai-model-card" key={card.label}>
            <span className="material-symbols-outlined">{card.icon}</span>
            <p>{card.label}</p>
            <h3>{formatMoney(card.value)}</h3>
            <small>{card.confidence}</small>
          </div>
        ))}
      </section>

      <div className="ai-dashboard-grid">
        <section className="ai-panel ai-panel-wide">
          <div className="ai-section-head">
            <div>
              <span>Forecast vs actual</span>
              <h3>Revenue prediction curve</h3>
            </div>
            <div className="ai-legend">
              <i className="actual" /> Actual
              <i className="linear" /> Linear
              <i className="arima" /> ARIMA
              <i className="lstm" /> LSTM
            </div>
          </div>
          <LineChart data={forecastRows} />
        </section>

        <section className="ai-panel">
          <div className="ai-section-head compact">
            <div>
              <span>Anomaly trend</span>
              <h3>Risk score by category</h3>
            </div>
          </div>
          <BarTrend data={anomalies} />
        </section>
      </div>

      <div className="ai-dashboard-grid">
        <section className="ai-panel ai-panel-wide">
          <div className="ai-section-head">
            <div>
              <span>Anomaly detection</span>
              <h3>Suspicious expenses</h3>
            </div>
          </div>

          <div className="ai-table-wrap">
            <table className="ai-table">
              <thead>
                <tr>
                  <th>Expense signal</th>
                  <th>Project</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Score</th>
                  <th>Severity</th>
                </tr>
              </thead>
              <tbody>
                {anomalies.map((item) => (
                  <tr key={item.id}>
                    <td>{item.label}</td>
                    <td>{item.project}</td>
                    <td>{item.category}</td>
                    <td>{formatMoney(item.amount)}</td>
                    <td>{Math.round(item.score * 100)}%</td>
                    <td><span className={`severity ${item.severity.toLowerCase()}`}>{item.severity}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="ai-panel alerts-panel">
          <div className="ai-section-head compact">
            <div>
              <span>AI alerts</span>
              <h3>Notifications</h3>
            </div>
          </div>

          <div className="ai-alert-list">
            {anomalies.slice(0, 4).map((item) => (
              <div key={item.id} className={`ai-alert-item ${item.severity.toLowerCase()}`}>
                <span className="material-symbols-outlined">{item.severity === 'High' ? 'priority_high' : 'notifications'}</span>
                <div>
                  <strong>{item.label}</strong>
                  <p>{item.project} • {item.category} • score {Math.round(item.score * 100)}%</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="what-if-panel">
        <div className="what-if-copy">
          <span>Interactive AI simulation</span>
          <h3>What-if financial scenario</h3>
          <p>
            Managers can test revenue and expense growth assumptions before pushing similar sliders into Power BI parameters.
          </p>
        </div>

        <div className="what-if-controls">
          <label>
            Revenue Growth %
            <strong>{revenueGrowth}%</strong>
            <input type="range" min="-10" max="30" value={revenueGrowth} onChange={(event) => setRevenueGrowth(Number(event.target.value))} />
          </label>
          <label>
            Expense Growth %
            <strong>{expenseGrowth}%</strong>
            <input type="range" min="-20" max="20" value={expenseGrowth} onChange={(event) => setExpenseGrowth(Number(event.target.value))} />
          </label>
        </div>

        <div className="what-if-results">
          <div><span>Adjusted revenue</span><strong>{formatMoney(adjustedRevenue)}</strong></div>
          <div><span>Adjusted expenses</span><strong>{formatMoney(adjustedExpenses)}</strong></div>
          <div><span>Adjusted profit</span><strong className={adjustedProfit >= 0 ? 'positive' : 'negative'}>{formatMoney(adjustedProfit)}</strong></div>
        </div>

        <SimulationBars
          revenue={adjustedRevenue}
          expenses={adjustedExpenses}
          salaries={adjustedSalaries}
          profit={adjustedProfit}
        />
      </section>
    </div>
  )
}

export default AIAnalysis
