import { useEffect, useMemo, useState } from 'react'
import API_BASE_URL from '../../services/api'
import './FinancialAnalysis.css'
import PageHeader from '../common/PageHeader'
import { readOptionalData } from '../../services/authFetch'
import { getCurrentUserRole } from '../../services/auth'
import { canAccessResource } from '../../services/permissions'

const translations = {
  English: {
    pageTitle: 'Financial Analysis',
    generatedOn: 'Operational analysis generated on',
    loadingInsights: 'Loading financial insights...',
    failedLoad: 'Failed to load financial analysis data',

    roi: 'Return on Investment',
    profitable: 'Profitable position',
    negative: 'Negative position',

    operatingMargin: 'Operating Margin',
    revenueVsCost: 'Revenue vs cost performance',

    burnRate: 'Burn Rate / Mo',
    monthlyAverage: 'Expenses + salaries monthly average',

    expenseBreakdown: 'Expense Breakdown',
    categorySpend: 'Category Spend Analysis',
    liveData: 'Live Data',

    noExpenseData: 'No expense category data available.',

    invoiceOverview: 'Invoice Status Overview',
    invoiceDistribution: 'Distribution of current invoice states',

    paid: 'Paid',
    pending: 'Pending',
    cancelled: 'Cancelled',

    realtimeSummary: 'Real-Time Summary',
    netFinancial: 'Net Financial Position',

    netText1: 'Total revenue currently stands at',
    netText2: 'while total expenses and salaries amount to',

    totalRevenue: 'Total Revenue',
    netResult: 'Net Result',

    openPowerBI: 'Open Power BI for Deep Analysis',

    topProjects: 'Top Projects by Value',
    backendData: 'Using backend data',

    project: 'Project',
    client: 'Client',
    totalValue: 'Total Value',
    displayedValue: 'Displayed Value',
    trend: 'Trend',

    noProjects: 'No project data available',
    restrictedByRole: 'Restricted by role',
    restrictedFinancialData: 'Detailed accounting data is hidden for your current role.',
  },

  French: {
    pageTitle: 'Analyse financière',
    generatedOn: 'Analyse opérationnelle générée le',
    loadingInsights: 'Chargement des analyses financières...',
    failedLoad: 'Impossible de charger les données financières',

    roi: 'Retour sur investissement',
    profitable: 'Position rentable',
    negative: 'Position négative',

    operatingMargin: 'Marge opérationnelle',
    revenueVsCost: 'Performance revenus vs coûts',

    burnRate: 'Taux de consommation / Mois',
    monthlyAverage: 'Moyenne mensuelle dépenses + salaires',

    expenseBreakdown: 'Répartition des dépenses',
    categorySpend: 'Analyse des dépenses par catégorie',
    liveData: 'Données en direct',

    noExpenseData: 'Aucune donnée de catégorie disponible.',

    invoiceOverview: 'Vue des statuts des factures',
    invoiceDistribution: 'Distribution des états actuels des factures',

    paid: 'Payées',
    pending: 'En attente',
    cancelled: 'Annulées',

    realtimeSummary: 'Résumé temps réel',
    netFinancial: 'Position financière nette',

    netText1: 'Le revenu total actuel est de',
    netText2: 'tandis que les dépenses et salaires atteignent',

    totalRevenue: 'Revenus totaux',
    netResult: 'Résultat net',

    openPowerBI: 'Ouvrir Power BI pour analyse avancée',

    topProjects: 'Top projets par valeur',
    backendData: 'Utilisation des données backend',

    project: 'Projet',
    client: 'Client',
    totalValue: 'Valeur totale',
    displayedValue: 'Valeur affichée',
    trend: 'Tendance',

    noProjects: 'Aucune donnée projet disponible',
    restrictedByRole: 'Restreint par rôle',
    restrictedFinancialData: 'Les données comptables détaillées sont masquées pour votre rôle.',
  },
}

