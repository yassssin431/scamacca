import { useEffect, useMemo, useState } from 'react'
import API_BASE_URL from '../../services/api'
import PageHeader from '../common/PageHeader'
import LoadingState from '../common/LoadingState'
import EmptyState from '../common/EmptyState'
import Toast from '../common/Toast'
import { apiRequest, readOptionalData } from '../../services/authFetch'
import { getCurrentUserRole } from '../../services/auth'
import { ROLES, canAccessResource } from '../../services/permissions'
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
    invoiceSearch: 'Search invoice, client or project',
    payableInvoice: 'Invoice ready for payment',
    payThisInvoice: 'Pay this invoice',
    recentInvoices: 'Recent invoices',
    recentPayments: 'Recent payments',
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
    invoiceSearch: 'Rechercher facture, client ou projet',
    payableInvoice: 'Facture prete au paiement',
    payThisInvoice: 'Payer cette facture',
    recentInvoices: 'Factures recentes',
    recentPayments: 'Paiements recents',
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

function getPaidAmount(invoice) {
  return (invoice?.Payments || []).reduce((sum, payment) => sum + Number(payment.amount || 0), 0)
}

function CommercialCycle() {
  const language = localStorage.getItem('language') || 'English'
  const t = translations[language] || translations.English
  const role = getCurrentUserRole()

  // Read permissions come from the central RBAC map; action permissions stay
  // stricter because Finance owns the commercial/financial workflow.
  const canUseQuotes = canAccessResource('devis', role)
  const canManageQuotes = role === ROLES.FINANCE
  const canConvertQuotes = role === ROLES.FINANCE
  const canRegisterPayments = role === ROLES.FINANCE
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
  const [invoiceSearch, setInvoiceSearch] = useState('')
  const [highlightedInvoiceId, setHighlightedInvoiceId] = useState(null)
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
        // Each request is conditional so restricted roles never spam protected
        // endpoints. Optional reads also turn 403/401 into empty sections.
        canUseQuotes ? readOptionalData(`${API_BASE_URL}/devis`, []) : [],
        canUseInvoices ? readOptionalData(`${API_BASE_URL}/invoices`, []) : [],
        canUsePayments ? readOptionalData(`${API_BASE_URL}/payments`, []) : [],
        canUseBudgets ? readOptionalData(`${API_BASE_URL}/budgets`, []) : [],
        // Only Finance needs lookup lists because only Finance can create quotes.
        canManageQuotes ? readOptionalData(`${API_BASE_URL}/clients`, []) : [],
        canManageQuotes ? readOptionalData(`${API_BASE_URL}/projects`, []) : [],
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

  const visibleInvoices = useMemo(() => {
    const query = invoiceSearch.trim().toLowerCase()

    // Keep the freshly converted or selected invoice at the top so Finance can
    // immediately register its payment without hunting through thousands of rows.
    const sorted = [...invoices].sort((a, b) => {
      if (String(a.id) === String(highlightedInvoiceId)) return -1
      if (String(b.id) === String(highlightedInvoiceId)) return 1
      return Number(b.id || 0) - Number(a.id || 0)
    })

    if (!query) return sorted

    return sorted.filter((invoice) => {
      const haystack = [
        invoice.reference,
        invoice.status,
        getName(invoice.Client),
        getName(invoice.Project),
        invoice.amount,
      ]
        .join(' ')
        .toLowerCase()

      return haystack.includes(query)
    })
  }, [highlightedInvoiceId, invoiceSearch, invoices])

  const payableInvoices = useMemo(
    () => visibleInvoices.filter((invoice) => invoice.status !== 'Paid'),
    [visibleInvoices]
  )

  const selectedInvoice = useMemo(
    () => invoices.find((invoice) => String(invoice.id) === String(paymentForm.InvoiceId)),
    [invoices, paymentForm.InvoiceId]
  )

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
      const result = await apiRequest(`${API_BASE_URL}/devis/${quote.id}/convert-to-invoice`, {
        method: 'POST',
        body: JSON.stringify({}),
      })
      const invoice = result?.data
      if (invoice?.id) {
        // Conversion feeds the payment form directly, creating a clear
        // quote -> invoice -> payment path for the operator.
        setHighlightedInvoiceId(invoice.id)
        setPaymentForm((current) => ({
          ...current,
          InvoiceId: String(invoice.id),
          amount: String(invoice.amount || ''),
          reference: invoice.reference ? `PAY-${invoice.reference}` : current.reference,
        }))
        setInvoiceSearch(invoice.reference || `INV-${invoice.id}`)
      }
      setToast({ type: 'success', message: invoice?.reference ? `${t.convertedOk}: ${invoice.reference}` : t.convertedOk })
      await loadCommercialData()
    } catch (error) {
      setToast({ type: 'error', message: error.message || t.operationFailed })
    }
  }

  const preparePaymentForInvoice = (invoice) => {
    // When an invoice has partial payments, default the form to the remaining
    // balance rather than the original invoice total.
    const remaining = Math.max(Number(invoice.amount || 0) - getPaidAmount(invoice), 0)
    setHighlightedInvoiceId(invoice.id)
    setPaymentForm((current) => ({
      ...current,
      InvoiceId: String(invoice.id),
      amount: String(remaining || invoice.amount || ''),
      reference: invoice.reference ? `PAY-${invoice.reference}` : current.reference,
    }))
    setInvoiceSearch(invoice.reference || `INV-${invoice.id}`)
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
      setHighlightedInvoiceId(null)
      setInvoiceSearch('')
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
              {canManageQuotes && (
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
              )}

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
                            ) : !canConvertQuotes ? (
                              <span className="muted-pill">{t.restricted}</span>
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
            <div>
              <h2>{t.invoices}</h2>
              <p>{highlightedInvoiceId ? t.payableInvoice : t.recentInvoices}</p>
            </div>
          </div>
          {canUseInvoices ? (
            invoices.length ? (
              <>
                <input
                  className="invoice-search"
                  placeholder={t.invoiceSearch}
                  value={invoiceSearch}
                  onChange={(e) => setInvoiceSearch(e.target.value)}
                />
                <div className="compact-list">
                  {visibleInvoices.slice(0, 10).map((invoice) => (
                  <div
                    className={`compact-row ${String(invoice.id) === String(highlightedInvoiceId) ? 'highlighted' : ''}`}
                    key={invoice.id}
                  >
                    <div>
                      <strong>{invoice.reference || `INV-${invoice.id}`}</strong>
                      <span>{getName(invoice.Client)} - {getName(invoice.Project)}</span>
                    </div>
                    <div>
                      <strong>{formatMoney(invoice.amount)}</strong>
                      <span className={`status-pill ${invoice.status?.toLowerCase()}`}>{invoice.status}</span>
                    </div>
                    {canRegisterPayments && invoice.status !== 'Paid' && (
                      <button className="small-action ghost-action" type="button" onClick={() => preparePaymentForInvoice(invoice)}>
                        {t.payThisInvoice}
                      </button>
                    )}
                  </div>
                ))}
                </div>
              </>
            ) : (
              <EmptyState title={t.noInvoices} message={t.workspaceSubtitle} />
            )
          ) : (
            <div className="restricted-panel">{t.restricted}</div>
          )}
        </section>

        <section className="commercial-panel">
          <div className="panel-heading">
            <div>
              <h2>{t.payments}</h2>
              <p>{canRegisterPayments ? t.payableInvoice : t.recentPayments}</p>
            </div>
          </div>
          {canUsePayments ? (
            <>
              {canRegisterPayments && (
                <form className="payment-form" onSubmit={registerPayment}>
                  <select
                    required
                    value={paymentForm.InvoiceId}
                    onChange={(e) => {
                      const invoice = invoices.find((item) => String(item.id) === e.target.value)
                      setPaymentForm({
                        ...paymentForm,
                        InvoiceId: e.target.value,
                        amount: invoice ? String(Math.max(Number(invoice.amount || 0) - getPaidAmount(invoice), 0) || invoice.amount || '') : paymentForm.amount,
                      })
                      setHighlightedInvoiceId(invoice?.id || null)
                    }}
                  >
                    <option value="">{t.selectInvoice}</option>
                    {payableInvoices.slice(0, 250).map((invoice) => (
                      <option key={invoice.id} value={invoice.id}>
                        {invoice.reference || `INV-${invoice.id}`} - {getName(invoice.Client)} - {formatMoney(Math.max(Number(invoice.amount || 0) - getPaidAmount(invoice), 0) || invoice.amount)}
                      </option>
                    ))}
                  </select>
                  {selectedInvoice && (
                    <div className="selected-invoice-card">
                      <span>{selectedInvoice.reference || `INV-${selectedInvoice.id}`}</span>
                      <strong>{formatMoney(selectedInvoice.amount)}</strong>
                      <small>{getName(selectedInvoice.Client)} - {getName(selectedInvoice.Project)}</small>
                    </div>
                  )}
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
              )}

              {payments.length ? (
                <div className="compact-list payment-history">
                  {payments.slice(0, 8).map((payment) => (
                    <div className="compact-row" key={payment.id}>
                      <div>
                        <strong>{payment.reference || `PAY-${payment.id}`}</strong>
                        <span>{payment.Invoice?.reference || `INV-${payment.InvoiceId}`} - {payment.method}</span>
                      </div>
                      <div>
                        <strong>{formatMoney(payment.amount)}</strong>
                        <span>{formatDate(payment.payment_date)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : !canRegisterPayments ? (
                <EmptyState title={t.noInvoices} message={t.workspaceSubtitle} />
              ) : null}
            </>
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
