import './PowerBI.css'
import PageHeader from '../common/PageHeader'

function PowerBI() {
  return (
    <div className="powerbi-page">
      {/* Header */}
     <PageHeader
  title="Power BI Analytics Layer"
  subtitle="Business Intelligence dashboards powered by ETL and Data Warehouse"
/>

      {/* Info Banner */}
      <section className="powerbi-filters">
        <div className="filter-group">
          <div className="filter-box">
            <span>Architecture</span>
            <strong>Backend ETL → Data Warehouse → Power BI</strong>
          </div>
          <div className="filter-box">
            <span>Integration Status</span>
            <strong>Prepared</strong>
          </div>
          <div className="filter-box">
            <span>Access Mode</span>
            <strong>Desktop App (Electron) – Planned</strong>
          </div>
        </div>

        <div className="filter-actions">
          <button className="secondary-btn">Documentation</button>
          <button className="primary-btn">Open Power BI</button>
        </div>
      </section>

      {/* KPI Meaning Cards (NOT fake numbers anymore) */}
      <section className="powerbi-kpis">
        <div className="pbi-card">
          <p>Revenue Dashboard</p>
          <h3>Available</h3>
          <span className="positive">Based on invoices & projects</span>
        </div>

        <div className="pbi-card">
          <p>Expense Analysis</p>
          <h3>Available</h3>
          <span className="positive">Based on expenses & categories</span>
        </div>

        <div className="pbi-card">
          <p>Profitability</p>
          <h3>Available</h3>
          <span className="positive">Revenue vs cost logic ready</span>
        </div>

        <div className="pbi-card">
          <p>Cash Flow</p>
          <h3>Planned</h3>
          <span className="negative">Requires payments integration</span>
        </div>
      </section>

      {/* Main Grid */}
      <section className="powerbi-main-grid">
        <div className="chart-card">
          <div className="card-top">
            <div>
              <h4>Revenue Dashboard Structure</h4>
              <p>Time-based revenue analysis with project and client breakdown</p>
            </div>
          </div>

          <div className="big-line-chart">
            <div className="line-shape"></div>
          </div>

          <div className="chart-labels">
            <span>Time</span>
            <span>Projects</span>
            <span>Clients</span>
            <span>Invoices</span>
            <span>DWH</span>
            <span>Power BI</span>
          </div>
        </div>

        <div className="profit-card">
          <h4>Planned Dashboards</h4>
          <p>Core BI reports to be delivered through Power BI</p>

          <div className="profit-list">
            <div className="profit-item">
              <div className="profit-row">
                <span>Global Overview</span>
                <strong>KPIs</strong>
              </div>
              <div className="bar-bg"><div className="bar-fill green w82"></div></div>
            </div>

            <div className="profit-item">
              <div className="profit-row">
                <span>Revenue Analysis</span>
                <strong>Trends</strong>
              </div>
              <div className="bar-bg"><div className="bar-fill green w75"></div></div>
            </div>

            <div className="profit-item">
              <div className="profit-row">
                <span>Expense Analysis</span>
                <strong>Categories</strong>
              </div>
              <div className="bar-bg"><div className="bar-fill navy w58"></div></div>
            </div>

            <div className="profit-item">
              <div className="profit-row">
                <span>Salary Analysis</span>
                <strong>Costs</strong>
              </div>
              <div className="bar-bg"><div className="bar-fill navy w48"></div></div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Grid */}
      <section className="powerbi-bottom-grid">
        <div className="expense-card">
          <h4>Data Pipeline</h4>

          <div className="expense-content">
            <div className="donut-placeholder">
              <div className="donut-center">
                <span>Flow</span>
                <strong>ETL</strong>
              </div>
            </div>

            <div className="expense-legend">
              <div>
                <span className="legend-dot navy"></span>
                <div>
                  <strong>OLTP Database</strong>
                  <small>Operational data</small>
                </div>
              </div>
              <div>
                <span className="legend-dot green"></span>
                <div>
                  <strong>Data Warehouse</strong>
                  <small>Fact & Dimension tables</small>
                </div>
              </div>
              <div>
                <span className="legend-dot red"></span>
                <div>
                  <strong>Power BI</strong>
                  <small>Visualization & analytics</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="cashflow-card">
          <div className="card-top simple">
            <h4>Integration Roadmap</h4>
            <span className="positive">Planned Phases</span>
          </div>

          <div className="cashflow-bars">
            <div className="cash-col">
              <div className="cash-bar q1"></div>
              <span>Backend Ready</span>
            </div>
            <div className="cash-col">
              <div className="cash-bar q2"></div>
              <span>DWH Ready</span>
            </div>
            <div className="cash-col">
              <div className="cash-bar q3"></div>
              <span>Power BI Build</span>
            </div>
            <div className="cash-col">
              <div className="cash-bar q4 predicted"></div>
              <span>Embed</span>
            </div>
            <div className="cash-col">
              <div className="cash-bar q5 predicted"></div>
              <span>Electron App</span>
            </div>
          </div>
        </div>
      </section>

      {/* Embed Placeholder */}
      <section className="embed-card">
        <div className="card-top simple">
          <div>
            <h4>Embedded Power BI Report</h4>
            <p>
              This section will host Power BI dashboards through embedding or desktop integration
              once reports are finalized.
            </p>
          </div>
          <button className="primary-btn">Launch BI Workspace</button>
        </div>

        <div className="embed-placeholder">
          <span>[ POWER BI DASHBOARD WILL APPEAR HERE ]</span>
        </div>
      </section>
    </div>
  )
}

export default PowerBI