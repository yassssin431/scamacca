import { useEffect, useMemo, useState } from 'react'
import API_BASE_URL from '../../services/api'
import PageHeader from '../common/PageHeader'
import LoadingState from '../common/LoadingState'
import EmptyState from '../common/EmptyState'
import Toast from '../common/Toast'
import { apiRequest, readOptionalData } from '../../services/authFetch'
import { getCurrentUserRole } from '../../services/auth'
import { canAccessResource } from '../../services/permissions'
import './CommercialCycle.css'

const translations = {
  English: {
    pageTitle: 'Commercial Cycle',
    pageSubtitle: 'Manage quotes, invoice conversion, payments and budget visibility',
    workspace: 'Commercial workspace',
    workspaceSubtitle: 'Quote-to-cash flow aligned with backend roles',
    quotes: 'Quotes',
    invoices: 'Invoices',
    payments: 'Payments',
    budgets: 'Budgets',
    createQuote: 'Create quote',
    registerPayment: 'Register payment',
    convert: 'Convert to invoice',
    converted: 'Converted',
    restricted: 'Restricted by role',
    noQuotes: 'No quotes available',
    noInvoices: 'No invoices available',
    noBudgets: 'No budgets available',
    reference: 'Reference',
    amount: 'Amount',
    status: 'Status',
    client: 'Client',
    project: 'Project',
    issueDate: 'Issue date',
    validityDate: 'Validity date',
    dueDate: 'Due date',
    paymentDate: 'Payment date',
    method: 'Method',
    selectClient: 'Select client',
    selectProject: 'Select project',
    selectInvoice: 'Select invoice',
    save: 'Save',
    paymentSaved: 'Payment registered successfully',
    quoteSaved: 'Quote created successfully',
    convertedOk: 'Quote converted to invoice',
    operationFailed: 'Operation failed',
  },
  French: {
    pageTitle: 'Cycle commercial',
    pageSubtitle: 'Gerer les devis, la conversion en facture, les paiements et les budgets',
    workspace: 'Espace commercial',
    workspaceSubtitle: 'Flux devis-facture-paiement aligne avec les roles backend',
    quotes: 'Devis',
    invoices: 'Factures',
    payments: 'Paiements',
    budgets: 'Budgets',
    createQuote: 'Creer un devis',
    registerPayment: 'Enregistrer paiement',
    convert: 'Convertir en facture',
    converted: 'Converti',
    restricted: 'Restreint par role',
    noQuotes: 'Aucun devis disponible',
    noInvoices: 'Aucune facture disponible',
    noBudgets: 'Aucun budget disponible',
    reference: 'Reference',
    amount: 'Montant',
    status: 'Statut',
    client: 'Client',
    project: 'Projet',
    issueDate: 'Date emission',
    validityDate: 'Date validite',
    dueDate: 'Date echeance',
    paymentDate: 'Date paiement',
    method: 'Methode',
    selectClient: 'Selectionner client',
    selectProject: 'Selectionner projet',
    selectInvoice: 'Selectionner facture',
    save: 'Enregistrer',
    paymentSaved: 'Paiement enregistre avec succes',
    quoteSaved: 'Devis cree avec succes',
    convertedOk: 'Devis converti en facture',
    operationFailed: 'Operation echouee',
  },
}

const today = new Date().toISOString().slice(0, 10)

function formatMoney(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(Number(value || 0))
}

function formatDate(value) {
  return value ? new Date(value).toLocaleDateString() : '-'
}

function getName(item, fallback = '-') {
  return item?.name || item?.company || item?.reference || fallback
}

