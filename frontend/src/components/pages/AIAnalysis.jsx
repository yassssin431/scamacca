import './AIAnalysis.css'
import PageHeader from '../common/PageHeader'

function AIAnalysis() {
  return (
    <div className="ai-page">
      <PageHeader
  title="AI & Simulation"
  subtitle="Analytical assistance layer • Prepared for future intelligent features"
/>
      <div className="ai-top-grid">
        <section className="forecast-card">
          <div className="section-top">
            <div>
              <p className="section-tag">Decision Support Preparation</p>
              <h3>Revenue Forecast Readiness</h3>
            </div>
            <div className="legend">
              <div><span className="dot navy"></span>Available Data</div>
              <div><span className="dot green"></span>Future Prediction Layer</div>
            </div>
          </div>

          <div className="forecast-chart">
            <div className="line historical"></div>
            <div className="line predicted"></div>
          </div>

          <div className="forecast-labels">
            <span>Invoices</span>
            <span>Expenses</span>
            <span>Salaries</span>
            <span>Projects</span>
            <span>DWH</span>
            <span>Forecasting</span>
          </div>

          <div className="forecast-stats">
            <div>
              <p>Forecast Status</p>
              <h4>Prepared</h4>
            </div>
            <div>
              <p>Data Foundation</p>
              <h4>Ready</h4>
            </div>
            <div>
              <p>Model State</p>
              <h4>Later Phase</h4>
            </div>
          </div>
        </section>

        <section className="anomaly-card">
          <div className="anomaly-top">
            <h3>Anomaly Detection Scope</h3>
            <span className="alert-pill">Planned</span>
          </div>

          <div className="anomaly-list">
            <div className="anomaly-item high">
              <h4>Expense anomaly monitoring</h4>
              <p>
                The current system already captures expenses, suppliers, categories and dates,
                which makes anomaly detection a valid next analytical extension.
              </p>
              <button>Review Data Basis</button>
            </div>

            <div className="anomaly-item medium">
              <h4>Invoice and payment behavior</h4>
              <p>
                Future AI logic can flag unusual payment patterns, abnormal invoice values,
                or suspicious operational outliers once the advanced layer is connected.
              </p>
              <button>Open Monitoring Notes</button>
            </div>
          </div>

          <div className="engine-stats">
            <div>
              <span>Current AI Engine</span>
              <strong>Conceptual Layer</strong>
            </div>
            <div>
              <span>Backend Readiness</span>
              <strong>Structured</strong>
            </div>
          </div>
        </section>
      </div>

      <section className="simulation-section">
        <div className="simulation-left">
          <h3>What-if Simulation Tool</h3>
          <p>
            This area is designed to support scenario simulation using financial data already
            available in the application. It will later evaluate the impact of changes in
            salaries, project budgets, and market conditions on the company’s financial outlook.
          </p>

          <div className="slider-group">
            <label>Salary Increase Scenario <span>Future Input</span></label>
            <input type="range" defaultValue="45" />
          </div>

          <div className="slider-group">
            <label>New Project Budget <span>Future Input</span></label>
            <input type="range" defaultValue="55" />
          </div>

          <div className="slider-group">
            <label>Market Volatility Factor <span>Future Input</span></label>
            <input type="range" defaultValue="70" />
          </div>

          <button className="commit-btn">Simulation Layer Planned</button>
        </div>

        <div className="simulation-right">
          <div className="metric-card glass">
            <p>Simulation Readiness</p>
            <h4>High</h4>
            <span className="positive">Core financial data already available</span>
          </div>

          <div className="metric-card glass">
            <p>Prediction Engine</p>
            <h4>Later</h4>
            <span className="negative">To be connected after backend/data stabilization</span>
          </div>

          <div className="mini-metrics">
            <div><p>Invoices</p><strong>Ready</strong></div>
            <div><p>Expenses</p><strong>Ready</strong></div>
            <div><p>Salaries</p><strong>Ready</strong></div>
            <div><p>DWH</p><strong>Ready</strong></div>
          </div>
        </div>
      </section>

      <div className="ai-bottom-grid">
        <section className="recommendation-card">
          <div>
            <h3>AI Recommendation Direction</h3>
            <p>
              The most relevant first intelligent features for this system are expense anomaly
              detection, revenue forecasting, and what-if simulation based on operational and
              warehouse data already prepared in the project architecture.
            </p>
            <button>View Recommended AI Roadmap</button>
          </div>
          <div className="health-score">
            <strong>A</strong>
            <span>Readiness</span>
          </div>
        </section>

        <section className="history-card">
          <div className="section-top-simple">
            <h3>Planned AI Capabilities</h3>
            <button>View All</button>
          </div>

          <div className="history-list">
            <div className="history-item">
              <div>
                <h4>Expense Anomaly Detection</h4>
                <p>Based on expenses, categories, suppliers and dates</p>
              </div>
              <span className="positive">Relevant</span>
            </div>

            <div className="history-item">
              <div>
                <h4>Revenue Forecasting</h4>
                <p>Based on invoices, periods and project evolution</p>
              </div>
              <span className="positive">Relevant</span>
            </div>

            <div className="history-item">
              <div>
                <h4>Scenario Simulation</h4>
                <p>Based on salaries, budgets, projects and financial trends</p>
              </div>
              <span className="neutral">Planned</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default AIAnalysis