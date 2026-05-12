import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API_BASE_URL from '../../services/api'
import './Dashboard.css'
import PageHeader from '../common/PageHeader'
import { readOptionalData } from '../../services/authFetch'
import { getCurrentUserRole } from '../../services/auth'
import { canAccessResource } from '../../services/permissions'

const translations = {
  English: {
    title: 'Executive Dashboard',
    subtitle: 'Operational overview as of',
    loadError: 'Failed to load dashboard data',

    manageTransactions: 'Manage Transactions',
    manageMasterData: 'Manage Master Data',
    openPowerBI: 'Open Power BI',

    totalRevenue: 'Total Revenue',
    totalExpenses: 'Total Expenses',
    totalSalaries: 'Total Salaries',
    netResult: 'Net Result',
    profitMargin: 'Profit Margin',

    invoiceRecords: 'invoice records',
    expenseRecords: 'expense records',
    salaryRecords: 'salary records',
    clients: 'clients',
    projects: 'projects',

    operationalSnapshot: 'Operational Snapshot',
    snapshotSubtitle: 'Current core totals from backend data',
    clientsLabel: 'Clients',
    projectsLabel: 'Projects',
    invoicesLabel: 'Invoices',
    expensesLabel: 'Expenses',
    salariesLabel: 'Salaries',
    powerBIRole: 'Power BI Role',
    analytics: 'Analytics',

    systemHighlights: 'System Highlights',
    registeredClients: 'registered clients',
    clientsLoaded: 'All client records loaded from backend.',
    activeProjectRecords: 'active project records',
    projectsTracking: 'Project portfolio available for operational tracking.',
    calculatedFrom: 'Calculated from revenue - expenses - salaries.',
    viewBIReports: 'View Detailed BI Reports',

    topProjects: 'Top Projects by Value',
    noProjects: 'No projects available.',

    powerBIReady: 'Power BI Ready',
    powerBIText:
      'The desktop application now uses real backend KPIs for quick overview, while advanced analytics and visual reporting will remain centralized in Power BI.',
    openPowerBIWorkspace: 'Open Power BI Workspace',
    backendConnected: 'Backend connected successfully',

    expenseByCategory: 'Expense by Category',
    uncategorized: 'Uncategorized',
    noCategoryData: 'No category data',
    addExpenses: 'Add expense records to see breakdown.',

    recentInvoices: 'Recent Invoices',
    noInvoicesFound: 'No invoices found',
    createInvoices: 'Create invoices to populate this section.',
    noClient: 'No client',
    invoice: 'Invoice',
    restrictedByRole: 'Restricted by role',
    financeOnlyData: 'Finance-only data is hidden for your current role.',
    partialDataLoaded: 'Dashboard loaded with role-based access limits.',
    workspace: 'Workspace',
  },

  French: {
    title: 'Tableau de bord exécutif',
    subtitle: 'Vue opérationnelle au',
    loadError: 'Échec du chargement des données du tableau de bord',

    manageTransactions: 'Gérer les transactions',
    manageMasterData: 'Gérer les données de base',
    openPowerBI: 'Ouvrir Power BI',

    totalRevenue: 'Revenus totaux',
    totalExpenses: 'Dépenses totales',
    totalSalaries: 'Salaires totaux',
    netResult: 'Résultat net',
    profitMargin: 'Marge bénéficiaire',

    invoiceRecords: 'factures enregistrées',
    expenseRecords: 'dépenses enregistrées',
    salaryRecords: 'salaires enregistrés',
    clients: 'clients',
    projects: 'projets',

    operationalSnapshot: 'Aperçu opérationnel',
    snapshotSubtitle: 'Indicateurs principaux issus des données backend',
    clientsLabel: 'Clients',
    projectsLabel: 'Projets',
    invoicesLabel: 'Factures',
    expensesLabel: 'Dépenses',
    salariesLabel: 'Salaires',
    powerBIRole: 'Rôle Power BI',
    analytics: 'Analyse',

    systemHighlights: 'Points clés du système',
    registeredClients: 'clients enregistrés',
    clientsLoaded: 'Tous les enregistrements clients sont chargés depuis le backend.',
    activeProjectRecords: 'projets enregistrés',
    projectsTracking: 'Le portefeuille de projets est disponible pour le suivi opérationnel.',
    calculatedFrom: 'Calculé à partir des revenus - dépenses - salaires.',
    viewBIReports: 'Voir les rapports BI détaillés',

    topProjects: 'Meilleurs projets par valeur',
    noProjects: 'Aucun projet disponible.',

    powerBIReady: 'Power BI prêt',
    powerBIText:
      'L’application desktop utilise maintenant des KPI réels issus du backend pour une vue rapide, tandis que les analyses avancées restent centralisées dans Power BI.',
    openPowerBIWorkspace: 'Ouvrir l’espace Power BI',
    backendConnected: 'Backend connecté avec succès',

    expenseByCategory: 'Dépenses par catégorie',
    uncategorized: 'Non catégorisé',
    noCategoryData: 'Aucune donnée de catégorie',
    addExpenses: 'Ajoutez des dépenses pour afficher la répartition.',

    recentInvoices: 'Factures récentes',
    noInvoicesFound: 'Aucune facture trouvée',
    createInvoices: 'Créez des factures pour alimenter cette section.',
    noClient: 'Aucun client',
    invoice: 'Facture',
    restrictedByRole: 'Restreint par rôle',
    financeOnlyData: 'Les données réservées à la Finance sont masquées pour votre rôle.',
    partialDataLoaded: 'Tableau de bord chargé avec les limites d’accès par rôle.',
    workspace: 'Espace de travail',
  },
}