function FinancialAnalysis() {
  const language = localStorage.getItem('language') || 'English'
  const t = translations[language] || translations.English
  const role = getCurrentUserRole()
  const canViewInvoices = canAccessResource('invoices', role)
  const canViewExpenses = canAccessResource('expenses', role)
  const canViewSalaries = canAccessResource('salaries', role)
  const canViewProjects = canAccessResource('projects', role)

  const [invoices, setInvoices] = useState([])
  const [expenses, setExpenses] = useState([])
  const [salaries, setSalaries] = useState([])
  const [projects, setProjects] = useState([])
  const [summary, setSummary] = useState(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const summaryData = await readOptionalData(`${API_BASE_URL}/dashboard/summary`, null)
        setSummary(summaryData)

        const [invData, expData, salData, projData] = await Promise.all([
          canViewInvoices ? readOptionalData(`${API_BASE_URL}/invoices`) : Promise.resolve([]),
          canViewExpenses && !summaryData ? readOptionalData(`${API_BASE_URL}/expenses`) : Promise.resolve([]),
          canViewSalaries && !summaryData ? readOptionalData(`${API_BASE_URL}/salaries`) : Promise.resolve([]),
          canViewProjects ? readOptionalData(`${API_BASE_URL}/projects`) : Promise.resolve([]),
        ])

        setInvoices(invData)
        setExpenses(expData)
        setSalaries(salData)
        setProjects(projData)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [canViewInvoices, canViewExpenses, canViewSalaries, canViewProjects])

  const summaryTotals = summary?.totals || {}
  const summaryInvoiceStatus = summary?.invoiceStatus || {}

  const totalRevenue = summaryTotals.revenue ?? invoices.reduce((sum, i) => sum + Number(i.amount || 0), 0)
  const totalExpenses = summaryTotals.expenses ?? expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0)
  const totalSalaries = summaryTotals.salaries ?? salaries.reduce((sum, s) => sum + Number(s.amount_paid || 0), 0)
  const netProfit = summaryTotals.netProfit ?? totalRevenue - totalExpenses - totalSalaries
  const margin =
    summaryTotals.profitMargin != null
      ? Number(summaryTotals.profitMargin).toFixed(1)
      : totalRevenue > 0
      ? ((netProfit / totalRevenue) * 100).toFixed(1)
      : '0.0'

  const burnRate = (
    (totalExpenses + totalSalaries) /
    12
  ).toFixed(0)

  const paidInvoices = summaryInvoiceStatus.Paid ?? invoices.filter((i) => i.status === 'Paid').length
  const pendingInvoices = summaryInvoiceStatus.Pending ?? invoices.filter((i) => i.status === 'Pending').length
  const cancelledInvoices = summaryInvoiceStatus.Cancelled ?? invoices.filter((i) => i.status === 'Cancelled').length

  const categoryBreakdown = useMemo(() => {
    if (summary?.expenseByCategory) return summary.expenseByCategory.map((item) => ({
      name: item.name,
      value: Number(item.value ?? item.amount ?? 0),
    }))

    return Object.entries(
      expenses.reduce((acc, exp) => {
        const key = exp.Category?.name || 'Other'
        acc[key] = (acc[key] || 0) + Number(exp.amount || 0)
        return acc
      }, {})
    )
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
  }, [expenses, summary])

  const topProjects = useMemo(() => {
    if (summary?.topProjects) return summary.topProjects

    return [...projects]
      .sort((a, b) => Number(b.total_value || 0) - Number(a.total_value || 0))
      .slice(0, 5)
  }, [projects, summary])

  const currentDate = new Date().toLocaleDateString()

  if (loading) {
    return (
      <div className="fa-page">
        <PageHeader
          title={t.pageTitle}
          subtitle={`${t.generatedOn} ${currentDate}`}
        />
      </div>
    )
  }

  if (error) {
    return (
      <div className="fa-page">
        <PageHeader
          title={t.pageTitle}
          subtitle={t.loadingInsights}
        />
      </div>
    )
  }

  return (
    <div className="fa-page">
      <PageHeader
        title={t.pageTitle}
        subtitle={error}
      />

      <section className="fa-kpis">
        <div className="fa-kpi-card">
          <p>{t.roi}</p>
          <h3>{margin}%</h3>
          <span className={netProfit >= 0 ? 'positive' : 'negative'}>
            {netProfit >= 0 ? t.profitable : t.negative}
          </span>

          <div className="progress">
            <div
              className="fill green"
              style={{
                width: `${Math.min(Math.max(Number(margin), 0), 100)}%`,
              }}
            ></div>
          </div>
        </div>

        <div className="fa-kpi-card">
          <p>{t.operatingMargin}</p>
          <h3>{margin}%</h3>
          <span className="neutral">{t.revenueVsCost}</span>

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
          <p>{t.burnRate}</p>
          <h3>${Number(burnRate).toLocaleString()}</h3>
          <span className="negative">{t.monthlyAverage}</span>

          <div className="progress">
            <div className="fill red" style={{ width: '80%' }}></div>
          </div>
        </div>
      </section>

      <section className="fa-variance">
        <div className="fa-section-top">
          <div>
            <span className="tag">{t.expenseBreakdown}</span>
            <h4>{t.categorySpend}</h4>
          </div>

          <button className="export-btn">{t.liveData}</button>
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
                      width: `${Math.min(
                        (item.value /
                          Math.max(categoryBreakdown[0].value, 1)) *
                          100,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>

                <span className="neutral">
                  ${item.value.toLocaleString()}
                </span>
              </div>
            ))
          ) : (
            <p>{t.noExpenseData}</p>
          )}
        </div>
      </section>

      <div className="fa-mid-grid">
        <section className="trend-card">
          <div className="fa-section-top simple">
            <div>
              <h4>{t.invoiceOverview}</h4>
              <p>{t.invoiceDistribution}</p>
            </div>
          </div>

          <div className="trend-bars">
            <div className="trend-col">
              <div className="bar fa-bar-paid"></div>
              <span>{t.paid} ({paidInvoices})</span>
            </div>

            <div className="trend-col">
              <div className="bar fa-bar-pending"></div>
              <span>{t.pending} ({pendingInvoices})</span>
            </div>

            <div className="trend-col">
              <div className="bar fa-bar-cancelled"></div>
              <span>{t.cancelled} ({cancelledInvoices})</span>
            </div>
          </div>
        </section>

        <section className="forecast-card-analysis">
          <span className="tag light">{t.realtimeSummary}</span>

          <h4>{t.netFinancial}</h4>

          <p>
            {t.netText1} ${totalRevenue.toLocaleString()}, {t.netText2}{' '}
            ${(totalExpenses + totalSalaries).toLocaleString()}.
          </p>

          <div className="forecast-stats-box">
            <div>
              <span>{t.totalRevenue}</span>
              <strong>${totalRevenue.toLocaleString()}</strong>
            </div>

            <div>
              <span>{t.netResult}</span>
              <strong>${netProfit.toLocaleString()}</strong>
            </div>
          </div>

          <button className="white-btn">{t.openPowerBI}</button>
        </section>
      </div>

      <section className="fa-table-card">
        <div className="fa-section-top simple">
          <h4>{t.topProjects}</h4>
          <button className="text-link">{t.backendData}</button>
        </div>

        <table>
          <thead>
            <tr>
              <th>{t.project}</th>
              <th>{t.client}</th>
              <th>{t.totalValue}</th>
              <th>{t.displayedValue}</th>
              <th>{t.trend}</th>
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
                <td colSpan="5">{t.noProjects}</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  )
}

export default FinancialAnalysis