function CommercialCycle() {
  const language = localStorage.getItem('language') || 'English'
  const t = translations[language] || translations.English
  const role = getCurrentUserRole()
  const canUseQuotes = canAccessResource('devis', role)
  const canUseInvoices = canAccessResource('invoices', role)
  const canUsePayments = canAccessResource('payments', role)
  const canUseBudgets = canAccessResource('budgets', role)

  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [quotes, setQuotes] = useState([])
  const [invoices, setInvoices] = useState([])
  const [payments, setPayments] = useState([])
  const [budgets, setBudgets] = useState([])
  const [clients, setClients] = useState([])
  const [projects, setProjects] = useState([])
  const [quoteForm, setQuoteForm] = useState({
    reference: '',
    amount: '',
    status: 'Pending',
    issue_date: today,
    validity_date: '',
    ClientId: '',
    ProjectId: '',
  })
  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    payment_date: today,
    method: 'Bank Transfer',
    reference: '',
    InvoiceId: '',
  })

  const loadCommercialData = async () => {
    setLoading(true)

    try {
      const [
        quotesData,
        invoicesData,
        paymentsData,
        budgetsData,
        clientsData,
        projectsData,
      ] = await Promise.all([
        canUseQuotes ? readOptionalData(`${API_BASE_URL}/devis`, []) : [],
        canUseInvoices ? readOptionalData(`${API_BASE_URL}/invoices`, []) : [],
        canUsePayments ? readOptionalData(`${API_BASE_URL}/payments`, []) : [],
        canUseBudgets ? readOptionalData(`${API_BASE_URL}/budgets`, []) : [],
        canUseQuotes ? readOptionalData(`${API_BASE_URL}/clients`, []) : [],
        canUseQuotes ? readOptionalData(`${API_BASE_URL}/projects`, []) : [],
      ])

      setQuotes(quotesData)
      setInvoices(invoicesData)
      setPayments(paymentsData)
      setBudgets(budgetsData)
      setClients(clientsData)
      setProjects(projectsData)
    } catch (error) {
      setToast({ type: 'error', message: error.message || t.operationFailed })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCommercialData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role])

  const totals = useMemo(() => {
    const quoteValue = quotes.reduce((sum, item) => sum + Number(item.amount || 0), 0)
    const invoiceValue = invoices.reduce((sum, item) => sum + Number(item.amount || 0), 0)
    const paymentValue = payments.reduce((sum, item) => sum + Number(item.amount || 0), 0)
    const budgetValue = budgets.reduce((sum, item) => sum + Number(item.amount || 0), 0)

    return { quoteValue, invoiceValue, paymentValue, budgetValue }
  }, [quotes, invoices, payments, budgets])

  const createQuote = async (event) => {
    event.preventDefault()

    try {
      await apiRequest(`${API_BASE_URL}/devis`, {
        method: 'POST',
        body: JSON.stringify({
          ...quoteForm,
          amount: Number(quoteForm.amount),
          ClientId: Number(quoteForm.ClientId),
          ProjectId: Number(quoteForm.ProjectId),
          reference: quoteForm.reference || undefined,
          validity_date: quoteForm.validity_date || undefined,
        }),
      })

      setQuoteForm({
        reference: '',
        amount: '',
        status: 'Pending',
        issue_date: today,
        validity_date: '',
        ClientId: '',
        ProjectId: '',
      })
      setToast({ type: 'success', message: t.quoteSaved })
      loadCommercialData()
    } catch (error) {
      setToast({ type: 'error', message: error.message || t.operationFailed })
    }
  }

  const convertQuote = async (quote) => {
    try {
      await apiRequest(`${API_BASE_URL}/devis/${quote.id}/convert-to-invoice`, {
        method: 'POST',
        body: JSON.stringify({}),
      })
      setToast({ type: 'success', message: t.convertedOk })
      loadCommercialData()
    } catch (error) {
      setToast({ type: 'error', message: error.message || t.operationFailed })
    }
  }

  const registerPayment = async (event) => {
    event.preventDefault()

    try {
      await apiRequest(`${API_BASE_URL}/payments`, {
        method: 'POST',
        body: JSON.stringify({
          ...paymentForm,
          amount: Number(paymentForm.amount),
          InvoiceId: Number(paymentForm.InvoiceId),
          reference: paymentForm.reference || undefined,
        }),
      })

      setPaymentForm({
        amount: '',
        payment_date: today,
        method: 'Bank Transfer',
        reference: '',
        InvoiceId: '',
      })
      setToast({ type: 'success', message: t.paymentSaved })
      loadCommercialData()
    } catch (error) {
      setToast({ type: 'error', message: error.message || t.operationFailed })
    }
  }

  if (loading) {
    return <LoadingState message="Loading commercial cycle..." />
  }

  return (
    <div className="commercial-cycle-page">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <PageHeader
        eyebrow={t.workspace}
        title={t.pageTitle}
        subtitle={t.pageSubtitle}
      />

      <section className="commercial-kpis">
        <article>
          <span>{t.quotes}</span>
          <strong>{canUseQuotes ? quotes.length : '-'}</strong>
          <small>{canUseQuotes ? formatMoney(totals.quoteValue) : t.restricted}</small>
        </article>
        <article>
          <span>{t.invoices}</span>
          <strong>{canUseInvoices ? invoices.length : '-'}</strong>
          <small>{canUseInvoices ? formatMoney(totals.invoiceValue) : t.restricted}</small>
        </article>
        <article>
          <span>{t.payments}</span>
          <strong>{canUsePayments ? payments.length : '-'}</strong>
          <small>{canUsePayments ? formatMoney(totals.paymentValue) : t.restricted}</small>
        </article>
        <article>
          <span>{t.budgets}</span>
          <strong>{canUseBudgets ? budgets.length : '-'}</strong>
          <small>{canUseBudgets ? formatMoney(totals.budgetValue) : t.restricted}</small>
        </article>
      </section>

      <section className="cycle-flow">
        <div className="cycle-step active">{t.quotes}</div>
        <span className="material-symbols-outlined">arrow_forward</span>
        <div className="cycle-step">{t.invoices}</div>
        <span className="material-symbols-outlined">arrow_forward</span>
        <div className="cycle-step">{t.payments}</div>
      </section>

      <div className="commercial-grid">
        <section className="commercial-panel commercial-panel-wide">
          <div className="panel-heading">
            <div>
              <h2>{t.quotes}</h2>
              <p>{t.workspaceSubtitle}</p>
            </div>
          </div>

          {canUseQuotes ? (
            <>
              <form className="commercial-form" onSubmit={createQuote}>
                <input
                  placeholder={t.reference}
                  value={quoteForm.reference}
                  onChange={(e) => setQuoteForm({ ...quoteForm, reference: e.target.value })}
                />
                <input
                  required
                  type="number"
                  min="1"
                  placeholder={t.amount}
                  value={quoteForm.amount}
                  onChange={(e) => setQuoteForm({ ...quoteForm, amount: e.target.value })}
                />
                <select
                  required
                  value={quoteForm.ClientId}
                  onChange={(e) => setQuoteForm({ ...quoteForm, ClientId: e.target.value })}
                >
                  <option value="">{t.selectClient}</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>{getName(client)}</option>
                  ))}
                </select>
                <select
                  required
                  value={quoteForm.ProjectId}
                  onChange={(e) => setQuoteForm({ ...quoteForm, ProjectId: e.target.value })}
                >
                  <option value="">{t.selectProject}</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                  ))}
                </select>
                <select
                  value={quoteForm.status}
                  onChange={(e) => setQuoteForm({ ...quoteForm, status: e.target.value })}
                >
                  {['Pending', 'Sent', 'Accepted', 'Rejected', 'Expired'].map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                <input
                  required
                  type="date"
                  value={quoteForm.issue_date}
                  onChange={(e) => setQuoteForm({ ...quoteForm, issue_date: e.target.value })}
                />
                <input
                  type="date"
                  value={quoteForm.validity_date}
                  onChange={(e) => setQuoteForm({ ...quoteForm, validity_date: e.target.value })}
                />
                <button className="primary-action" type="submit">{t.createQuote}</button>
              </form>

              {quotes.length ? (
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>{t.reference}</th>
                        <th>{t.client}</th>
                        <th>{t.project}</th>
                        <th>{t.amount}</th>
                        <th>{t.status}</th>
                        <th>{t.validityDate}</th>
                        <th>{t.invoices}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quotes.slice(0, 12).map((quote) => (
                        <tr key={quote.id}>
                          <td>{quote.reference || `DEV-${quote.id}`}</td>
                          <td>{getName(quote.Client)}</td>
                          <td>{getName(quote.Project)}</td>
                          <td>{formatMoney(quote.amount)}</td>
                          <td><span className={`status-pill ${quote.status?.toLowerCase()}`}>{quote.status}</span></td>
                          <td>{formatDate(quote.validity_date)}</td>
                          <td>
                            {quote.Invoice ? (
                              <span className="muted-pill">{t.converted}</span>
                            ) : (
                              <button
                                className="small-action"
                                disabled={['Rejected', 'Expired'].includes(quote.status)}
                                onClick={() => convertQuote(quote)}
                              >
                                {t.convert}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <EmptyState title={t.noQuotes} message={t.workspaceSubtitle} />
              )}
            </>
          ) : (
            <div className="restricted-panel">{t.restricted}</div>
          )}
        </section>

        <section className="commercial-panel">
          <div className="panel-heading">
            <h2>{t.invoices}</h2>
          </div>
          {canUseInvoices ? (
            invoices.length ? (
              <div className="compact-list">
                {invoices.slice(0, 8).map((invoice) => (
                  <div className="compact-row" key={invoice.id}>
                    <div>
                      <strong>{invoice.reference || `INV-${invoice.id}`}</strong>
                      <span>{getName(invoice.Client)} - {getName(invoice.Project)}</span>
                    </div>
                    <div>
                      <strong>{formatMoney(invoice.amount)}</strong>
                      <span className={`status-pill ${invoice.status?.toLowerCase()}`}>{invoice.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title={t.noInvoices} message={t.workspaceSubtitle} />
            )
          ) : (
            <div className="restricted-panel">{t.restricted}</div>
          )}
        </section>

        <section className="commercial-panel">
          <div className="panel-heading">
            <h2>{t.payments}</h2>
          </div>
          {canUsePayments ? (
            <form className="payment-form" onSubmit={registerPayment}>
              <select
                required
                value={paymentForm.InvoiceId}
                onChange={(e) => setPaymentForm({ ...paymentForm, InvoiceId: e.target.value })}
              >
                <option value="">{t.selectInvoice}</option>
                {invoices.filter((invoice) => invoice.status !== 'Paid').slice(0, 200).map((invoice) => (
                  <option key={invoice.id} value={invoice.id}>
                    {invoice.reference || `INV-${invoice.id}`} - {formatMoney(invoice.amount)}
                  </option>
                ))}
              </select>
              <input
                required
                type="number"
                min="1"
                placeholder={t.amount}
                value={paymentForm.amount}
                onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
              />
              <input
                required
                type="date"
                value={paymentForm.payment_date}
                onChange={(e) => setPaymentForm({ ...paymentForm, payment_date: e.target.value })}
              />
              <select
                value={paymentForm.method}
                onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value })}
              >
                {['Bank Transfer', 'Card', 'Cash', 'Check', 'Mobile Payment'].map((method) => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </select>
              <input
                placeholder={t.reference}
                value={paymentForm.reference}
                onChange={(e) => setPaymentForm({ ...paymentForm, reference: e.target.value })}
              />
              <button className="primary-action" type="submit">{t.registerPayment}</button>
            </form>
          ) : (
            <div className="restricted-panel">{t.restricted}</div>
          )}
        </section>

        <section className="commercial-panel commercial-panel-wide">
          <div className="panel-heading">
            <h2>{t.budgets}</h2>
          </div>
          {canUseBudgets ? (
            budgets.length ? (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>{t.project}</th>
                      <th>{t.amount}</th>
                      <th>{t.issueDate}</th>
                      <th>{t.dueDate}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {budgets.slice(0, 10).map((budget) => (
                      <tr key={budget.id}>
                        <td>{getName(budget.Project)}</td>
                        <td>{formatMoney(budget.amount)}</td>
                        <td>{formatDate(budget.start_date)}</td>
                        <td>{formatDate(budget.end_date)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState title={t.noBudgets} message={t.workspaceSubtitle} />
            )
          ) : (
            <div className="restricted-panel">{t.restricted}</div>
          )}
        </section>
      </div>
    </div>
  )
}

export default CommercialCycle
