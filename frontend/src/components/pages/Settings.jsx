import './Settings.css'
import PageHeader from '../common/PageHeader'

function Settings() {
  return (
    <div className="settings-page">
      <PageHeader
  title="System Settings"
  subtitle="Administrator Control Panel"
/>

      <div className="settings-grid-top">
        <section className="general-card">
          <div className="section-head">
            <h4>General Configuration</h4>
          </div>

          <div className="form-group">
            <label>Organization Name</label>
            <input type="text" defaultValue="Tradrly" />
          </div>

          <div className="two-cols">
            <div className="form-group">
              <label>Primary Currency</label>
              <select defaultValue="TND">
                <option value="TND">TND - Tunisian Dinar</option>
                <option value="USD">USD - United States Dollar</option>
                <option value="EUR">EUR - Euro</option>
              </select>
            </div>

            <div className="form-group">
              <label>Fiscal Year Start</label>
              <input type="date" defaultValue="2025-01-01" />
            </div>
          </div>

          <div className="two-cols">
            <div className="form-group">
              <label>Application Mode</label>
              <select defaultValue="Desktop">
                <option value="Desktop">Desktop Application (Electron target)</option>
                <option value="Web">Web Development Mode</option>
              </select>
            </div>

            <div className="form-group">
              <label>Data Architecture</label>
              <input type="text" defaultValue="OLTP + Data Warehouse + Power BI" />
            </div>
          </div>
        </section>

        <section className="security-access-card">
          <div className="section-head">
            <h4>Security &amp; Access</h4>
          </div>

          <div className="toggle-row">
            <div>
              <strong>JWT Authentication</strong>
              <p>Application login is currently based on token authentication.</p>
            </div>
            <div className="toggle on">
              <div></div>
            </div>
          </div>

          <div className="toggle-row">
            <div>
              <strong>Role-Based Access</strong>
              <p>Access logic is structured around Admin, Manager and Finance roles.</p>
            </div>
            <div className="toggle on">
              <div></div>
            </div>
          </div>

          <div className="slider-box">
            <label>Session Timeout (Minutes)</label>
            <div className="slider-row">
              <input type="range" min="15" max="120" defaultValue="45" />
              <span>45m</span>
            </div>
          </div>

          <small>Current security model: login + protected routes + role foundation</small>
        </section>
      </div>

      <div className="settings-grid-mid">
        <section className="integration-card">
          <div className="section-head">
            <h4>Data &amp; Power BI Integration</h4>
          </div>

          <div className="two-cols">
            <div className="form-group">
              <label>Backend Stack</label>
              <input type="text" defaultValue="Node.js + Express + Sequelize" />
            </div>

            <div className="form-group">
              <label>Database Engine</label>
              <input type="text" defaultValue="PostgreSQL" />
            </div>
          </div>

          <div className="two-cols">
            <div className="form-group">
              <label>ETL Strategy</label>
              <input type="text" defaultValue="Backend ETL (Node.js) + light Power Query transforms" />
            </div>

            <div className="form-group">
              <label>Power BI Delivery</label>
              <input type="text" defaultValue="Power BI Service + Desktop App Integration Later" />
            </div>
          </div>

          <div className="integration-panel">
            <div>
              <p>Refresh Frequency</p>
              <div className="freq-buttons">
                <button>Manual</button>
                <button className="active">On Demand</button>
                <button>Scheduled Later</button>
              </div>
            </div>

            <div className="connection-status">
              <span>Current Integration Status</span>
              <strong>Application Ready</strong>
            </div>
          </div>
        </section>

        <section className="alerts-card-settings">
          <div className="section-head">
            <h4>Alert Thresholds</h4>
          </div>

          <div className="threshold-box">
            <div className="threshold-row">
              <span>Budget Overrun Warning</span>
              <strong>15%</strong>
            </div>
            <div className="bar-bg">
              <div className="bar-fill"></div>
            </div>
            <p>
              Intended to flag operational overspending and later support anomaly analysis.
            </p>
          </div>

          <div className="threshold-box">
            <div className="threshold-row">
              <span>Pending Invoice Monitoring</span>
              <strong>Enabled</strong>
            </div>
            <div className="bar-bg">
              <div className="bar-fill"></div>
            </div>
            <p>
              Used to highlight unpaid revenue records and support financial monitoring.
            </p>
          </div>

          <div className="sensitivity-box">
            <label>Anomaly Sensitivity</label>
            <div className="sensitivity-options">
              <button>LOW</button>
              <button className="active">MED</button>
              <button>HIGH</button>
            </div>
          </div>
        </section>
      </div>

      <section className="changes-card">
        <div className="changes-head">
          <h4>Recent Configuration Notes</h4>
          <button>View History</button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Area</th>
              <th>Configuration</th>
              <th>Status</th>
              <th>Impact</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Architecture</td>
              <td>Desktop application target confirmed with Electron</td>
              <td>Current</td>
              <td><span className="impact good">Aligned</span></td>
            </tr>
            <tr>
              <td>ETL</td>
              <td>Backend ETL retained, Power Query used lightly for analysis</td>
              <td>Current</td>
              <td><span className="impact good">Consistent</span></td>
            </tr>
            <tr>
              <td>Security</td>
              <td>JWT login and role-based logic foundation in place</td>
              <td>Current</td>
              <td><span className="impact good">Secure</span></td>
            </tr>
            <tr>
              <td>Power BI</td>
              <td>Embedding and desktop delivery scheduled for later phase</td>
              <td>Planned</td>
              <td><span className="impact good">Planned</span></td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  )
}

export default Settings