function Dashboard() {
  const navigate = useNavigate()
  const language = localStorage.getItem('language') || 'English'
  const t = translations[language] || translations.English
  const role = getCurrentUserRole()

  // Dashboard cards are role-aware: every dataset is requested only when the
  // current user is allowed to read it by frontend/backend RBAC.
  const canViewClients = canAccessResource('clients', role)
  const canViewProjects = canAccessResource('projects', role)
  const canViewInvoices = canAccessResource('invoices', role)
  const canViewExpenses = canAccessResource('expenses', role)
  const canViewSalaries = canAccessResource('salaries', role)
  const canOpenTransactions = canViewInvoices || canViewExpenses || canViewSalaries

  const [clients, setClients] = useState([])
  const [projects, setProjects] = useState([])
  const [invoices, setInvoices] = useState([])
  const [expenses, setExpenses] = useState([])
  const [salaries, setSalaries] = useState([])
  const [summary, setSummary] = useState(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const summaryData = await readOptionalData(`${API_BASE_URL}/dashboard/summary`, null)
        setSummary(summaryData)

        const [
          clientsData,
          projectsData,
          invoicesData,
          expensesData,
          salariesData,
        ] = await Promise.all([
          // The summary endpoint is preferred for KPIs; direct datasets are a
          // fallback for sections that still need detailed rows.
          canViewClients ? readOptionalData(`${API_BASE_URL}/clients`) : Promise.resolve([]),
          canViewProjects ? readOptionalData(`${API_BASE_URL}/projects`) : Promise.resolve([]),
          canViewInvoices ? readOptionalData(`${API_BASE_URL}/invoices`) : Promise.resolve([]),
          canViewExpenses && !summaryData ? readOptionalData(`${API_BASE_URL}/expenses`) : Promise.resolve([]),
          canViewSalaries && !summaryData ? readOptionalData(`${API_BASE_URL}/salaries`) : Promise.resolve([]),
        ])

        setClients(clientsData)
        setProjects(projectsData)
        setInvoices(invoicesData)
        setExpenses(expensesData)
        setSalaries(salariesData)
      } catch (err) {
        setError(err.message || t.loadError)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [t.loadError, canViewClients, canViewProjects, canViewInvoices, canViewExpenses, canViewSalaries])

  const summaryCounts = summary?.counts || {}
  const summaryTotals = summary?.totals || {}

  const totalRevenue = summaryTotals.revenue ?? invoices.reduce((sum, item) => sum + Number(item.amount || 0), 0)
  const totalExpenses = summaryTotals.expenses ?? expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0)
  const totalSalaries = summaryTotals.salaries ?? salaries.reduce((sum, item) => sum + Number(item.amount_paid || 0), 0)
  const netProfit = summaryTotals.netProfit ?? totalRevenue - totalExpenses - totalSalaries
  const profitMargin =
    summaryTotals.profitMargin != null
      ? Number(summaryTotals.profitMargin).toFixed(1)
      : totalRevenue > 0
      ? ((netProfit / totalRevenue) * 100).toFixed(1)
      : '0.0'

  const clientsCount = summaryCounts.clients ?? clients.length
  const projectsCount = summaryCounts.projects ?? projects.length
  const invoicesCount = summaryCounts.invoices ?? invoices.length
  const expensesCount = summaryCounts.expenses ?? expenses.length
  const salariesCount = summaryCounts.salaries ?? salaries.length

  const topProjects = useMemo(() => {
    if (summary?.topProjects) return summary.topProjects

    return [...projects]
      .sort((a, b) => Number(b.total_value || 0) - Number(a.total_value || 0))
      .slice(0, 4)
  }, [projects, summary])

  const expenseByCategory = useMemo(() => {
    if (summary?.expenseByCategory) return summary.expenseByCategory

    const grouped = {}

    expenses.forEach((expense) => {
      const key = expense.Category?.name || t.uncategorized
      grouped[key] = (grouped[key] || 0) + Number(expense.amount || 0)
    })

    return Object.entries(grouped)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 4)
  }, [expenses, summary, t.uncategorized])

  const recentInvoices = useMemo(() => {
    if (summary?.recentInvoices) return summary.recentInvoices

    return [...invoices]
      .sort((a, b) => new Date(b.issue_date || 0) - new Date(a.issue_date || 0))
      .slice(0, 3)
  }, [invoices, summary])

  const currentDate = new Date().toLocaleDateString(
    language === 'French' ? 'fr-FR' : 'en-US'
  )

  if (loading) {
    return (
      <div className="dashboard-page">
        <PageHeader title={t.title} subtitle={`${t.subtitle} ${currentDate}`} kicker={t.workspace} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <PageHeader title={t.title} subtitle={error} kicker={t.workspace} />
      </div>
    )
  }

  return (
    <div className="dashboard-page">
      <PageHeader title={t.title} subtitle={`${t.subtitle} ${currentDate}`} kicker={t.workspace} />

      <section className="quick-actions">
        {canOpenTransactions && (
          <button
            className="primary-action"
            onClick={() => navigate('/financial-transactions')}
          >
            <span className="material-symbols-outlined">receipt_long</span>
            {t.manageTransactions}
          </button>
        )}

        <button className="secondary-action" onClick={() => navigate('/master-data')}>
          <span className="material-symbols-outlined">storage</span>
          {t.manageMasterData}
        </button>

        <button className="secondary-action" onClick={() => navigate('/powerbi')}>
          <span className="material-symbols-outlined">analytics</span>
          {t.openPowerBI}
        </button>
      </section>

      <section className="kpi-grid">
        <div className="kpi-card highlighted">
          <p>{t.totalRevenue}</p>
          <h3>${totalRevenue.toLocaleString()}</h3>
          <span className="positive">{invoicesCount} {t.invoiceRecords}</span>
        </div>

        <div className="kpi-card">
          <p>{t.totalExpenses}</p>
          <h3>${totalExpenses.toLocaleString()}</h3>
          <span className="negative">{expensesCount} {t.expenseRecords}</span>
        </div>

        <div className="kpi-card highlighted">
          <p>{t.totalSalaries}</p>
          <h3>${totalSalaries.toLocaleString()}</h3>
          <span className="positive">{salariesCount} {t.salaryRecords}</span>
        </div>

        <div className="kpi-card">
          <p>{t.netResult}</p>
          <h3>${netProfit.toLocaleString()}</h3>
          <div className="mini-progress">
            <div
              className="mini-progress-fill"
              style={{
                width: `${Math.min(Math.max(Number(profitMargin), 0), 100)}%`,
              }}
            ></div>
          </div>
        </div>

        <div className="kpi-card dark-card">
          <p>{t.profitMargin}</p>
          <h3>{profitMargin}%</h3>
          <span>
            {clientsCount} {t.clients} • {projectsCount} {t.projects}
          </span>
        </div>
      </section>

      <section className="analytics-row">
        <div className="chart-card">
          <div className="section-header">
            <div>
              <h4>{t.operationalSnapshot}</h4>
              <p>{t.snapshotSubtitle}</p>
            </div>
          </div>

          <div className="dashboard-stats-grid">
            <div className="dashboard-stat-box">
              <span>{t.clientsLabel}</span>
              <strong>{clientsCount}</strong>
            </div>

            <div className="dashboard-stat-box">
              <span>{t.projectsLabel}</span>
              <strong>{projectsCount}</strong>
            </div>

            <div className="dashboard-stat-box">
              <span>{t.invoicesLabel}</span>
              <strong>{invoicesCount}</strong>
            </div>

            <div className="dashboard-stat-box">
              <span>{t.expensesLabel}</span>
              <strong>{expensesCount}</strong>
            </div>

            <div className="dashboard-stat-box">
              <span>{t.salariesLabel}</span>
              <strong>{salariesCount}</strong>
            </div>

            <div className="dashboard-stat-box">
              <span>{t.powerBIRole}</span>
              <strong>{t.analytics}</strong>
            </div>
          </div>
        </div>

        <div className="alerts-card">
          <div className="alerts-title">
            <span className="material-symbols-outlined alert-icon">
              notifications_active
            </span>
            <h4>{t.systemHighlights}</h4>
          </div>

          <div className="alerts-list">
            <div className="alert-item">
              <div>
                <strong>{clientsCount} {t.registeredClients}</strong>
                <p>{t.clientsLoaded}</p>
              </div>
            </div>

            <div className="alert-item">
              <div>
                <strong>{projectsCount} {t.activeProjectRecords}</strong>
                <p>{t.projectsTracking}</p>
              </div>
            </div>

            <div className={`alert-item ${netProfit < 0 ? 'danger' : ''}`}>
              <div>
                <strong>{t.netResult}: ${netProfit.toLocaleString()}</strong>
                <p>{t.calculatedFrom}</p>
              </div>
            </div>
          </div>

          <button className="link-button" onClick={() => navigate('/powerbi')}>
            {t.viewBIReports}
          </button>
        </div>
      </section>

      <section className="secondary-row">
        <div className="profit-card">
          <h4>{t.topProjects}</h4>

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
            <p>{t.noProjects}</p>
          )}
        </div>

        <div className="simulation-card">
          <div className="simulation-overlay">
            <h4>{t.powerBIReady}</h4>
            <p>{t.powerBIText}</p>
            <div className="simulation-actions">
              <button onClick={() => navigate('/powerbi')}>
                {t.openPowerBIWorkspace}
              </button>
              <span>{t.backendConnected}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="shortcuts-section">
        <h4>{t.expenseByCategory}</h4>

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
              <h5>{t.noCategoryData}</h5>
              <p>{t.addExpenses}</p>
            </div>
          )}
        </div>
      </section>

      <section className="shortcuts-section">
        <h4>{t.recentInvoices}</h4>

        <div className="shortcuts-grid">
          {recentInvoices.length > 0 ? (
            recentInvoices.map((invoice) => (
              <div className="shortcut-card" key={invoice.id}>
                <div className="shortcut-icon navy">
                  <span className="material-symbols-outlined">receipt_long</span>
                </div>
                <h5>{invoice.reference || `${t.invoice} #${invoice.id}`}</h5>
                <p>
                  {invoice.Client?.name || t.noClient} • $
                  {Number(invoice.amount || 0).toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <div className="shortcut-card">
              <div className="shortcut-icon gray">
                <span className="material-symbols-outlined">info</span>
              </div>
              <h5>{t.noInvoicesFound}</h5>
              <p>{t.createInvoices}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Dashboard
